import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const read = (path) => readFileSync(join(root, path), 'utf8');
const source = (...paths) => paths.map(read).join('\n');

test('shared shell has exact sticky navigation, skip link, attribution, and no timed modal', () => {
  const chrome = read('components/SiteChrome.tsx');
  const layout = read('app/layout.tsx');
  assert.match(chrome, /skip-to-content/);
  assert.match(chrome, /Home[\s\S]*Services[\s\S]*Contact Us/);
  assert.equal((chrome.match(/Powered by StealthAgents/g) || []).length, 2);
  assert.match(chrome, /aria-expanded/);
  assert.match(chrome, /aria-controls/);
  assert.doesNotMatch(chrome + layout, /TimedLeadModal|lead-modal-seen/);
});

test('contact conversion contract uses approved reviews and parent assets', () => {
  const contact = source('app/contact-us/page.tsx', 'components/ReviewMarquee.tsx');
  const reviews = JSON.parse(read('app/review-provenance.json'));
  assert.ok(reviews.length >= 10);
  assert.equal(new Set(reviews.map((review) => review.id)).size, reviews.length);
  assert.match(contact, /StealthAgents reviews/);
  assert.match(contact, /Approved client feedback published by StealthAgents/);
  assert.match(contact, /Five star review/);
  assert.match(contact, /★★★★★/);
  assert.match(contact, /Focus or hover to pause/);
  assert.doesNotMatch(contact, /Pause reviews|Resume reviews|aria-pressed|is-paused|Verified first-party source/);
  assert.match(contact, /Official team, Bacolod/);
  assert.match(contact, /stealth-agents-team\.webp/);
  assert.match(contact, /stealth-agents-logo-black\.png/);
  assert.doesNotMatch(contact, /oncehub\.com/i);
});

test('thank-you routes implement truthful funnel and are excluded from sitemap', () => {
  assert.match(read('app/thank-you/page.tsx'), /https:\/\/go\.oncehub\.com\/StealthAgentsTeam/);
  assert.match(read('app/thanks-whats-next/page.tsx'), /direct|If you reached this page directly/i);
  assert.doesNotMatch(read('app/sitemap.ts'), /thank-you|thanks-whats-next/);
});

test('all six service details use the substantial shared operating page system', () => {
  const page = read('app/services/[slug]/page.tsx');
  for (const heading of ['Who this team is for', 'Inputs', 'Scope of work', 'Workflow', 'Outputs', 'Boundaries', 'Quality controls', 'Common starting scenarios', 'Frequently asked questions', 'Related services']) assert.match(page, new RegExp(heading, 'i'));
  assert.match(page, /ServiceNetworkVisual/);
});

test('article layouts have generated complete TOC, populated sticky sidebar, and active section behavior', () => {
  const editorial = source('components/ArticleSidebar.tsx', 'app/blog/[slug]/page.tsx', 'app/research/[slug]/page.tsx');
  assert.match(editorial, /IntersectionObserver/);
  assert.match(editorial, /aria-current/);
  assert.match(editorial, /<details/);
  assert.match(editorial, /Related (reading|services)/);
  assert.match(editorial, /article-sidebar/);
});

test('endpoint enforces content type, byte limit, trusted origin, bounded schema, rate cap, and confirmed delivery', () => {
  const route = read('app/api/submit-lead/route.ts');
  for (const contract of ['content-length', 'multipart/form-data', 'allowedOrigins', 'MAX_BODY_BYTES', 'rateLimit', 'delivered', 'ignored']) assert.match(route, new RegExp(contract, 'i'));
  assert.doesNotMatch(route, /void sendLeadFallback/);
});

test('SEO, canonical redirects, security policy, logo identity, and design registry exist', () => {
  const config = source('next.config.mjs', 'middleware.ts', 'lib/canonical-request.ts');
  for (const header of ['Strict-Transport-Security', 'Content-Security-Policy', 'X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy']) assert.match(config, new RegExp(header));
  assert.match(config, /cf-visitor/i);
  assert.match(config, /x-forwarded-proto/i);
  assert.match(config, /script-src[^"\n]*https:\/\/static\.cloudflareinsights\.com/);
  assert.match(config, /connect-src[^"\n]*https:\/\/cloudflareinsights\.com/);
  assert.ok(existsSync(join(root, 'app/icon.svg')));
  const registry = JSON.parse(read('design-registry.json'));
  assert.equal(registry.domain, 'hireoffshoreteams.com');
  assert.ok(registry.comparisonNote);
});

test('commercial components contain no decorative zero-padded labels', () => {
  const commercial = source('components/Marketing.tsx', 'app/contact-us/page.tsx', 'app/services/page.tsx', 'app/services/[slug]/page.tsx');
  assert.doesNotMatch(commercial, />\s*0[1-9]\s*</);
});

test('responsive grids and large mobile headings cannot expand the root canvas', () => {
  const styles = read('app/globals.css');
  assert.match(styles, /\.article-grid,\.scenario-grid\{[^}]*repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(styles, /\.content-grid\{[^}]*repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(styles, /\.services-hero>\*,\.service-hero>\*\{min-width:0\}/);
  assert.match(styles, /@media\(max-width:620px\)[\s\S]*h1,h2,h3\{overflow-wrap:anywhere\}/);
});

test('legacy editorial repairs retain distinct truthful metadata and relevant sources', () => {
  const content = read('lib/content.ts');
  for (const description of [
    'Compare fractional operating leadership with offshore delivery capacity',
    'Write an offshore role charter that defines purpose, outputs, scope',
    'Build distributed handoffs that preserve current state, decisions, evidence',
    'Design an offshore operations review rhythm for queue control',
    'Create an offshore escalation map with observable triggers',
  ]) assert.match(content, new RegExp(description));
  assert.ok((content.match(/"readTime": "4 min read"/g) || []).length >= 5);
  assert.match(content, /Small Business Administration: Manage your business/);
  assert.match(content, /Office of Personnel Management: Position classification/);
  assert.match(content, /Agency for Healthcare Research and Quality: Handoff/);
  assert.match(content, /Government Accountability Office: Green Book/);
  assert.match(content, /National Institute of Standards and Technology: Incident response recommendations/);
  assert.doesNotMatch(content, /A practical guide to a practical offshore team review rhythm/);
});
