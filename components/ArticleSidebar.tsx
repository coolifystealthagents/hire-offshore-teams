'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { TocItem } from '@/lib/editorial';

type SidebarLink = { href: string; label: string };
type Fact = { label: string; value: string };

type ArticleSidebarProps = {
  toc: TocItem[];
  facts: Fact[];
  related: SidebarLink[];
  services: SidebarLink[];
  sources?: SidebarLink[];
};

function Toc({ items, activeId }: { items: TocItem[]; activeId: string }) {
  return <nav className="article-toc" aria-label="Table of contents">
    <h2>On this page</h2>
    <ol>{items.map((item) => <li key={item.id} className={item.level === 3 ? 'toc-child' : undefined}>
      <a href={`#${item.id}`} aria-current={activeId === item.id ? 'location' : undefined}>{item.label}</a>
    </li>)}</ol>
  </nav>;
}

function SupportingContent({ facts, related, services, sources }: Omit<ArticleSidebarProps, 'toc'>) {
  return <>
    <section className="sidebar-module">
      <h2>Quick facts</h2>
      <dl>{facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
    </section>
    <section className="sidebar-module">
      <h2>Related reading</h2>
      <ul>{related.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}</ul>
    </section>
    <section className="sidebar-module">
      <h2>Related services</h2>
      <ul>{services.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}</ul>
    </section>
    {sources?.length ? <section className="sidebar-module">
      <h2>Source guide</h2>
      <ul>{sources.slice(0, 3).map((item, index) => <li key={`${item.href}-${item.label}-${index}`}><a href={item.href} rel="noreferrer">{item.label}</a></li>)}</ul>
    </section> : null}
    <Link className="button primary sidebar-cta" href="/contact-us">Discuss your workflow</Link>
  </>;
}

export function ArticleSidebar({ toc, facts, related, services, sources }: ArticleSidebarProps) {
  const [activeId, setActiveId] = useState(toc[0]?.id ?? '');

  useEffect(() => {
    const headings = toc.map(({ id }) => document.getElementById(id)).filter((heading): heading is HTMLElement => Boolean(heading));
    if (!headings.length) return;

    const visible = new Map<string, IntersectionObserverEntry>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visible.set(entry.target.id, entry));
      const intersecting = headings
        .filter((heading) => visible.get(heading.id)?.isIntersecting)
        .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
      if (intersecting.length) {
        setActiveId(intersecting[0].id);
        return;
      }
      const passed = headings.filter((heading) => heading.getBoundingClientRect().top < 160);
      setActiveId((passed.at(-1) ?? headings[0]).id);
    }, { rootMargin: '-112px 0px -68% 0px', threshold: [0, 0.1, 1] });

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [toc]);

  return <>
    <aside className="article-sidebar" aria-label="Article guide">
      <Toc items={toc} activeId={activeId} />
      <SupportingContent facts={facts} related={related} services={services} sources={sources} />
    </aside>
    <details className="article-sidebar-mobile">
      <summary>Article guide and table of contents</summary>
      <div className="article-sidebar-mobile-content">
        <Toc items={toc} activeId={activeId} />
        <SupportingContent facts={facts} related={related} services={services} sources={sources} />
      </div>
    </details>
  </>;
}
