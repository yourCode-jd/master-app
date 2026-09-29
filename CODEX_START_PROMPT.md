# Codex Start Prompt — Gym Intelligence App

You are building a completely fresh application.

The complete product requirements are in:

`gym-intelligence-app-master-build-spec.md`

Read the entire specification carefully before making changes.

## Main Goal

Build the Gym Intelligence App described in the specification as a real, functional application.

This is NOT RAPTOR and must not use RAPTOR branding, naming, database naming, UI structure, or code assumptions.

Treat `gym-intelligence-app-master-build-spec.md` as the source of truth.

Also maintain these files throughout the build:

- `BUILD_PROGRESS.md`
- `DECISIONS.md`

Do not rewrite or silently change the master specification.

---

## Important Constraints

1. Use only free/local/open-source tools for now.
2. Do not add paid APIs or services.
3. WhatsApp, SMS, email, payments, gym-floor occupancy, smart equipment, and similar external systems must use local simulators.
4. Do not require OpenAI, Anthropic, or another paid AI API.
5. Intelligence must initially use deterministic/rule-based logic.
6. Use realistic synthetic demo data only.
7. Do not hardcode fake dashboard statistics. Dashboard data must come from the database.
8. Build actual working workflows, not static UI mockups.
9. Permissions must be enforced server-side.
10. Important forms and actions must persist to the database.
11. Keep the application multi-gym ready.
12. Keep external systems behind provider interfaces so they can be replaced later.
13. Build phase by phase.
14. Do not skip responsive QA.
15. Do not leave dead buttons, unfinished actions, or fake success states.

---

## Preferred Stack

Use the stack defined in the master specification:

- Next.js
- React
- TypeScript
- PostgreSQL
- Prisma
- Zod
- Tailwind CSS or a centralized token-based CSS system
- Lucide icons
- Free/open-source libraries only

If the repository already contains compatible versions, use them rather than changing versions unnecessarily.

---

## Design System Is Mandatory

Before feature pages, create a shared design system.

Centralize:

- Typography
- Colors
- Spacing
- Radius
- Shadows
- Borders
- Containers
- Breakpoints
- Status colors
- Focus states

Build reusable components for:

- Button
- Input
- Textarea
- Select / Dropdown
- Checkbox
- Radio
- Toggle
- Tabs
- Badge
- Card
- Stat Card
- Avatar
- Table
- Pagination
- Search
- Filters
- Tooltip
- Popover
- Modal / Dialog
- Drawer
- Mobile bottom sheet where useful
- Toast
- Skeleton
- Empty State
- Error State
- Confirm Dialog

Do not style every page independently.

---

## Responsive Requirements

The application must work correctly at:

- 320px
- 360px
- 375px
- 390px
- 430px
- 768px
- 1024px
- 1280px
- 1440px
- 1920px

Requirements:

- No horizontal page overflow
- Desktop sidebar
- Mobile hamburger/toggle navigation
- Mobile navigation drawer
- Mobile filter drawer/bottom sheet
- Dropdowns remain inside viewport
- Long links/text wrap or truncate correctly
- Secondary mobile actions move to a More menu
- Desktop tables become card/list layouts on small screens where appropriate
- Buttons remain tappable
- Forms fit mobile screens
- Modals fit mobile screens
- Navigation does not jump
- No clipped cards, menus, text, icons, controls, or tables

---

## Architecture

Use clear separation:

UI
→ server action/API
→ domain/service layer
→ database

Business logic must not exist only inside React components.

Create provider interfaces such as:

- MessagingProvider
- EmailProvider
- PaymentProvider
- StorageProvider
- IntelligenceProvider
- EquipmentProvider

Initial implementations:

- SimulatorMessagingProvider
- SimulatorEmailProvider
- ManualPaymentProvider
- LocalStorageProvider
- RuleBasedIntelligenceProvider
- SimulatorEquipmentProvider

---

## Roles

Implement:

- OWNER
- MANAGER
- TRAINER
- RECEPTION
- MEMBER

Each role must have appropriate UI and server-side access control.

---

## Build Order

### Phase 1 — Foundation

Build and verify:

- Application setup
- Database
- Prisma
- Authentication
- Roles/permissions
- App shell
- Design system
- Responsive navigation
- Demo mode
- Audit foundation
- Demo-seeding foundation

Do not start Phase 2 until Phase 1 is working and verified.

### Phase 2 — Members

Build:

- Member CRUD
- Member list
- Member detail
- Membership
- Visits/attendance
- Trainer assignment
- Notes
- Member preferences
- Activity timeline

### Phase 3 — Progress

Build:

- Goals
- Assessments
- Progress metrics
- Progress history
- Progress reviews
- Milestones
- Member progress dashboard

### Phase 4 — Intelligence

Build:

- Member State Engine
- Rule engine
- State history
- Attention generation
- Priority
- Reason
- Recommended action

### Phase 5 — Trainer Actions

Build:

- Trainer dashboard
- Daily attention queue
- Interventions
- Assignments
- Due dates
- Completion
- Notes
- Follow-up

### Phase 6 — Outcomes

Build:

- Before/after metrics
- Intervention outcomes
- Follow-up measurement
- Improvement/recovery tracking
- Owner outcome summaries

### Phase 7 — 30/60/90 Journey

Build:

- Structured onboarding
- Journey tasks
- Reassessments
- Completion tracking

### Phase 8 — Member Experience

Build:

- Micro feedback
- Complaints
- Escalations
- Attention preferences
- Pain/discomfort continuity

### Phase 9 — Gym Floor

Build:

- Floor zones
- Occupancy simulator
- Equipment
- Equipment status
- Issue reporting
- Maintenance workflow

### Phase 10 — Reception

Build:

- Reception dashboard
- Visitors
- Trials
- Renewals
- Requests
- Handover
- Front-desk worklist

### Phase 11 — Community

Build:

- Groups
- Challenges
- Participation

Do not build a social-media feed.

### Phase 12 — Complete Demo & QA

Build and verify:

- Realistic synthetic data
- Simulator data
- End-to-end scenarios
- Responsive QA
- Functional QA
- Final demo walkthrough

---

## Intelligence Rules

Start with deterministic rules from the specification.

Examples:

- No visit for X days
- Attendance decline vs personal baseline
- Missing trainer interaction
- Overdue progress review
- Plateau
- Onboarding failure
- Renewal opportunity
- PT opportunity
- Repeated negative feedback

Rules must be reusable and centralized.

Do not scatter intelligence conditions throughout UI components.

---

## Demo Data

Create realistic scenarios, not meaningless random rows.

Include examples of:

- Progressing member
- Plateaued member
- Declining member
- At-risk member
- Lapsed member
- New/onboarding member
- Successful trainer intervention
- Unsuccessful intervention
- Negative member feedback
- Crowding complaint
- Equipment issue
- Renewal opportunity
- PT opportunity
- Milestone

Dashboard numbers must be computed from these records.

---

## Testing

Add automated tests for:

- Role permissions
- Tenant/gym isolation
- Member state rules
- Attention generation
- Duplicate prevention
- Interventions
- Outcomes
- Onboarding
- Feedback escalation
- Equipment issue workflow
- Simulator behavior

After each phase run:

- Typecheck
- Tests
- Production build

Fix all relevant errors before continuing.

---

## Required Working Method

Before changing code:

1. Read `gym-intelligence-app-master-build-spec.md`.
2. Inspect the repository.
3. Read `BUILD_PROGRESS.md`.
4. Read `DECISIONS.md`.
5. Create a concise implementation plan.
6. Identify what already exists and what must be created.
7. Start only the requested phase.

After each phase:

1. Run typecheck.
2. Run tests.
3. Run production build.
4. Fix failures.
5. Verify responsive behavior.
6. Verify main workflows manually.
7. Update `BUILD_PROGRESS.md`.
8. Add any important architectural/product decisions to `DECISIONS.md`.
9. Summarize exactly what was completed.
10. List any unresolved issues honestly.

Do not silently skip requirements.

If something cannot be implemented using the free/local approach, keep the core workflow functional with a simulator and record the limitation in `DECISIONS.md`.

---

# First Task

Start with **Phase 1 only**.

Read the master specification, inspect the repository, and implement the complete Phase 1 foundation.

Do not start Phase 2 until Phase 1 is working, tested, built successfully, and documented in `BUILD_PROGRESS.md`.
