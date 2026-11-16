import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArticleSidebar } from '@/components/ArticleSidebar';
import type { TocItem } from '@/lib/editorial';

type SidebarLink = { href: string; label: string };
type Fact = { label: string; value: string };
type Breadcrumb = { label: string; href?: string };

type EditorialArticleShellProps = {
  kind: 'blog' | 'research';
  breadcrumb: Breadcrumb[];
  title: string;
  summary: string;
  meta: ReactNode;
  hero: { src: string; alt: string };
  toc: TocItem[];
  facts: Fact[];
  related: SidebarLink[];
  services: SidebarLink[];
  sources?: SidebarLink[];
  children: ReactNode;
};

export function EditorialArticleShell({ kind, breadcrumb, title, summary, meta, hero, toc, facts, related, services, sources, children }: EditorialArticleShellProps) {
  return <>
    <header className={`page-hero editorial-hero editorial-hero-${kind}`}>
      <nav className="editorial-breadcrumb" aria-label="Breadcrumb">
        {breadcrumb.map((item, index) => <span className="editorial-breadcrumb-item" key={`${item.label}-${index}`}>
          {index ? <span aria-hidden="true">/</span> : null}
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
        </span>)}
        <span className="editorial-breadcrumb-item"><span aria-hidden="true">/</span><span aria-current="page">{title}</span></span>
      </nav>
      <div className="editorial-hero-grid">
        <div className="editorial-hero-copy">
          <p className="eyebrow">{kind === 'blog' ? 'Operations field note' : 'Research brief'}</p>
          <h1>{title}</h1>
          <p className="editorial-dek">{summary}</p>
          <p className="meta">{meta}</p>
        </div>
        <figure className="article-hero-image editorial-hero-image">
          <Image src={hero.src} alt={hero.alt} width={1200} height={630} sizes="(max-width: 960px) 90vw, 42vw" priority />
        </figure>
      </div>
    </header>
    <section className="content-wrap article-layout">
      <ArticleSidebar toc={toc} facts={facts} related={related} services={services} sources={sources} />
      <article className={`editorial-article ${kind === 'research' ? 'research-article' : 'blog-article'}`}>{children}</article>
    </section>
  </>;
}
