import { NextResponse } from 'next/server';
import { isIP } from 'node:net';
import { sendLeadFallbackToMattermost } from '../../../lib/lead-fallback-mattermost';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 64 * 1024;
const MAX_RATE_LIMIT_KEYS = 5_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const DELIVERY_TIMEOUT_MS = 5_000;
const DELIVERY_CACHE_TTL_MS = 10 * 60 * 1_000;
const ACR_TRACKING_API = 'https://acrtracking.stealthagents.us/api/track';
const ACR_SITE_ID = 'hire-offshore-teams';
const ACR_TRACKER_VERSION = '0.4.19';

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
  '_submission_id',
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
  _submission_id: 64,
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
type DeliveryEntry = { fingerprint: string; expiresAt: number; promise: Promise<boolean> };
const deliveryCache = new Map<string, DeliveryEntry>();

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
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(fields._submission_id || '')) {
    return 'Please check the submitted fields.';
  }
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

function pageDetails(value: string | undefined) {
  try {
    const url = new URL(value || '', 'https://hireoffshoreteams.com/contact-us');
    if (url.origin !== 'https://hireoffshoreteams.com' && url.origin !== 'https://www.hireoffshoreteams.com') {
      return { pageUrl: 'https://hireoffshoreteams.com/contact-us', pagePath: '/contact-us' };
    }
    return { pageUrl: url.href, pagePath: url.pathname };
  } catch {
    return { pageUrl: 'https://hireoffshoreteams.com/contact-us', pagePath: '/contact-us' };
  }
}

async function deliverEstablishedAcrLead(request: Request, payload: LeadFields): Promise<boolean> {
  const name = [payload.first_name, payload.last_name].filter(Boolean).join(' ') || payload.name || '';
  const { pageUrl, pagePath } = pageDetails(payload._page_url || request.headers.get('referer') || undefined);
  const metadata: Record<string, string> = {
    tracker_version: ACR_TRACKER_VERSION,
    lead_name: name,
    lead_email: payload.email,
    lead_phone: payload.phone || '',
    lead_message: payload.message || '',
    lead_source: payload.source || '',
    _page_url: payload._page_url || '',
    lead_form_id: '',
  };
  for (const field of ['first_name', 'last_name', 'company', 'company_website', 'company_size', 'positions_to_fill', 'referral_source', 'phone_country']) {
    metadata[field] = payload[field] || '';
  }
  const event = {
    client_event_id: payload._submission_id,
    event_type: 'lead_submit',
    timestamp: new Date().toISOString(),
    session_id: '',
    user_id: '',
    anonymous_id: '',
    page_url: pageUrl,
    page_path: pagePath,
    page_title: 'Hire Offshore Teams consultation request',
    referrer: request.headers.get('referer') || '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
    screen_width: 0,
    screen_height: 0,
    scroll_depth: 0,
    time_on_page: 0,
    event_value: payload.source || '',
    event_metadata: JSON.stringify(metadata),
  };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DELIVERY_TIMEOUT_MS);
  try {
    const clientIp = requestKey(request);
    const headers: Record<string, string> = {
      'content-type': 'application/json',
      'user-agent': request.headers.get('user-agent') || '',
      'accept-language': request.headers.get('accept-language') || '',
    };
    if (clientIp !== 'unknown-client') {
      headers['x-forwarded-for'] = clientIp;
      headers['x-acr-client-ip'] = clientIp;
    }
    const response = await fetch(ACR_TRACKING_API, {
      method: 'POST',
      headers,
      body: JSON.stringify({ site_id: ACR_SITE_ID, events: [event] }),
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

async function deliverAcceptedLead(request: Request, payload: LeadFields): Promise<boolean> {
  const endpoint = process.env.ACR_LEAD_ENDPOINT;
  if (endpoint && await deliverPrimary(endpoint, payload)) return true;
  if (await deliverEstablishedAcrLead(request, payload)) return true;
  return sendLeadFallbackToMattermost({
    name: [payload.first_name, payload.last_name].filter(Boolean).join(' ') || payload.name || '',
    email: payload.email,
    phone: payload.phone || '',
    phoneCountry: payload.phone_country || '',
    business: payload.company || '',
    companyWebsite: payload.company_website || '',
    message: payload.message || '',
    companySize: payload.company_size || '',
    positions: payload.positions_to_fill || '',
    referral: payload.referral_source || '',
    source: payload.source || '',
    pageUrl: payload._page_url || request.headers.get('referer') || '',
    userAgent: request.headers.get('user-agent') || '',
  });
}

function pruneDeliveryCache(now: number) {
  for (const [key, entry] of deliveryCache) if (entry.expiresAt <= now) deliveryCache.delete(key);
  while (deliveryCache.size >= MAX_RATE_LIMIT_KEYS) {
    const oldestKey = deliveryCache.keys().next().value as string | undefined;
    if (!oldestKey) break;
    deliveryCache.delete(oldestKey);
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

  const submissionId = payload._submission_id;
  const fingerprint = JSON.stringify(payload);
  const now = Date.now();
  pruneDeliveryCache(now);
  const existing = deliveryCache.get(submissionId);
  if (existing) {
    if (existing.fingerprint !== fingerprint) {
      return json({ ok: false, delivered: false, message: 'Submission identifier was already used.' }, 409);
    }
    const delivered = await existing.promise;
    return delivered
      ? json({ ok: true, delivered: true })
      : json({ ok: false, delivered: false, message: 'We could not send your request.' }, 502);
  }

  const promise = deliverAcceptedLead(request, payload);
  deliveryCache.set(submissionId, { fingerprint, expiresAt: now + DELIVERY_CACHE_TTL_MS, promise });
  const delivered = await promise;
  if (!delivered && deliveryCache.get(submissionId)?.promise === promise) deliveryCache.delete(submissionId);
  return delivered
    ? json({ ok: true, delivered: true })
    : json({ ok: false, delivered: false, message: 'We could not send your request.' }, 502);
}
