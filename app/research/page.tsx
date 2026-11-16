import type { Metadata } from 'next';
import { EditorialCard, EditorialIndex } from '@/components/EditorialIndex';
import { researchPosts } from '@/lib/content';

const title = 'Research';
const description = 'Source-led distributed operations research.';
const hero = '/images/research-hero-evidence.jpg';
const heroAlt = 'Analysts reviewing workflow evidence, quality checks, and performance charts';
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/research' },
  openGraph: { title, description, url: '/research', type: 'website', images: [{ url: hero, width: 1672, height: 941, alt: heroAlt }] },
  twitter: { card: 'summary_large_image', title, description, images: [hero] },
};

export default function Page() {
  const clusters = new Set(researchPosts.map((post) => post.cluster));
  return <main id="main-content" tabIndex={-1} className="research-index editorial-index">
    <EditorialIndex
      eyebrow="Research library"
      title="Evidence for distributed team decisions."
      description="Transparent protocols for testing handoffs, ownership, and operating controls."
      hero={{ src: hero, alt: heroAlt, width: 1672, height: 941 }}
      contextEyebrow="Use the evidence library"
      contextTitle="Move from a broad question to a testable operating choice."
      contextBody="Each brief names its public sources, states a key finding, and connects the evidence to workflow design. Open a brief for its protocol, source list, related reading, and relevant service context."
      countLabel={`${researchPosts.length} briefs across ${clusters.size} research areas`}
    >
      {researchPosts.map((post) => <EditorialCard
        key={post.slug}
        variant="research"
        href={`/research/${post.slug}`}
        image={post.thumbnail}
        imageAlt={`Research illustration for ${post.title}`}
        tag={post.cluster}
        title={post.title}
        summary={post.summary}
        publishedAt={post.publishedAt}
        destination="Review the brief"
      />)}
    </EditorialIndex>
  </main>;
}
