import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EditorialArticleShell } from '@/components/EditorialArticleShell';
import { blogPosts, blogBySlug } from '@/lib/content';
import { getBlogCategoryOptions } from '@/lib/blog-categories';
import { editorialImage, headingId, serviceLinksFor, type TocItem } from '@/lib/editorial';
import { site } from '@/lib/site';
import '../../editorial.css';

const displayPublishedDate = (value: string) => new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));

export function generateStaticParams() { return blogPosts.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogBySlug(slug);
  if (!post) return {};
  const image = editorialImage(post.slug, post.title, post.thumbnail);
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: 'article', title: post.title, description: post.description, url: `/blog/${post.slug}`, publishedTime: post.publishedAt, images: [{ url: image, alt: `Editorial illustration for ${post.title}` }] },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description, images: [image] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogBySlug(slug);
  if (!post) notFound();

  const categoryMatches = blogPosts.filter((item) => item.slug !== post.slug && item.category === post.category);
  const categoryHref = getBlogCategoryOptions(blogPosts).find((category) => category.name === post.category)?.href ?? '/blog';
  const related = [...categoryMatches, ...blogPosts.filter((item) => item.slug !== post.slug && item.category !== post.category)].slice(0, 3);
  const services = serviceLinksFor(`${post.slug} ${post.title} ${post.category}`, post.internalService);
  const primaryService = services[0];
  const faqId = 'common-questions-answered';
  const toc: TocItem[] = [
    ...post.sections.map((section) => ({ id: headingId(section.heading), label: section.heading, level: 2 as const })),
    { id: faqId, label: 'Common questions answered', level: 2 },
    ...post.faq.map((item) => ({ id: `question-${headingId(item.q)}`, label: item.q, level: 3 as const })),
    { id: 'put-guidance-into-practice', label: 'Put the guidance into practice', level: 2 },
  ];
  const heroImage = editorialImage(post.slug, post.title, post.thumbnail);
  const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.description, datePublished: post.publishedAt, author: { '@type': 'Organization', name: `${site.name} Editorial Team` }, publisher: { '@type': 'Organization', name: site.name }, mainEntityOfPage: `https://${site.domain}/blog/${post.slug}`, image: `https://${site.domain}${heroImage}` };

  return <main id="main-content" tabIndex={-1} className="editorial-detail blog-detail">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c') }} />
    <EditorialArticleShell
      kind="blog"
      breadcrumb={[{ href: '/', label: 'Home' }, { href: '/blog', label: 'Blog' }, { href: categoryHref, label: post.category }]}
      title={post.title}
      summary={post.description}
      meta={<>{site.name} Editorial Team · Published <time dateTime={post.publishedAt}>{displayPublishedDate(post.publishedAt)}</time> · {post.readTime}</>}
      hero={{ src: heroImage, alt: `Editorial illustration for ${post.title}` }}
      toc={toc}
      facts={[
        { label: 'Topic', value: post.category },
        { label: 'Reading time', value: post.readTime },
        { label: 'Publisher', value: `${site.name} Editorial Team` },
      ]}
      related={related.map((item) => ({ href: `/blog/${item.slug}`, label: item.title }))}
      services={services.map((service) => ({ href: `/services/${service.slug}`, label: service.name }))}
      sources={[{ href: post.source.url, label: post.source.label }]}
    >
      {post.sections.map((section, sectionIndex) => <section className="article-section" key={section.heading} aria-labelledby={headingId(section.heading)}>
        <h2 id={headingId(section.heading)}>{section.heading}</h2>
        {section.paragraphs.map((paragraph, paragraphIndex) => <p key={`${section.heading}-${paragraphIndex}`}>{paragraph}</p>)}
        {sectionIndex === 2 && primaryService ? <p className="context-link">See how a <Link href={`/services/${primaryService.slug}`}>specialist offshore team</Link> can support a controlled scope and evidence trail.</p> : null}
        {sectionIndex === 4 ? <p className="context-link"><a href={post.source.url}>{post.source.label}</a> provides public guidance relevant to testing this workflow.</p> : null}
      </section>)}
      <section className="article-section article-faq" aria-labelledby={faqId}>
        <h2 id={faqId}>Common questions answered</h2>
        {post.faq.map((item) => <section className="faq-item" key={item.q} aria-labelledby={`question-${headingId(item.q)}`}>
          <h3 id={`question-${headingId(item.q)}`}>{item.q}</h3><p>{item.a}</p>
        </section>)}
      </section>
      <div className="article-end-cta">
        <h2 id="put-guidance-into-practice">Put the guidance into practice</h2>
        <p>Define the inputs, ownership, review points, and escalation boundaries before adding volume.</p>
        <Link className="button primary" href="/contact-us">Book a free consultation</Link>
      </div>
    </EditorialArticleShell>
  </main>;
}
