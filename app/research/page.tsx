import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { researchPosts } from '@/lib/content';
import { editorialImage } from '@/lib/editorial';

const title = 'Research';
const description = 'Source-led distributed operations research.';
const hero = editorialImage(researchPosts[0].slug, researchPosts[0].title, researchPosts[0].thumbnail);
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/research' },
  openGraph: { title, description, url: '/research', type: 'website', images: [{ url: hero, alt: 'Distributed operations research illustration' }] },
  twitter: { card: 'summary_large_image', title, description, images: [hero] },
};

export default function Page() {
  return <main id="main-content" tabIndex={-1}>
    <header className="page-hero index-hero">
      <div><p className="eyebrow">Research library</p><h1>Evidence for distributed team decisions.</h1><p>Transparent protocols for testing handoffs, ownership, and operating controls.</p></div>
      <Image className="index-hero-image" src={hero} alt="Distributed operations research illustration" width={1200} height={630} priority />
    </header>
    <section className="content-wrap content-grid">{researchPosts.map((post) => <Link className="content-card" href={`/research/${post.slug}`} key={post.slug}>{post.thumbnail && <Image src={post.thumbnail} alt="" width={1200} height={630} />}<span className="pill">{post.cluster}</span><h2>{post.title}</h2><p>{post.summary}</p><p className="meta">Published {post.publishedAt}</p><span className="text-link">Review the brief</span></Link>)}</section>
  </main>;
}
