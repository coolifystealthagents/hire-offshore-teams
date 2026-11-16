import type { Metadata } from 'next';
import { BlogCategoryNav } from '@/components/BlogCategoryNav';
import { EditorialCard, EditorialIndex } from '@/components/EditorialIndex';
import { blogPosts } from '@/lib/content';
import { getBlogCategoryOptions, selectBlogCategory } from '@/lib/blog-categories';

const title = 'Blog';
const description = 'Practical guides for distributed team design and management.';
const hero = '/images/blog-hero-field-notes.jpg';
const heroAlt = 'Operations leader writing practical field notes beside a distributed team workflow';
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/blog' },
  openGraph: { title, description, url: '/blog', type: 'website', images: [{ url: hero, width: 1672, height: 941, alt: heroAlt }] },
  twitter: { card: 'summary_large_image', title, description, images: [hero] },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  const requestedCategory = (await searchParams).category;
  const categorySlug = Array.isArray(requestedCategory) ? requestedCategory[0] : requestedCategory;
  const categories = getBlogCategoryOptions(blogPosts);
  const selection = selectBlogCategory(blogPosts, categorySlug);
  const activeCategory = categories.find((category) => category.slug === selection.activeSlug)?.name ?? 'All topics';

  return <main id="main-content" tabIndex={-1} className="blog-index editorial-index">
    <EditorialIndex
      eyebrow="Distributed operations field notes"
      title="Clear roles. Reliable bridges."
      description="Guides for building offshore teams with visible ownership, evidence, and escalation."
      hero={{ src: hero, alt: heroAlt, width: 1672, height: 941 }}
      contextEyebrow="Browse the field notes"
      contextTitle="Start with the operating question in front of you."
      contextBody="Each guide turns a recurring distributed-work question into a bounded workflow, review point, or decision path. Category links preserve a shareable destination and lead to the complete matching set."
      countLabel={`${selection.posts.length} ${selection.posts.length === 1 ? 'guide' : 'guides'} in ${activeCategory}`}
      toolbar={<BlogCategoryNav categories={categories} activeSlug={selection.activeSlug} />}
    >
      {selection.posts.map((post) => <EditorialCard
        key={post.slug}
        variant="blog"
        href={`/blog/${post.slug}`}
        image={post.thumbnail}
        imageAlt={`Editorial illustration for ${post.title}`}
        tag={post.category}
        title={post.title}
        summary={post.description}
        publishedAt={post.publishedAt}
        destination="Read article"
      />)}
    </EditorialIndex>
  </main>;
}
