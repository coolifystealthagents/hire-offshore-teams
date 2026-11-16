import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync(new URL('../app/blog/[slug]/page.tsx', import.meta.url), 'utf8');

function sourceBetween(start, end) {
  const startIndex = page.indexOf(start);
  const endIndex = page.indexOf(end, startIndex + start.length);
  assert.notEqual(startIndex, -1, `missing ${start}`);
  assert.notEqual(endIndex, -1, `missing ${end}`);
  return page.slice(startIndex, endIndex);
}

test('blog detail hero owns the post image and the article body does not duplicate it', () => {
  const hero = sourceBetween('<header className="page-hero editorial-hero">', '</header>');
  const article = sourceBetween('<article className="editorial-article">', '</article>');

  assert.match(hero, /<figure className="[^"]*article-hero-image[^"]*">[\s\S]*<Image[\s\S]*src=\{heroImage\}[\s\S]*alt=\{`Editorial illustration for \$\{post\.title\}`\}[\s\S]*sizes=/);
  assert.equal((page.match(/src=\{heroImage\}/g) || []).length, 1);
  assert.doesNotMatch(article, /article-hero-image|src=\{heroImage\}/);
});
