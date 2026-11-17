import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const read = (path) => readFileSync(join(root, path), 'utf8');
const source = (...paths) => paths.map(read).join('\n');

test('GPT Taste preserve-mode design registry records the approved dials', () => {
  const registry = JSON.parse(read('design-registry.json'));
  assert.equal(registry.redesignMode, 'preserve');
  assert.equal(registry.designVariance, 8);
  assert.equal(registry.motionIntensity, 3);
  assert.equal(registry.visualDensity, 7);
});

test('shared semantic tokens own sitewide surfaces, rhythm, shape, and motion', () => {
  const styles = read('app/globals.css');
  for (const token of [
    '--surface-raised', '--surface-dark', '--surface-soft', '--text-muted',
    '--page-gutter', '--section-space', '--reading-measure', '--radius-panel',
    '--shadow-hard', '--motion-fast', '--motion-standard', '--ease-out',
  ]) assert.match(styles, new RegExp(token));
  assert.match(styles, /prefers-reduced-motion:reduce/);
});

test('primary navigation omits editorial links while the footer keeps them available', () => {
  const chrome = read('components/SiteChrome.tsx');
  const primary = chrome.match(/const primaryNav = \[([\s\S]*?)\];/)?.[1] ?? '';
  const footer = chrome.match(/const footerNav = \[([\s\S]*?)\];/)?.[1] ?? '';
  for (const label of ['Home', 'Services', 'Contact Us']) assert.match(primary, new RegExp(`label: '${label}'`));
  for (const label of ['Blog', 'Research']) assert.doesNotMatch(primary, new RegExp(`label: '${label}'`));
  for (const label of ['Blog', 'Research']) assert.match(footer, new RegExp(`label: '${label}'`));
  assert.match(chrome, /primaryNav\.map/);
  assert.match(chrome, /footerNav\.map/);
  assert.match(chrome, /aria-current/);
});

test('blog and research indexes use one shared editorial index and card system', () => {
  const shared = read('components/EditorialIndex.tsx');
  const indexes = source('app/blog/page.tsx', 'app/research/page.tsx');
  assert.match(shared, /export function EditorialIndex/);
  assert.match(shared, /export function EditorialCard/);
  assert.match(shared, /editorial-index-context/);
  assert.match(shared, /editorial-card-media/);
  assert.match(shared, /summary/);
  assert.equal((indexes.match(/EditorialIndex/g) || []).length >= 4, true);
  assert.equal((indexes.match(/EditorialCard/g) || []).length >= 4, true);
});

test('blog and research details use one shared article shell while preserving distinct content', () => {
  const shell = read('components/EditorialArticleShell.tsx');
  const blog = read('app/blog/[slug]/page.tsx');
  const research = read('app/research/[slug]/page.tsx');
  assert.match(shell, /export function EditorialArticleShell/);
  assert.match(shell, /ArticleSidebar/);
  assert.match(shell, /editorial-hero/);
  assert.match(shell, /aria-current="page">\{title\}/);
  assert.match(blog, /EditorialArticleShell/);
  assert.match(blog, /const primaryService = services\[0\]/);
  assert.match(blog, /sectionIndex === 2 && primaryService/);
  assert.match(blog, /href=\{`\/services\/\$\{primaryService\.slug\}`\}/);
  assert.doesNotMatch(blog, /href=\{post\.internalService\}/);
  assert.match(research, /EditorialArticleShell/);
  assert.match(blog, /Common questions answered/);
  assert.match(research, /Key finding/);
  assert.match(research, /Sources/);
});

test('about, legal, and conversion routes declare meaningful presentation modes', () => {
  assert.match(read('app/about/page.tsx'), /narrative-page/);
  assert.match(read('app/privacy/page.tsx'), /legal-page/);
  assert.match(read('app/terms/page.tsx'), /legal-page/);
  assert.match(read('app/privacy/page.tsx'), /ACR service, which owns request delivery and notification handling/);
  assert.doesNotMatch(read('app/privacy/page.tsx'), /Mattermost workspace as an emergency fallback/);
  assert.match(read('app/thank-you/page.tsx'), /funnel-page/);
  assert.match(read('app/thanks-whats-next/page.tsx'), /funnel-page/);
});

test('preserved production contracts remain present after visual consolidation', () => {
  const all = source(
    'app/layout.tsx', 'app/contact-us/page.tsx', 'components/LeadForm.tsx',
    'app/blog/page.tsx', 'app/blog/[slug]/page.tsx', 'components/BlogCategoryNav.tsx',
  );
  for (const contract of [
    'acrtracking.stealthagents.us', 'databull.stealthagents.us',
    'contact-page-consultation', 'stealth-agents-team-bacolod.jpg',
    'BlogCategoryNav', 'editorialImage',
  ]) assert.match(all, new RegExp(contract));
});
