import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleSidebar } from '@/components/ArticleSidebar';
import { researchPosts, researchBySlug } from '@/lib/content';
import { editorialImage, headingId, researchSections, serviceLinksFor, type TocItem } from '@/lib/editorial';
import { site } from '@/lib/site';
import '../../editorial.css';
import TocSync from '@/components/TocSync';
const displayPublishedDate = (value: string) => new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));

export function generateStaticParams() {
  return researchPosts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = researchBySlug(slug);
  if (!post) return {};
  const image = editorialImage(post.slug, post.title, post.thumbnail);
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/research/${post.slug}` },
    openGraph: { type: 'article', title: post.title, description: post.summary, url: `/research/${post.slug}`, publishedTime: post.publishedAt, images: [{ url: image, alt: `Research illustration for ${post.title}` }] },
    twitter: { card: 'summary_large_image', title: post.title, description: post.summary, images: [image] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = researchBySlug(slug);
  if (!post) notFound();

  const sections = researchSections(post.title, post.finding, post.sections);
  const clusterMatches = researchPosts.filter((item) => item.slug !== post.slug && item.cluster === post.cluster);
  const related = [...clusterMatches, ...researchPosts.filter((item) => item.slug !== post.slug && item.cluster !== post.cluster)].slice(0, 3);
  const services = serviceLinksFor(`${post.slug} ${post.title} ${post.cluster}`);
  const toc: TocItem[] = [
    { id: 'key-finding', label: 'Key finding', level: 2 },
    ...sections.map((section) => ({ id: headingId(section.heading), label: section.heading, level: 2 as const })),
    { id: 'sources', label: 'Sources', level: 2 },
    { id: 'apply-this-research', label: 'Apply this research', level: 2 },
  ];
  const heroImage = editorialImage(post.slug, post.title, post.thumbnail);
  const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.summary, datePublished: post.publishedAt, author: { '@type': 'Organization', name: `${site.name} Research Desk` }, publisher: { '@type': 'Organization', name: site.name }, mainEntityOfPage: `https://${site.domain}/research/${post.slug}`, image: `https://${site.domain}${heroImage}` };

  return <main id="main-content" tabIndex={-1}><TocSync />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c') }} />
    <header className="page-hero editorial-hero">
      <nav className="editorial-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/research">Research</Link><span aria-hidden="true">/</span><span>{post.cluster}</span></nav>
      <h1>{post.title}</h1>
      <p className="editorial-dek">{post.summary}</p>
      <p className="meta">{site.name} Research Desk · Published <time dateTime={post.publishedAt}>{displayPublishedDate(post.publishedAt)}</time></p>
    </header>
    <section className="content-wrap article-layout">
      <ArticleSidebar
        toc={toc}
        facts={[
          { label: 'Research area', value: post.cluster },
          { label: 'Evidence sections', value: String(sections.length) },
          { label: 'Public sources', value: String(post.sources.length) },
          { label: 'Publisher', value: `${site.name} Research Desk` },
        ]}
        related={related.map((item) => ({ href: `/research/${item.slug}`, label: item.title }))}
        services={services.map((service) => ({ href: `/services/${service.slug}`, label: service.name }))}
        sources={post.sources.map((source) => ({ href: source.url, label: source.label }))}
      />
      <article className="editorial-article research-article">
        <figure className="article-hero-image">
          <Image src={heroImage} alt={`Research illustration for ${post.title}`} width={1200} height={630} sizes="(max-width: 900px) 90vw, 760px" priority />
        </figure>
        <section className="key-finding" aria-labelledby="key-finding">
          <h2 id="key-finding">Key finding</h2>
          <p>{post.finding}</p>
        </section>
        {sections.map((section) => <section className="article-section" key={section.heading} aria-labelledby={headingId(section.heading)}>
          <h2 id={headingId(section.heading)}>{section.heading}</h2>
          {section.paragraphs.map((paragraph, index) => <p key={`${section.heading}-${index}`}>{paragraph}</p>)}
        </section>)}
        <section className="article-section sources" aria-labelledby="sources">
          <h2 id="sources">Sources</h2>
          <ol>{post.sources.map((source, index) => <li key={`${source.url}-${index}`}><a href={source.url} rel="noreferrer">{source.label}</a></li>)}</ol>
        </section>
        <div className="article-end-cta">
          <h2 id="apply-this-research">Apply this research to your workflow</h2>
          <p>Use the protocol to define the records, review owner, and decision boundaries before work is delegated.</p>
          <Link className="button primary" href="/contact-us">Discuss your workflow</Link>
        </div>
      </article>
    </section>
  </main>;
}
