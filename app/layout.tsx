import type { Metadata } from 'next';
import Script from 'next/script';
import { Header, Footer } from '@/components/SiteChrome';
import { site } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: { default: 'Hire Offshore Teams | Connected Distributed Operations', template: `%s | ${site.name}` },
  description: site.heroBody,
  applicationName: site.name,
  authors: [{ name: `${site.name} Editorial Team` }],
  creator: site.name,
  openGraph: { type: 'website', siteName: site.name, title: 'Hire Offshore Teams | Connected Distributed Operations', description: site.heroBody, url: '/', images: [{ url: '/hero.png', width: 1536, height: 1024, alt: site.heroAlt }] },
  twitter: { card: 'summary_large_image', title: 'Hire Offshore Teams | Connected Distributed Operations', description: site.heroBody, images: ['/hero.png'] },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-design={site.design}><body style={{ '--primary': site.primary, '--secondary': site.secondary, '--accent': site.accent, '--canvas': site.canvas, '--ink': site.ink, '--display': site.displayFont, '--body': site.bodyFont } as React.CSSProperties}><Header />{children}<Footer /><Script id="acr-tracker-config" strategy="beforeInteractive">{`window.ACR_TRACKER_CONFIG={siteId:'${site.siteId}',endpoint:'/ingest/track',debug:false};`}</Script><Script src="https://acrtracking.stealthagents.us/v1/tracker.js" strategy="afterInteractive" /></body></html>;
}
