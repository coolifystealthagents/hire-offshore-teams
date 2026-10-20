export type ServiceDetail = {
  problem: string;
  audience: string;
  inputs: string[];
  scope: string[];
  workflow: { title: string; copy: string }[];
  outputs: string[];
  boundaries: string[];
  controls: string[];
  scenarios: { title: string; copy: string }[];
  faq: { q: string; a: string }[];
  related: string[];
  visual: { queue: string; work: string; review: string; exception: string };
};

export const serviceDetails: Record<string, ServiceDetail> = {
  'operations-team': {
    problem: 'Operating work often fragments across inboxes, spreadsheets, and individual memory. An operations team creates a visible queue and a repeatable path from request to reviewed completion.',
    audience: 'Operations leaders with recurring coordination, record maintenance, status reporting, and cross-functional follow through. It fits teams that know what good completion looks like but need more consistent execution capacity.',
    inputs: ['Approved request queue or worklist', 'Current SOPs and completed examples', 'Named process owner and reviewers', 'Access matrix and escalation criteria'],
    scope: ['Maintain approved operating records', 'Prepare daily or weekly status summaries', 'Coordinate routine handoffs between owners', 'Log exceptions and route them to the named decision maker'],
    workflow: [
      { title: 'Intake and triage', copy: 'Requests enter one agreed queue. The team checks required fields, confirms priority rules, and returns incomplete items before work begins.' },
      { title: 'Process and document', copy: 'The assigned specialist follows the current procedure, records source links, and leaves a clear activity trail for the next owner.' },
      { title: 'Review and close', copy: 'Defined samples or exception classes go to the internal reviewer. Accepted work is closed with status, evidence, and any follow-up owner.' }
    ],
    outputs: ['Current operating records', 'Queue and aging view', 'Handoff notes with next owner', 'Exception log for management review'],
    boundaries: ['Your leaders retain policy and priority decisions', 'The offshore team does not override controls or approve exceptions', 'Sensitive access follows your least privilege rules', 'Material process changes require owner approval'],
    controls: ['Required-field checks before processing', 'Sample-based review by workflow risk', 'Daily reconciliation of open and closed items', 'SOP version and exception tracking'],
    scenarios: [
      { title: 'A growing request queue', copy: 'Volume has outgrown informal inbox ownership, but the work already follows a recognizable completion standard.' },
      { title: 'Cross-team handoffs disappear', copy: 'Work is performed, yet the next owner, status, or evidence is difficult to reconstruct.' }
    ],
    faq: [
      { q: 'Does this replace an operations manager?', a: 'No. Your manager owns priorities, policy, exceptions, capacity decisions, and performance. The offshore team adds controlled execution capacity.' },
      { q: 'Can the team work across several tools?', a: 'Yes, when each tool has an approved purpose, named account owner, least privilege access, and a documented source of truth.' },
      { q: 'What is a sensible first workflow?', a: 'Choose a recurring queue with stable inputs, a clear output, enough volume to observe, and an available reviewer.' }
    ],
    related: ['back-office-team', 'executive-support-team'],
    visual: { queue: 'Request queue', work: 'Operating desk', review: 'Owner review', exception: 'Exception route' }
  },
  'customer-support-team': {
    problem: 'Customer queues become risky when response guidance, account context, and escalation ownership live in different places. A support team connects approved answers to a traceable escalation path.',
    audience: 'Customer experience leaders with repeatable email, chat, help desk, or order-support conversations and an internal owner available for sensitive or unusual cases.',
    inputs: ['Approved knowledge base and response guidance', 'Customer identity and verification rules', 'Ticket priorities and service windows', 'Escalation contacts by issue type'],
    scope: ['Triage and categorize incoming requests', 'Answer routine questions from approved knowledge', 'Update ticket and account records', 'Escalate complaints, risk, refunds, and sensitive cases'],
    workflow: [
      { title: 'Verify and classify', copy: 'The specialist confirms the permitted identity checks, reads available history, and assigns the approved request category and priority.' },
      { title: 'Respond from evidence', copy: 'Routine replies use current guidance and account facts. Every action and customer commitment is recorded in the designated system.' },
      { title: 'Escalate with context', copy: 'Cases outside authority move to the correct owner with the question, customer history, attempted steps, urgency, and requested decision.' }
    ],
    outputs: ['Documented customer replies', 'Accurate ticket dispositions', 'Escalation packets with context', 'Queue themes for knowledge updates'],
    boundaries: ['No unapproved refunds, credits, or policy exceptions', 'No legal, clinical, financial, or safety advice', 'No customer commitment beyond written authority', 'Sensitive complaints stay with designated leaders'],
    controls: ['Approved response and knowledge versions', 'Conversation sampling for accuracy and tone', 'Escalation aging review', 'Ticket-to-account record checks'],
    scenarios: [
      { title: 'Routine volume is masking urgent work', copy: 'Internal specialists spend their day answering predictable questions while complex cases wait.' },
      { title: 'Escalations lack usable context', copy: 'Senior staff receive forwarded messages without verification history, attempted steps, or a clear decision request.' }
    ],
    faq: [
      { q: 'Can specialists speak in our brand voice?', a: 'Yes. Provide examples, approved language, prohibited claims, and a review owner who can coach against real conversations.' },
      { q: 'Can they resolve every ticket?', a: 'No. Resolution authority should be explicit. Policy exceptions, sensitive complaints, regulated questions, and material concessions stay with your owners.' },
      { q: 'How is quality reviewed?', a: 'Use a risk-based sample covering accuracy, verification, tone, record quality, and correct escalation rather than speed alone.' }
    ],
    related: ['operations-team', 'sales-support-team'],
    visual: { queue: 'Customer queue', work: 'Support desk', review: 'Quality sample', exception: 'Sensitive case' }
  },
  'sales-support-team': {
    problem: 'Revenue teams lose selling time when account research, CRM upkeep, scheduling, and response routing are inconsistent. Sales support keeps preparation moving without transferring commercial judgment.',
    audience: 'Sales leaders with an established target profile, approved outreach process, active CRM, and representatives who need clean context before they engage or decide.',
    inputs: ['Approved account and contact criteria', 'CRM stages and required fields', 'Messaging and channel permissions', 'Routing rules for replies and opportunities'],
    scope: ['Research approved accounts and contacts', 'Prepare and maintain CRM records', 'Coordinate calendars and meeting context', 'Route replies, objections, and qualified signals'],
    workflow: [
      { title: 'Build the worklist', copy: 'Approved criteria become a research queue. Specialists cite sources and flag ambiguous matches rather than stretching the target definition.' },
      { title: 'Prepare and coordinate', copy: 'Records, sequences, and meeting details are prepared within approved tools. Sales owners retain message approval and account strategy.' },
      { title: 'Return signal to the seller', copy: 'Replies and changes are classified, recorded, and routed to the correct representative with source context and the next required action.' }
    ],
    outputs: ['Source-backed account records', 'Current CRM fields and activity history', 'Prepared meeting briefs', 'Routed responses and exception notes'],
    boundaries: ['No invented contact facts or buying intent', 'No pricing, legal, or contract commitments', 'No unsupervised account strategy decisions', 'Opt-out and channel rules remain mandatory'],
    controls: ['Source checks for contact and account data', 'Duplicate and required-field validation', 'Reply routing reconciliation', 'Regular review of criteria and message permissions'],
    scenarios: [
      { title: 'Representatives are cleaning the CRM', copy: 'Sellers spend high-value time correcting fields and reconstructing activity before every conversation.' },
      { title: 'Inbound signals are routed slowly', copy: 'Replies arrive across channels without a stable classification and ownership rule.' }
    ],
    faq: [
      { q: 'Is this outsourced selling?', a: 'It is sales operations support. Your sales team keeps relationship, qualification, pricing, negotiation, and commitment decisions.' },
      { q: 'Can the team do prospect research?', a: 'Yes, against approved criteria and sources. Ambiguous matches should be flagged for review, not presented as certain.' },
      { q: 'What should be measured?', a: 'Measure record completeness, source validity, routing accuracy, queue aging, and seller acceptance before emphasizing activity volume.' }
    ],
    related: ['customer-support-team', 'executive-support-team'],
    visual: { queue: 'Account list', work: 'Research desk', review: 'Seller review', exception: 'Reply route' }
  },
  'finance-admin-team': {
    problem: 'Finance preparation slows when invoices, vendor records, receipts, and reconciliation questions arrive incomplete. Administrative support can organize evidence while approval remains with qualified finance owners.',
    audience: 'Finance and operations leaders who need disciplined document preparation, status visibility, and exception routing around an existing accounting process.',
    inputs: ['Approved source documents and intake channel', 'Chart, coding, and naming guidance', 'Vendor master ownership rules', 'Finance reviewer and approval matrix'],
    scope: ['Organize invoice and receipt records', 'Maintain approved vendor details', 'Prepare payment or reconciliation status views', 'Flag duplicates, missing evidence, and mismatches'],
    workflow: [
      { title: 'Receive and validate', copy: 'Documents enter an approved location and are checked for required identifiers, readable evidence, and duplicates before preparation.' },
      { title: 'Prepare the record', copy: 'The specialist applies written coding guidance, attaches source evidence, and marks uncertainties for the qualified reviewer.' },
      { title: 'Review before action', copy: 'Authorized finance owners resolve exceptions and make every approval, release, accounting, tax, and payment decision.' }
    ],
    outputs: ['Organized source document packets', 'Prepared records awaiting approval', 'Vendor change verification notes', 'Reconciliation exception list'],
    boundaries: ['No payment release or bank changes', 'No accounting, tax, or legal judgment', 'No final reconciliation or close approval', 'Vendor changes require independent verification'],
    controls: ['Duplicate and required-evidence checks', 'Segregation between preparation and approval', 'Independent verification for vendor detail changes', 'Reconciliation and exception review by finance'],
    scenarios: [
      { title: 'Approvers receive incomplete packets', copy: 'Senior finance staff repeatedly chase purchase context, receipts, and required identifiers before they can review.' },
      { title: 'Vendor changes arrive by email', copy: 'A controlled intake and verification trail is needed before any authorized owner considers the update.' }
    ],
    faq: [
      { q: 'Can the team approve invoices or payments?', a: 'No. They can prepare complete review packets and status views. Authorized internal owners retain approval and release.' },
      { q: 'Can they work in our accounting platform?', a: 'Potentially, with least privilege access, individual accounts, approved actions, and logs your finance and security owners can review.' },
      { q: 'How should vendor changes be handled?', a: 'Use a separate verified channel and authorized approver. An emailed request alone is not sufficient evidence.' }
    ],
    related: ['back-office-team', 'operations-team'],
    visual: { queue: 'Document intake', work: 'Prep desk', review: 'Finance review', exception: 'Mismatch hold' }
  },
  'executive-support-team': {
    problem: 'Executive attention fragments when calendar changes, meeting context, action items, and priority messages lack a dependable coordination layer.',
    audience: 'Executives and leadership teams who can define access, communication authority, priority rules, and a daily review rhythm for a trusted support role.',
    inputs: ['Calendar and communication preferences', 'Priority contacts and meeting rules', 'Approved templates and action tracker', 'Escalation channel for urgent changes'],
    scope: ['Coordinate calendars within approved rules', 'Prepare meeting context and materials', 'Maintain action and follow-up logs', 'Route priority changes and unresolved conflicts'],
    workflow: [
      { title: 'Capture priorities', copy: 'The executive and support specialist establish a current priority view, protected time, meeting rules, and contacts who require direct handling.' },
      { title: 'Prepare the day', copy: 'Calendar, briefs, materials, and action history are checked in advance. Conflicts surface with options rather than hidden assumptions.' },
      { title: 'Close the loop', copy: 'Actions are logged with owner and due date. The executive reviews decisions, sensitive messages, and unresolved priority conflicts.' }
    ],
    outputs: ['Maintained calendar and meeting context', 'Briefing packets and agenda materials', 'Action register with owners', 'Priority and conflict summary'],
    boundaries: ['No executive commitments without authority', 'No legal, employment, or financial decisions', 'Sensitive correspondence follows explicit approval', 'Personal and business access stay separated'],
    controls: ['Daily priority and calendar review', 'Approval rules by contact and message type', 'Action-owner and due-date reconciliation', 'Access review for sensitive systems'],
    scenarios: [
      { title: 'The calendar has no operating rules', copy: 'Meetings are accepted by default, preparation is late, and protected work is repeatedly displaced.' },
      { title: 'Action items live in several notebooks', copy: 'Commitments are discussed but lack a single owner, due date, and follow-up view.' }
    ],
    faq: [
      { q: 'How much access is required?', a: 'Only the access needed for approved actions. Start narrow, use individual accounts where possible, and review access as scope changes.' },
      { q: 'Can the specialist send messages for an executive?', a: 'Yes, only within explicit message categories, templates, approval rules, and escalation boundaries.' },
      { q: 'What makes onboarding successful?', a: 'Written calendar rules, examples of useful briefs, priority contacts, a daily check-in, and fast correction during the first workflow.' }
    ],
    related: ['operations-team', 'sales-support-team'],
    visual: { queue: 'Priority inbox', work: 'Support desk', review: 'Executive check', exception: 'Conflict route' }
  },
  'back-office-team': {
    problem: 'High-volume records create downstream errors when source files, required fields, naming rules, and exceptions are handled inconsistently.',
    audience: 'Teams with stable administrative queues such as data preparation, catalog upkeep, document indexing, record checks, or routine system updates.',
    inputs: ['Source files and authorized work queue', 'Field definitions and naming standards', 'Completed examples and rejection reasons', 'Reviewer, sampling plan, and exception rules'],
    scope: ['Prepare and index source records', 'Maintain approved administrative queues', 'Check required fields and formatting', 'Document duplicates, conflicts, and missing information'],
    workflow: [
      { title: 'Control the source', copy: 'Each item receives a traceable source, received state, and work status so records do not disappear between folders or tools.' },
      { title: 'Process to the standard', copy: 'Specialists follow the approved field and naming rules, preserve source evidence, and avoid guessing when information conflicts.' },
      { title: 'Sample and reconcile', copy: 'Review samples target error risk. Counts are reconciled between received, completed, rejected, and outstanding records.' }
    ],
    outputs: ['Prepared and indexed records', 'Queue status and aging report', 'Required-field exception list', 'Traceable source-to-output links'],
    boundaries: ['No invented values for missing information', 'No deletion outside approved retention rules', 'No final compliance or eligibility decisions', 'System authority remains least privilege'],
    controls: ['Source-to-output count reconciliation', 'Field validation and duplicate checks', 'Risk-based accuracy samples', 'Rework reason and SOP change tracking'],
    scenarios: [
      { title: 'A migration needs clean preparation', copy: 'Records must be normalized, indexed, and checked before internal owners approve import into a new system.' },
      { title: 'Administrative work arrives in bursts', copy: 'A visible queue and accepted completion standard are needed to absorb volume without losing traceability.' }
    ],
    faq: [
      { q: 'Is every data task suitable offshore?', a: 'No. Consider sensitivity, access, decision risk, process stability, review capacity, and applicable contractual or regulatory limits.' },
      { q: 'How do you prevent silent errors?', a: 'Keep source links, validate required fields, reconcile queue counts, sample against risk, and record rejection and rework reasons.' },
      { q: 'Can the scope expand later?', a: 'Yes. Expand after the initial queue is stable, evidence is reviewable, and your owner has capacity to govern the additional work.' }
    ],
    related: ['operations-team', 'finance-admin-team'],
    visual: { queue: 'Source records', work: 'Admin desk', review: 'Sample review', exception: 'Missing field' }
  }
};
