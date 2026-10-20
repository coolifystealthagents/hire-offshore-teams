import { NextResponse } from 'next/server';
import { isIP } from 'node:net';
import { sendLeadFallbackToMattermost } from '../../../lib/lead-fallback-mattermost';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 64 * 1024;
const MAX_RATE_LIMIT_KEYS = 5_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const DELIVERY_TIMEOUT_MS = 5_000;

const allowedOrigins = new Set([
  'https://hireoffshoreteams.com',
  'https://www.hireoffshoreteams.com',
]);

const allowedFields = new Set([
  'source',
  'first_name',
  'last_name',
  'name',
  'email',
  'company',
  'company_website',
  'company_size',
  'positions_to_fill',
  'referral_source',
  'phone_country',
  'phone',
  'message',
  '_page_url',
  'website_url',
]);

const fieldLimits: Record<string, number> = {
  source: 80,
  first_name: 80,
  last_name: 80,
  name: 160,
  email: 254,
  company: 120,
  company_website: 200,
  company_size: 20,
  positions_to_fill: 20,
  referral_source: 40,
  phone_country: 10,
  phone: 40,
  message: 2_000,
  _page_url: 2_048,
  website_url: 200,
};

const personalDomains = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'hotmail.com',
  'outlook.com', 'live.com', 'msn.com', 'icloud.com', 'me.com', 'mac.com',
  'aol.com', 'proton.me', 'protonmail.com', 'gmx.com', 'mail.com', 'ymail.com',
]);
const companySizes = new Set(['1 to 10', '11 to 50', '51 to 200', '201 to 500', '501+']);
const positionsToFill = new Set(['1', '2 to 3', '4 to 10', '11+', 'Not sure yet']);
const referralSources = new Set(['Search engine', 'Referral', 'Business network', 'Social media', 'Stealth Agents', 'Other']);
const phoneCountries = new Set(['', '+1', '+44', '+61', '+63', 'other']);

type RateEntry = { count: number; expiresAt: number };
const rateLimit = new Map<string, RateEntry>();

type LeadFields = Record<string, string>;

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'cache-control': 'no-store' },
  });
}

function isAllowedOrigin(value: string | null): boolean {
  if (!value) return false;
  if (allowedOrigins.has(value)) return true;
  try {
    const candidate = new URL(value);
    return process.env.NODE_ENV !== 'production'
      && (candidate.protocol === 'http:' || candidate.protocol === 'https:')
      && (candidate.hostname === 'localhost' || candidate.hostname === '127.0.0.1')
      && candidate.username === ''
      && candidate.password === ''
      && candidate.pathname === '/'
      && candidate.search === ''
      && candidate.hash === '';
  } catch {
    return false;
  }
}

function requestKey(request: Request): string {
  // Prefer headers normally replaced by the deployment proxy. If none are present,
  // one shared bucket is intentionally conservative rather than trusting arbitrary IDs.
  for (const header of ['x-vercel-forwarded-for', 'cf-connecting-ip', 'x-real-ip', 'x-forwarded-for']) {
    const candidate = request.headers.get(header)?.split(',')[0]?.trim();
    if (candidate && candidate.length <= 64 && isIP(candidate) !== 0) return candidate;
  }
  return 'unknown-client';
}

function isRateLimited(key: string, now = Date.now()): boolean {
  for (const [storedKey, entry] of rateLimit) {
    if (entry.expiresAt <= now) rateLimit.delete(storedKey);
  }

  const current = rateLimit.get(key);
  if (current) {
    current.count += 1;
    return current.count > RATE_LIMIT_MAX_REQUESTS;
  }

  if (rateLimit.size >= MAX_RATE_LIMIT_KEYS) {
    const oldestKey = rateLimit.keys().next().value as string | undefined;
    if (oldestKey) rateLimit.delete(oldestKey);
  }
  rateLimit.set(key, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
  return false;
}

async function readBoundedBody(request: Request): Promise<Uint8Array | null> {
  if (!request.body) return null;
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } catch {
    return null;
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

async function parseFields(body: Uint8Array, contentType: string): Promise<LeadFields | null> {
  try {
    const form = await new Response(body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength) as ArrayBuffer, { headers: { 'content-type': contentType } }).formData();
    if ([...form.keys()].length > allowedFields.size) return null;
    const fields: LeadFields = {};
    for (const [key, value] of form.entries()) {
      if (!allowedFields.has(key) || key in fields || typeof value !== 'string') return null;
      if (value.length > fieldLimits[key] || /\0/.test(value)) return null;
      fields[key] = value.trim();
    }
    return fields;
  } catch {
    return null;
  }
}

function isBusinessEmail(email: string): boolean {
  if (email.length > 254 || /\s/.test(email)) return false;
  const match = email.match(/^([a-z0-9.!#$%&'*+/=?^_`{|}~-]+)@([a-z0-9-]+(?:\.[a-z0-9-]+)+)$/i);
  if (!match || match[1].length > 64 || match[1].startsWith('.')
    || match[1].endsWith('.') || match[1].includes('..')) return false;
  const domain = match[2].toLowerCase();
  if (personalDomains.has(domain)) return false;
  return domain.split('.').every((label) => label.length <= 63 && !label.startsWith('-') && !label.endsWith('-'));
}

function validateFields(fields: LeadFields): string | null {
  const source = fields.source || '';
  const full = source === 'contact-page-consultation';
  const email = (fields.email || '').toLowerCase();

  if (!isBusinessEmail(email)) return 'Please use your business email address.';
  if (!full) return 'Please check the submitted fields.';
  if (full) {
    if (!fields.first_name || !fields.last_name || !fields.company
      || !companySizes.has(fields.company_size || '')
      || !positionsToFill.has(fields.positions_to_fill || '')
      || !referralSources.has(fields.referral_source || '')) {
      return 'Please complete every required field.';
    }
  } else if (!fields.name) {
    return 'Please complete every required field.';
  }
  if (!phoneCountries.has(fields.phone_country || '')) return 'Please check the submitted fields.';
  return null;
}

async function deliverPrimary(endpoint: string, payload: LeadFields): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DELIVERY_TIMEOUT_MS);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: 'no-store',
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request.headers.get('origin'))) {
    return json({ ok: false, message: 'Request origin is not allowed.' }, 403);
  }

  const contentType = request.headers.get('content-type') || '';
  // The public endpoint accepts only multipart/form-data with a parser boundary.
  if (!/^multipart\/form-data\s*;/i.test(contentType) || !/boundary=/i.test(contentType)) {
    return json({ ok: false, message: 'Unsupported request format.' }, 415);
  }

  const contentLengthValue = request.headers.get('content-length');
  if (contentLengthValue) {
    const contentLength = Number(contentLengthValue);
    if (!Number.isSafeInteger(contentLength) || contentLength < 0) {
      return json({ ok: false, message: 'Invalid request size.' }, 400);
    }
    if (contentLength > MAX_BODY_BYTES) {
      return json({ ok: false, message: 'Request is too large.' }, 413);
    }
  }

  if (isRateLimited(requestKey(request))) {
    return json({ ok: false, message: 'Too many requests. Please try again later.' }, 429);
  }

  const body = await readBoundedBody(request);
  if (!body) return json({ ok: false, message: 'Request is too large or malformed.' }, 413);
  const fields = await parseFields(body, contentType);
  if (!fields) return json({ ok: false, message: 'Please check the submitted fields.' }, 400);

  if (fields.website_url) {
    return json({ ok: false, ignored: true, delivered: false });
  }

  const validationMessage = validateFields(fields);
  if (validationMessage) return json({ ok: false, message: validationMessage }, 400);

  const payload: LeadFields = { ...fields, email: fields.email.toLowerCase() };
  delete payload.website_url;

  const endpoint = process.env.ACR_LEAD_ENDPOINT;
  if (endpoint && await deliverPrimary(endpoint, payload)) {
    return json({ ok: true, delivered: true });
  }

  const delivered = await sendLeadFallbackToMattermost({
    name: [fields.first_name, fields.last_name].filter(Boolean).join(' ') || fields.name || '',
    email: payload.email,
    phone: fields.phone || '',
    phoneCountry: fields.phone_country || '',
    business: fields.company || '',
    companyWebsite: fields.company_website || '',
    message: fields.message || '',
    companySize: fields.company_size || '',
    positions: fields.positions_to_fill || '',
    referral: fields.referral_source || '',
    source: fields.source || '',
    pageUrl: fields._page_url || request.headers.get('referer') || '',
    userAgent: request.headers.get('user-agent') || '',
  });

  if (delivered) return json({ ok: true, delivered: true });
  return json({ ok: false, delivered: false, message: 'We could not send your request.' }, 502);
}
