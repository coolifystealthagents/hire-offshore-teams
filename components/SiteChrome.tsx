'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { site } from '@/lib/site';

const nav = [{ href: '/', label: 'Home' }, { href: '/services', label: 'Services' }, { href: '/contact-us', label: 'Contact Us' }];

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
  return <><a className="skip-to-content" href="#main-content">Skip to content</a><header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
    <Link className="brand" href="/" aria-label={`${site.name} home`}><Image src="/logo.svg" alt="" width={38} height={38} /><span>{site.name}</span></Link>
    <nav ref={panel} id="primary-menu" aria-label="Primary navigation" className={open ? 'is-open' : ''}>{nav.map((item) => { const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href); return <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} onClick={() => setOpen(false)}>{item.label}</Link>; })}</nav>
    <div className="powered"><Image src="/brand/stealth-agents-logo-black.png" alt="StealthAgents" width={88} height={25} /><span>Powered by StealthAgents</span></div>
    <button ref={button} className="menu-toggle" type="button" aria-expanded={open} aria-controls="primary-menu" onClick={() => setOpen((value) => !value)}><span>{open ? 'Close' : 'Menu'}</span></button>
  </header></>;
}

export function Footer() {
  return <footer><div><Link className="brand inverse" href="/"><Image src="/logo.svg" alt="" width={44} height={44} /><span>{site.name}</span></Link><p>Distributed specialists connected through visible ownership, documented handoffs, and accountable review.</p><div className="powered footer-powered"><Image src="/brand/stealth-agents-logo-black.png" alt="StealthAgents" width={100} height={29} /><span>Powered by StealthAgents</span></div></div><div className="footer-links">{nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}<Link href="/about">About</Link><Link href="/blog">Blog</Link><Link href="/research">Research</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><p className="copyright">© {new Date().getFullYear()} {site.name}</p></footer>;
}
