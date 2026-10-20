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
export function researchSections(title: string, finding: string, sections?: ContentSection[]): ContentSection[] {
  if (sections?.length) return sections;
  return [
    {
      heading: 'Finding in context',
      paragraphs: [`This brief treats ${title.toLowerCase()} as an operational review question. The key finding should be read with the linked evidence, the workflow definition, and the limits of the available records.`],
    },
    {
      heading: 'How to use this brief',
      paragraphs: ['Use the finding to frame a bounded review, identify the accountable owner, and decide which records must be checked. Keep preparation separate from approval and preserve unresolved evidence as an explicit state.'],
    },
    {
      heading: 'Evidence boundaries',
      paragraphs: ['The sources provide public guidance, not a conclusion about a specific organization. Local policy, contracts, system records, and qualified professional review remain necessary where the workflow involves legal, employment, privacy, finance, or security decisions.'],
    },
  ];
}
