'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { site } from '@/lib/site';

const primaryNav = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/contact-us', label: 'Contact Us' },
];

const footerNav = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/research', label: 'Research' },
  { href: '/contact-us', label: 'Contact Us' },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  useEffect(() => { const onScroll = () => setScrolled(scrollY > 12); onScroll(); addEventListener('scroll', onScroll, { passive: true }); return () => removeEventListener('scroll', onScroll); }, []);
  useEffect(() => {
    if (!open) return;
    const prior = document.activeElement as HTMLElement;
    const focusable = panel.current?.querySelectorAll<HTMLElement>('a,button');
    focusable?.[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); button.current?.focus(); }
      if (event.key === 'Tab' && focusable?.length) {
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.body.classList.add('menu-open'); document.addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('menu-open'); document.removeEventListener('keydown', onKey); if (prior === button.current) button.current?.focus(); };
  }, [open]);
  return <><a className="skip-to-content" href="#main-content">Skip to content</a><header data-site-header="sticky" className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
    <Link className="brand" href="/" aria-label={`${site.name} home`}><Image src="/logo.svg" alt="" width={38} height={38} /><span>{site.name}</span></Link>
    <nav ref={panel} id="primary-menu" aria-label="Primary navigation" className={open ? 'is-open' : ''}>{primaryNav.map((item) => { const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href); return <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} onClick={() => setOpen(false)}>{item.label}</Link>; })}</nav>
    <div className="powered"><Image src="/brand/stealth-agents-logo-black.png" alt="StealthAgents" width={88} height={25} /><span>Powered by StealthAgents</span></div>
    <button ref={button} className="menu-toggle" type="button" aria-expanded={open} aria-controls="primary-menu" onClick={() => setOpen((value) => !value)}><span>{open ? 'Close' : 'Menu'}</span></button>
  </header></>;
}

export function Footer() {
  return <footer data-site-footer="true"><div><Link className="brand inverse" href="/"><Image src="/logo.svg" alt="" width={44} height={44} /><span>{site.name}</span></Link><p>Distributed specialists connected through visible ownership, documented handoffs, and accountable review.</p><div className="powered footer-powered"><Image src="/brand/stealth-agents-logo-black.png" alt="StealthAgents" width={100} height={29} /><span>Powered by StealthAgents</span></div></div><div data-footer-menu="true" className="footer-links">{footerNav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}<Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><section className="site-parent-company" aria-label="Powered by StealthAgents"><a className="site-parent-logo" href="https://stealthagents.com/" aria-label="Visit StealthAgents"><img src="/stealthagents-parent-logo.png" alt="StealthAgents" width="158" height="53" loading="lazy" /></a><div><h2>Powered by StealthAgents</h2><p>StealthAgents recruits and supports the remote professionals behind our services, from matching and onboarding to ongoing team support.</p><a className="site-parent-link" href="https://stealthagents.com/">Explore StealthAgents ↗</a></div></section><p className="copyright">© {new Date().getFullYear()} {site.name}</p></footer>;
}
