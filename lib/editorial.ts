import type { ContentSection, Service } from './types';
import { site } from './site';

export type TocItem = { id: string; label: string; level: 2 | 3 };

export function headingId(heading: string) {
  return heading
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'section';
}

const imageGroups = {
  access: [
    '/thumbnails/october-12/distributed-access-change-verification.svg',
    '/thumbnails/october-12/distributed-access-recertification-completeness-study.svg',
    '/thumbnails/october-13/offshore-access-removal-event-completeness.svg',
    '/thumbnails/october-13/departing-offshore-member-access-removal.svg',
  ],
  customer: [
    '/thumbnails/october-12/distributed-customer-escalation-custody.svg',
    '/thumbnails/october-13/customer-message-translation-ambiguity.svg',
    '/thumbnails/october-12/offshore-team-incident-communication-boundary.svg',
  ],
  finance: [
    '/thumbnails/october-12/offshore-invoice-review-packet.svg',
    '/thumbnails/october-13/distributed-timesheet-payroll-review.svg',
    '/thumbnails/october-13/remote-vendor-payment-change-verification.svg',
    '/thumbnails/october-13/remote-vendor-payment-verification-reliability.svg',
  ],
  handoff: [
    '/thumbnails/october-12/offshore-team-handoff-acceptance-receipt.svg',
    '/thumbnails/october-12/distributed-handoff-acceptance-latency-study.svg',
    '/thumbnails/october-12/follow-the-sun-shift-change-log.svg',
    '/thumbnails/october-12/follow-the-sun-status-agreement-study.svg',
  ],
  quality: [
    '/thumbnails/october-12/remote-quality-sample-review.svg',
    '/thumbnails/october-12/remote-quality-reviewer-agreement-study.svg',
    '/thumbnails/october-13/new-offshore-queue-acceptance-gates.svg',
    '/thumbnails/october-13/distributed-automation-exception-audit.svg',
  ],
  operations: [
    '/thumbnails/october-12/distributed-role-decision-rights-map.svg',
    '/thumbnails/october-12/distributed-sop-version-custody.svg',
    '/thumbnails/october-12/distributed-work-queue-outage-reconciliation.svg',
    '/thumbnails/october-13/offshore-queue-ownership-rotation.svg',
  ],
  data: [
    '/thumbnails/october-13/cross-border-customer-data-export-control.svg',
    '/thumbnails/october-13/cross-region-crm-merge-evidence.svg',
    '/thumbnails/october-12/offshore-sales-lead-source-lineage.svg',
    '/thumbnails/october-13/offshore-vendor-subprocessor-change-review.svg',
  ],
};

type ImageGroup = keyof typeof imageGroups;

function stableIndex(value: string, length: number) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  return hash % length;
}

/** Uses the record image first, then picks a stable image from the closest topic family. */
export function editorialImage(slug: string, title: string, thumbnail?: string) {
  if (thumbnail) return thumbnail;
  const text = `${slug} ${title}`.toLowerCase();
  let group: ImageGroup = 'operations';
  if (/access|identity|provision|security/.test(text)) group = 'access';
  else if (/customer|message|support|incident|communication/.test(text)) group = 'customer';
  else if (/finance|invoice|payment|payroll|vendor|timesheet/.test(text)) group = 'finance';
  else if (/handoff|follow.the.sun|shift|time.zone/.test(text)) group = 'handoff';
  else if (/quality|review|audit|reliability|acceptance|agreement/.test(text)) group = 'quality';
  else if (/data|crm|source|privacy|subprocessor|export/.test(text)) group = 'data';
  const choices = imageGroups[group];
  return choices[stableIndex(slug, choices.length)];
}

export function serviceLinksFor(text: string, preferredPath?: string): Service[] {
  const lower = text.toLowerCase();
  const preferredSlug = preferredPath?.split('/').filter(Boolean).at(-1);
  const scores = site.services.map((service) => {
    const tokens = service.slug.replace('-team', '').split('-');
    const score = tokens.reduce((total, token) => total + (lower.includes(token) ? 2 : 0), 0)
      + (service.slug === preferredSlug ? 20 : 0);
    return { service, score };
  });
  return scores.sort((a, b) => b.score - a.score || a.service.name.localeCompare(b.service.name)).slice(0, 2).map(({ service }) => service);
}

/** Older research records predate structured bodies. Give them an honest, bounded reading structure. */
export function researchSections(title: string, _finding: string, sections?: ContentSection[]): ContentSection[] {
  if (sections?.length) return sections;
  const lower = title.toLowerCase();
  const role = lower.includes('customer support')
    ? { queue: 'customer conversations', records: 'ticket history, approved knowledge, response status, and escalation receipts', owner: 'support lead', risk: 'a sensitive or unresolved customer issue' }
    : lower.includes('sales support')
      ? { queue: 'prospect and CRM work', records: 'source links, CRM field history, response status, and meeting handoffs', owner: 'sales leader', risk: 'an unverified claim or buying signal' }
      : lower.includes('finance administration')
        ? { queue: 'finance administration', records: 'invoice sources, vendor records, reconciliation notes, and approval receipts', owner: 'qualified finance owner', risk: 'a payment, tax, or accounting decision' }
        : lower.includes('executive support')
          ? { queue: 'executive coordination', records: 'calendar requests, briefing sources, action owners, and priority changes', owner: 'executive', risk: 'a confidential or priority-changing decision' }
          : lower.includes('back office')
            ? { queue: 'back office processing', records: 'source documents, required fields, queue status, and exception notes', owner: 'operations manager', risk: 'an incomplete record or policy exception' }
            : { queue: 'operations coordination', records: 'source records, status history, named owners, and escalation receipts', owner: 'operations lead', risk: 'an ambiguous ownership or policy decision' };
  const method = lower.includes('source quality')
    ? { question: 'whether every output can be traced to an approved, current source', test: 'sample completed records and compare each field with its cited source', signal: 'the share of fields with a valid source and the age of the source at review' }
    : lower.includes('exception pattern')
      ? { question: 'which exceptions repeat and where decision rights become unclear', test: 'group exception notes by trigger, owner, resolution, and elapsed time', signal: 'repeat triggers, unresolved age, and the handoff where escalation stalled' }
      : lower.includes('handoff reliability')
        ? { question: 'whether the next owner receives a complete and acknowledged work packet', test: 'trace sampled handoffs from release through acceptance or rejection', signal: 'missing fields, acceptance latency, and unacknowledged transfers' }
        : lower.includes('review consistency')
          ? { question: 'whether different reviewers apply the same acceptance criteria', test: 'give two reviewers the same sample and reconcile every disagreement', signal: 'agreement by checklist item and the rules that caused divergent decisions' }
          : { question: 'where routine preparation ends and accountable judgment begins', test: 'mark each workflow step as preparation, review, approval, or escalation', signal: 'unowned steps, mixed decision rights, and exceptions without a named destination' };
  return [
    {
      heading: 'Review question',
      paragraphs: [`For ${title.toLowerCase()}, ask ${method.question}. The review should follow ${role.queue} from intake through accepted output rather than relying on task counts or self-reported completion.`],
    },
    {
      heading: 'Records and method',
      paragraphs: [`Collect ${role.records}. Then ${method.test}. Preserve rejected and unresolved samples so the ${role.owner} can see where the operating definition failed.`],
    },
    {
      heading: 'Decision signal',
      paragraphs: [`Report ${method.signal}. The evidence should make ${role.risk} visible before work crosses the role boundary, while approval remains with the ${role.owner}.`],
    },
    {
      heading: 'Evidence boundary',
      paragraphs: [`For ${title.toLowerCase()}, the public sources frame controls relevant to ${role.queue}; they do not prove performance for a specific company. Local policy, contracts, system evidence, and qualified review determine whether this protocol is appropriate.`],
    },
  ];
}

export function legacyResearchFinding(title: string) {
  const sections = researchSections(title, '', undefined);
  return `${sections[0].paragraphs[0]} ${sections[2].paragraphs[0]}`;
}
