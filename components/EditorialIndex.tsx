import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type EditorialIndexProps = {
  eyebrow: string;
  title: string;
  description: string;
  hero: { src: string; alt: string; width: number; height: number };
  contextEyebrow: string;
  contextTitle: string;
  contextBody: string;
  countLabel: string;
  toolbar?: ReactNode;
  children: ReactNode;
};

type EditorialCardProps = {
  href: string;
  image?: string;
  imageAlt: string;
  tag: string;
  title: string;
  summary: string;
  publishedAt: string;
  destination: string;
  variant: 'blog' | 'research';
};

export function EditorialIndex({ eyebrow, title, description, hero, contextEyebrow, contextTitle, contextBody, countLabel, toolbar, children }: EditorialIndexProps) {
  return <>
    <header className="page-hero index-hero editorial-index-hero">
      <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>
      <figure className="editorial-index-hero-media">
        <Image className="index-hero-image" src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} sizes="(max-width: 980px) 90vw, 42vw" priority />
      </figure>
    </header>
    <section className="content-wrap editorial-index-body">
      <div className="editorial-index-context">
        <div><p className="eyebrow">{contextEyebrow}</p><h2>{contextTitle}</h2></div>
        <div><p>{contextBody}</p><p className="editorial-index-count" aria-live="polite">{countLabel}</p></div>
      </div>
      {toolbar ? <div className="editorial-index-toolbar">{toolbar}</div> : null}
      <div className="editorial-card-grid">{children}</div>
    </section>
  </>;
}

export function EditorialCard({ href, image, imageAlt, tag, title, summary, publishedAt, destination, variant }: EditorialCardProps) {
  return <Link className={`${variant === 'blog' ? 'article-card' : 'content-card'} editorial-card`} href={href}>
    {image ? <span className="editorial-card-media"><Image src={image} alt={imageAlt} width={1200} height={630} sizes="(max-width: 620px) 90vw, (max-width: 980px) 44vw, 30vw" /></span> : null}
    <span className="editorial-card-content">
      <span className="pill">{tag}</span>
      <h2>{title}</h2>
      <p>{summary}</p>
      <span className="meta">Published <time dateTime={publishedAt}>{publishedAt}</time></span>
      <span className="text-link">{destination}</span>
    </span>
  </Link>;
}
