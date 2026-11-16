import test from 'node:test';
import assert from 'node:assert/strict';

const fixture = [
  { slug: 'role-one', category: 'Role design' },
  { slug: 'team-one', category: 'Team operations' },
  { slug: 'role-two', category: 'Role design' },
  { slug: 'role-case-distinct', category: 'Role Design' },
];

test('category options come from the post collection with stable distinct URL slugs and counts', async () => {
  const { getBlogCategoryOptions } = await import('../lib/blog-categories.ts');
  assert.deepEqual(getBlogCategoryOptions(fixture), [
    { name: 'All', slug: null, count: 4, href: '/blog' },
    { name: 'Role design', slug: 'role-design', count: 2, href: '/blog?category=role-design' },
    { name: 'Team operations', slug: 'team-operations', count: 1, href: '/blog?category=team-operations' },
    { name: 'Role Design', slug: 'role-design-2', count: 1, href: '/blog?category=role-design-2' },
  ]);
});

test('category selection returns all and only exact matches and restores all posts for missing or unknown filters', async () => {
  const { selectBlogCategory } = await import('../lib/blog-categories.ts');

  assert.deepEqual(selectBlogCategory(fixture, 'role-design'), {
    activeSlug: 'role-design',
    posts: [fixture[0], fixture[2]],
  });
  assert.deepEqual(selectBlogCategory(fixture, 'role-design-2'), {
    activeSlug: 'role-design-2',
    posts: [fixture[3]],
  });
  assert.deepEqual(selectBlogCategory(fixture, undefined), {
    activeSlug: null,
    posts: fixture,
  });
  assert.deepEqual(selectBlogCategory(fixture, 'not-published'), {
    activeSlug: null,
    posts: fixture,
  });
});
