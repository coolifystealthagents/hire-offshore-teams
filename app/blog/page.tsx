import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { blogPosts } from '@/lib/content';
import { editorialImage } from '@/lib/editorial';

const title = 'Blog';
const description = 'Practical guides for distributed team design and management.';
const hero = editorialImage(blogPosts[0].slug, blogPosts[0].title, blogPosts[0].thumbnail);
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/blog' },
  openGraph: { title, description, url: '/blog', type: 'website', images: [{ url: hero, alt: 'Distributed operations editorial illustration' }] },
  twitter: { card: 'summary_large_image', title, description, images: [hero] },
};

export default function Page() {
  return <main id="main-content" tabIndex={-1}>
    <header className="page-hero index-hero">
      <div><p className="eyebrow">Distributed operations field notes</p><h1>Clear roles. Reliable bridges.</h1><p>Guides for building offshore teams with visible ownership, evidence, and escalation.</p></div>
      <Image className="index-hero-image" src={hero} alt="Distributed operations editorial illustration" width={1200} height={630} priority />
    </header>
    <section className="content-wrap">
      <div className="principles">{['All', ...new Set(blogPosts.map((post) => post.category))].map((category) => <span className="pill" key={category}>{category} ({category === 'All' ? blogPosts.length : blogPosts.filter((post) => post.category === category).length})</span>)}</div>
      <div className="article-grid">{blogPosts.map((post) => <Link className="article-card" href={`/blog/${post.slug}`} key={post.slug}>{post.thumbnail && <Image src={post.thumbnail} alt="" width={1200} height={630} />}<span className="pill">{post.category}</span><h2>{post.title}</h2><p>{post.description}</p><p className="meta">Published {post.publishedAt}</p><span className="text-link">Read article</span></Link>)}</div>
    </section>
  </main>;
}
