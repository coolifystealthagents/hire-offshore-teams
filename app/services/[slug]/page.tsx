import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { site } from '@/lib/site';
import { serviceBySlug } from '@/lib/content';
import { serviceDetails } from '@/lib/service-details';

export function generateStaticParams() { return site.services.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  return service ? {
    title: service.name,
    description: `${service.short} Review scope, workflow, outputs, boundaries, and quality controls.`,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: service.name, description: service.short, url: `/services/${service.slug}` }
  } : {};
}

function ServiceNetworkVisual({ labels, name }: { labels: { queue: string; work: string; review: string; exception: string }; name: string }) {
  return <figure className="service-network" aria-labelledby="network-caption">
    <svg viewBox="0 0 720 430" role="img" aria-label={`${name} role-to-handoff network map`}>
      <path className="network-line" d="M142 94H328M390 94H576M360 126V252M142 284H328M390 284H576" />
      <path className="network-exception" d="M607 115V350H420" />
      <g><circle cx="110" cy="94" r="31" /><text x="110" y="99">IN</text></g>
      <g className="node-primary"><rect x="328" y="62" width="64" height="64" /><text x="360" y="99">WORK</text></g>
      <g><circle cx="608" cy="94" r="31" /><text x="608" y="99">OUT</text></g>
      <g><circle cx="110" cy="284" r="31" /><text x="110" y="289">SOP</text></g>
      <g><rect x="328" y="252" width="64" height="64" /><text x="360" y="289">CHECK</text></g>
      <g className="node-accent"><circle cx="608" cy="284" r="31" /><text x="608" y="289">FLAG</text></g>
      <text className="network-label" x="72" y="45">{labels.queue}</text>
      <text className="network-label" x="310" y="45">{labels.work}</text>
      <text className="network-label" x="548" y="45">{labels.review}</text>
      <text className="network-label" x="522" y="382">{labels.exception}</text>
    </svg>
    <figcaption id="network-caption">A role begins with controlled inputs, follows an approved workflow, and returns work to a named reviewer. Exceptions take a separate route.</figcaption>
  </figure>;
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  const detail = serviceDetails[slug];
  if (!service || !detail) notFound();
  const related = detail.related.map((item) => site.services.find((serviceItem) => serviceItem.slug === item)).filter(Boolean);
  return <main id="main-content" tabIndex={-1} className="service-page">
    <header className="service-hero">
      <div><p className="eyebrow">Offshore team service</p><h1>{service.name}</h1><p className="hero-body">{service.short}</p><p>{detail.problem}</p><Link id={`cta-services-${service.slug}-bookcall`} className="button primary" href="/contact-us">Discuss this team</Link></div>
      <ServiceNetworkVisual labels={detail.visual} name={service.name} />
    </header>

    <nav className="service-jump" aria-label="On this page"><a href="#audience">Audience</a><a href="#scope">Scope</a><a href="#workflow">Workflow</a><a href="#controls">Controls</a><a href="#faq">Questions</a></nav>

    <section id="audience" className="sheet-section service-audience"><div><p className="eyebrow">Who this team is for</p><h2>A defined queue needs a defined owner.</h2></div><p>{detail.audience}</p></section>

    <section id="scope" className="deep-band service-inputs"><div><p className="eyebrow">Inputs</p><h2>What the team needs before work begins.</h2><ul className="line-list">{detail.inputs.map((item) => <li key={item}>{item}</li>)}</ul></div><div><p className="eyebrow">Scope of work</p><h2>Repeatable work with a visible finish.</h2><ul className="line-list">{detail.scope.map((item) => <li key={item}>{item}</li>)}</ul></div></section>

    <section id="workflow" className="sheet-section service-workflow"><div className="section-heading"><p className="eyebrow">Workflow</p><h2>A controlled route from intake to acceptance.</h2><p>The handoff is explicit at each point. Work does not become complete merely because activity occurred.</p></div><ol className="handoff-flow">{detail.workflow.map((step) => <li key={step.title}><h3>{step.title}</h3><p>{step.copy}</p></li>)}</ol></section>

    <section className="sheet-section outputs-boundaries"><div><p className="eyebrow">Outputs</p><h2>What comes back to your team.</h2><ul>{detail.outputs.map((item) => <li key={item}>{item}</li>)}</ul></div><div><p className="eyebrow">Boundaries</p><h2>What remains a human decision.</h2><ul>{detail.boundaries.map((item) => <li key={item}>{item}</li>)}</ul></div></section>

    <section id="controls" className="deep-band controls-section"><div><p className="eyebrow">Quality controls</p><h2>Review the evidence, not only the activity.</h2><p>Controls should match the consequence of an error. The team records enough evidence for your owner to inspect the result and improve the procedure.</p></div><ul className="control-grid">{detail.controls.map((item) => <li key={item}>{item}</li>)}</ul></section>

    <section className="sheet-section scenarios"><div className="section-heading"><p className="eyebrow">Common starting scenarios</p><h2>Signals that this team may fit.</h2></div><div className="scenario-grid">{detail.scenarios.map((scenario) => <article key={scenario.title}><h3>{scenario.title}</h3><p>{scenario.copy}</p></article>)}</div></section>

    <section id="faq" className="sheet-section faq-section"><div><p className="eyebrow">Frequently asked questions</p><h2>Decisions to make before launch.</h2></div><div>{detail.faq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div></section>

    <section className="related-services"><p className="eyebrow">Related services</p><h2>Connect adjacent handoffs.</h2><div>{related.map((item) => item && <Link href={`/services/${item.slug}`} key={item.slug}><h3>{item.name}</h3><p>{item.short}</p><span>Review this team</span></Link>)}</div></section>

    <section className="closing"><p className="eyebrow">Map a controlled first queue</p><h2>Turn recurring work into a clear role brief.</h2><p>Bring one workflow, its current owner, and an example of an accepted output. We will map the handoff and the decisions your team should keep.</p><Link id={`cta-services-${service.slug}-consultation`} className="button primary" href="/contact-us">Plan a consultation</Link></section>
  </main>;
}
