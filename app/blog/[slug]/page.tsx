import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleSidebar } from '@/components/ArticleSidebar';
import { blogPosts, blogBySlug } from '@/lib/content';
import { editorialImage, headingId, serviceLinksFor, type TocItem } from '@/lib/editorial';
import { site } from '@/lib/site';
import '../../editorial.css';
import TocSync from '@/components/TocSync';
const displayPublishedDate = (value: string) => new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));

export function generateStaticParams() {
  return blogPosts.map(({ slug }) => ({ slug }));
}

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
  const related = [...categoryMatches, ...blogPosts.filter((item) => item.slug !== post.slug && item.category !== post.category)].slice(0, 3);
  const services = serviceLinksFor(`${post.slug} ${post.title} ${post.category}`, post.internalService);
  const sectionItems: TocItem[] = post.sections.map((section) => ({ id: headingId(section.heading), label: section.heading, level: 2 }));
  const faqId = 'common-questions-answered';
  const toc: TocItem[] = [
    ...sectionItems,
    { id: faqId, label: 'Common questions answered', level: 2 },
    ...post.faq.map((item) => ({ id: `question-${headingId(item.q)}`, label: item.q, level: 3 as const })),
    { id: 'put-guidance-into-practice', label: 'Put the guidance into practice', level: 2 },
  ];
  const heroImage = editorialImage(post.slug, post.title, post.thumbnail);
  const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.description, datePublished: post.publishedAt, author: { '@type': 'Organization', name: `${site.name} Editorial Team` }, publisher: { '@type': 'Organization', name: site.name }, mainEntityOfPage: `https://${site.domain}/blog/${post.slug}`, image: `https://${site.domain}${heroImage}` };

  return <main id="main-content" tabIndex={-1}><TocSync />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c') }} />
    <header className="page-hero editorial-hero">
      <nav className="editorial-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><span>{post.category}</span></nav>
      <h1>{post.title}</h1>
      <p className="editorial-dek">{post.description}</p>
      <p className="meta">{site.name} Editorial Team · Published <time dateTime={post.publishedAt}>{displayPublishedDate(post.publishedAt)}</time> · {post.readTime}</p>
    </header>
    <section className="content-wrap article-layout">
      <ArticleSidebar
        toc={toc}
        facts={[
          { label: 'Topic', value: post.category },
          { label: 'Reading time', value: post.readTime },
          { label: 'Publisher', value: `${site.name} Editorial Team` },
        ]}
        related={related.map((item) => ({ href: `/blog/${item.slug}`, label: item.title }))}
        services={services.map((service) => ({ href: `/services/${service.slug}`, label: service.name }))}
        sources={[{ href: post.source.url, label: post.source.label }]}
      />
      <article className="editorial-article">
        <figure className="article-hero-image">
          <Image src={heroImage} alt={`Editorial illustration for ${post.title}`} width={1200} height={630} sizes="(max-width: 900px) 90vw, 760px" priority />
        </figure>
        {post.sections.map((section, sectionIndex) => <section className="article-section" key={section.heading} aria-labelledby={headingId(section.heading)}>
          <h2 id={headingId(section.heading)}>{section.heading}</h2>
          {section.paragraphs.map((paragraph, paragraphIndex) => <p key={`${section.heading}-${paragraphIndex}`}>{paragraph}</p>)}
          {sectionIndex === 2 ? <p className="context-link">See how a <Link href={post.internalService}>specialist offshore team</Link> can support a controlled scope and evidence trail.</p> : null}
          {sectionIndex === 4 ? <p className="context-link"><a href={post.source.url}>{post.source.label}</a> provides public guidance relevant to testing this workflow.</p> : null}
        </section>)}
        <section className="article-section article-faq" aria-labelledby={faqId}>
          <h2 id={faqId}>Common questions answered</h2>
          {post.faq.map((item) => <section className="faq-item" key={item.q} aria-labelledby={`question-${headingId(item.q)}`}>
            <h3 id={`question-${headingId(item.q)}`}>{item.q}</h3>
            <p>{item.a}</p>
          </section>)}
        </section>
        <div className="article-end-cta">
          <h2 id="put-guidance-into-practice">Put the guidance into practice</h2>
          <p>Define the inputs, ownership, review points, and escalation boundaries before adding volume.</p>
          <Link className="button primary" href="/contact-us">Book a free consultation</Link>
        </div>
      </article>
    </section>
  </main>;
}
