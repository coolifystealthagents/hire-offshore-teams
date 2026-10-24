'use client';

import { useEffect } from 'react';

const CSS = `
.oct22-sticky-toc{position:fixed!important;top:var(--oct22-top,84px);right:12px;left:auto;z-index:45;margin:0!important;width:fit-content;max-width:calc(100% - 1rem);border:1px solid currentColor;border-radius:999px;background:#fff;color:#17202a;box-shadow:0 8px 20px rgba(0,0,0,.14)}
.oct22-sticky-toc>summary{display:flex;align-items:center;gap:.6rem;min-height:44px;padding:.5rem .95rem;font:800 .74rem/1.2 Arial,sans-serif;letter-spacing:.04em;text-transform:uppercase;cursor:pointer;list-style:none}
.oct22-sticky-toc>summary::-webkit-details-marker{display:none}
.oct22-sticky-toc>summary::after{content:'+';font-size:1rem;line-height:1}
.oct22-sticky-toc[open]>summary::after{content:'-'}
.oct22-sticky-toc>summary span{font-weight:600;text-transform:none;letter-spacing:0;opacity:.7}
.oct22-sticky-toc>nav{position:absolute;right:0;top:calc(100% + 6px);width:min(84vw,320px);max-height:min(60vh,420px);overflow:auto;background:#fff;color:#17202a;border:1px solid #17202a;padding:.35rem .9rem .8rem;box-shadow:0 18px 34px rgba(0,0,0,.2)}
.oct22-sticky-toc ol{margin:0;padding-left:1.1rem}
.oct22-sticky-toc li{padding:.55rem 0;border-top:1px solid rgba(0,0,0,.12);font:400 .86rem/1.35 Arial,sans-serif}
.oct22-sticky-toc li:first-child{border-top:0}
.oct22-sticky-toc a{color:inherit;text-decoration:none}
.oct22-sticky-toc a:focus-visible{outline:2px solid #1d4e89;outline-offset:2px}
.oct22-sticky-toc a[data-oct22-active="true"],nav a[data-oct22-active="true"],.sidebar a[data-oct22-active="true"]{font-weight:800!important;text-decoration:underline!important;text-underline-offset:.2em}
.oct22-desktop-toc{padding:.85rem 1rem;border-left:3px solid currentColor;background:rgba(127,127,127,.06);margin:0 0 1rem}
.oct22-desktop-toc strong{display:block;margin-bottom:.5rem;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase}
.oct22-desktop-toc ol{list-style:none;margin:0;padding:0}
.oct22-desktop-toc li{margin:.35rem 0}
.oct22-desktop-toc a{font-size:.82rem;line-height:1.35;text-decoration:none}
@media(min-width:901px){.oct22-sticky-toc{display:none!important}}
@media(max-width:900px){.oct22-desktop-toc{display:none!important}}
`;

export default function TocSync() {
  useEffect(() => {
    const main = document.querySelector('main') || document.body;
    const article = main.querySelector('article') || main;
    const headingNodes = Array.from(article.querySelectorAll<HTMLElement>('h2[id], section[id] > h2'));
    const headings = headingNodes.map((node) => ({ id: node.id || node.closest('section[id]')?.id || '', el: node })).filter((item) => item.id);
    if (!headings.length) return;

    const header = document.querySelector<HTMLElement>('.site-header, .header, body > header');
    const headerIsSticky = header ? ['sticky', 'fixed'].includes(getComputedStyle(header).position) : false;
    const top = header && headerIsSticky ? header.offsetHeight + 8 : 8;
    document.documentElement.style.setProperty('--oct22-top', `${top}px`);
    headings.forEach((heading) => { heading.el.style.scrollMarginTop = `${top + 90}px`; });

    // Desktop: use a visible ToC or create one in a real article sidebar.
    const navs = Array.from(document.querySelectorAll<HTMLElement>('nav')).filter((n) => /contents|on this page/i.test(n.getAttribute('aria-label') || ''));
    let desktopNav = navs.find((n) => n.offsetParent !== null && !n.closest('details')) || null;
    if (!desktopNav) {
      const asides = Array.from(document.querySelectorAll<HTMLElement>('aside, .sidebar, .article-sidebar')).filter((a) => a.offsetParent !== null);
      const aside = asides.find((a) => /article-sidebar|sidebar/.test(a.className)) || asides[0];
      if (aside) {
        const nav = document.createElement('nav');
        nav.className = 'oct22-desktop-toc';
        nav.setAttribute('aria-label', 'Table of contents');
        nav.innerHTML = '<strong>Table of contents</strong><ol></ol>';
        const list = nav.querySelector('ol')!;
        headings.forEach((heading) => {
          const item = document.createElement('li');
          const link = document.createElement('a');
          link.href = `#${heading.id}`;
          link.textContent = (heading.el.textContent || '').trim();
          item.appendChild(link);
          list.appendChild(item);
        });
        aside.insertBefore(nav, aside.firstChild);
        desktopNav = nav;
      }
    }
    if (!desktopNav) {
      const nav = document.createElement('nav');
      nav.className = 'oct22-desktop-toc';
      nav.setAttribute('aria-label', 'Table of contents');
      nav.innerHTML = '<strong>Table of contents</strong><ol></ol>';
      const list = nav.querySelector('ol')!;
      headings.forEach((heading) => { const item = document.createElement('li'); const link = document.createElement('a'); link.href = `#${heading.id}`; link.textContent = (heading.el.textContent || '').trim(); item.appendChild(link); list.appendChild(item); });
      document.body.appendChild(nav);
      nav.style.position = 'fixed'; nav.style.right = '16px'; nav.style.top = `${top + 8}px`; nav.style.width = '250px'; nav.style.maxHeight = `calc(100vh - ${top + 28}px)`; nav.style.overflow = 'auto'; nav.style.zIndex = '44'; nav.style.background = '#fff'; nav.style.border = '1px solid #999'; nav.style.padding = '.6rem .8rem'; nav.style.boxShadow = '0 8px 20px rgba(0,0,0,.12)';
      desktopNav = nav;
    }
    if (desktopNav) {
      desktopNav.classList.add('oct22-desktop-toc');
      desktopNav.style.position = 'sticky';
      desktopNav.style.top = `${top + 8}px`;
      desktopNav.style.maxHeight = `calc(100vh - ${top + 28}px)`;
      desktopNav.style.overflow = 'auto';
      desktopNav.style.alignSelf = 'start';
      const parent = desktopNav.parentElement;
      if (parent) { parent.style.alignSelf = 'stretch'; parent.style.height = 'auto'; }
    }

    // Mobile: one compact control above the article title.
    const existingDetails = Array.from(document.querySelectorAll<HTMLDetailsElement>('details')).find((item) => {
      if (item.closest('aside')) return false;
      const label = (item.querySelector('summary')?.textContent || '').toLowerCase();
      return label.includes('contents') || label.includes('on this page') || label.includes('explore') || label.includes('in this guide') || label.includes('in this article');
    });
    if (existingDetails) { existingDetails.hidden = true; existingDetails.setAttribute('aria-hidden', 'true'); }
    let details = article.querySelector<HTMLDetailsElement>('details[data-oct22-copy="true"]');
    if (!details) {
      details = document.createElement('details');
      details.dataset.oct22Copy = 'true';
      details.className = 'oct22-sticky-toc';
      details.innerHTML = `<summary>Contents <span>${headings.length} sections</span></summary><nav aria-label="Table of contents mobile"><ol></ol></nav>`;
      document.body.appendChild(details);
    }
    details.classList.add('oct22-sticky-toc');
    let list = details.querySelector('ol');
    if (!list) { list = document.createElement('ol'); (details.querySelector('nav') || details).appendChild(list); }
    if (!list) return;
    if (!list.querySelector('a')) {
      headings.forEach((heading) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = (heading.el.textContent || '').trim();
        item.appendChild(link);
        list.appendChild(item);
      });
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = 150;
      let current = headings[0].id;
      for (const heading of headings) { if (heading.el.getBoundingClientRect().top - offset <= 0) current = heading.id; else break; }
      document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
        if (link.getAttribute('href') === `#${current}`) { link.setAttribute('aria-current', 'location'); link.setAttribute('data-oct22-active', 'true'); }
        else { link.removeAttribute('aria-current'); link.removeAttribute('data-oct22-active'); }
      });
    };
    const onScroll = () => { if (frame) return; frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return <style dangerouslySetInnerHTML={{ __html: CSS }} />;
}
