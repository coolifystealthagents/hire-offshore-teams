import { site } from './site';
import type { BlogPost, ResearchPost } from './types';
import { october12BlogPosts } from './october12BlogPosts';
import { october12ResearchPosts } from './october12ResearchPosts';
import { october13BlogPosts } from './october13BlogPosts';
import { october13ResearchPosts } from './october13ResearchPosts';
import { legacyResearchFinding } from './editorial';

const existingBlogPosts: BlogPost[] = [
  {
    "slug": "fractional-coo-vs-offshore-operations-team",
    "title": "Fractional COO vs offshore operations team",
    "description": "Compare fractional operating leadership with offshore delivery capacity by decision authority, workflow maturity, outputs, and internal ownership.",
    "category": "Role design",
    "publishedAt": "2026-10-04",
    "readTime": "4 min read",
    "sections": [
      { "heading": "Choose leadership or delivery capacity", "paragraphs": [
        "A fractional COO supplies senior operating judgment for a limited part of the week. An offshore operations team supplies people who execute defined workflows across the week. One shapes the operating model; the other adds delivery capacity inside it.",
        "The right choice follows the constraint. If priorities, ownership, and cross functional decisions are unclear, hire leadership first. If the process is already owned and documented but the queue outruns the local team, add operations capacity."
      ] },
      { "heading": "Diagnose the actual operating gap", "paragraphs": [
        "A founder who remains the routing point for priorities, tradeoffs, and manager conflicts has a leadership gap. More coordinators may make activity faster without resolving who can decide what or which work should stop.",
        "A team with stable rules, named approvers, and an accumulating backlog has a capacity gap. Senior advice alone will not clear records, coordinate vendors, maintain systems, or prepare recurring reports."
      ] },
      { "heading": "Define what each option owns", "paragraphs": [
        "A fractional COO can translate strategy into operating priorities, assign decision owners, design meeting cadences, coach managers, and resolve conflicts between functions. The engagement should name the decisions this leader can make without the founder.",
        "An offshore operations team can maintain trackers, prepare management information, coordinate routine requests, document procedures, and move approved work between owners. It needs acceptance criteria and an escalation route, not an open mandate to fix operations."
      ] },
      { "heading": "Compare the work products", "paragraphs": [
        "Expect the fractional executive to leave clearer priorities, decision rules, accountable owners, and an operating cadence. Their value appears in how managers decide and coordinate, not in the number of administrative tasks personally completed.",
        "Expect the delivery team to produce inspectable outputs such as current records, reconciled queues, complete meeting packs, and documented follow ups. Quality can be reviewed without asking the team to set company policy."
      ] },
      { "heading": "Separate authority from access", "paragraphs": [
        "Executive authority should be explicit: budget limits, hiring input, priority changes, and commitments to other leaders all need written boundaries. A senior title without delegated authority creates another adviser whose recommendations wait on the founder.",
        "Operational access should follow the task. Team members may edit a project system or prepare a payment file, while approval remains with the designated employee. System permissions should reflect that difference."
      ] },
      { "heading": "Use both roles in the right sequence", "paragraphs": [
        "The options are not mutually exclusive. A fractional COO can design the workflow, name the internal owner, and define controls; an offshore team can then run the repeatable portions and surface evidence for review.",
        "Sequence matters. Adding delivery staff before leaders agree on priorities creates competing instructions. Keeping the executive involved in every routine update prevents the delivery layer from becoming independently useful."
      ] },
      { "heading": "Evaluate candidates differently", "paragraphs": [
        "Assess a fractional COO with a real ambiguity: ask how they would identify the decision owner, test assumptions, and establish a useful management forum. Look for judgment and facilitation rather than a generic transformation plan.",
        "Assess an operations provider with a sample workflow. Ask how it trains people, verifies output, controls access, covers absence, and records exceptions. Look for a managed delivery method rather than broad promises."
      ] },
      { "heading": "Measure the role you selected", "paragraphs": [
        "Review executive support through decision clarity, follow through by named owners, and whether the founder is still the default resolver. These are directional management signals, not claims that one leader caused every business result.",
        "Review the operations team through output completeness, queue age, exception quality, and adherence to approval boundaries. Pair the measures with comments on unusual cases so a clean dashboard does not conceal workarounds."
      ] },
      { "heading": "Make the first engagement concrete", "paragraphs": [
        "For a fractional COO, define the operating problem, decision scope, executive sponsor, meeting access, and initial deliverables. Include a transfer plan so managers can sustain the new cadence as the engagement changes.",
        "For an offshore team, select one mature queue, provide examples of accepted output, identify the reviewer, and test access before work begins. Expand only after exceptions show that the process and ownership are sound."
      ] }
    ],
    "faq": [
      { "q": "Can an offshore operations team replace a fractional COO?", "a": "Not when the missing work is executive judgment, priority setting, or cross functional authority. It can provide execution capacity once those decisions have owners and rules." },
      { "q": "When should a company use both?", "a": "Use both when operating design and execution capacity are constrained. Let the fractional COO establish ownership and controls, then let the operations team run suitable workflows." },
      { "q": "Who should manage the offshore operations team?", "a": "A named internal process owner should set priorities, approve exceptions, and review service quality, even when a fractional COO helped design the arrangement." }
    ],
    "internalService": "/services/operations-team",
    "internalSibling": "/blog/offshore-team-role-charter",
    "source": { "label": "U.S. Small Business Administration: Manage your business", "url": "https://www.sba.gov/counseling/manage-your-business/" }
  },
  {
    "slug": "offshore-team-role-charter",
    "title": "How to write an offshore team role charter",
    "description": "Write an offshore role charter that defines purpose, outputs, scope, decision rights, access, quality checks, and escalation paths.",
    "category": "Team design",
    "publishedAt": "2026-10-05",
    "readTime": "4 min read",
    "sections": [
      { "heading": "Give the role a working contract", "paragraphs": [
        "A role charter is a compact agreement about purpose, outputs, authority, and working relationships. It turns a broad request such as support the customer team into a role that a new hire and manager can interpret the same way.",
        "Keep the charter close to daily work. It should guide queue decisions, feedback, and onboarding, while detailed click instructions remain in procedures that can change without redefining the role."
      ] },
      { "heading": "Start with purpose and outcome", "paragraphs": [
        "Write one purpose statement that connects the role to a business need. For example, the role may keep customer records review ready so account owners can act without searching across messages and spreadsheets.",
        "Then list outcomes the role influences without pretending it controls them alone. Accurate routing and complete case notes are fair expectations; customer retention is shared with product, pricing, service, and account leadership."
      ] },
      { "heading": "Name recurring outputs", "paragraphs": [
        "Describe concrete deliverables by destination and condition: an updated case record in the support system, a verified appointment on the shared calendar, or an exception brief sent to the duty manager.",
        "For each output, state what complete means. Required fields, source links, status labels, recipient, and deadline make the charter testable while leaving procedures to explain the individual steps."
      ] },
      { "heading": "Draw the scope boundary", "paragraphs": [
        "Include work that belongs to the role and nearby work that does not. A support coordinator may classify an inquiry under approved rules but may not promise a refund, change contract terms, or interpret legal obligations.",
        "Boundaries should reflect risk and ownership rather than geography. If an employee in the main office needs approval for an action, an offshore colleague doing equivalent preparation should not inherit that approval implicitly."
      ] },
      { "heading": "Write decision rights as verbs", "paragraphs": [
        "Use direct verbs such as prepare, verify, recommend, approve, publish, and close. Assign each verb to a role so everyone can distinguish producing a draft from authorizing the action it describes.",
        "Add conditions where authority is limited. A team member might send an approved template when all fields are present, pause when identity details conflict, and escalate any request outside the published options."
      ] },
      { "heading": "Map working relationships", "paragraphs": [
        "Name the manager who sets priorities, the subject expert who answers process questions, and the approver who handles exceptions. Include a backup for time sensitive work so absence does not produce informal authority.",
        "Clarify how requests enter the role. A shared queue with required information is easier to govern than direct messages from several leaders, each assuming that their request is the highest priority."
      ] },
      { "heading": "Add access and information rules", "paragraphs": [
        "List the systems and information categories required for the assigned outputs. Start with the least access that permits the work, and identify who can approve a permission change when the scope evolves.",
        "State where records must be stored and which channels are unsuitable for sensitive material. The charter sets the responsibility; separate security procedures can hold technical controls and retention details."
      ] },
      { "heading": "Turn quality into observable checks", "paragraphs": [
        "Choose checks tied to the role's outputs: required fields present, source attached, approved language used, next owner named, and exception recorded. Avoid a vague instruction to deliver excellent work.",
        "Explain how feedback changes the charter. A recurring new task may justify a scope update, while a missed procedural step belongs in coaching or the operating guide rather than a silent expansion of duties."
      ] },
      { "heading": "Test and maintain the charter", "paragraphs": [
        "Walk through recent examples with the role holder and manager before sign off. Ask each person to classify the request, name the expected output, and identify the decision owner; disagreement reveals language to fix.",
        "Review the charter when systems, services, managers, or approval policies change. Date the current version and keep one owner responsible for updates so onboarding does not rely on conflicting copies."
      ] }
    ],
    "faq": [
      { "q": "How long should an offshore team role charter be?", "a": "It should be short enough to consult during work while covering purpose, outputs, scope, decision rights, relationships, access, quality checks, and escalation." },
      { "q": "Is a role charter the same as a job description?", "a": "No. A job description supports hiring and employment expectations; a role charter is an operational agreement about how the role works with a particular team." },
      { "q": "Who should approve the charter?", "a": "The accountable manager should approve it after the role holder, process owner, and relevant security or compliance owners review the parts they govern." }
    ],
    "internalService": "/services/customer-support-team",
    "internalSibling": "/blog/distributed-team-handoff",
    "source": { "label": "U.S. Office of Personnel Management: Position classification", "url": "https://www.opm.gov/policy-data-oversight/classification-qualifications/classifying-general-schedule-positions/" }
  },
  {
    "slug": "distributed-team-handoff",
    "title": "Build a distributed team handoff that holds context",
    "description": "Build distributed handoffs that preserve current state, decisions, evidence, ownership, risks, and executable next actions.",
    "category": "Distributed operations",
    "publishedAt": "2026-10-06",
    "readTime": "4 min read",
    "sections": [
      { "heading": "Treat the handoff as a work product", "paragraphs": [
        "A distributed handoff is not a message saying what happened today. It is a structured transfer of current state, evidence, risk, and next action that lets another person continue without reconstructing the story.",
        "Design the handoff around the receiver's first decision. The sender should provide enough context to act, while linking to the system of record instead of copying an entire conversation into a new document."
      ] },
      { "heading": "Choose one source of current state", "paragraphs": [
        "Select the project board, CRM, ticket system, or case record that holds status and ownership. Chat can announce a transfer, but it should not become the only place where a later shift can find the facts.",
        "Define which fields must be current before transfer: owner, status, due point, latest customer or stakeholder response, dependencies, and linked evidence. An incomplete record remains with the sender unless urgency requires escalation."
      ] },
      { "heading": "Capture decisions, not meeting history", "paragraphs": [
        "Record what was decided, who decided it, the relevant constraint, and when the choice should be revisited. This preserves rationale without forcing the next person to read a transcript or infer meaning from reactions.",
        "Separate facts from assumptions. A note can say that a prospect requested a revised date and that the sender expects approval, but it should not present the expected approval as settled status."
      ] },
      { "heading": "Make the next action executable", "paragraphs": [
        "Write the next action with an owner, expected output, and timing. Continue follow up is weak; send the approved response after pricing confirms the exception tells the next shift what event unlocks the work.",
        "If no action is currently possible, state the waiting condition and who will monitor it. Work should not bounce between time zones merely because the receiving team is online."
      ] },
      { "heading": "Use a compact handoff template", "paragraphs": [
        "A useful template can contain current state, completed work, open decisions, next action, deadline, risk, and evidence links. Keep fields stable so receivers know where to scan when several items arrive together.",
        "Allow a not applicable value rather than encouraging invented text. Conditional fields, such as customer impact or approval reference, should appear only for work where that context affects the receiver's choice."
      ] },
      { "heading": "Create an overlap protocol", "paragraphs": [
        "Use limited overlap for ambiguous, urgent, or newly transferred work. The sender can highlight exceptions and the receiver can confirm interpretation, while routine items move through the written record without a meeting.",
        "Define acceptance explicitly. A reaction icon may acknowledge a message but does not prove ownership; the receiver should accept the item in the system or return it with the missing information identified."
      ] },
      { "heading": "Route risk before a shift ends", "paragraphs": [
        "List conditions that cannot wait for the next normal review, such as a blocked customer commitment, suspected data exposure, safety concern, or deadline that expires during the receiving shift.",
        "Provide a reachable escalation owner and backup for each condition. The handoff should record when escalation occurred and what guidance was received, so later teams do not reopen or contradict the response."
      ] },
      { "heading": "Review failures at the transfer point", "paragraphs": [
        "When work stalls, inspect whether the sender supplied context, whether the receiver accepted ownership, and whether the system reflected the transfer. This locates the broken control instead of blaming a time zone.",
        "Look for repeated questions and returned items. They often show that a field is unclear, a source is inaccessible, or the receiving team lacks authority for the next step; update the design accordingly."
      ] },
      { "heading": "Pilot one cross zone workflow", "paragraphs": [
        "Start with a queue that has a clear record and a real reason to continue across working hours. Practice routine, incomplete, and urgent examples so both sides learn when to transfer and when to retain ownership.",
        "After the pilot, remove fields nobody uses and strengthen fields that prompted clarification. A good handoff is brief because its contents are selected carefully, not because important context is omitted."
      ] }
    ],
    "faq": [
      { "q": "Should distributed teams require a live handoff meeting?", "a": "Reserve live overlap for urgent, ambiguous, or new work. Routine transfers should be understandable from the system record and explicit acceptance." },
      { "q": "What belongs in a handoff note?", "a": "Include current state, completed work, open decisions, next action, owner, timing, material risks, and links to authoritative evidence." },
      { "q": "When is a handoff complete?", "a": "It is complete when required context is recorded and the receiving owner accepts the item, or returns it through the defined exception path." }
    ],
    "internalService": "/services/sales-support-team",
    "internalSibling": "/blog/offshore-team-review-rhythm",
    "source": { "label": "Agency for Healthcare Research and Quality: Handoff", "url": "https://www.ahrq.gov/teamstepps-program/curriculum/team/tools/handoff.html" }
  },
  {
    "slug": "offshore-team-review-rhythm",
    "title": "A practical offshore team review rhythm",
    "description": "Design an offshore operations review rhythm for queue control, quality learning, decisions, evidence, coaching, and escalation follow-through.",
    "category": "Management systems",
    "publishedAt": "2026-10-07",
    "readTime": "4 min read",
    "sections": [
      { "heading": "Match the forum to the decision", "paragraphs": [
        "A review rhythm is a set of recurring forums with different jobs, not one meeting that absorbs every update. Queue control, quality learning, staffing, and scope decisions need distinct owners and levels of detail.",
        "Begin with the decisions managers must make and work backward to the evidence they need. If a dashboard has no decision attached, remove it from the meeting and leave it available for reference."
      ] },
      { "heading": "Run a short queue check", "paragraphs": [
        "Use the operational check to identify blocked, urgent, unowned, or aging work. The team should update routine status beforehand so meeting time goes to assignment and obstacle removal rather than reading the queue aloud.",
        "Close each discussed item with an owner and next action in the system. A verbal promise that is not reflected in the queue creates two versions of current state as soon as the call ends."
      ] },
      { "heading": "Hold a focused quality review", "paragraphs": [
        "Review selected completed work against the acceptance criteria and discuss meaningful exceptions. Include ordinary cases as well as errors so the team can distinguish a reliable method from a lucky outcome.",
        "Classify findings by cause: unclear instruction, missing access, source problem, skill gap, or individual lapse. The response then becomes a process edit, permission fix, coaching action, or correction rather than generic feedback."
      ] },
      { "heading": "Use one evidence pack", "paragraphs": [
        "Prepare a stable pack with queue condition, quality observations, unresolved escalations, capacity concerns, and decisions due. Link to source records so a surprising summary can be checked during the discussion.",
        "Keep commentary beside the measure. A change caused by a planned migration, seasonal request pattern, or revised intake rule should not be interpreted as a performance problem without that context."
      ] },
      { "heading": "Assign roles in every review", "paragraphs": [
        "The chair owns the agenda and decisions, the operations lead explains current work, and the process owner resolves policy questions. A note owner records actions where the team already manages work.",
        "Invite specialists only for items that need their judgment. A standing audience can turn a practical review into reporting theater and discourage the people closest to the work from raising uncertainty."
      ] },
      { "heading": "Separate coaching from governance", "paragraphs": [
        "Use private coaching for individual skill, judgment, and development. Use the team review for shared patterns, procedure changes, dependencies, and examples that improve a common understanding of accepted work.",
        "Do not surprise a team member with personal performance feedback in a broad operating forum. The manager can address the issue directly, then bring any system lesson back without exposing unnecessary personal detail."
      ] },
      { "heading": "Keep an explicit decision log", "paragraphs": [
        "Record the decision, owner, date, rationale, and any review condition. This prevents the same policy question from returning each week and gives absent colleagues a reliable account of what changed.",
        "Link decisions to updated checklists, templates, or permissions. A meeting is not finished when people agree verbally; the operating materials must reflect the choice before the old method quietly returns."
      ] },
      { "heading": "Adjust cadence to the work", "paragraphs": [
        "New or unstable workflows may need closer observation, while mature queues can rely more on exception reporting. Change the cadence when risk and learning needs change, not simply because the calendar has always held a meeting.",
        "Cancel a forum when there are no decisions, exceptions, or learning items. The evidence pack can still be published, preserving visibility without teaching the team that attendance matters more than useful review."
      ] },
      { "heading": "Launch with a simple agenda", "paragraphs": [
        "For the first cycle, review prior actions, queue exceptions, one quality theme, open escalations, and decisions requested. Time box status and protect space for owners to resolve the items that require judgment.",
        "After several cycles, ask which information changed a decision and which discussion repeated material available elsewhere. Refine the forum, dashboard, and attendees together so the rhythm remains an operating tool."
      ] }
    ],
    "faq": [
      { "q": "How often should an offshore team be reviewed?", "a": "Set cadence by workflow risk and stability. Use closer checks during launch or change, then rely more on exceptions as ownership and output become reliable." },
      { "q": "What should the review dashboard show?", "a": "Show queue condition, quality findings, unresolved escalations, capacity concerns, and decisions due, with links and commentary needed to interpret them." },
      { "q": "Should individual feedback happen in the team review?", "a": "Shared process lessons belong there. Personal skill or performance feedback should usually happen privately between the team member and manager." }
    ],
    "internalService": "/services/finance-admin-team",
    "internalSibling": "/blog/offshore-team-escalation-map",
    "source": { "label": "U.S. Government Accountability Office: Green Book", "url": "https://www.gao.gov/greenbook" }
  },
  {
    "slug": "offshore-team-escalation-map",
    "title": "Create an offshore team escalation map",
    "description": "Create an offshore escalation map with observable triggers, urgency levels, authorized owners, evidence packets, and safe holding actions.",
    "category": "Management systems",
    "publishedAt": "2026-10-08",
    "readTime": "4 min read",
    "sections": [
      { "heading": "Turn uncertainty into a route", "paragraphs": [
        "An escalation map tells a team which conditions require help, who receives them, what information to send, and what to do while waiting. It converts pause and ask someone into an executable control.",
        "The map should cover operational exceptions rather than every possible event. Begin with situations where delay, unauthorized action, or incomplete context could materially affect a customer, employee, payment, system, or commitment."
      ] },
      { "heading": "Define triggers in observable terms", "paragraphs": [
        "Write triggers that a team member can recognize: identity details conflict, an amount exceeds the role's approval limit, a requested term is absent from the approved options, or required evidence is missing.",
        "Avoid labels such as important or unusual without examples. If judgment is unavoidable, provide contrasting cases and route borderline situations to a named reviewer rather than asking the operator to guess intent."
      ] },
      { "heading": "Group by response urgency", "paragraphs": [
        "Distinguish work that can wait for normal review from work needing prompt attention and events needing an immediate stop. Each level should state the channel, response owner, and safe holding action.",
        "Urgency should follow consequence and deadline, not the seniority of the requester. A routine executive request may wait in sequence, while suspected exposure of sensitive information needs the designated incident route at once."
      ] },
      { "heading": "Name an owner and a backup", "paragraphs": [
        "Assign a role, current contact, coverage hours, and backup for every escalation class. A general instruction to tell management fails when several managers assume someone else owns the response.",
        "Separate receipt from decision authority. A duty coordinator can acknowledge and route an issue, but the map must identify who may approve a commercial exception, authorize access, or direct an incident response."
      ] },
      { "heading": "Specify the evidence packet", "paragraphs": [
        "Require the record identifier, observed facts, relevant source links, deadline, action already taken, and decision requested. A compact packet lets the owner respond without a long exchange to discover the basic situation.",
        "Tell operators not to investigate beyond their authority or copy sensitive content into unrestricted channels. The packet should point to protected evidence and include only the information the receiving owner needs."
      ] },
      { "heading": "Define the safe holding action", "paragraphs": [
        "For each trigger, state whether to pause, preserve the current state, send approved acknowledgement, restrict further access, or continue unaffected steps. Escalation should not leave the operator improvising during the wait.",
        "A holding action must not imply resolution. Telling a customer that a request is under review may be appropriate; promising the requested outcome because an approver has not replied crosses the boundary."
      ] },
      { "heading": "Close the escalation loop", "paragraphs": [
        "The decision owner should record the answer, conditions, and next operator action in the work system. Private guidance in chat leaves later shifts unable to verify whether the issue was resolved or merely discussed.",
        "Mark who communicated the outcome and whether a checklist, template, access rule, or policy needs revision. Closure includes restoring normal flow and capturing a reusable lesson, not simply removing an alert."
      ] },
      { "heading": "Test the map with scenarios", "paragraphs": [
        "Use realistic examples from customer requests, finance preparation, executive support, and system access. Ask the team to identify the trigger, urgency, recipient, evidence packet, and holding action for each one.",
        "Include an unavailable primary owner and an event that fits more than one category. These tests expose coverage gaps and conflicting routes before the team encounters them during live work."
      ] },
      { "heading": "Maintain it as conditions change", "paragraphs": [
        "Review unanswered, misrouted, and repeated escalations to improve the map. A common question may need a clearer rule, while a slow response may require a different backup or channel rather than more operator training.",
        "Update contact details and authority whenever roles, services, approval limits, or tools change. Place version ownership with one manager and link the current map from the systems where escalation begins."
      ] }
    ],
    "faq": [
      { "q": "What is the difference between an escalation map and an org chart?", "a": "An org chart shows reporting relationships. An escalation map routes specific operating conditions to an authorized, available owner with evidence and a holding action." },
      { "q": "What should an escalation message include?", "a": "Include the record identifier, observed facts, source links, relevant deadline, action already taken, and the exact decision or help requested." },
      { "q": "How do you prevent excessive escalation?", "a": "Use observable triggers, examples, approval boundaries, and feedback on repeated cases. Do not discourage valid escalation merely to reduce message volume." }
    ],
    "internalService": "/services/executive-support-team",
    "internalSibling": "/blog/fractional-coo-vs-offshore-operations-team",
    "source": { "label": "National Institute of Standards and Technology: Incident response recommendations", "url": "https://csrc.nist.gov/pubs/sp/800/61/r3/final" }
  }
];
const existingResearchPosts: ResearchPost[] = [
  {
    "slug": "operations-team-workflow-boundary-review-1",
    "title": "Offshore operations team: workflow boundary review",
    "summary": "A source-led brief on how founders, operators, and functional leaders can define, inspect, and improve offshore operations team workflows.",
    "cluster": "Team design",
    "publishedAt": "2026-10-01",
    "finding": "The most useful control is a visible boundary between routine preparation and accountable judgment, supported by source records and explicit escalation.",
    "sources": [
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "National Institute of Standards and Technology",
        "url": "https://www.nist.gov/privacy-framework"
      }
    ]
  },
  {
    "slug": "customer-support-team-source-quality-audit-2",
    "title": "Offshore customer support team: source quality audit",
    "summary": "A source-led brief on how founders, operators, and functional leaders can define, inspect, and improve offshore customer support team workflows.",
    "cluster": "Distributed operations",
    "publishedAt": "2026-10-02",
    "finding": "The most useful control is a visible boundary between routine preparation and accountable judgment, supported by source records and explicit escalation.",
    "sources": [
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "National Institute of Standards and Technology",
        "url": "https://www.nist.gov/privacy-framework"
      }
    ]
  },
  {
    "slug": "sales-support-team-exception-pattern-study-3",
    "title": "Offshore sales support team: exception pattern study",
    "summary": "A source-led brief on how founders, operators, and functional leaders can define, inspect, and improve offshore sales support team workflows.",
    "cluster": "Management systems",
    "publishedAt": "2026-10-03",
    "finding": "The most useful control is a visible boundary between routine preparation and accountable judgment, supported by source records and explicit escalation.",
    "sources": [
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "National Institute of Standards and Technology",
        "url": "https://www.nist.gov/privacy-framework"
      }
    ]
  },
  {
    "slug": "finance-admin-team-handoff-reliability-brief-4",
    "title": "Offshore finance administration team: handoff reliability brief",
    "summary": "A source-led brief on how founders, operators, and functional leaders can define, inspect, and improve offshore finance administration team workflows.",
    "cluster": "Role design",
    "publishedAt": "2026-10-04",
    "finding": "The most useful control is a visible boundary between routine preparation and accountable judgment, supported by source records and explicit escalation.",
    "sources": [
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "National Institute of Standards and Technology",
        "url": "https://www.nist.gov/privacy-framework"
      }
    ]
  },
  {
    "slug": "executive-support-team-review-consistency-report-5",
    "title": "Offshore executive support team: review consistency report",
    "summary": "A source-led brief on how founders, operators, and functional leaders can define, inspect, and improve offshore executive support team workflows.",
    "cluster": "Team design",
    "publishedAt": "2026-10-05",
    "finding": "The most useful control is a visible boundary between routine preparation and accountable judgment, supported by source records and explicit escalation.",
    "sources": [
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "National Institute of Standards and Technology",
        "url": "https://www.nist.gov/privacy-framework"
      }
    ]
  },
  {
    "slug": "back-office-team-workflow-boundary-review-6",
    "title": "Offshore back office team: workflow boundary review",
    "summary": "A source-led brief on how founders, operators, and functional leaders can define, inspect, and improve offshore back office team workflows.",
    "cluster": "Distributed operations",
    "publishedAt": "2026-10-06",
    "finding": "The most useful control is a visible boundary between routine preparation and accountable judgment, supported by source records and explicit escalation.",
    "sources": [
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "National Institute of Standards and Technology",
        "url": "https://www.nist.gov/privacy-framework"
      }
    ]
  },
  {
    "slug": "operations-team-source-quality-audit-7",
    "title": "Offshore operations team: source quality audit",
    "summary": "A source-led brief on how founders, operators, and functional leaders can define, inspect, and improve offshore operations team workflows.",
    "cluster": "Management systems",
    "publishedAt": "2026-10-07",
    "finding": "The most useful control is a visible boundary between routine preparation and accountable judgment, supported by source records and explicit escalation.",
    "sources": [
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "National Institute of Standards and Technology",
        "url": "https://www.nist.gov/privacy-framework"
      }
    ]
  },
  {
    "slug": "customer-support-team-exception-pattern-study-8",
    "title": "Offshore customer support team: exception pattern study",
    "summary": "A source-led brief on how founders, operators, and functional leaders can define, inspect, and improve offshore customer support team workflows.",
    "cluster": "Role design",
    "publishedAt": "2026-10-08",
    "finding": "The most useful control is a visible boundary between routine preparation and accountable judgment, supported by source records and explicit escalation.",
    "sources": [
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "National Institute of Standards and Technology",
        "url": "https://www.nist.gov/privacy-framework"
      }
    ]
  },
  {
    "slug": "sales-support-team-handoff-reliability-brief-9",
    "title": "Offshore sales support team: handoff reliability brief",
    "summary": "A source-led brief on how founders, operators, and functional leaders can define, inspect, and improve offshore sales support team workflows.",
    "cluster": "Team design",
    "publishedAt": "2026-10-01",
    "finding": "The most useful control is a visible boundary between routine preparation and accountable judgment, supported by source records and explicit escalation.",
    "sources": [
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "National Institute of Standards and Technology",
        "url": "https://www.nist.gov/privacy-framework"
      }
    ]
  },
  {
    "slug": "finance-admin-team-review-consistency-report-10",
    "title": "Offshore finance administration team: review consistency report",
    "summary": "A source-led brief on how founders, operators, and functional leaders can define, inspect, and improve offshore finance administration team workflows.",
    "cluster": "Distributed operations",
    "publishedAt": "2026-10-02",
    "finding": "The most useful control is a visible boundary between routine preparation and accountable judgment, supported by source records and explicit escalation.",
    "sources": [
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "National Institute of Standards and Technology",
        "url": "https://www.nist.gov/privacy-framework"
      }
    ]
  },
  {
    "slug": "executive-support-team-workflow-boundary-review-11",
    "title": "Offshore executive support team: workflow boundary review",
    "summary": "A source-led brief on how founders, operators, and functional leaders can define, inspect, and improve offshore executive support team workflows.",
    "cluster": "Management systems",
    "publishedAt": "2026-10-03",
    "finding": "The most useful control is a visible boundary between routine preparation and accountable judgment, supported by source records and explicit escalation.",
    "sources": [
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "National Institute of Standards and Technology",
        "url": "https://www.nist.gov/privacy-framework"
      }
    ]
  },
  {
    "slug": "back-office-team-source-quality-audit-12",
    "title": "Offshore back office team: source quality audit",
    "summary": "A source-led brief on how founders, operators, and functional leaders can define, inspect, and improve offshore back office team workflows.",
    "cluster": "Role design",
    "publishedAt": "2026-10-04",
    "finding": "The most useful control is a visible boundary between routine preparation and accountable judgment, supported by source records and explicit escalation.",
    "sources": [
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "National Institute of Standards and Technology",
        "url": "https://www.nist.gov/privacy-framework"
      }
    ]
  },
  {
    "slug": "operations-team-exception-pattern-study-13",
    "title": "Offshore operations team: exception pattern study",
    "summary": "A source-led brief on how founders, operators, and functional leaders can define, inspect, and improve offshore operations team workflows.",
    "cluster": "Team design",
    "publishedAt": "2026-10-05",
    "finding": "The most useful control is a visible boundary between routine preparation and accountable judgment, supported by source records and explicit escalation.",
    "sources": [
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "National Institute of Standards and Technology",
        "url": "https://www.nist.gov/privacy-framework"
      }
    ]
  },
  {
    "slug": "customer-support-team-handoff-reliability-brief-14",
    "title": "Offshore customer support team: handoff reliability brief",
    "summary": "A source-led brief on how founders, operators, and functional leaders can define, inspect, and improve offshore customer support team workflows.",
    "cluster": "Distributed operations",
    "publishedAt": "2026-10-06",
    "finding": "The most useful control is a visible boundary between routine preparation and accountable judgment, supported by source records and explicit escalation.",
    "sources": [
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "National Institute of Standards and Technology",
        "url": "https://www.nist.gov/privacy-framework"
      }
    ]
  },
  {
    "slug": "sales-support-team-review-consistency-report-15",
    "title": "Offshore sales support team: review consistency report",
    "summary": "A source-led brief on how founders, operators, and functional leaders can define, inspect, and improve offshore sales support team workflows.",
    "cluster": "Management systems",
    "publishedAt": "2026-10-07",
    "finding": "The most useful control is a visible boundary between routine preparation and accountable judgment, supported by source records and explicit escalation.",
    "sources": [
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "National Institute of Standards and Technology",
        "url": "https://www.nist.gov/privacy-framework"
      }
    ]
  },
  {
    "slug": "finance-admin-team-workflow-boundary-review-16",
    "title": "Offshore finance administration team: workflow boundary review",
    "summary": "A source-led brief on how founders, operators, and functional leaders can define, inspect, and improve offshore finance administration team workflows.",
    "cluster": "Role design",
    "publishedAt": "2026-10-08",
    "finding": "The most useful control is a visible boundary between routine preparation and accountable judgment, supported by source records and explicit escalation.",
    "sources": [
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "National Institute of Standards and Technology",
        "url": "https://www.nist.gov/privacy-framework"
      }
    ]
  },
  {
    "slug": "executive-support-team-source-quality-audit-17",
    "title": "Offshore executive support team: source quality audit",
    "summary": "A source-led brief on how founders, operators, and functional leaders can define, inspect, and improve offshore executive support team workflows.",
    "cluster": "Team design",
    "publishedAt": "2026-10-01",
    "finding": "The most useful control is a visible boundary between routine preparation and accountable judgment, supported by source records and explicit escalation.",
    "sources": [
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "National Institute of Standards and Technology",
        "url": "https://www.nist.gov/privacy-framework"
      }
    ]
  },
  {
    "slug": "back-office-team-exception-pattern-study-18",
    "title": "Offshore back office team: exception pattern study",
    "summary": "A source-led brief on how founders, operators, and functional leaders can define, inspect, and improve offshore back office team workflows.",
    "cluster": "Distributed operations",
    "publishedAt": "2026-10-02",
    "finding": "The most useful control is a visible boundary between routine preparation and accountable judgment, supported by source records and explicit escalation.",
    "sources": [
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "National Institute of Standards and Technology",
        "url": "https://www.nist.gov/privacy-framework"
      }
    ]
  },
  {
    "slug": "operations-team-handoff-reliability-brief-19",
    "title": "Offshore operations team: handoff reliability brief",
    "summary": "A source-led brief on how founders, operators, and functional leaders can define, inspect, and improve offshore operations team workflows.",
    "cluster": "Management systems",
    "publishedAt": "2026-10-03",
    "finding": "The most useful control is a visible boundary between routine preparation and accountable judgment, supported by source records and explicit escalation.",
    "sources": [
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "National Institute of Standards and Technology",
        "url": "https://www.nist.gov/privacy-framework"
      }
    ]
  },
  {
    "slug": "customer-support-team-review-consistency-report-20",
    "title": "Offshore customer support team: review consistency report",
    "summary": "A source-led brief on how founders, operators, and functional leaders can define, inspect, and improve offshore customer support team workflows.",
    "cluster": "Role design",
    "publishedAt": "2026-10-04",
    "finding": "The most useful control is a visible boundary between routine preparation and accountable judgment, supported by source records and explicit escalation.",
    "sources": [
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "United States Department of Labor",
        "url": "https://www.dol.gov/general/topic/workhours"
      },
      {
        "label": "National Institute of Standards and Technology",
        "url": "https://www.nist.gov/privacy-framework"
      }
    ]
  }
];

export const blogPosts: BlogPost[] = [...october13BlogPosts, ...october12BlogPosts, ...existingBlogPosts];
export const researchPosts: ResearchPost[] = [
  ...october13ResearchPosts,
  ...october12ResearchPosts,
  ...existingResearchPosts.map((post) => ({
    ...post,
    summary: `A focused review protocol for ${post.title.toLowerCase()}, including records, test method, decision signals, and evidence limits.`,
    finding: legacyResearchFinding(post.title),
  })),
];

export const nav = [
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/research', label: 'Research' },
  { href: '/contact-us', label: 'Contact' }
];

export function serviceBySlug(slug: string) { return site.services.find((service) => service.slug === slug); }
export function blogBySlug(slug: string) { return blogPosts.find((post) => post.slug === slug); }
export function researchBySlug(slug: string) { return researchPosts.find((post) => post.slug === slug); }
