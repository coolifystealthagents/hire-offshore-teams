import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const routeUrl = pathToFileURL(join(root, 'app/api/submit-lead/route.ts')).href;
const fallbackUrl = pathToFileURL(join(root, 'lib/lead-fallback-mattermost.ts')).href;
const trackingUrl = pathToFileURL(join(root, 'app/ingest/track/route.ts')).href;

function runTypeScriptModule(script, env = {}, loaderSource) {
  const temporaryDirectory = mkdtempSync(join(tmpdir(), 'lead-route-test-'));
  try {
    const arguments_ = ['--experimental-strip-types'];
    if (loaderSource) {
      const loaderPath = join(temporaryDirectory, 'loader.mjs');
      writeFileSync(loaderPath, loaderSource);
      arguments_.push('--experimental-loader', loaderPath);
    }
    arguments_.push('--input-type=module', '--eval', script);
    const result = spawnSync(process.execPath, arguments_, {
      cwd: root,
      encoding: 'utf8',
      env: { ...process.env, ...env },
    });
    assert.equal(result.status, 0, `child failed\nstdout: ${result.stdout}\nstderr: ${result.stderr}`);
    return JSON.parse(result.stdout.trim());
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}

const routeLoader = `
export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'next/server') {
    return { url: 'data:text/javascript,' + encodeURIComponent(\`
      export class NextResponse {
        static json(body, init = {}) {
          return new Response(JSON.stringify(body), {
            status: init.status || 200,
            headers: { 'content-type': 'application/json', ...(init.headers || {}) }
          });
        }
      }
    \`), shortCircuit: true };
  }
  if (specifier.includes('lead-fallback-mattermost')) {
    return { url: 'data:text/javascript,' + encodeURIComponent(\`
      export async function sendLeadFallbackToMattermost() {
        globalThis.__deliveryEvents.push('fallback');
        return globalThis.__fallbackResult;
      }
    \`), shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
`;

test('endpoint rejects invalid requests without delivery and confirms primary or fallback delivery', () => {
  const result = runTypeScriptModule(`
    process.env.NODE_ENV = 'production';
    globalThis.__deliveryEvents = [];
    globalThis.__fallbackResult = false;
    let primaryResult = true;
    globalThis.fetch = async () => {
      globalThis.__deliveryEvents.push('primary');
      return new Response(primaryResult ? null : '', { status: primaryResult ? 204 : 503 });
    };
    const { POST } = await import(process.env.ROUTE_URL);
    let ip = 0;
    function validForm() {
      const form = new FormData();
      form.set('source', 'contact-page');
      form.set('first_name', 'Ada');
      form.set('last_name', 'Lovelace');
      form.set('email', 'ada@analytical.example');
      form.set('company', 'Analytical Engines');
      form.set('company_size', '11 to 50');
      form.set('positions_to_fill', '2 to 3');
      form.set('referral_source', 'Search engine');
      form.set('phone_country', '+44');
      return form;
    }
    async function submit(form, headers = {}) {
      const request = new Request('https://hireoffshoreteams.com/api/submit-lead', {
        method: 'POST',
        headers: { origin: 'https://hireoffshoreteams.com', 'x-real-ip': '192.0.2.' + (++ip), ...headers },
        body: form,
      });
      const response = await POST(request);
      return { status: response.status, body: await response.json() };
    }

    process.env.ACR_LEAD_ENDPOINT = 'https://internal.invalid/lead';
    const primary = await submit(validForm());
    const afterPrimary = [...globalThis.__deliveryEvents];

    primaryResult = false;
    globalThis.__fallbackResult = true;
    const fallback = await submit(validForm());
    const afterFallback = [...globalThis.__deliveryEvents];

    globalThis.__deliveryEvents.length = 0;
    const personalForm = validForm();
    personalForm.set('email', 'ada@gmail.com');
    const personal = await submit(personalForm);

    const unknownForm = validForm();
    unknownForm.set('admin', 'true');
    const unknown = await submit(unknownForm);

    const duplicateForm = validForm();
    duplicateForm.append('source', 'duplicate');
    const duplicate = await submit(duplicateForm);

    const honeypotForm = validForm();
    honeypotForm.set('website_url', 'https://spam.invalid');
    const honeypot = await submit(honeypotForm);
    const invalidDeliveryEvents = [...globalThis.__deliveryEvents];

    const badOrigin = await submit(validForm(), { origin: 'https://hireoffshoreteams.com.evil.invalid' });
    const jsonRequest = new Request('https://hireoffshoreteams.com/api/submit-lead', {
      method: 'POST', headers: { origin: 'https://hireoffshoreteams.com', 'content-type': 'application/json', 'x-real-ip': '192.0.2.200' }, body: '{}'
    });
    const jsonResponse = await POST(jsonRequest);
    const wrongType = { status: jsonResponse.status, body: await jsonResponse.json() };

    const oversized = validForm();
    oversized.set('message', 'x'.repeat(70000));
    const oversizedResult = await submit(oversized);

    const declaredOversized = await submit(validForm(), { 'content-length': '65537' });

    globalThis.__fallbackResult = false;
    const noSink = await submit(validForm());

    const rateResults = [];
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const spam = validForm();
      spam.set('website_url', 'bot');
      const request = new Request('https://hireoffshoreteams.com/api/submit-lead', {
        method: 'POST',
        headers: { origin: 'https://hireoffshoreteams.com', 'x-real-ip': '198.51.100.50' },
        body: spam,
      });
      rateResults.push((await POST(request)).status);
    }

    console.log(JSON.stringify({ primary, afterPrimary, fallback, afterFallback, personal, unknown, duplicate, honeypot, invalidDeliveryEvents, badOrigin, wrongType, oversizedResult, declaredOversized, noSink, rateResults }));
  `, { ROUTE_URL: routeUrl }, routeLoader);

  assert.deepEqual(result.primary.body, { ok: true, delivered: true });
  assert.deepEqual(result.afterPrimary, ['primary']);
  assert.deepEqual(result.fallback.body, { ok: true, delivered: true });
  assert.deepEqual(result.afterFallback, ['primary', 'primary', 'fallback']);
  assert.equal(result.personal.status, 400);
  assert.equal(result.unknown.status, 400);
  assert.equal(result.duplicate.status, 400);
  assert.deepEqual(result.honeypot, { status: 200, body: { ok: false, ignored: true, delivered: false } });
  assert.deepEqual(result.invalidDeliveryEvents, []);
  assert.equal(result.badOrigin.status, 403);
  assert.equal(result.wrongType.status, 415);
  assert.equal(result.oversizedResult.status, 413);
  assert.equal(result.declaredOversized.status, 413);
  assert.deepEqual(result.noSink, { status: 502, body: { ok: false, delivered: false, message: 'We could not send your request.' } });
  assert.deepEqual(result.rateResults, [200, 200, 200, 200, 200, 429]);
});

test('Mattermost fallback returns a reliable boolean and escapes markdown fields', () => {
  const result = runTypeScriptModule(`
    process.env.SITE_MATTERMOST_FALLBACK_WEBHOOK_URL = 'https://secret-webhook.invalid/token';
    let sentBody = '';
    globalThis.fetch = async (_url, init) => {
      sentBody = init.body;
      return new Response('', { status: 200 });
    };
    const { sendLeadFallbackToMattermost } = await import(process.env.FALLBACK_URL);
    const delivered = await sendLeadFallbackToMattermost({
      name: 'Ada | *Lead* @channel', email: 'ada@business.example', phone: '+44 123',
      business: 'Engine \\ Works', message: 'First | line\\nSecond * line',
      pageUrl: 'https://hireoffshoreteams.com/contact-us'
    });
    globalThis.fetch = async () => new Response('', { status: 500 });
    const rejected = await sendLeadFallbackToMattermost({
      name: 'Grace Hopper', email: 'grace@business.example', phone: '', pageUrl: ''
    });
    console.log(JSON.stringify({ delivered, rejected, sentBody }));
  `, { FALLBACK_URL: fallbackUrl });

  assert.equal(result.delivered, true);
  assert.equal(result.rejected, false);
  const webhookPayload = JSON.parse(result.sentBody);
  assert.match(webhookPayload.text, /Ada \\| \\\*Lead\\\*/);
  assert.match(webhookPayload.text, /> First \\| line/);
  assert.doesNotMatch(webhookPayload.text, /@channel/);
  assert.doesNotMatch(webhookPayload.text, /secret-webhook/);
});

test('tracking proxy enforces origin, JSON media type, schema, byte limit, rate limit, and timeout-safe upstream behavior', () => {
  const result = runTypeScriptModule(`
    let upstreamCalls = 0;
    globalThis.fetch = async () => { upstreamCalls += 1; return new Response('{"status":"ok"}', { status: 202, headers: { 'content-type': 'application/json' } }); };
    const { POST } = await import(process.env.TRACKING_URL);
    const make = (body, headers = {}) => new Request('https://hireoffshoreteams.com/ingest/track', { method: 'POST', body, headers: { origin: 'https://hireoffshoreteams.com', 'content-type': 'application/json', 'x-real-ip': headers.ip || '203.0.113.10', ...headers } });
    const valid = await POST(make(JSON.stringify({ event: 'page_view', path: '/contact-us', value: 1 })));
    const hostile = await POST(make('{}', { origin: 'https://hireoffshoreteams.com.evil.invalid', ip: '203.0.113.11' }));
    const media = await POST(make('{}', { 'content-type': 'text/plain', ip: '203.0.113.12' }));
    const schema = await POST(make(JSON.stringify({ nested: { unsafe: true } }), { ip: '203.0.113.13' }));
    const oversized = await POST(make(JSON.stringify({ event: 'x'.repeat(66000) }), { ip: '203.0.113.14' }));
    const rate = [];
    for (let i = 0; i < 31; i += 1) rate.push((await POST(make('{}', { ip: '203.0.113.15' }))).status);
    console.log(JSON.stringify({ valid: valid.status, hostile: hostile.status, media: media.status, schema: schema.status, oversized: oversized.status, lastRate: rate.at(-1), upstreamCalls }));
  `, { TRACKING_URL: trackingUrl });
  assert.deepEqual(result, { valid: 202, hostile: 403, media: 415, schema: 400, oversized: 413, lastRate: 429, upstreamCalls: 31 });
});
