import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { ArrowIcon } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Offshore Team Services',
  description: 'Compare six offshore team models with defined inputs, operating scope, review controls, decision boundaries, and handoff outputs.',
  alternates: { canonical: '/services' },
  openGraph: { title: `Offshore Team Services | ${site.name}`, description: 'Compare focused team models for operations, support, sales, finance administration, executive support, and back office work.', url: '/services' }
};

export default function ServicesPage() {
  return <main id="main-content" tabIndex={-1} className="services-index">
    <header className="services-hero"><div><p className="eyebrow">Offshore team services</p><h1>Build capacity around the work, not a generic job title.</h1><p>Six focused team models connect recurring queues to a defined role, accepted output, named reviewer, and human decision path.</p><Link className="button primary" href="/contact-us">Map the right team</Link></div><div className="service-system" aria-label="Service operating model"><span>Queue</span><i /><span>Role</span><i /><span>Review</span><i /><span>Decision</span><p>Every team model follows the same accountable operating logic while its scope and controls stay specific to the function.</p></div></header>

    <section className="service-directory"><div className="section-heading"><p className="eyebrow">The complete service system</p><h2>Find the queue your leaders need to release.</h2><p>Open any service to review the audience, required inputs, exact scope, workflow, outputs, boundaries, quality controls, common scenarios, and questions.</p></div><div className="directory-list">{site.services.map((service) => <Link href={`/services/${service.slug}`} key={service.slug}><div><h3>{service.name}</h3><p>{service.short}</p></div><span>Review complete scope <ArrowIcon /></span></Link>)}</div></section>

    <section className="deep-band compare-band"><div><p className="eyebrow">Choose by handoff</p><h2>Similar tasks can carry different operating risk.</h2><p>A record update in customer support may create a customer commitment. A record update in finance may affect an approval packet. The right service depends on the source, consequence, reviewer, and authority involved.</p></div><dl><div><dt>Customer-facing queue</dt><dd>Start with customer support when approved knowledge and escalation are central.</dd></div><div><dt>Revenue preparation</dt><dd>Start with sales support when research, CRM, scheduling, and response routing are central.</dd></div><div><dt>Evidence-heavy records</dt><dd>Start with finance administration or back office based on approval and accounting proximity.</dd></div><div><dt>Cross-team coordination</dt><dd>Start with operations or executive support based on whether the queue serves a process or a leader.</dd></div></dl></section>

    <section className="sheet-section start-section"><div><p className="eyebrow">Start narrow</p><h2>One controlled workflow is enough to learn.</h2></div><ol className="handoff-flow"><li><h3>Bring a real queue</h3><p>Use current work, source documents, and accepted examples rather than an imagined future task list.</p></li><li><h3>Name the internal owner</h3><p>The owner sets priorities, grants access, reviews evidence, resolves exceptions, and approves scope changes.</p></li><li><h3>Set the acceptance rule</h3><p>Define what complete means, what gets sampled, what is rejected, and what must stop for a decision.</p></li></ol></section>

    <section className="sheet-section faq-section"><div><p className="eyebrow">Service selection questions</p><h2>Clarify the operating need.</h2></div><div><details><summary>Can one team support more than one function?</summary><p>Adjacent workflows can connect, but each should retain a named owner, separate permissions, acceptance criteria, and escalation path. Begin with the most stable queue.</p></details><details><summary>How do we choose between operations and back office?</summary><p>Operations support often coordinates work across owners and status changes. Back office support often prepares high-volume records against field and evidence rules.</p></details><details><summary>What should remain with our internal team?</summary><p>Keep strategy, approvals, policy, regulated judgments, sensitive exceptions, security administration, financial release, employment decisions, and executive commitments with authorized owners.</p></details></div></section>

    <section className="closing"><p className="eyebrow">A clearer starting point</p><h2>Bring the queue. We will map the role and handoff.</h2><p>Discuss the work, systems, review capacity, access boundary, and exception path before selecting a team model.</p><Link className="button primary" href="/contact-us">Request a consultation</Link></section>
  </main>;
}
