# Gym Intelligence App — Master Build Specification

## 1. Purpose

Build a **fresh gym intelligence and member-outcome application**.

This is **not** a copy of RAPTOR and should not use RAPTOR branding, naming, page structure, database naming, or implementation-specific references.

The goal is to build a working demo that helps gyms:

- Understand every member's current state
- Show whether members are actually progressing
- Identify who needs attention and why
- Tell trainers what action to take next
- Track whether the action worked
- Measure trainer quality through member outcomes
- Improve first 30–90 day onboarding
- Capture gym-floor and member-experience problems
- Give owners actionable decisions instead of generic dashboards
- Run fully with free/local infrastructure for the first demo

The app must work end-to-end with realistic demo data and simulators.

---

# 2. Product Positioning

Do **not** position the product as:

- Another gym management system
- Another attendance app
- Another CRM
- Another WhatsApp reminder tool
- Another generic dashboard
- Another AI chatbot
- Another churn-score product

Core product idea:

> **Know which members need attention, understand why, tell the team what to do next, and measure whether it worked.**

Primary product loop:

> **OBSERVE → UNDERSTAND → DECIDE → ACT → MEASURE → LEARN**

Core data loop:

> **Member Data → Member State → Problem → Recommended Action → Assigned Person → Outcome → Business Impact**

---

# 3. Main Users

## 3.1 Owner / Admin

Needs to know:

- Which members are declining
- Which members are progressing
- Revenue at risk
- Renewal opportunities
- PT opportunities
- Which trainers are performing well
- Which trainers need support
- Which gym-floor problems are increasing
- What member complaints are increasing
- Which interventions are working
- Which actions are overdue
- Which parts of the member journey are failing
- What happened today / this week / this month

## 3.2 Manager

Needs to:

- Monitor member attention queue
- Assign interventions
- Review trainer actions
- Review member feedback
- Resolve gym-floor issues
- Monitor onboarding completion
- Monitor progress reviews
- Handle escalations
- Review member experience
- Track renewals and opportunities

## 3.3 Trainer

Needs to know:

- Who needs attention today
- Why that member needs attention
- Member goal
- Member progress
- Attendance trend
- Last trainer interaction
- Current workout/program
- Pain/injury notes
- Member attention preference
- What action is recommended
- What actions are overdue
- Which members have milestones
- Which reassessments are due

Trainer should be able to:

- Record interaction
- Add progress review
- Record reassessment
- Update plan
- Mark action complete
- Add outcome
- Add pain/discomfort note
- Add member note
- Escalate to manager
- Schedule next check-in

## 3.4 Reception

Needs a simple operational screen:

- New visitors
- Trial bookings
- Renewals due
- Payment/plan status
- Member lookup
- Trainer availability
- Member complaints
- Member requests
- Access issues
- Follow-ups
- Shift handover
- Important alerts

Do not overload reception with complex analytics.

## 3.5 Member

Needs:

- Personal goal
- Progress
- Attendance consistency
- Milestones
- Reassessment dates
- Current plan
- Trainer/contact details
- Attention preference
- Feedback
- Requests
- Pain/discomfort reporting
- Progress history

Member experience should answer:

> **Am I actually progressing?**

---

# 4. Core Product Modules

## 4.1 Member Profile

Each member should have:

- Full name
- Photo/avatar
- Phone
- Email
- DOB or age range
- Gender (optional)
- Join date
- Membership status
- Membership start/end date
- Assigned trainer
- Current goal
- Goal start date
- Goal target date
- Attention preference
- Preferred contact method
- Preferred trainer gender (optional)
- Notes
- Pain/discomfort flags
- Current member state
- Current risk/attention level
- Last visit
- Attendance trend
- Last trainer interaction
- Next review date
- Current plan/program
- Progress summary
- Milestones
- Interventions
- Feedback history

---

## 4.2 Member Progress System

Track progress beyond body weight.

Possible metrics:

- Weight
- Body measurements
- Body-fat percentage
- Strength
- Personal records
- Endurance
- Mobility
- Workout completion
- Attendance consistency
- Program adherence
- Goal completion
- Progress photos
- Trainer assessment
- Member self-rating

Progress screen should show:

- Starting point
- Current point
- Change
- Trend
- Goal %
- Milestones
- Next review
- Clear explanation

Example:

- Goal: Lose 10 kg
- Start: 92 kg
- Current: 86.5 kg
- Goal progress: 55%
- Attendance consistency: 84%
- Squat: 60 kg → 75 kg
- Waist: 98 cm → 93 cm
- Trend: Improving

Important:

Do not make body weight the only success metric.

---

## 4.3 Member State Engine

Member status and member behavioral state are different.

Membership status can be:

- ACTIVE
- EXPIRING
- EXPIRED
- FROZEN
- CANCELLED

Behavioral/member state can be:

- NEW
- ONBOARDING
- CONSISTENT
- PROGRESSING
- PLATEAU
- DECLINING
- AT_RISK
- LAPSED
- WIN_BACK
- ADVANCING
- PT_OPPORTUNITY
- RENEWAL_OPPORTUNITY
- ADVOCATE

A member can have:

- One primary state
- Multiple secondary flags/opportunities

Example:

- Membership: ACTIVE
- Member state: DECLINING
- Opportunity: RENEWAL_OPPORTUNITY

---

## 4.4 Rule-Based Intelligence Engine

For the free demo, use deterministic rules.

Do **not** require paid AI.

Example rules:

### Attendance

- No visit for 7 days → Needs attention
- No visit for 14 days → High attention
- Attendance down > 40% vs personal baseline → DECLINING
- Attendance down > 60% → AT_RISK

### Trainer interaction

- No trainer interaction for 21 days → Trainer check-in
- Member in ONBOARDING and no trainer interaction for 7 days → Escalate

### Progress

- No measurable improvement for 4 weeks → PLATEAU
- Progress review overdue → Reassessment required
- Goal completion > 80% → ADVANCING
- Goal completed → Milestone + new-goal review

### Membership

- Membership expires within 30 days → RENEWAL_OPPORTUNITY
- Membership expires within 7 days → High-priority renewal
- Strong engagement + no PT → PT_OPPORTUNITY

### Feedback

- 2 negative feedback events in 30 days → Manager review
- Trainer complaint → Immediate manager attention
- Safety issue → High-priority escalation

### Onboarding

- New member + no assessment → Onboarding incomplete
- New member + no workout completed in first 3 days → Trainer attention
- New member + <2 visits in first 14 days → At-risk onboarding

Every rule should produce:

- Rule name
- Reason
- Priority
- Recommended action
- Assigned role
- Due date
- Member state change if applicable

---

# 5. Member Attention System

Main question:

> **Who needs attention today?**

Create a central attention queue.

Each attention item should include:

- Member
- Priority
- What changed
- Why it matters
- Recommended action
- Assigned person
- Created date
- Due date
- Status
- Outcome
- Follow-up date

Priority levels:

- Critical
- High
- Medium
- Low
- Positive opportunity

Example:

**Member:** Aman  
**Problem:** Attendance declined 52%  
**Reason:** Usual 4.1 visits/week → current 2.0  
**Recommended action:** Trainer check-in  
**Assigned:** Ravi  
**Due:** Today  
**Priority:** High

---

# 6. Intervention System

An intervention is an actual team action.

Types:

- Trainer check-in
- Goal review
- Program reassessment
- Personal outreach
- PT consultation
- Renewal discussion
- Welcome call
- Progress celebration
- Member complaint follow-up
- Equipment issue follow-up
- Recovery recommendation
- Manager review
- Safety escalation

Intervention lifecycle:

- OPEN
- ASSIGNED
- IN_PROGRESS
- COMPLETED
- FOLLOW_UP_DUE
- CLOSED
- CANCELLED

Every intervention should record:

- Member
- Problem/reason
- Recommended action
- Assigned person
- Due date
- Action taken
- Completion time
- Member response
- Follow-up date
- Outcome status
- Notes

---

# 7. Outcome Engine

Do not stop at "action completed."

Track what happened afterward.

Possible outcomes:

- IMPROVED
- PARTIALLY_IMPROVED
- UNCHANGED
- DECLINED
- MEMBER_UNREACHABLE
- NO_LONGER_RELEVANT

Example:

Attendance decline detected  
→ Trainer contacted member  
→ Program adjusted  
→ Review after 14 days  
→ Attendance increased from 1.5/week to 3.2/week  
→ Outcome = IMPROVED

Track:

- Before metric
- Action
- After metric
- Change
- Time window
- Outcome
- Business impact where applicable

---

# 8. Trainer Intelligence

Trainer home screen should answer:

> **Who needs me today?**

Sections:

- High-priority members
- Reassessments due
- Members declining
- Members plateauing
- New members requiring onboarding
- Milestones
- Member complaints
- Pain/discomfort follow-ups
- Overdue actions

Example card:

**Aman**
- Attendance −48%
- Last contact: 19 days ago
- Goal: Lose 10 kg
- State: DECLINING
- Recommended: Check-in today

---

# 9. Trainer Quality / Outcome Tracking

Do not rank trainers only by PT sales.

Track:

- Assigned members
- Active PT clients
- Intervention completion
- On-time intervention %
- Reassessment completion
- Member progress rate
- Member retention
- Member feedback
- Complaint count
- Response time
- PT renewal rate
- Member goal achievement
- Members declining under trainer
- Members recovered after intervention

Owner should see trends, not humiliating public leaderboards.

---

# 10. First 30–90 Day Member Journey

The first months should be structured.

## Day 0

- Welcome
- Goal capture
- Baseline assessment
- Attention preference
- Trainer assignment
- Starting program

## Day 1–3

- First guided workout
- Equipment orientation
- Basic confidence check

## Week 1

- Attendance review
- Member feedback
- Trainer check-in

## Week 2

- Adherence check
- Any pain/discomfort
- Program confidence

## Day 30

- Progress review
- Adjust plan
- Show member visible progress

## Day 60

- Progress review
- Plateau check
- Goal reassessment if needed

## Day 90

- Full review
- Progress summary
- Next goal
- Renewal/continuation conversation if appropriate

App must track whether each onboarding step is complete.

---

# 11. Member Attention Preference

Allow members to choose how they want staff to interact.

Options:

- Independent
- Occasional check-in
- Close coaching
- Form correction only
- Goal accountability
- Social/group motivation
- Prefer female trainer
- Prefer male trainer
- No interruption during workout
- Contact me only when necessary

This should be visible to trainers and managers.

---

# 12. Micro Feedback System

Keep feedback fast.

Example question:

**How was today's session?**

- Great
- Good
- Okay
- Poor

If poor:

- Too crowded
- Equipment unavailable
- Equipment broken
- Cleanliness
- Trainer issue
- Staff issue
- Pain/discomfort
- Didn't know what to do
- Other

Do not ask after every visit.

Trigger feedback at useful moments:

- First workout
- Day 7
- Day 30
- After PT session
- After complaint resolution
- After long absence
- After milestone
- Random occasional sample

---

# 13. Gym Floor Intelligence

For the demo, do not require hardware.

Use manual/simulated floor data.

Track:

- Equipment
- Equipment category
- Area/zone
- Status
- Availability
- Busy level
- Broken/maintenance status
- Last maintenance date
- Issue reports
- Average wait estimate
- Trainer availability

Zones can be:

- Cardio
- Free weights
- Strength machines
- Functional
- Studio
- Recovery
- Stretching

Possible floor states:

- QUIET
- NORMAL
- BUSY
- VERY_BUSY

Demo can simulate occupancy.

Later hardware integrations can be optional.

---

# 14. Equipment Issue System

Member/staff can report:

- Broken
- Unsafe
- Dirty
- Missing attachment
- Unavailable
- Other

Issue lifecycle:

- REPORTED
- ACKNOWLEDGED
- IN_PROGRESS
- RESOLVED
- CLOSED

Owner should see:

- Open issues
- Repeat issues
- Most problematic equipment
- Average resolution time

---

# 15. Pain / Discomfort Continuity

This is not a medical diagnosis system.

Allow member/trainer to record:

- Body area
- Description
- Severity
- Date
- Triggering exercise
- Temporary modification
- Trainer note
- Resolved/not resolved
- Follow-up date

Important:

- Show relevant warning to trainer
- Keep history
- Allow escalation
- Do not generate medical diagnosis
- Do not recommend medical treatment

---

# 16. Community / Accountability

Do not build a social-media feed first.

Useful groups:

- Beginner
- Fat loss
- Strength
- Running
- Women
- 40+
- Transformation challenge
- Weekend activity
- Recovery/mobility
- Training partner group

For demo:

- Group list
- Member count
- Challenge
- Schedule
- Member participation
- Attendance
- Simple updates

No paid chat platform required.

---

# 17. Owner Decision Dashboard

Owner dashboard must be action-focused.

Main areas:

## Members

- Members needing attention
- At-risk members
- Declining members
- Progressing members
- Onboarding failures
- Renewal opportunities
- PT opportunities

## Trainers

- Intervention completion
- Member outcomes
- Feedback
- Reassessment completion
- Retention
- Complaints

## Experience

- Negative feedback
- Crowding complaints
- Equipment issues
- Cleanliness issues
- Trainer issues
- Safety issues

## Business

For demo, use simulated/manual values:

- Renewal value at risk
- Renewal opportunities
- PT opportunities
- Revenue retained after intervention
- Revenue won from renewals
- Lost revenue estimate

## Actions

- Overdue actions
- Unassigned actions
- High-priority unresolved items
- Escalations

---

# 18. Reception Dashboard

Keep simple.

Sections:

- Today's visitors
- Trials
- Renewals
- Member requests
- Member lookup
- Open complaints
- Trainer availability
- Access issues
- Follow-ups
- Shift handover

Mobile version should show cards, not a huge desktop table.

---

# 19. Member Dashboard

Member should see:

- Greeting
- Goal
- Goal progress
- Current streak/consistency
- Key progress metrics
- Milestones
- Current plan
- Next workout
- Next assessment
- Trainer
- Feedback/request shortcut
- Attention preference
- Pain/discomfort shortcut

Avoid overwhelming members with internal risk scores.

---

# 20. Demo Data

Seed realistic demo data.

Recommended:

- 1 gym
- 1 owner
- 1 manager
- 2 reception staff
- 5 trainers
- 100–150 members
- 15 new members
- 20 progressing
- 15 plateau
- 10 declining
- 8 at-risk
- 5 lapsed
- 20 renewal opportunities
- 10 PT opportunities
- 30 interventions
- 20 feedback records
- 10 equipment issues
- 15 progress reviews
- 8 pain/discomfort notes
- 6 community groups

Use synthetic names/contact data.

Do not use real customer information.

---

# 21. Free-Only Technical Approach

The first demo must run without paid services.

Recommended stack:

## Application

- Next.js
- TypeScript
- React

## Styling

- Tailwind CSS or custom CSS tokens
- One design-system source of truth

## Database

- PostgreSQL local

## ORM

- Prisma

## Validation

- Zod

## Forms

- React Hook Form or native server actions

## Charts

Use a free open-source chart library if needed.

Possible options:

- Recharts
- Chart.js

Do not depend on paid analytics.

## Icons

Use free open-source icons:

- Lucide

## Date utilities

- date-fns

## Local file storage

- Local filesystem for demo uploads

## Authentication

Build local application auth.

No paid auth provider required.

---

# 22. Simulator Strategy

Everything external should be behind an interface.

For demo:

## Messaging

Mode: SIMULATOR

Simulate:

- WhatsApp
- SMS
- Push notification

Store:

- Recipient
- Template
- Rendered message
- Queued time
- Simulated send time
- Status = SIMULATED

Never display simulated messages as delivered.

## Email

Mode: SIMULATOR

Store email in application outbox.

## Payments

Mode: MANUAL / SIMULATED

Allow:

- Cash
- UPI
- Card
- Bank transfer
- Other

For demo, record transactions only.

No gateway.

## Storage

Mode: LOCAL

Files stored locally.

## Gym floor occupancy

Mode: SIMULATOR

Allow admin to change:

- Quiet
- Normal
- Busy
- Very busy

## Smart equipment

Mode: SIMULATOR

Generate sample:

- Equipment usage
- Availability
- Maintenance events

## AI

Do not require external AI.

Use rule-based recommendations.

---

# 23. Architecture Rules

Use clear layering:

> UI → server action/API → domain/service layer → database

Rules:

- Business logic must not live only in UI
- Permissions must be enforced server-side
- Validation must happen server-side
- UI can validate for convenience but server is authoritative
- External services must use provider interfaces
- Demo simulators must be clearly labeled
- Use audit logs for important changes
- Use timestamps consistently
- Keep data tenant-ready even if first demo has one gym
- Avoid hardcoded dashboard values
- Seed demo data instead

---

# 24. Multi-Gym Readiness

Even if demo has one gym, structure data so multiple gyms can be added later.

Every gym-owned record should contain:

- gymId

Examples:

- Member
- Staff
- Trainer
- Progress
- Intervention
- Feedback
- Equipment
- Group
- Membership
- Visit
- Action
- Audit record

Do not mix data between gyms.

---

# 25. Role & Permission System

Roles:

- OWNER
- MANAGER
- TRAINER
- RECEPTION
- MEMBER

Possible permission categories:

- Members
- Progress
- Interventions
- Feedback
- Trainers
- Reports
- Revenue
- Equipment
- Community
- Settings
- Staff
- Audit

Examples:

Owner:

- Full access

Manager:

- Operational access
- No sensitive owner-only settings unless granted

Trainer:

- Assigned members
- Progress
- Interventions
- Notes
- Feedback relevant to their members

Reception:

- Member lookup
- Membership basics
- Visitor/trial
- Requests
- Front desk
- No private trainer evaluation

Member:

- Own profile
- Own progress
- Own feedback
- Own preferences

---

# 26. Audit Log

Audit important changes:

- Membership changes
- Member state manual override
- Progress edit
- Intervention assignment
- Intervention completion
- Complaint resolution
- Trainer reassignment
- Pain note
- Permission change
- Equipment resolution
- Payment record
- Member profile update

Audit entry:

- Who
- What
- Record
- Before
- After
- Time

---

# 27. Design System

The entire app must use one consistent design system.

No random styling per screen.

Create one central token system.

---

## 27.1 Typography

Choose one free font family.

Recommended:

- Inter

Use a consistent type scale.

Example:

- Display: 32px / 40px / 700
- H1: 28px / 36px / 700
- H2: 24px / 32px / 700
- H3: 20px / 28px / 600
- H4: 18px / 26px / 600
- Body Large: 16px / 24px / 400
- Body: 14px / 22px / 400
- Small: 13px / 18px / 400
- Caption: 12px / 16px / 400

Do not use too many font sizes.

---

## 27.2 Color Tokens

Use semantic tokens, not raw colors throughout components.

Example token names:

- background
- surface
- surface-muted
- surface-elevated
- text-primary
- text-secondary
- text-muted
- border
- border-strong
- primary
- primary-hover
- success
- warning
- danger
- info
- focus

State colors:

- Progressing
- Plateau
- Declining
- At Risk
- Positive Opportunity

Never communicate status using color alone.

Use icon + text + color.

---

## 27.3 Spacing System

Use a fixed spacing scale.

Example:

- 4
- 8
- 12
- 16
- 20
- 24
- 32
- 40
- 48
- 64

Use spacing tokens.

Avoid arbitrary values unless absolutely necessary.

---

## 27.4 Radius

Use a limited set:

- Small: 6px
- Medium: 10px
- Large: 14px
- XL: 18px
- Pill: 999px

Example:

- Inputs: medium
- Buttons: medium
- Cards: large
- Modals: XL
- Badges: pill

---

## 27.5 Shadows

Keep shadows subtle.

Tokens:

- shadow-sm
- shadow-md
- shadow-lg

Do not use heavy shadows on every card.

Use border + subtle elevation.

---

## 27.6 Layout Widths

Create consistent container widths.

Example:

- App full width
- Content max width: 1440px
- Form max width: 720px
- Reading/detail max width: 960px

Desktop page structure:

- Sidebar
- Topbar
- Main content

---

# 28. Core UI Components

Build reusable components before building pages.

Required:

## Buttons

Variants:

- Primary
- Secondary
- Outline
- Ghost
- Danger
- Icon

Sizes:

- Small
- Medium
- Large

States:

- Normal
- Hover
- Focus
- Disabled
- Loading

## Inputs

- Text input
- Number
- Email
- Phone
- Search
- Password
- Textarea
- Date
- Date range

States:

- Default
- Focus
- Error
- Disabled
- Read-only

## Select / Dropdown

Must support:

- Label
- Search
- Keyboard navigation
- Disabled state
- Empty state
- Error state

Do not allow dropdown menus to overflow off-screen.

## Checkbox

## Radio

## Toggle / Switch

## Tabs

Tabs must wrap or become horizontal-scroll safely on mobile.

Do not let tabs overflow the viewport.

## Badge

Use for:

- Status
- Priority
- Member state
- Outcome

## Avatar

## Tooltip

## Popover

## Modal / Dialog

On mobile:

- Use near-full-screen or bottom sheet where appropriate

## Drawer

Use for:

- Mobile navigation
- Mobile filter panel
- Secondary details

## Toast / Notification

## Empty State

## Skeleton / Loading State

## Error State

## Confirm Dialog

Required before destructive actions.

---

# 29. Stat Cards

Stat cards should be consistent.

Each stat card can include:

- Label
- Main value
- Trend
- Comparison
- Icon
- Status
- Optional link

Example:

**Members needing attention**
18  
+4 vs last week

Desktop:

- 3–5 per row depending on width

Tablet:

- 2 per row

Mobile:

- 1 or 2 per row depending on card size

Do not squeeze text.

---

# 30. Tables

Desktop tables can be used for:

- Members
- Staff
- Interventions
- Equipment
- Audit logs
- Feedback

Rules:

- Sticky header where useful
- Clear column alignment
- Row hover
- Sort
- Search
- Filters
- Pagination
- Empty state
- Loading
- Error state
- Row actions menu

Do not make tables excessively wide.

Avoid 12–15 columns on one screen.

Use:

- Priority columns
- Hide lower-priority columns
- Expand/details drawer

---

# 31. Mobile Table Rules

Do not simply shrink desktop tables.

On mobile, convert important table rows into cards.

Example member card:

- Member name
- State
- Priority
- Last visit
- Assigned trainer
- Main action
- More menu

If horizontal scrolling is necessary:

- Keep first column sticky
- Show scroll affordance
- Avoid clipped actions

---

# 32. Filters

Desktop:

- Inline filter row or filter bar

Mobile:

Use:

- Filter button
- Opens drawer/bottom sheet
- Show active filter count
- Clear all
- Apply button

Do not put a long horizontal filter list on mobile.

---

# 33. Navigation

## Desktop

Use sidebar navigation.

Suggested sections:

- Dashboard
- Attention
- Members
- Trainers
- Progress
- Interventions
- Experience
- Gym Floor
- Equipment
- Community
- Reception
- Reports
- Settings

## Mobile

Use:

- Top bar
- Hamburger/toggle menu
- Slide-out drawer

Important:

- Menu must not jump
- Prevent body scroll when drawer open
- Clear active page
- Large tap targets
- Close button
- Keyboard accessible

---

# 34. Mobile Link / Action Overflow

Important requirement:

Links and actions must never go outside the screen.

Rules:

- Allow text wrap
- Truncate long URLs/names with ellipsis where appropriate
- Use overflow-wrap
- Use responsive flex wrapping
- Move secondary actions into "More" menu
- Avoid fixed widths
- Never allow horizontal page overflow
- Test at 320px width

---

# 35. Responsive Breakpoints

Support at minimum:

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

No horizontal overflow at any size.

---

# 36. Responsive Layout Rules

## Desktop

- Sidebar visible
- Multi-column dashboards
- Tables
- Inline filters

## Tablet

- Collapsible sidebar
- 2-column cards
- Some tables become simplified

## Mobile

- Navigation drawer
- Single-column pages
- Card-based data
- Filter drawer
- Bottom sheet where useful
- Large tap targets
- No tiny text
- No clipped dropdowns
- No fixed desktop widths

---

# 37. Accessibility

Required:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Labels for all inputs
- ARIA only where needed
- Sufficient contrast
- Minimum practical touch target around 44px
- Do not rely only on color
- Accessible dialogs
- Screen-reader-friendly status text
- Error messages linked to fields

---

# 38. Main Pages

## Authentication

- Login
- Forgot password (simulated/local for demo)
- Reset password (local demo flow)

## Dashboard

Role-specific.

## Attention

- Attention queue
- Priority filters
- Assignment
- Action
- Outcome

## Members

- Member list
- Member detail
- Add member
- Edit member
- Member progress
- Member state history
- Attendance
- Feedback
- Interventions
- Notes
- Pain/discomfort
- Journey

## Trainers

- Trainer list
- Trainer detail
- Assigned members
- Actions
- Outcome metrics
- Feedback
- Schedule summary

## Progress

- Progress reviews
- Due reassessments
- Goal tracking
- Milestones

## Interventions

- Open
- Assigned
- Completed
- Follow-up
- Outcomes

## Experience

- Member feedback
- Complaints
- Trends
- Issue categories

## Gym Floor

- Occupancy
- Zones
- Equipment
- Trainer availability

## Equipment

- Equipment list
- Status
- Issues
- Maintenance

## Community

- Groups
- Challenges
- Participation

## Reception

- Today
- Visitors
- Trials
- Requests
- Renewals
- Handover

## Reports

Keep reports action-oriented.

## Settings

- Gym
- Staff
- Roles
- Rules
- Member states
- Simulator settings
- Design/theme settings

---

# 39. Search

Global search should support:

- Member
- Trainer
- Phone
- Membership
- Intervention
- Equipment

Search results must be grouped clearly.

---

# 40. Notification Center

Internal notifications only for demo.

Examples:

- New high-priority attention item
- Action overdue
- Feedback complaint
- Equipment safety issue
- Progress review due
- Member milestone
- Renewal opportunity

No paid push service required.

---

# 41. Activity Timeline

Member detail should have a chronological timeline.

Events:

- Joined
- Visit
- Progress review
- Trainer note
- Intervention
- Feedback
- Complaint
- Goal updated
- Milestone
- Membership update
- Pain note

This helps staff understand member history quickly.

---

# 42. Forms

Form rules:

- Group related fields
- Clear labels
- Short sections
- Validation near field
- Save/cancel actions
- Prevent accidental duplicate submission
- Warn about unsaved changes
- Mobile-friendly controls
- Use date pickers that work on mobile
- Do not create enormous single-page forms

---

# 43. Empty / Loading / Error States

Every screen must support:

- Loading
- No data
- No search results
- Error
- Permission denied

Do not leave blank screens.

Example empty state:

> No members need attention right now.

With useful next action where relevant.

---

# 44. Data Integrity

Important:

- Use IDs, not names, for relationships
- Prevent duplicate members where possible
- Record timestamps
- Use transactions for critical multi-step writes
- Prevent double form submission
- Keep history for important records
- Do not overwrite progress history
- Do not delete audit history
- Prefer soft-delete/archiving for important business records

---

# 45. Security

For demo:

- Password hashing
- Secure session
- CSRF protection where framework requires
- Server-side authorization
- Validate all input
- Sanitize uploaded filenames
- Restrict file types
- Limit upload size
- Prevent direct cross-role access
- Hide sensitive owner information from other roles

Do not put secrets in frontend code.

---

# 46. Privacy

For demo:

- Use synthetic data
- Minimize collected personal data
- Do not collect unnecessary location/device tracking
- Do not store medical diagnoses
- Keep member notes permission-controlled
- Allow sensitive notes only where needed
- Do not expose internal risk labels to members unless intentionally designed

---

# 47. Demo Messaging

Create internal simulator pages:

## Message Outbox

Columns/cards:

- Recipient
- Channel
- Template
- Message
- Created
- Scheduled
- Status
- Simulated

Statuses:

- QUEUED
- SIMULATED
- SKIPPED
- FAILED_SIMULATION

Allow configurable simulated failure rate only in demo/testing.

Clearly label:

> **SIMULATED — no real message was sent**

---

# 48. Demo Payment System

For demo:

- Create payment record
- Method
- Amount
- Date
- Reference
- Notes

No actual payment processing.

Clearly label demo mode.

---

# 49. Design Themes

Start with:

- Light theme

Optional:

- Dark theme

If dark mode is built:

- Use same semantic tokens
- Do not create duplicate component styles

---

# 50. Charts

Use charts only where they answer a question.

Useful charts:

- Attendance trend
- Progress trend
- Member states
- Intervention outcomes
- Feedback trend
- Trainer outcome trend
- Gym occupancy trend

Avoid decorative charts.

Always show numeric values alongside important charts.

---

# 51. Recommended Dashboard Structure

## Owner Dashboard

Top:

- Members needing attention
- At-risk
- Progressing
- Renewal value at risk

Middle:

- Attention priority
- Trainer actions
- Member state distribution
- Experience issues

Bottom:

- Intervention outcomes
- Feedback
- Equipment issues
- Opportunities

## Trainer Dashboard

Top:

- Need attention today
- Reassessments due
- Overdue actions
- Milestones

Main:

- Priority member queue

Secondary:

- Today's follow-ups
- Progress reviews
- Member feedback

## Reception Dashboard

Top:

- Visitors
- Renewals
- Requests
- Open issues

Main:

- Today's worklist

---

# 52. Business Impact Tracking

For demo, calculate simple estimated values.

Examples:

- Renewal revenue at risk
- Renewal revenue recovered
- PT opportunity value
- Intervention recovery count

Do not claim predictive financial accuracy.

Label estimates clearly.

---

# 53. Rule Configuration

Admin should eventually be able to configure thresholds.

Example:

Attendance decline threshold:

- Default: 40%

No-visit alert:

- Default: 7 days

Trainer contact gap:

- Default: 21 days

Plateau period:

- Default: 4 weeks

For first demo, defaults can be seeded.

---

# 54. System Logs

Keep basic logs for:

- Application error
- Worker/rules execution
- Simulator sends
- Scheduled jobs

Do not expose sensitive data in logs.

---

# 55. Background Jobs

Use local scheduled worker/process.

Tasks:

- Recalculate member states
- Generate attention items
- Check overdue actions
- Generate onboarding tasks
- Generate renewal opportunities
- Process simulated messages
- Generate follow-up reviews

For demo, allow:

- Run automatically
- Run manually using "Run intelligence now"

This makes demos easy.

---

# 56. Testing

Required automated areas:

- Role permissions
- Member state rules
- Attention generation
- Duplicate prevention
- Intervention completion
- Outcome calculations
- Progress calculations
- Onboarding tasks
- Feedback escalation
- Equipment issue workflow
- Simulator behavior
- Tenant isolation/readiness

---

# 57. Responsive QA

Test every major page at:

- 320
- 360
- 390
- 430
- 768
- 1024
- 1440
- 1920

Check:

- No horizontal overflow
- Menus fit
- Dropdowns fit
- Filters work
- Cards do not clip
- Tables convert properly
- Text wraps correctly
- Buttons remain tappable
- Modals fit
- Forms fit
- Navigation works

---

# 58. Functional QA

Every clickable element must work.

Test:

- Login
- Logout
- Navigation
- Search
- Filters
- Add
- Edit
- Save
- Cancel
- Delete/archive
- Assign
- Complete action
- Add outcome
- Add progress
- Feedback
- Equipment issue
- Mobile menu
- Mobile filters
- Role restrictions
- Simulator pages
- Error states
- Empty states

No dead buttons.

---

# 59. Demo Mode Indicator

The app should visibly show:

> **DEMO MODE**

In demo mode:

- Messaging simulated
- Email simulated
- Payments recorded only
- Floor occupancy simulated
- Equipment data can be simulated
- No real external communication

---

# 60. Build Phases

## Phase 1 — Foundation

Build:

- App shell
- Design system
- Responsive layout
- Auth
- Roles
- Database
- Seed
- Demo mode
- Audit base

## Phase 2 — Members

Build:

- Member list
- Member detail
- Membership
- Attendance
- Notes
- Member preferences

## Phase 3 — Progress

Build:

- Goals
- Assessments
- Metrics
- Progress history
- Milestones

## Phase 4 — Intelligence

Build:

- Member state engine
- Rules
- Attention queue
- Priorities
- Recommended actions

## Phase 5 — Trainer Actions

Build:

- Trainer dashboard
- Interventions
- Assignment
- Completion
- Follow-up

## Phase 6 — Outcomes

Build:

- Outcome tracking
- Before/after comparisons
- Intervention effectiveness
- Owner summary

## Phase 7 — Member Journey

Build:

- 30/60/90 journey
- Onboarding tasks
- Reassessments

## Phase 8 — Experience

Build:

- Micro feedback
- Complaints
- Member preference
- Pain/discomfort
- Escalations

## Phase 9 — Gym Floor

Build:

- Zones
- Occupancy simulator
- Equipment
- Issues
- Maintenance

## Phase 10 — Reception

Build:

- Worklist
- Visitors
- Trials
- Renewals
- Handover

## Phase 11 — Community

Build:

- Groups
- Challenges
- Participation

## Phase 12 — Final Demo

Build:

- Realistic seed data
- Simulator data
- Demo walkthrough
- Complete responsive QA
- Complete functional QA

---

# 61. Demo Story

Prepare a demo gym with realistic scenarios.

Example flow:

## Scenario 1 — Declining member

1. Aman normally visits 4×/week
2. Drops to 1–2×/week
3. State engine marks DECLINING
4. Attention item created
5. Trainer Ravi assigned
6. Ravi records check-in
7. Program modified
8. Follow-up created
9. Attendance improves
10. Outcome = IMPROVED
11. Owner sees successful intervention

## Scenario 2 — Beginner onboarding

1. Priya joins
2. Goal captured
3. Assessment completed
4. First workout
5. Week 1 check-in
6. Progress review
7. Milestone
8. Member sees progress

## Scenario 3 — Poor experience

1. Member rates session Poor
2. Reason: Too crowded
3. Manager receives alert
4. Floor data shows recurring 7–8 PM issue
5. Owner sees trend

## Scenario 4 — Equipment issue

1. Member reports broken cable machine
2. Issue opened
3. Manager acknowledges
4. Status updated
5. Issue resolved
6. Resolution time tracked

---

# 62. What Not to Build Yet

Do not spend time or money on:

- Real WhatsApp API
- Real SMS
- Real email provider
- Payment gateway
- Cloud storage
- Paid AI APIs
- Face recognition
- Biometrics
- Smart-equipment hardware integrations
- External CRM
- Native mobile apps
- Complex social feed
- Medical diagnosis
- Advanced machine-learning predictions

First prove the workflow and value.

---

# 63. Future Integration Readiness

Keep interfaces ready for later:

- MessagingProvider
- EmailProvider
- PaymentProvider
- StorageProvider
- AIProvider
- EquipmentProvider
- AccessControlProvider

Demo implementations:

- SimulatorMessagingProvider
- SimulatorEmailProvider
- ManualPaymentProvider
- LocalStorageProvider
- RuleBasedIntelligenceProvider
- SimulatorEquipmentProvider

---

# 64. Success Criteria for the First Demo

The first demo is successful when:

- App runs locally without paid services
- Every major workflow works
- Design is consistent
- Mobile is fully usable
- No horizontal overflow
- Role permissions work
- Demo data is realistic
- State engine identifies members
- Attention queue works
- Trainer can complete interventions
- Outcomes are measurable
- Member can see progress
- Owner gets action-focused insights
- Feedback creates actionable issues
- Equipment/floor demo works
- All simulated external actions are clearly labeled
- No dead links/buttons
- No unfinished core screens
- No fake hardcoded dashboard numbers

---

# 65. Final Product Principle

The product should not feel like:

> **Software where staff enter data.**

It should feel like:

> **A system that understands what is changing inside the gym and tells the right person what deserves attention.**

The central promise:

> **Make every member feel known, guided and progressing — while giving trainers and owners clear next actions.**

---

# 66. Final Build Rule

Before adding any new feature, ask:

1. Does this help the member progress?
2. Does this help staff know who needs attention?
3. Does this make a trainer more effective?
4. Does this improve the gym experience?
5. Does this help the owner make a better decision?
6. Can we measure the result?

If the answer is no to all six, it is probably not important for the first product.

