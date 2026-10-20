import { isIP } from 'node:net';

const TRACKING_API = 'https://acrtracking.stealthagents.us/api/track';
const SITE_ID = 'hire-offshore-teams';
const MAX_BODY_BYTES = 64 * 1024;
const MAX_BATCH_EVENTS = 200;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 30;
const allowedOrigins = new Set(['https://hireoffshoreteams.com', 'https://www.hireoffshoreteams.com']);
const rateLimit = new Map<string, { count: number; expiresAt: number }>();

export const runtime = 'nodejs';

function allowedOrigin(value: string | null) {
  if (!value) return false;
  if (allowedOrigins.has(value)) return true;
  try {
    const url = new URL(value);
    return (url.protocol === 'http:' || url.protocol === 'https:')
      && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')
      && !url.username && !url.password && url.pathname === '/' && !url.search && !url.hash;
  } catch {
    return false;
  }
}

function clientKey(request: Request) {
  for (const header of ['cf-connecting-ip', 'x-real-ip', 'x-forwarded-for']) {
    const value = request.headers.get(header)?.split(',')[0]?.trim();
    if (value && isIP(value)) return value;
  }
  return 'unknown-client';
}

function limited(key: string, now = Date.now()) {
  for (const [stored, entry] of rateLimit) if (entry.expiresAt <= now) rateLimit.delete(stored);
  const entry = rateLimit.get(key);
  if (entry) return ++entry.count > RATE_MAX;
  if (rateLimit.size >= 5_000) rateLimit.delete(rateLimit.keys().next().value as string);
  rateLimit.set(key, { count: 1, expiresAt: now + RATE_WINDOW_MS });
  return false;
}

async function boundedBody(request: Request) {
  if (!request.body) return { bytes: null, oversized: false };
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return { bytes: null, oversized: true };
      }
      chunks.push(value);
    }
  } catch {
    return { bytes: null, oversized: false };
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return { bytes, oversized: false };
}

function validEvent(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const event = value as Record<string, unknown>;
  const entries = Object.entries(event);
  if (entries.length === 0 || entries.length > 40) return false;
  if (typeof event.event_type !== 'string' || event.event_type.length === 0 || event.event_type.length > 120) return false;
  return entries.every(([key, field]) => key.length > 0 && key.length <= 80
    && (typeof field === 'string' ? field.length <= MAX_BODY_BYTES
      : typeof field === 'number' ? Number.isFinite(field)
      : typeof field === 'boolean' || field === null));
}

function validEnvelope(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const envelope = value as Record<string, unknown>;
  const keys = Object.keys(envelope);
  return keys.length === 2
    && keys.includes('site_id')
    && keys.includes('events')
    && envelope.site_id === SITE_ID
    && Array.isArray(envelope.events)
    && envelope.events.length > 0
    && envelope.events.length <= MAX_BATCH_EVENTS
    && envelope.events.every(validEvent);
}

function response(body: { status: string }, status: number) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  if (!allowedOrigin(request.headers.get('origin'))) return response({ status: 'error' }, 403);
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') || '')) return response({ status: 'error' }, 415);

  const declared = request.headers.get('content-length');
  if (declared) {
    const size = Number(declared);
    if (!Number.isSafeInteger(size) || size < 0) return response({ status: 'error' }, 400);
    if (size > MAX_BODY_BYTES) return response({ status: 'error' }, 413);
  }
  if (limited(clientKey(request))) return response({ status: 'error' }, 429);

  const { bytes, oversized } = await boundedBody(request);
  if (!bytes) return response({ status: 'error' }, oversized ? 413 : 400);
  let envelope: unknown;
  try { envelope = JSON.parse(new TextDecoder().decode(bytes)); } catch { return response({ status: 'error' }, 400); }
  if (!validEnvelope(envelope)) return response({ status: 'error' }, 400);

  try {
    const clientIp = clientKey(request);
    const upstream = await fetch(TRACKING_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('user-agent') || '',
        'Accept-Language': request.headers.get('accept-language') || '',
        'X-Forwarded-For': clientIp,
        'X-ACR-Client-IP': clientIp,
      },
      body: bytes,
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    });
    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('content-type') || 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch {
    return response({ status: 'error' }, 502);
  }
}
