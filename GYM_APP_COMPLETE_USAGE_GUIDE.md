# Gym Intelligence App — Complete Usage Guide

This is a practical guide to the finished local demo. It describes the pages, buttons, forms, roles, and workflows that are in the app now.

## 1. App Overview

Gym Intelligence helps a gym turn ordinary member records into clear follow-up work.

Main flow:

`Member Data → Progress → Intelligence → Attention → Intervention → Follow-Up → Outcome → Owner Insight`

- **Member Data** stores membership, visits, trainer, preferences, notes, and activity.
- **Progress** stores goals, metrics, assessments, reviews, and milestones.
- **Intelligence** turns these records into a member state and explainable alerts.
- **Attention** is the shared list of things that need action.
- **Intervention** is the assigned staff action with a due date and action record.
- **Follow-Up** is recorded when completing an intervention.
- **Outcome** compares before/after evidence after the intervention.
- **Owner Insight** shows the operational picture on the owner dashboard and outcomes pages.

Supporting areas are the 90-day **Member Journey**, **Experience & Feedback**, **Gym Floor & Equipment**, **Reception**, **Community**, **Notifications**, and **Training Center**.

## 2. Demo Accounts

All accounts use password **`demo123`**.

| Role | Email | Main responsibility |
| --- | --- | --- |
| Owner | `owner@demo.gym` | Full operating view, decisions, settings, and training reset |
| Manager | `manager@demo.gym` | Day-to-day operations, assignment, member management |
| Trainer | `trainer@demo.gym` | Assigned members, actions, progress, and follow-through |
| Reception | `reception@demo.gym` | Visitors, renewals, member lookup, requests, and handovers |
| Member | `member@demo.gym` | Private membership, progress, journey, feedback, and community |

## 3. Login & Role Access

1. Open `/login`.
2. Enter one of the email addresses above and `demo123`.
3. Use **Enter demo** if shown to populate a demo account quickly.
4. Use **Logout** in the header to end the session.

| Role | Landing page | Main navigation |
| --- | --- | --- |
| Owner | `/` | Dashboard, Attention, Members, Trainer actions, Outcomes, Journeys, Experience, Floor, Reception, Community, Notifications, Reports, Staff, Training Center, Settings |
| Manager | `/` | Same operational pages as Owner, except Settings |
| Trainer | `/trainer` | My actions, My members, Journeys, Floor, Community, Notifications, Training Center |
| Reception | `/reception` | Reception, Member lookup, Floor, Notifications, Training Center |
| Member | `/member` | My dashboard, My community, Training Center |

Pages are protected on the server. Opening a restricted URL redirects to `/forbidden`; a member attempting to open another member profile receives no record. Hidden navigation is not the only protection.

## 4. Owner Guide

### Decision Dashboard — `/`

**Purpose**

- See what needs attention across the gym.

**Main sections**

- Headline counts for interventions, priority members, reassessments, and overdue work.
- Attention and intervention work, outcome/effectiveness context, and quick links into member records.

**Main actions**

- Open an alert, member, or action from its card/list.
- Use dashboard links to continue the workflow instead of guessing a URL.

**What happens next**

- You move into Attention, a member profile, an intervention, or Outcomes.

**What to review**

- Counts should be based on current demo records, not static numbers.
- Open items should have a visible reason, priority, and owner.

### Attention — `/attention`

**Purpose**

- Review explainable intelligence alerts before deciding what staff should do.

**Main sections**

- Search and filters for member/trainer, priority, state, role, and open/closed status.
- Deterministic intelligence results with reason, recommended action, due date, priority, and assignment context.

**Main actions**

- Run the available intelligence action when shown.
- Open the linked member or create/open the related intervention.

**What happens next**

- An attention item becomes staff-owned intervention work. Re-running intelligence updates/deduplicates active alerts rather than making repeated copies.

**What to review**

- Verify every alert has a useful reason and next action.

### Members — `/members`

**Purpose**

- Search, filter, and manage member records.

**Main sections**

- Member search/filter controls, list/card view toggle, member state and membership details.
- **Add member** form for Owner and Manager.

**Main actions**

- Search by member name; filter the list; open a member.
- Add a member with full name, email, phone, goal, membership plan, and optional trainer.

**What happens next**

- A saved member receives a membership, preference record, activity entry, and an initial journey when eligible.

**What to review**

- Verify new members appear in search and their membership/trainer details are correct.

### Member Profile — `/members/[id]`

**Purpose**

- One operational record for a member.

**Main sections**

- Profile header and state badge.
- **Membership**, **Attendance**, **Trainer & preference**, **Staff notes**, **Edit profile**, and **Activity timeline**.
- Links to **View progress**, **Intelligence summary**, **Intervention history**, **Outcome history**, **90-day journey**, and **Experience & feedback**.

**Main actions**

- Record visit; assign/reassign trainer; save attention preferences; add a staff note.
- Owner/Manager can edit basic profile fields or cancel membership.

**What happens next**

- Changes appear in the activity timeline and can affect future intelligence rules.

**What to review**

- Check the history explains who changed what. The contact choices marked WhatsApp/SMS/Email are simulators; no message is delivered.

### Progress — `/members/[id]/progress`

**Purpose**

- Record and review evidence of change.

**Main sections**

- Goal/metric trend, milestones, assessment history, and progress reviews.
- Staff forms: **Add goal**, **Record metric**, **Assessment**, **Progress review**, and **Add milestone**.

**Main actions**

- Add a focused goal; record a matching metric; save an assessment or review.

**What happens next**

- Records become visible in history and give intelligence/outcome evaluation evidence.

### Intelligence, interventions, outcomes, journey, and experience — member links

**Purpose**

- Use these links to understand the member’s alert reasons, action history, measured results, onboarding checkpoints, and feedback/support records.

**What to review**

- Follow the links in order: intelligence reason → intervention → outcome.

### Trainer actions — `/trainer`

**Purpose**

- Manage intervention work across the gym.

**Main sections**

- Priority/due/status filters, action queue, reassessments, milestones, and **Create planned intervention**.

**Main actions**

- Search/filter actions, open an action, start it, or create a planned intervention.

**What happens next**

- The intervention can be assigned, completed with a follow-up, then evaluated as an outcome.

### Outcomes — `/outcomes` and `/outcomes/effectiveness`

**Purpose**

- Review due outcomes and owner/manager effectiveness evidence.

**Main sections**

- Outcome queue, result/status filters, and the effectiveness page for staff/evaluator/type/result views.

**Main actions**

- Open an intervention outcome; confirm or adjust the suggested result with a reason and business-impact fields where available.

**What happens next**

- The evaluated outcome updates the intervention/attention context and can recalculate member state.

### Member journeys — `/journeys`

**Purpose**

- See the onboarding work due across new members.

**Main sections**

- Search, stage, status, risk, and trainer filters; task counts and overdue indicators.

**Main actions**

- Complete a task with notes; Owner/Manager can pause or cancel a journey.

### Experience — `/experience`

**Purpose**

- Review feedback, complaints, and discomfort follow-up safely.

**Main sections**

- Experience queue, complaint/escalation details, and staff follow-up controls.

**Main actions**

- Review and resolve staff-visible records. Do not treat discomfort as diagnosis; it is a non-medical follow-up record.

### Gym floor — `/floor`

**Purpose**

- View zones, equipment, reports, and maintenance.

**Main sections**

- Simulated occupancy cards, equipment availability, issue form, and open issue/maintenance list.

**Main actions**

- Owner/Manager can set a zone occupancy with **Simulate**, resolve an issue, and optionally return equipment to available.

**What to review**

- All occupancy is clearly labelled **SIMULATED FLOOR DATA**. It is not sensor or camera data.

### Reception — `/reception`

**Purpose**

- Monitor visitors, trials, renewals, requests, access problems, and shift handover.

**Main actions**

- Mark an expected visitor **Arrived**; add a visitor; add/acknowledge a handover; open a renewal/member lookup record.

### Community — `/community`

**Purpose**

- View accountability groups, upcoming activities, staff updates, and attendance challenges.

**Main actions**

- Owner/Manager/Trainer can refresh stored attendance challenge progress. Members can join/leave open groups.

### Notifications — `/notifications`

**Purpose**

- View internal local reminders for outcomes, declines, overdue work, and escalations.

**Main actions**

- Use **Open** when provided to open the related intervention/outcome.

### Settings — `/settings`

**Purpose**

- Owner-only reference for the local demo’s external-service boundaries.

**What to review**

- Messaging/email are simulated, payments are manual records only, and storage/intelligence are local.

### Reports — `/reports`

**Purpose**

- Owner-only, action-focused summaries based on real local database records.

**Main sections and actions**

- Use date range, member-state, and assigned-role filters.
- Review Member State, Attention, Intervention Outcome, Trainer Activity, Renewal, and Experience/Complaint summaries.
- Open a renewal member link to continue the appropriate member workflow.

### Staff management — `/staff`

**Purpose**

- Owner-only local account management for the first gym trial.

**Main actions**

- Create a Manager, Trainer, or Reception account with name, email, role, and a temporary local password.
- Search/filter staff; edit name, email, role, active status, or password.
- Inactive accounts cannot sign in. The primary Owner account is protected from role/status changes on this page.
- Roles remain enforced by the fixed server-side permission matrix; this page does not offer custom permission editing.

### Training Center — `/training`

- See section 20. Owner can start every scenario and reset training data.

## 5. Manager Guide

Manager uses the same decision dashboard and operational pages as Owner: Attention, Members, Trainer actions, Outcomes, Journeys, Experience, Floor, Reception, Community, Notifications, and Training Center.

- Manage member records, assignments, intervention due dates/priorities/status, journeys, floor simulations, and handovers.
- Use intervention detail to **Assign / reassign** a trainer or **Update action**.
- Review complaint/escalation and experience work without exposing it to Reception or members.
- Managers **cannot open Settings**. Only Owner has the settings page.
- Managers can reset Training Center progress and tagged training scenario data.

## 6. Trainer Guide

### My actions — `/trainer`

- This is the Trainer landing page.
- It shows only work assigned to the signed-in trainer and only that trainer’s members for member-driven lists.
- Use filters, open an action, then choose **Start** or **Open**.
- Use **Create planned intervention** for a member you are allowed to work with: member, type, due date, reason, and recommended action are required.

### Intervention detail — `/trainer/interventions/[id]`

- Review member context, current state, goal, recent visits, metric, assigned staff, due date, and source rule.
- Click **Start intervention**.
- Open **Record action and complete**. Required field: **Action taken**. Optional fields: member response, follow-up date, completion notes, resolution summary, and interaction type.
- Click **Record action**. The intervention has a durable interaction history and may move to follow-up/outcome work.

### My members and progress

- Open `/members`, then a permitted profile. Trainers see assigned members, can record a visit, save relevant preferences, add staff notes, and use the progress forms.
- On Progress, record goals, metrics, assessments, reviews, and milestones. This gives the next outcome evaluation useful evidence.

### Journeys, floor, community, notifications

- `/journeys`: complete assigned journey tasks with notes.
- `/floor`: report equipment issues; view operational status. Trainer cannot simulate occupancy or resolve as a manager.
- `/community`: see groups and refresh attendance challenge progress.
- `/notifications`: read team reminders that are targeted to the trainer or the gym team.

Trainer workflow:

`See member needing attention → understand why → open member → start intervention → record action → schedule follow-up → review outcome`

Trainers cannot access Settings, Reception, owner dashboard decision view, staff-wide Attention page, or unassigned member records.

## 7. Reception Guide

### Reception operations — `/reception`

**Purpose**

- A today-first front-desk worklist.

**Main sections**

- Visitors today, trials today, renewals due, open requests, access issues, handovers.
- Previous shift handover, Today’s visitors, Quick actions, Renewals & member lookup, Requests/access/floor.

**Main actions**

- Click **Arrived** for an expected visitor.
- Use **Add visitor**: Visitor name and expected date/time are required; choose Trial, Walk-in, Guest, Tour, or Consultation; notes are optional.
- Use **Add handover**: choose Morning/Afternoon/Evening, enter required note, choose Medium/High, then click **Add handover**.
- Click **Acknowledge** on another person’s unresolved handover.

**Front-desk workflow**

`Trial visitor → Add visitor (Trial) → expected visit appears → Arrived → staff can see the arrival record and arrange the next real-world follow-up.`

`Previous shift handover → Acknowledge → handle the listed request/access/renewal → create the next handover if work remains.`

Reception can use safe Member lookup, Floor, Notifications, and Training Center. Reception cannot use Trainer actions, Attention, Outcomes, Experience queue, Settings, or private member notes/progress editing.

## 8. Member Guide

### My dashboard — `/member`

- Shows only the signed-in member’s membership, recent visits, primary goal, journey count, trainer, and private next-step links.
- Open **View my profile**, **My progress**, **My journey**, **Feedback & support**, or **My community**.

### My profile and linked pages

- **Membership / Attendance / Trainer & preference**: view own records and save personal attention/contact/trainer preferences.
- **My progress**: view goal trend, milestones, assessments, and reviews. Staff-only entry forms are not shown to a member.
- **My journey**: view checkpoint status and milestone information; staff completion controls are not shown.
- **Feedback & support**: submit feedback or non-medical discomfort support requests where available on the member experience page.
- **My community**: join/leave open groups and view only personal challenge progress.

Members do **not** see internal risk state reasoning, staff notes, Attention, interventions, outcomes, other members, Reception, Floor operations, Notifications, or admin data.

## 9. Members Module

The profile is connected by links, not browser-style tabs.

| Area | What it shows | Connection |
| --- | --- | --- |
| Overview | Name, contact, goal, visible state | Starting point for every workflow |
| Membership | Plans, dates, amount, status | Renewal and member status context |
| Attendance | Recent visit count and last visit | Can trigger attendance intelligence |
| Trainer & preference | Assigned trainer and contact/support preferences | Guides appropriate follow-up |
| Progress | Goals, metrics, assessments, reviews, milestones | Evidence for intelligence and outcomes |
| Intelligence | State, reasons, recommended action | Opens Attention/intervention work |
| Interventions | Member action history | Shows follow-through and follow-up |
| Outcomes | Evaluated results | Shows whether work helped |
| Journey | 0–90 day checkpoints | Keeps onboarding work visible |
| Experience | Feedback, complaints, discomfort follow-up | Routes serious signals safely |
| Activity timeline | Recorded changes and actors | Audit-style operational context |

## 10. Forms Guide

Only forms implemented in the app are listed below.

| Form | Where / who | Required fields | After save |
| --- | --- | --- | --- |
| Add member | `/members`, Owner/Manager | Full name, email, phone, goal, membership plan | Creates member, membership, preference/activity records |
| Edit profile | member profile, Owner/Manager | Full name, email, phone, goal | Updates profile and activity history |
| Record visit | member profile, Owner/Manager/Trainer | None beyond selected member | Adds attendance evidence |
| Assign trainer | member profile, Owner/Manager | Trainer selection | Updates assignment/history |
| Attention preference | member profile; own member or permitted staff | Preference selections | Saves preferred support/contact choices |
| Add staff note | member profile, Owner/Manager/Trainer | Note body | Adds staff-only note/history |
| Add goal | Progress, Owner/Manager/Trainer | Title | Adds goal; starting/target/unit/date are optional |
| Record metric | Progress, Owner/Manager/Trainer | Metric, value, unit, date | Adds trend evidence |
| Assessment | Progress, Owner/Manager/Trainer | Date | Saves assessment; other values/notes optional |
| Progress review | Progress, Owner/Manager/Trainer | No fixed required text field | Saves review and optional next review date |
| Add milestone | Progress, Owner/Manager/Trainer | Type, title | Adds a manual milestone |
| Create planned intervention | Trainer actions, permitted staff | Member, due date, reason, recommended action | Creates assigned/actionable work |
| Record action | intervention detail, permitted staff | Action taken | Records interaction, completion, optional follow-up |
| Assign/reassign / update action | intervention detail, Owner/Manager | Selection/action settings | Changes assignment or status/due date/priority |
| Feedback | member experience, own member/permitted staff | Feedback type and rating | Stores feedback; serious/repeated signals can escalate |
| Discomfort report | member experience, own member/permitted staff | Body area, description, severity | Stores non-medical follow-up record |
| Report equipment issue | Floor, staff | Equipment, issue, severity, description | Creates operational issue; safety may change availability |
| Resolve equipment issue | Floor, Owner/Manager | Resolution notes | Closes issue; can return equipment to available |
| Add visitor | Reception, Owner/Manager/Reception | Visitor, expected date/time | Creates expected visitor/trial record |
| Add handover | Reception, Owner/Manager/Reception | Handover note | Creates next-shift record |
| Create staff account | `/staff`, Owner | Name, email, role, temporary password | Creates active Manager, Trainer, or Reception login |
| Edit staff account | `/staff`, Owner | Name, email, role, status; password optional | Saves account changes; inactive staff are blocked from sign-in |

There is no implemented form to create community groups/challenges, a payment transaction, custom role/permission rules, or a separate member request. Do not promise these in a gym demo.

## 11. Intelligence Guide

- **Member State** is the current operational picture based on stored member data. The app uses states such as **Onboarding**, **At risk**, **Declining**, **Plateau**, **Progressing**, and related normal/opportunity cases when the rules support them.
- **Attention** is a concrete alert: why it matters, priority, recommended action, owner/role, and due date.
- The rules use durable facts such as visits, membership dates, missing assessments, progress, reviews, and onboarding timing.
- **Run Intelligence Now**, where presented, evaluates the current records and creates/updates relevant attention work.
- Active alerts use a deterministic key so repeat runs do not create duplicate open alerts for the same issue.
- State history is preserved through member activity and the durable alerts/actions/outcomes that explain change.

Example: the seeded training scenario member **Aman — Declining Training Member** has a 12-day attendance gap. The alert explains the gap and recommends a trainer check-in instead of showing a vague risk score.

## 12. Intervention Guide

An intervention is a specific piece of staff work created from Attention or planned manually.

1. Open an alert/member, or use **Create planned intervention**.
2. Set the member, type, reason, recommended action, priority/due date when those controls are available.
3. Owner/Manager can assign/reassign a trainer.
4. Trainer opens the action and clicks **Start intervention**.
5. Trainer records **Action taken**, optional response and completion notes, and optional follow-up date.
6. The action history and assignment history retain the work record.
7. When enough time/data exists, evaluate an outcome instead of treating completion as proof of success.

Example: “Trainer check-in” for a member whose visits dropped. The trainer agrees a return plan, records it, sets a follow-up, then later compares attendance before/after.

## 13. Outcome Guide

Intervention completion means staff did the work. An **Outcome** means staff checked whether it made a difference.

- **Before**: stored attendance/progress/membership context at evaluation start.
- **After**: the comparable current data.
- **Suggested result**: transparent rule-based suggestion, not an automatic claim.
- **Staff confirmation**: staff confirms or adjusts the result with context.
- Results include **Improved**, **Partially improved**, **Unchanged**, **Declined**, and **Insufficient data**.

After evaluation, the result is kept with the intervention and can update attention/intervention/member-state context. Review the Owner/Manager effectiveness view to see the pattern across work, rather than relying on one completed checkbox.

## 14. Member Journey Guide

The automatic 90-day journey supplies checkpoints at:

- **Day 0** — welcome and setup.
- **Day 1–3** — first workout/early support.
- **Week 1** — early attendance and baseline follow-through.
- **Week 2** — check momentum and missing assessment/workout.
- **Day 30** — first review.
- **Day 60** — continued review.
- **Day 90** — longer-term review.

Staff open `/journeys` or the member’s **90-day journey** link. Complete a task with notes. Owner/Manager can pause/cancel a journey. Open/assigned tasks that pass their due date become overdue; the journey/rules can surface that risk for attention and intervention follow-through.

## 15. Experience & Feedback Guide

- **Micro feedback** captures a simple rating, reason, and optional free text.
- Negative, repeated-negative, trainer, safety, and pain/discomfort signals are handled as operational records, not medical conclusions.
- A serious or repeated negative signal can create a complaint, attention item, intervention, and local internal notification.
- **Trainer complaints** and confidential fields are restricted to appropriate staff visibility.
- **Safety complaints** are escalated more urgently.
- **Pain/discomfort** creates a non-medical follow-up record; do not use the app to diagnose or prescribe treatment.
- **Attention preferences** on the profile record how a member wants support, including no interruption during workout.

## 16. Gym Floor & Equipment Guide

`/floor` is a staff-only operational page.

- **Floor zones** show capacity, current occupancy, busy state, and equipment context.
- **Occupancy simulator**: Owner/Manager changes the count with **Simulate**. It is manual, local, and clearly simulated.
- Busy levels include normal/busy/very busy context; they are not live sensors.
- **Equipment availability** lists asset status and open issues.
- **Report equipment issue** creates a durable problem record.
- **Unsafe/critical equipment** is not shown as normally available; Owner/Manager can resolve it and decide whether to return it to available.
- **Maintenance** shows due or overdue work.

Members do not have a floor page in this finished app. Floor visibility is for Owner, Manager, Trainer, and Reception.

## 17. Reception Guide

Reception is fully described in section 7. The key connected worklists are:

- **Visitor / Trial**: expected visitor → Arrived.
- **Renewal**: expiring membership → member lookup → staff follow-up outside the demo if needed.
- **Request / Access issue**: visible operational queue for the front desk.
- **Floor alerts**: compact status context without manager controls.
- **Handover**: previous shift note → acknowledge → resolve/continue → create next shift note.

Trainer availability is not a separate implemented reception page, and a trial does not contain a dedicated trainer-assignment form in the app. Use the visitor record and normal staff coordination instead.

## 18. Community Guide

`/community` is consent-based accountability, not a social-media feed.

- View active/upcoming **Groups**, capacity, activities, staff updates, and challenges.
- A member can **Join group** or **Leave group** for an open group.
- Challenges show each member only their own stored progress.
- Staff can refresh challenge progress from attendance.
- There is no public comparison table, open social feed, training-partner preference setting, group creator, or recommendation engine in the finished app.

## 19. Notifications Guide

`/notifications` is for Owner, Manager, Trainer, and Reception.

- Shows local in-app reminders for outcome checks, improvements/declines, overdue work, and escalations.
- The page displays notifications addressed to the signed-in user plus gym-wide notifications.
- Use **Open** when a notification has a linked intervention record.
- There is no implemented read/unread control or external email/SMS delivery.

## 20. Training Center Guide

Open `/training` from the sidebar.

- **Owner Training**, **Manager Training**, **Trainer Training**, **Reception Training**, and **Member Training** teach each role’s real workspace.
- **Full Gym Scenario** and **Practice Gym Demo** are cross-role scenarios available to Owner/Manager.
- Each scenario has a progress bar, guided step, **Open page** link, Back/Skip/Next/Finish controls, and persisted progress.
- **Learning checklist** reflects saved training progress.
- The header **How this works** control opens page help and terminology definitions.
- The gold **TRAINING MODE** pill means a scenario is active. The green **DEMO MODE** pill identifies the local demo/simulators.
- Owner/Manager can use **Reset Training Data**. It resets training progress/events and tagged training records; it does not delete normal operational demo data.

Recommended order: Member Training → Trainer Training → Reception Training → Manager Training → Owner Training → Full Gym Scenario → Practice Gym Demo.

## 21. Full Gym Scenario

This walkthrough uses the real seeded training case **Aman — Declining Training Member**. Start the relevant Training Center scenario first; it creates/refreshes the tagged training record safely.

| Step | Page | Action | Expected result |
| --- | --- | --- | --- |
| 1 | `/login` | Sign in as Owner | Owner dashboard opens |
| 2 | `/` | Review dashboard attention/action context | A declining/attention case is visible |
| 3 | `/attention` | Find Aman’s attendance-related alert | Reason explains dropped attendance and recommended trainer check-in |
| 4 | Member link | Open Aman’s profile | Membership, attendance, trainer, preferences, and history are visible |
| 5 | Progress link | Review visits/goals/metrics/assessments | You can explain the evidence, not just the state badge |
| 6 | Attention or `/trainer` | Create/open a Trainer check-in intervention | Action has reason, recommendation, and due date |
| 7 | Intervention detail | Assign Trainer Ravi if necessary | Assignment history records the change |
| 8 | `/login` | Sign in as `trainer@demo.gym` | Trainer lands in My actions |
| 9 | `/trainer` | Open Aman’s action and click **Start intervention** | Status becomes in progress/history is retained |
| 10 | Intervention detail | Expand **Record action and complete** | Action form is available |
| 11 | Intervention detail | Enter required **Action taken**, optional response/follow-up | Follow-up date can be scheduled |
| 12 | Intervention detail | Click **Record action** | Interaction and completion/follow-up are stored |
| 13 | Member Progress | Add a later visit/metric/review only if demonstrating new evidence | The record appears in history |
| 14 | `/outcomes` | Open the due outcome and evaluate it | Before/after evidence and suggested result are visible |
| 15 | Attention / intelligence action | Re-run intelligence only when needed | Existing active alert is updated/deduplicated, not copied |
| 16 | Member profile | Review state and activity | State/context reflects the available evidence |
| 17 | `/login` | Sign in as Owner again | Decision dashboard opens |
| 18 | `/` or `/outcomes/effectiveness` | Review dashboard/outcome view | Owner sees the recorded operational result |

For a clean repeat, Owner/Manager can reset only the Training Center data. Do not use training reset as a full business-demo reset.

## 22. Practice Gym Demo

Use this short story when showing the product:

1. **Owner dashboard** — “This is the gym’s current follow-through picture.”
2. **Declining member** — “Here is a member whose visits have dropped, with the reason visible.”
3. **Intelligence reason** — “The app uses stored visits/progress, not unexplained scores.”
4. **Trainer action** — “The trainer owns a dated action and records what actually happened.”
5. **Outcome** — “Completion is not success; we check before/after evidence.”
6. **Member progress** — “Goals, metrics, assessment, and review records make the evidence useful.”
7. **Reception** — “The front desk handles visitors, renewals, access issues, and handovers.”
8. **Experience feedback** — “Feedback and safety concerns have safe follow-up paths.”
9. **Gym Floor** — “Floor/equipment records are operational; occupancy is clearly simulated.”
10. **Member app** — “Members see their own private progress and community, not internal staff work.”
11. **Training Center** — “New staff can practice the real workflow without new permissions.”

## 23. Review Checklist

### Owner / Manager

- [ ] Dashboard data has a visible source record.
- [ ] Attention opens a real member/action.
- [ ] Member add/edit, trainer assignment, visit, and preferences save.
- [ ] Intervention assignment and outcome flow works.
- [ ] Journey tasks, Experience records, Floor issue, Reception handover, and Notifications open correctly.
- [ ] Training reset only resets training data.

### Trainer

- [ ] Assigned members and actions are visible.
- [ ] Unassigned member data is blocked.
- [ ] Start intervention and Record action work.
- [ ] Follow-up date and progress records save.
- [ ] Journey completion, equipment report, community, and notifications work.

### Reception

- [ ] Visitor can be added and marked Arrived.
- [ ] Renewal/member lookup opens the correct member.
- [ ] Handover can be created and acknowledged by another user.
- [ ] Restricted operational pages remain blocked.

### Member

- [ ] Own dashboard/profile/progress/journey load.
- [ ] Other member records are blocked.
- [ ] Community join/leave and personal challenge view work.
- [ ] Internal queues, notes, interventions, and admin pages remain blocked.

### Responsive and simulator checks

- [ ] Test 320, 360, 390, 430, 768, 1024, 1440, and 1920px.
- [ ] No horizontal scroll; filters, menu, forms, cards, and dropdowns fit.
- [ ] Messaging, email, payments, and occupancy are presented as simulated/manual/local only.

## 24. Troubleshooting

### Local PostgreSQL is not running

```bash
npm run db:local:start
```

The project uses its local PostgreSQL database on port `5434`.

### Cannot log in or login fails after a preview restart

- Confirm the database command above ran.
- Start the app with the command in section 25.
- Use an exact demo email and password `demo123`.

### Demo data is missing or needs a full reseed

```bash
npm run db:seed
```

This resets/recreates local demo business scenarios. Use it only when a full local demo reseed is intended.

### Member profile says it is not linked

- The seeded `member@demo.gym` account is linked to a member profile.
- If a separately created account shows this message, an Owner/Manager must link/create its matching member record; there is no self-service link screen.

### Training scenario is already complete

- Select **Start again** for that scenario, or ask Owner/Manager to use **Reset Training Data** in Training Center.

### Preview shows missing Next.js files after a production build

- Stop and restart the dev server. A production build refreshes `.next`, so an already-running development server can hold stale chunk references.

## 25. Run Commands

From the project folder:

```bash
# Start project-local PostgreSQL (port 5434)
npm run db:local:start

# Start the preview
npm run dev -- --hostname 0.0.0.0 --port 3001

# Recreate the full local demo data when intentionally resetting the demo
npm run db:seed

# Quality checks
npm run typecheck
npm test
npm run lint
npm run build
```

Training reset is available in the **Training Center** to Owner and Manager. It is intentionally not a shell command and does not reseed the entire application.
