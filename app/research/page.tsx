import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { researchPosts } from '@/lib/content';

const title = 'Research';
const description = 'Source-led distributed operations research.';
const hero = '/images/research-hero-evidence.jpg';
const heroAlt = 'Analysts reviewing workflow evidence, quality checks, and performance charts';
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/research' },
  openGraph: { title, description, url: '/research', type: 'website', images: [{ url: hero, width: 1672, height: 941, alt: heroAlt }] },
  twitter: { card: 'summary_large_image', title, description, images: [hero] },
};

export default function Page() {
  return <main id="main-content" tabIndex={-1} className="research-index">
    <header className="page-hero index-hero">
      <div><p className="eyebrow">Research library</p><h1>Evidence for distributed team decisions.</h1><p>Transparent protocols for testing handoffs, ownership, and operating controls.</p></div>
      <Image className="index-hero-image" src={hero} alt={heroAlt} width={1672} height={941} sizes="(max-width: 980px) 90vw, 42vw" priority />
    </header>
    <section className="content-wrap content-grid">{researchPosts.map((post) => <Link className="content-card" href={`/research/${post.slug}`} key={post.slug}>{post.thumbnail && <Image src={post.thumbnail} alt="" width={1200} height={630} />}<span className="pill">{post.cluster}</span><h2>{post.title}</h2><p>{post.summary}</p><p className="meta">Published {post.publishedAt}</p><span className="text-link">Review the brief</span></Link>)}</section>
  </main>;
}
