'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { BlogCategoryOption } from '@/lib/blog-categories';

export function BlogCategoryNav({ categories, activeSlug }: { categories: BlogCategoryOption[]; activeSlug: string | null }) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !active || !window.matchMedia('(max-width: 620px)').matches) return;
    nav.scrollTo({ left: Math.max(0, active.offsetLeft - (nav.clientWidth - active.clientWidth) / 2), behavior: 'auto' });
  }, [activeSlug]);

  return <nav ref={navRef} className="principles blog-category-nav" aria-label="Blog categories">
    {categories.map((category) => <Link className={`pill category-link${activeSlug === category.slug ? ' is-active' : ''}`} href={category.href} aria-current={activeSlug === category.slug ? 'page' : undefined} key={category.name}>{category.name} ({category.count})</Link>)}
  </nav>;
}