import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const page = readFileSync(join(root, 'app/contact-us/page.tsx'), 'utf8');
const styles = readFileSync(join(root, 'app/contact-us/contact.css'), 'utf8');
const assetPath = join(root, 'public/brand/stealth-agents-team-bacolod.jpg');
const provenancePath = join(root, 'app/contact-us/team-photo-provenance.json');

test('contact proof uses the approved official Stealth Agents Bacolod team photograph', () => {
  assert.ok(existsSync(assetPath), 'verified official team photograph must exist');
  assert.ok(existsSync(provenancePath), 'team photograph provenance record must exist');

  const provenance = JSON.parse(readFileSync(provenancePath, 'utf8'));
  const digest = createHash('sha256').update(readFileSync(assetPath)).digest('hex');
  assert.equal(digest, 'e80f0e94a80f5ddceba7fbcf723774689e47089bce7981c9f2bdb4205ea52767');
  assert.equal(provenance.assetSha256, digest);
  assert.equal(provenance.officialPageUrl, 'https://stealthagents.com/our-team/');
  assert.equal(provenance.officialAssetUrl, 'https://stealthagents.com/team-bacolod.jpg');
  assert.equal(provenance.officialPageAlt, 'Stealth Agents team members collaborating');
  assert.equal(provenance.intrinsicWidth, 953);
  assert.equal(provenance.intrinsicHeight, 540);

  assert.match(page, /src="\/brand\/stealth-agents-team-bacolod\.jpg"/);
  assert.match(page, /alt="Stealth Agents team members collaborating in Bacolod"/);
  assert.match(page, /width=\{953\}[\s\S]*height=\{540\}[\s\S]*sizes="\(max-width: 980px\) 100vw, 55vw"/);
  assert.match(page, /Official Stealth Agents team, Bacolod/);
  assert.doesNotMatch(page, /stealth-agents-team\.webp/);
});

test('contact team photograph stays fluid without face-cropping fill behavior', () => {
  assert.match(styles, /\.team-frame img\{[^}]*display:block[^}]*width:100%[^}]*height:auto[^}]*object-fit:contain[^}]*\}/);
  assert.doesNotMatch(styles, /\.team-frame\{[^}]*min-height/);
  assert.doesNotMatch(page, /stealth-agents-team-bacolod\.jpg[^>]*\bfill\b/);
});
