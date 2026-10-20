import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/lib/site';
import { blogPosts } from '@/lib/content';
import { ArrowIcon, CheckIcon } from './Icons';

const CTA = ({ id, children }: { id: string; children: React.ReactNode }) => <Link id={id} className="button primary" href="/contact-us">{children} <ArrowIcon /></Link>;

function ServiceList() {
  return <div className="service-list">{site.services.map((service) => <Link href={`/services/${service.slug}`} key={service.slug}><div><h3>{service.name}</h3><p>{service.short}</p></div><span>View operating scope <ArrowIcon /></span></Link>)}</div>;
}
function Principles() { return <div className="principles">{site.principles.map((item) => <div key={item}><CheckIcon /><span>{item}</span></div>)}</div>; }
function Latest() { return <div className="article-grid">{blogPosts.slice(0, 3).map((post) => <Link href={`/blog/${post.slug}`} className="article-card" key={post.slug}><span className="pill">{post.category}</span><h3>{post.title}</h3><p>{post.description}</p><span className="text-link">Read the guide <ArrowIcon /></span></Link>)}</div>; }

function NetworkMap() {
  return <figure className="home-network"><svg viewBox="0 0 760 510" role="img" aria-label="Connected role-to-handoff operating network">
    <path className="network-line" d="M122 124H315M380 124H628M347 157V320M122 352H315M380 352H628" />
    <path className="network-exception" d="M660 156V420H420" />
    <g><circle cx="90" cy="124" r="32" /><text x="90" y="129">INPUT</text></g>
    <g className="node-primary"><rect x="315" y="92" width="64" height="64" /><text x="347" y="129">ROLE</text></g>
    <g><circle cx="660" cy="124" r="32" /><text x="660" y="129">OWNER</text></g>
    <g><circle cx="90" cy="352" r="32" /><text x="90" y="357">RULES</text></g>
    <g><rect x="315" y="320" width="64" height="64" /><text x="347" y="357">CHECK</text></g>
    <g className="node-accent"><circle cx="660" cy="352" r="32" /><text x="660" y="357">FLAG</text></g>
    <text className="network-label" x="54" y="58">Approved queue</text><text className="network-label" x="294" y="58">Offshore specialist</text><text className="network-label" x="590" y="58">Your reviewer</text><text className="network-label" x="510" y="464">Human decision route</text>
  </svg><figcaption>Work travels through a named role, review point, and exception route.</figcaption></figure>;
}

export function HomePage() {
  return <main id="main-content" tabIndex={-1} className="home">
    <section className="hero">
      <div className="hero-copy"><p className="eyebrow">{site.eyebrow}</p><h1>{site.hero} <em>{site.heroAccent}</em></h1><p className="hero-body">{site.heroBody}</p><div className="hero-actions"><CTA id="cta-home-hero-bookcall">Plan your offshore team</CTA><Link className="quiet-link" href="/services">Review all services</Link></div><Principles /></div>
      <NetworkMap />
    </section>

    <section className="handoff-strip" aria-label="Operating model"><span>Controlled inputs</span><span>Defined role</span><span>Reviewable output</span><span>Human exception route</span></section>

    <section className="section intro"><p className="eyebrow">Capacity that connects</p><div><h2>A team is useful when the handoff is clear.</h2><p>{site.manifesto} We help shape the role around a real queue, the systems it touches, the output your owner accepts, and the conditions that return a decision to your team.</p><p>This is not a generic task list. It is an operating design for distributed work.</p></div></section>

    <section className="section services"><div className="section-heading"><p className="eyebrow">Six focused team models</p><h2>Choose the operating surface that needs capacity.</h2><p>Each service has its own inputs, controls, boundaries, and output. Compare the complete scope before deciding where to begin.</p></div><ServiceList /></section>

    <section className="deep-band home-method"><div className="method-image"><Image src={site.heroImage} alt={site.heroAlt} fill sizes="(max-width: 900px) 100vw, 45vw" /></div><div><p className="eyebrow">The handoff sheet</p><h2>Define the work before adding the role.</h2><p>Start with a recurring queue and one accountable internal owner. Document what enters, what complete means, what evidence remains, and what must stop for a decision.</p><ol><li><strong>Set the boundary.</strong><span>Separate preparation and coordination from licensed, financial, security, and executive judgment.</span></li><li><strong>Make acceptance visible.</strong><span>Name the reviewer, sample, completion evidence, and rework path.</span></li><li><strong>Expand from stable work.</strong><span>Add volume or adjacent queues only after the initial handoff is reliable.</span></li></ol><CTA id="cta-home-method-consultation">Map a first workflow</CTA></div></section>

    <section className="section decision-section"><div><p className="eyebrow">A practical fit check</p><h2>Offshore support works best with an available owner.</h2></div><div className="decision-ledger"><p><strong>Good starting conditions</strong><span>Recurring volume, usable examples, clear permissions, a named reviewer, and decisions that can be separated from preparation.</span></p><p><strong>Pause and clarify first</strong><span>Undefined outcomes, no review capacity, broad shared access, or a role expected to make regulated and executive decisions.</span></p></div></section>

    <section className="section journal"><div className="section-heading"><p className="eyebrow">Operating field notes</p><h2>Guidance for distributed ownership.</h2><p>Use these research-backed working notes to examine handoffs, access, review, and escalation before the queue grows.</p></div><Latest /></section>

    <section className="closing"><p className="eyebrow">Make room for the work only you can do</p><h2>Let us map your first offshore role.</h2><p>A focused conversation can turn recurring work into a clear, reviewable role brief.</p><CTA id="cta-home-closing-schedulecall">Request a consultation</CTA></section>
  </main>;
}
