import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync(new URL('../app/blog/[slug]/page.tsx', import.meta.url), 'utf8');
const shell = readFileSync(new URL('../components/EditorialArticleShell.tsx', import.meta.url), 'utf8');

test('shared editorial shell owns the blog hero image and the article body does not duplicate it', () => {
  assert.match(shell, /<header className=\{`page-hero editorial-hero/);
  assert.match(shell, /<figure className="article-hero-image editorial-hero-image">[\s\S]*<Image[\s\S]*src=\{hero\.src\}[\s\S]*alt=\{hero\.alt\}[\s\S]*sizes=/);
  assert.match(page, /<EditorialArticleShell[\s\S]*hero=\{\{ src: heroImage, alt: `Editorial illustration for \$\{post\.title\}` \}\}/);
  assert.equal((page.match(/src: heroImage/g) || []).length, 1);

  const childrenStart = page.indexOf('>\n      {post.sections.map');
  assert.notEqual(childrenStart, -1, 'missing blog article children');
  const articleChildren = page.slice(childrenStart);
  assert.doesNotMatch(articleChildren, /article-hero-image|src=\{heroImage\}|src: heroImage/);
});
