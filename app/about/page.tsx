import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import '../editorial.css';

export const metadata: Metadata = {
  title: 'About',
  description: `How ${site.name} defines, launches, and reviews specialist remote support roles.`,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return <main id="main-content" tabIndex={-1}>
    <header className="page-hero">
      <p className="eyebrow">About {site.name}</p>
      <h1>Better delegation starts with a better operating role.</h1>
      <p>We help {site.audience} turn recurring work into focused offshore roles with clear inputs, decision boundaries, handoffs, and review points.</p>
    </header>

    <section className="content-wrap">
      <div className="prose">
        <figure className="article-hero-image">
          <img src="/thumbnails/october-12/distributed-role-decision-rights-map.svg" alt="A distributed-team decision-rights map connecting role ownership, review, and escalation" width="1200" height="630" style={{ objectFit: 'contain' }} />
          <figcaption>Original editorial diagram by Hire Offshore Teams: role ownership stays connected to review and escalation.</figcaption>
        </figure>

        <h2>The business model: capacity attached to a workflow</h2>
        <p>{site.name} is a specialist service within the Stealth Agents operating network. We help a client define the work, identify the capabilities it requires, and shape a remote role around the client&apos;s actual systems. The client retains management authority and business decisions. The offshore team member supplies dedicated execution capacity inside an agreed operating boundary.</p>
        <p>This is not a promise that adding a person will repair an undefined process. It is a structured way to separate repeatable preparation, coordination, documentation, and follow-through from the judgments that must remain with a founder, functional leader, or qualified professional.</p>

        <h2>We start with the queue, not a generic job title</h2>
        <p>A useful role begins with evidence from the work: where requests arrive, which inputs are required, what a complete output looks like, who approves exceptions, and how urgency is signaled. Those details become a role brief rather than a loose list of tasks.</p>
        <p>That brief guides candidate matching and the launch plan. Relevant software familiarity and functional context matter, but so do written communication, response discipline, and comfort with the review cadence the client can realistically maintain.</p>

        <h2>How an engagement moves from need to operating role</h2>
        <ol>
          <li><strong>Map the work.</strong> Identify one recurring queue, its volume pattern, source systems, dependencies, and current owner.</li>
          <li><strong>Set decision rights.</strong> Mark what the remote role may prepare or complete, what requires review, and what must be escalated immediately.</li>
          <li><strong>Define acceptance.</strong> Agree on required fields, evidence, naming, status updates, and the conditions that make a handoff complete.</li>
          <li><strong>Match deliberately.</strong> Evaluate candidates against the role&apos;s functional context, communication needs, schedule, and tool environment.</li>
          <li><strong>Launch one controlled workflow.</strong> Begin with a bounded queue, observe the handoffs, and adjust instructions before broadening scope.</li>
        </ol>

        <h2>Accountability stays visible</h2>
        <p>The client names a manager and remains accountable for access, priorities, approvals, and regulated or professional decisions. The remote team member owns the agreed preparation and follow-through. A useful operating rhythm makes both sides observable through queue status, completion evidence, exception notes, and scheduled review.</p>
        <p>When work touches customer data, financial records, health information, contracts, or privileged systems, the client must apply its own legal, security, retention, and access requirements. Named accounts, minimum-necessary permissions, approved channels, and prompt access removal are operating controls, not optional onboarding details.</p>

        <h2>Quality is a review system, not a claim</h2>
        <p>We do not present an unsupported percentage or guarantee as proof of quality. Quality is established inside the engagement through explicit acceptance criteria and reviewable work. Early samples should be checked more closely; repeated errors should update the instruction, template, or role boundary rather than becoming invisible rework.</p>
        <p>The practical measures depend on the queue. They may include completeness, aging, response timing, documented exceptions, rework reasons, or whether an accepted handoff contains the evidence the next owner needs. The goal is not surveillance. It is enough operating visibility to improve the system.</p>

        <h2>What remains with your leaders</h2>
        <p>Remote staff can prepare, coordinate, document, research, and follow through. Hiring decisions, executive judgment, licensed advice, clinical decisions, financial authorization, and final approval remain with the qualified people who own them. Clear boundaries protect the client, the remote professional, and the quality of the work.</p>

        <h2>Begin with one handoff</h2>
        <p>A consultation is most useful when you bring one queue that is repetitive enough to describe and important enough to improve. We can use it to outline the inputs, ownership, review, and escalation that a viable offshore role would need.</p>
        <Link id="cta-about-story-bookcall" className="button primary" href="/contact-us">Book a free consultation</Link>
      </div>
    </section>
  </main>;
}
