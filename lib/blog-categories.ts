type CategorizedPost = { category: string };

export type BlogCategoryOption = {
  name: string;
  slug: string | null;
  count: number;
  href: string;
};

function categorySlug(name: string) {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'category';
}

export function getBlogCategoryOptions<T extends CategorizedPost>(posts: readonly T[]): BlogCategoryOption[] {
  const counts = new Map<string, number>();
  for (const post of posts) counts.set(post.category, (counts.get(post.category) ?? 0) + 1);

  const slugCounts = new Map<string, number>();
  const categories = [...counts].map(([name, count]) => {
    const baseSlug = categorySlug(name);
    const occurrence = (slugCounts.get(baseSlug) ?? 0) + 1;
    slugCounts.set(baseSlug, occurrence);
    const slug = occurrence === 1 ? baseSlug : `${baseSlug}-${occurrence}`;
    return { name, slug, count, href: `/blog?category=${encodeURIComponent(slug)}` };
  });

  return [{ name: 'All', slug: null, count: posts.length, href: '/blog' }, ...categories];
}

export function selectBlogCategory<T extends CategorizedPost>(posts: readonly T[], requestedSlug?: string) {
  const selected = getBlogCategoryOptions(posts).find((category) => category.slug === requestedSlug);
  if (!selected || selected.slug === null) return { activeSlug: null, posts: [...posts] };
  return {
    activeSlug: selected.slug,
    posts: posts.filter((post) => post.category === selected.name),
  };
}