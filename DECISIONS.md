# DECISIONS.md

## Purpose

This file records important product and technical decisions made while building the Gym Intelligence App.

The source of truth for product requirements remains:

`gym-intelligence-app-master-build-spec.md`

Use this file only for decisions, tradeoffs, implementation choices, and documented limitations.

Do not silently change the master specification.

---

# Decision Format

Use this format for every meaningful decision:

## DEC-XXX — Decision title

- Date:
- Phase:
- Status: Accepted / Revisit / Superseded
- Context:
- Decision:
- Why:
- Alternatives considered:
- Impact:
- Follow-up:

---

# Accepted Decisions

## DEC-001 — Fresh application, no RAPTOR dependency

- Date:
- Phase: Foundation
- Status: Accepted
- Context: RAPTOR was used only as earlier reference/research.
- Decision: Build this application as a completely fresh product.
- Why: The current product direction is Gym Intelligence, Member Progress, Attention, Trainer Action, Outcome Tracking, Member Experience, and Gym Floor Intelligence.
- Alternatives considered: Reuse RAPTOR architecture directly.
- Impact: No RAPTOR branding, naming, database naming, page assumptions, or code dependency should be introduced.
- Follow-up: None.

---

## DEC-002 — Free/local-first demo

- Date:
- Phase: Foundation
- Status: Accepted
- Context: The first objective is a working gym demo, not immediate commercial deployment.
- Decision: Use only free, local, or open-source infrastructure for the initial version.
- Why: Avoid unnecessary cost before product validation.
- Alternatives considered: Paid cloud services and third-party APIs.
- Impact: External functionality must use local implementations or simulators.
- Follow-up: Replace providers only after real-world validation.

---

## DEC-003 — Rule-based intelligence before paid AI

- Date:
- Phase: Intelligence
- Status: Accepted
- Context: The product needs member-state detection and recommendations.
- Decision: Implement deterministic rules first.
- Why: Rules are explainable, testable, free, and sufficient for the demo.
- Alternatives considered: Paid LLM or machine-learning APIs.
- Impact: Member states, attention items, and recommendations must originate from real data and explicit rules.
- Follow-up: Revisit AI/ML only after collecting meaningful real-world data.

---

## DEC-004 — External services use provider interfaces

- Date:
- Phase: Foundation
- Status: Accepted
- Context: Messaging, email, payments, storage, equipment, and future AI may change later.
- Decision: Keep these behind replaceable provider interfaces.
- Why: Prevent business logic from depending directly on one vendor.
- Alternatives considered: Direct integrations inside feature code.
- Impact: Demo uses simulator/local implementations.
- Follow-up: Add production providers only when needed.

---

## DEC-005 — Simulated actions must never appear real

- Date:
- Phase: Foundation
- Status: Accepted
- Context: Demo messaging and other integrations are simulated.
- Decision: Clearly label simulated messages/actions as simulated.
- Why: Prevent false delivery/payment/equipment claims.
- Alternatives considered: Treat simulated success as normal success.
- Impact: UI and database statuses must distinguish simulated actions.
- Follow-up: Maintain this distinction when production integrations are added.

---

## DEC-006 — Multi-gym-ready data model

- Date:
- Phase: Foundation
- Status: Accepted
- Context: First demo may contain one gym, but product can later support multiple gyms/chains.
- Decision: Gym-owned records should be scoped with `gymId`.
- Why: Retrofitting tenancy later is risky.
- Alternatives considered: Single-gym database structure.
- Impact: Relations, permissions, queries, and tests should respect gym boundaries.
- Follow-up: Add tenant-isolation tests.

---

## DEC-007 — Server-side permissions are mandatory

- Date:
- Phase: Foundation
- Status: Accepted
- Context: UI hiding alone does not protect data/actions.
- Decision: Enforce roles and permissions on the server.
- Why: Security and correctness.
- Alternatives considered: UI-only role hiding.
- Impact: All protected actions and reads require authorization checks.
- Follow-up: Test unauthorized access directly.

---

## DEC-008 — Design system before feature expansion

- Date:
- Phase: Foundation
- Status: Accepted
- Context: The application must stay visually consistent across many modules.
- Decision: Build shared tokens and reusable primitives before feature-heavy pages.
- Why: Prevent design drift and responsive inconsistencies.
- Alternatives considered: Style each page independently.
- Impact: Feature pages should consume shared components.
- Follow-up: Add variants to primitives rather than creating one-off components where possible.

---

## DEC-009 — Mobile behavior is not a desktop shrink

- Date:
- Phase: Foundation
- Status: Accepted
- Context: Desktop tables, filters, and navigation can become unusable on small screens.
- Decision: Create mobile-specific interaction patterns where needed.
- Why: Usability at 320–430px.
- Alternatives considered: Horizontal shrinking of all desktop UI.
- Impact: Tables may become cards, filters may become drawers/bottom sheets, secondary actions may move into More menus.
- Follow-up: Verify every major page at required widths.

---

## DEC-010 — Progress is broader than body weight

- Date:
- Phase: Progress
- Status: Accepted
- Context: Members need to understand whether they are actually improving.
- Decision: Track multiple progress dimensions.
- Why: Weight alone can misrepresent fitness progress.
- Alternatives considered: Weight/BMI-centric progress.
- Impact: Support strength, measurements, endurance, consistency, adherence, milestones, and other goal-relevant metrics.
- Follow-up: Keep metrics extensible.

---

## DEC-011 — Member behavior state is separate from membership status

- Date:
- Phase: Intelligence
- Status: Accepted
- Context: An ACTIVE member can still be declining or at risk.
- Decision: Maintain separate membership status and behavioral/member state.
- Why: Required for useful intelligence.
- Alternatives considered: One combined status field.
- Impact: Member state history and rules are separate from membership lifecycle.
- Follow-up: Expose meaningful state internally without confusing members.

---

## DEC-012 — Attention queue is central to staff workflow

- Date:
- Phase: Intelligence
- Status: Accepted
- Context: Staff should not have to search dashboards to discover problems.
- Decision: Create a central "Who needs attention?" workflow.
- Why: Converts data into action.
- Alternatives considered: Dashboard-only analytics.
- Impact: Rules generate attention items with reason, priority, recommended action, assignee, and due date.
- Follow-up: Keep attention generation deduplicated.

---

## DEC-013 — Intervention completion is not the final result

- Date:
- Phase: Outcomes
- Status: Accepted
- Context: Completing a task does not prove that it helped the member.
- Decision: Track post-intervention outcomes.
- Why: Product differentiation depends on measuring whether actions worked.
- Alternatives considered: Mark complete and stop tracking.
- Impact: Record before/after metrics, follow-up windows, outcome statuses, and business impact where appropriate.
- Follow-up: Build intervention-effectiveness reporting.

---

## DEC-014 — Trainer quality should emphasize member outcomes

- Date:
- Phase: Trainer Actions / Outcomes
- Status: Accepted
- Context: PT sales alone do not show trainer effectiveness.
- Decision: Track trainer performance using service and member-outcome measures.
- Why: Align trainer quality with member success.
- Alternatives considered: Sales-only leaderboard.
- Impact: Use intervention completion, reassessments, progress, feedback, retention, and related metrics.
- Follow-up: Avoid humiliating public trainer rankings.

---

## DEC-015 — First 30–90 days require structured onboarding

- Date:
- Phase: Member Journey
- Status: Accepted
- Context: New members can become lost quickly.
- Decision: Build a defined onboarding journey with checkpoints.
- Why: Early guidance, confidence, and progress visibility are important.
- Alternatives considered: Membership activation only.
- Impact: Create day/week/month tasks and completion tracking.
- Follow-up: Make journey timing configurable later.

---

## DEC-016 — Member attention preferences are explicit

- Date:
- Phase: Member Experience
- Status: Accepted
- Context: Different members want different amounts/types of staff attention.
- Decision: Store member attention preferences.
- Why: Avoid unwanted interruptions while supporting members who want accountability.
- Alternatives considered: Same approach for everyone.
- Impact: Trainers/managers should see relevant preferences before interaction.
- Follow-up: Add preference editing for members.

---

## DEC-017 — Gym floor intelligence starts simulated/manual

- Date:
- Phase: Gym Floor
- Status: Accepted
- Context: Real occupancy and smart-equipment integrations can require hardware/vendor APIs.
- Decision: Build gym-floor workflows using manual/simulated data first.
- Why: Validate experience before hardware spending.
- Alternatives considered: Buy/integrate sensors immediately.
- Impact: Occupancy, equipment usage, availability, and maintenance can be simulated.
- Follow-up: Keep EquipmentProvider replaceable.

---

## DEC-018 — Community is accountability-first, not social-media-first

- Date:
- Phase: Community
- Status: Accepted
- Context: A social feed adds complexity without proving core value.
- Decision: Focus on useful groups, challenges, participation, and schedules.
- Why: Support belonging and accountability without recreating Instagram.
- Alternatives considered: Full social feed.
- Impact: Community scope remains intentionally small for first demo.
- Follow-up: Expand only if validated.

---

## DEC-019 — No medical diagnosis

- Date:
- Phase: Member Experience
- Status: Accepted
- Context: Pain/discomfort continuity is useful, but the application is not a medical system.
- Decision: Record member-reported discomfort and training modifications without diagnosing or prescribing medical treatment.
- Why: Keep scope safe and appropriate.
- Alternatives considered: Automated medical interpretation.
- Impact: Use notes, warnings, follow-ups, and professional-referral prompts only where appropriate.
- Follow-up: Reassess compliance requirements before any healthcare expansion.

---

## DEC-020 — Demo dashboards use computed data

- Date:
- Phase: All
- Status: Accepted
- Context: Demo dashboards should prove workflows, not show static marketing numbers.
- Decision: All dashboard counts and statistics must be computed from database records.
- Why: Makes the demo credible and testable.
- Alternatives considered: Hardcoded numbers.
- Impact: Seed scenarios must be realistic enough to drive meaningful dashboards.
- Follow-up: Add tests for important calculated metrics.

---

# Decisions To Revisit Later

## Future production messaging

- Real WhatsApp provider
- SMS provider
- Email provider
- Delivery webhooks
- Consent/compliance requirements

## Future payments

- Payment gateway
- Webhooks
- Refunds
- Financial reconciliation

## Future storage

- S3-compatible storage
- CDN strategy
- Image processing

## Future intelligence

- Statistical modeling
- Machine learning
- LLM-assisted summaries
- Personalized recommendations
- Cross-gym learning

These should not be introduced until the free/local demo and core product loop are validated.
## DEC-013 — SQLite was an initial local-demo fallback

- Date: 2026-09-29
- Phase: Foundation
- Status: Superseded
- Context: The local PostgreSQL service is available but no application database role is provisioned, and Prisma schema-engine initialization fails in this environment.
- Decision: This was an initial fallback and is no longer active; the app now uses project-local PostgreSQL.
- Why: This keeps the demo fully local and verifies real persistence without requiring paid or external infrastructure.
- Alternatives considered: Blocking Phase 1 until a PostgreSQL role is provisioned.
- Impact: PostgreSQL is still the planned deployment database and requires a provider/migration validation before production.
- Follow-up: Switch DATABASE_URL and validate the migration against local PostgreSQL before Phase 2 completes.

## DEC-019 — Project-local PostgreSQL cluster for the local demo

- Date: 2026-09-29
- Phase: Foundation
- Status: Accepted
- Context: The system PostgreSQL service did not expose an application role to the workspace.
- Decision: Run an isolated PostgreSQL 18 cluster for this project on port 5433 and point Prisma at it.
- Why: Meets the PostgreSQL persistence requirement without changing the system database service.
- Alternatives considered: Retain SQLite or require a system administrator-created role.
- Impact: The demo database is real PostgreSQL; migrations 0001_init and 0002_phase2_members are registered and applied.
- Follow-up: Document start/stop commands before handoff.

## DEC-020 — Member removal is a soft membership cancellation

- Date: 2026-09-29
- Phase: Members
- Status: Accepted
- Context: Member history, attendance, notes, and audits must remain available.
- Decision: The member delete control changes membership status to CANCELLED and records activity/audit history instead of deleting the record.
- Why: Preserves operational history and follows the data-integrity requirement.
- Alternatives considered: Permanent member deletion.
- Impact: Cancellation is reversible through later membership workflows.
- Follow-up: Add a dedicated archive/reinstate filter in a later operational phase.

## DEC-021 — Progress is append-only measurement history

- Date: 2026-09-29
- Phase: Progress
- Status: Accepted
- Context: Progress must remain explainable across reassessments and reviews.
- Decision: Store each metric and assessment as a new timestamped PostgreSQL record; never update historical measurements in place.
- Why: Trend calculation and trainer/member trust depend on preserving the underlying evidence.
- Alternatives considered: A single mutable current-measurement record.
- Impact: Goal progress uses actual stored values, and duplicate metric submissions are prevented by member, metric type, time, and source.
- Follow-up: Add richer charting and configured milestone rules in later phases.

## DEC-022 — Intelligence remains deterministic and persistent

- Date: 2026-09-29
- Phase: Intelligence
- Status: Accepted
- Context: The demo needs actionable member intelligence without external AI, hidden reasoning, or duplicate staff work.
- Decision: Evaluate centralized deterministic rules against PostgreSQL visit, membership, progress, assessment, review, and activity data; persist state transitions, attention items, assignments, resolutions, and run summaries.
- Why: Staff can see a clear reason and recommended action, runs are repeatable, and the same condition does not create duplicate queue items.
- Alternatives considered: Paid AI summaries, transient dashboard-only alerts, and one combined membership/behavior status.
- Impact: A local worker command and an owner-only manual run operate the same engine. Trainers only see assigned-member attention items, while members are denied internal intelligence access.
- Follow-up: Phase 5 can add interventions and outcome tracking without changing the state-engine contract.
## DEC-023 — Interventions are an accountable bridge from intelligence to outcomes

- Date: 2026-09-29
- Phase: Trainer Actions
- Status: Accepted
- Context: Attention items describe why a member needs action, but they are not proof that a trainer acted.
- Decision: Store a separate, PostgreSQL-backed intervention for the work itself, with a scoped member, source attention item, assignee, status, due date, action taken, member response, completion timestamp, and optional follow-up.
- Why: This creates clear operational ownership while preserving the original intelligence signal and making Phase 6 outcome measurement possible.
- Alternatives considered: Editing attention items in place or treating a dashboard click as completed work.
- Impact: Trainers can act only on their assigned work; managers and owners can assign work. Completion preserves the source attention item as in-progress and records an audit/activity trail; this prevents an action record from being mistaken for a measured outcome.
- Follow-up: Phase 6 should add before/after evidence and final outcome evaluation without redefining completion.

## DEC-024 — Completing an intervention is not an outcome claim

- Date: 2026-09-30
- Phase: Trainer Actions
- Status: Accepted
- Context: Recording a trainer contact or program change should not silently declare the underlying member issue solved.
- Decision: Completion stores the action, member response, optional follow-up, trainer interaction, and audit event while the source attention item remains in progress.
- Why: This keeps operational follow-through separate from effectiveness measurement, which belongs to Phase 6.
- Impact: Follow-up work remains visible and staff can review action history without fabricated outcome metrics.


## DEC-025 — Outcomes preserve evidence and separate association from causation

- Date: 2026-09-30
- Phase: Outcomes & Effectiveness
- Status: Accepted
- Context: Current member data changes over time, so a later dashboard alone cannot truthfully reconstruct the context in which an intervention was evaluated.
- Decision: Store one tenant-scoped Outcome per intervention with immutable before and after snapshots, transparent suggested metrics, staff confirmation, and optional recorded associated value.
- Why: This supports trustworthy follow-up without claiming that a trainer action caused a financial or behavioral result.
- Impact: Improved outcomes can close the related action, while unchanged, declined, unreachable, and insufficient-data outcomes remain visible for follow-up or escalation.
- Follow-up: Phase 7 may add richer reporting but must keep outcome attribution language conservative.


## DEC-026 — The 90-day journey is a workflow layer, not a second progress system

- Date: 2026-09-30
- Phase: 30/60/90-Day Journey
- Status: Accepted
- Context: Early-member retention needs consistent staff follow-through, but goals, attendance, assessments, and metrics already have durable sources of truth.
- Decision: Store only journey stages and tasks; Day 30/60/90 reviews direct staff to existing member progress and intelligence records rather than duplicating them.
- Why: This keeps the onboarding experience explainable and avoids conflicting health, attendance, and progress data.
- Impact: Active journeys are created once per member, tasks become overdue only while active, and paused/cancelled journeys retain their history without false overdue alerts.
- Follow-up: A future phase may add per-gym template editing while retaining these centralized timing rules.


## DEC-027 — Member experience signals are operational records, not a health or satisfaction score

- Date: 2026-09-30
- Phase: Member Experience, Feedback & Escalations
- Status: Accepted
- Context: Feedback, complaints, and discomfort reports need prompt follow-through without turning personal information into a hidden aggregate score or a medical record.
- Decision: Persist each feedback response, complaint, and non-medical discomfort report separately, preserve the original wording and resolution, and route only serious or repeated negative signals into the existing attention/intervention workflow.
- Why: Staff can act on a transparent record, members retain visibility of their own submissions, and the app avoids diagnosing or claiming clinical meaning.
- Alternatives considered: A single sentiment score, dashboard-only alerts, or storing pain as a diagnosis.
- Impact: Managers/owners receive sensitive queues; trainers see only their assigned members and never confidential trainer feedback; reception receives general operational signals; members see their own records.
- Follow-up: Future work may add configured request timing and anonymized reporting while retaining these privacy boundaries.

## DEC-028 — Floor occupancy is explicitly simulated, while operational records remain durable

- Date: 2026-09-30
- Phase: Gym Floor & Equipment Intelligence
- Status: Accepted
- Context: The first floor-management release needs useful operational context without cameras, sensors, paid APIs, or misleading live-data claims.
- Decision: Store manually controlled simulated occupancy as immutable snapshots and label all floor occupancy as simulated. Equipment issues, availability, safety shutdowns, maintenance, resolutions, and audits remain ordinary PostgreSQL operational records.
- Why: Teams can exercise the real workflow and examine trends while clearly understanding the source and confidence of occupancy data.
- Alternatives considered: Presenting demo values as live hardware data, or storing only a mutable current occupancy count.
- Impact: Managers can override zone occupancy, members receive simple busy/availability guidance, and later sensor integration can add a new source without replacing history.
- Follow-up: Add hardware connectors only after their data quality, privacy boundaries, and source labels are defined.

## DEC-029 — Reception is a time-bound operational workspace

- Date: 2026-09-30
- Phase: Reception & Front-Desk Operations
- Status: Accepted
- Context: Front-desk staff need to act on visitors, renewals, requests, access problems, and handovers without being given private member intelligence or owner analytics.
- Decision: Persist each reception object independently and surface a compact today-first worklist. Reuse membership, floor, and member records as references rather than duplicating their core data.
- Why: This makes work attributable and handovers durable while keeping the reception role focused on operational information.
- Impact: The next staff member must acknowledge a handover from another author; member accounts do not enter the internal reception workspace.
- Follow-up: Add payment transaction records only when a dedicated payment workflow is introduced.

## DEC-030 — Community is consent-based accountability, not a social feed

- Date: 2026-09-30
- Phase: Community & Accountability
- Status: Accepted
- Decision: Store consent-based group membership, participation, and personal challenge progress while keeping private health, risk, complaint, and comparative metrics out of community views.
- Why: The useful behavior is joining a relevant group, showing up, and seeing personal progress—not public comparison or social engagement mechanics.
- Impact: Members control join/leave for open groups; capacity is enforced; attendance challenges reuse stored visits; staff can track activity participation without public shaming.
- Follow-up: Later matching or recommendation rules must preserve this consent and privacy boundary.

## DEC-031 — The final demo favors traceable local workflows over external integration claims

- Date: 2026-09-30
- Phase: Complete Demo, System Integration & Final QA
- Status: Accepted
- Decision: Treat PostgreSQL records, deterministic rules, and explicit simulator labels as the sole source of truth for the local demo.
- Why: The end-to-end workflow can be demonstrated and audited without paid APIs, hardware, fabricated real-time assertions, or untraceable data.
- Impact: Seed/reset, workers, credentials, and known simulator boundaries are documented in README; claims about payments, access, messaging, and occupancy remain deliberately constrained.
- Follow-up: Production integrations require independent security, privacy, reliability, and data-source reviews.

## DEC-032 — Demo Training Mode is a persisted guidance layer, not an alternate permission model

- Date: 2026-09-30
- Status: Accepted
- Decision: Store per-user training progress and event analytics in PostgreSQL, keep scenarios and concise help definitions in application code, and enforce existing role permissions for every guided link and action.
- Why: Users can practice realistic workflows without a long manual or an unsafe training-only elevation of access.
- Impact: Reset removes only training progress/events and tagged scenario records; ordinary member, intervention, and operational records remain untouched.

