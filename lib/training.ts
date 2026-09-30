import type { Role } from "@/lib/permissions";

export type TrainingStep = { title: string; explanation: string; lookAt: string; action: string; href: string; validation?: "attention" | "intervention" | "visitor" | "feedback" | "group" | "outcome" };
export type TrainingScenario = { id: string; title: string; role: Role | "FULL"; description: string; estimate: number; steps: TrainingStep[]; next?: string };

const steps = (items: Array<[string, string, string, string, string, TrainingStep["validation"]?]>): TrainingStep[] => items.map(([title, explanation, lookAt, action, href, validation]) => ({ title, explanation, lookAt, action, href, validation }));

export const trainingScenarios: TrainingScenario[] = [
  { id: "owner", title: "Owner Training", role: "OWNER", description: "Learn to spot what needs attention across the gym.", estimate: 7, next: "full-gym", steps: steps([
    ["Read the owner dashboard", "This is the daily decision view.", "Attention totals and overdue work.", "Open the Attention queue.", "/attention"],
    ["Find Aman", "Aman is the known declining training member.", "A declining or at-risk member and the reason.", "Open Aman's attention item.", "/attention", "attention"],
    ["Review intervention work", "Staff work is tracked separately from the member state.", "Open and overdue actions.", "Open Trainer actions.", "/trainer"],
    ["Check outcomes", "Outcomes show what changed after an action.", "Items awaiting evaluation.", "Open Outcomes due.", "/outcomes"],
    ["Check experience signals", "Complaints need a recorded response.", "Complaint and escalation queue.", "Open Experience.", "/experience"],
    ["Check the gym floor", "Floor data is simulated; equipment records are operational.", "Busy zones and open issues.", "Open Gym floor.", "/floor"],
    ["Owner recap", "You can now identify the work that matters today.", "The relationship between attention, work, and outcomes.", "Mark this scenario complete.", "/training"],
  ]) },
  { id: "manager", title: "Manager Training", role: "MANAGER", description: "Practice assigning and following up important work.", estimate: 6, next: "owner", steps: steps([
    ["Review attention", "Start from work that needs an owner.", "Priority, reason, and recommended action.", "Open Attention.", "/attention", "attention"],
    ["Assign work", "A clear assignee prevents a missed follow-up.", "An unassigned or overdue intervention.", "Open Trainer actions and assign it.", "/trainer"],
    ["Review a complaint", "Experience issues should not close silently.", "Complaint status and recorded resolution.", "Open Experience.", "/experience"],
    ["Review floor issues", "Safety and equipment records require operational follow-through.", "Unsafe or out-of-service equipment.", "Open Gym floor.", "/floor"],
    ["Review a journey", "Onboarding work is time-bound.", "Overdue checkpoints.", "Open Member journeys.", "/journeys"],
    ["Manager recap", "Important work should be assigned, visible, and followed through.", "The owner and due date on each item.", "Mark this scenario complete.", "/training"],
  ]) },
  { id: "trainer", title: "Trainer Training", role: "TRAINER", description: "A mobile-friendly practice of completing member follow-through.", estimate: 6, next: "full-gym", steps: steps([
    ["Open My actions", "Your dashboard contains work assigned to you.", "High priority and due today items.", "Open My actions.", "/trainer"],
    ["Find Aman", "Aman's attendance trend needs a trainer response.", "The reason and recommended action.", "Open Aman's member profile.", "/members"],
    ["Review progress", "Use real member context before responding.", "Goal trend and last assessment.", "Open Aman's Progress page.", "/members"],
    ["Start an intervention", "Starting work makes ownership visible.", "A Start action on your assigned intervention.", "Start an intervention.", "/trainer", "intervention"],
    ["Record the result", "Brief, factual notes make the next step clear.", "Action taken and follow-up fields.", "Complete the intervention with a follow-up.", "/trainer"],
    ["Trainer recap", "You now know who needs you and how to close the loop.", "Next action and follow-up date.", "Mark this scenario complete.", "/training"],
  ]) },
  { id: "reception", title: "Reception Training", role: "RECEPTION", description: "Practice today's front-desk workflow without admin access.", estimate: 6, next: "manager", steps: steps([
    ["Open Reception", "This is a today-first operational worklist.", "Previous shift handover.", "Open Reception.", "/reception"],
    ["Review a handover", "A handover keeps the next shift informed.", "The previous shift note.", "Acknowledge it if it is not yours.", "/reception", "visitor"],
    ["Process a visitor", "Trials and guests should be recorded as they arrive.", "Today's expected visitors.", "Mark a visitor arrived.", "/reception", "visitor"],
    ["Find a member", "Membership timing informs a helpful front-desk conversation.", "Renewals and member lookup.", "Open a member record.", "/members"],
    ["Record a request", "Requests need a durable operational record.", "Requests, access, and floor panel.", "Create or review a request.", "/reception"],
    ["Reception recap", "You can handle today’s front-desk work without admin pages.", "The shift handover and open requests.", "Mark this scenario complete.", "/training"],
  ]) },
  { id: "member", title: "Member Training", role: "MEMBER", description: "Understand your progress, next steps, and feedback options.", estimate: 6, next: "trainer", steps: steps([
    ["Open My dashboard", "This private view contains only your information.", "Membership, recent visits, and goal.", "Open My progress.", "/member"],
    ["Review progress", "Goals and metrics show what is changing.", "Primary goal and recent trend.", "Open My progress.", "/member"],
    ["Check your journey", "Your next onboarding steps are time-bound.", "Open checkpoints and trainer.", "Open My journey.", "/member"],
    ["Give feedback", "Feedback is shared privately with the gym team.", "The quick feedback form.", "Submit useful feedback.", "/member", "feedback"],
    ["Join community", "Groups are opt-in and show personal progress only.", "Available groups and your challenges.", "Open My community.", "/community", "group"],
    ["Member recap", "You can understand your progress and your next step.", "Your trainer, goal, and support options.", "Mark this scenario complete.", "/training"],
  ]) },
  { id: "full-gym", title: "Full Gym Scenario", role: "FULL", description: "Follow Aman from attention to intervention, outcome, and owner insight.", estimate: 8, next: "practice-demo", steps: steps([
    ["Start with Aman", "Aman is the dedicated declining training member.", "Aman's attention reason.", "Open Attention as Owner or Manager.", "/attention", "attention"],
    ["Review his context", "Attendance, progress, and member state explain why he needs action.", "Aman's profile and progress.", "Open Aman's record.", "/members"],
    ["Create and assign work", "The intervention gives Trainer Ravi clear ownership.", "Intervention type, due date, and assignee.", "Create or assign an intervention.", "/trainer", "intervention"],
    ["Continue as Trainer Ravi", "Use the Trainer demo login to experience the real role.", "My actions.", "Log out and sign in as trainer@demo.gym.", "/login"],
    ["Complete follow-through", "Record what happened and schedule a follow-up.", "Action and follow-up information.", "Complete the intervention.", "/trainer"],
    ["Evaluate an outcome", "An outcome records the result; it does not claim causation.", "Before and after evidence.", "Return as Owner and open Outcomes.", "/outcomes", "outcome"],
    ["Check owner insight", "The owner sees the changed work and measured result.", "Dashboard and outcome totals.", "Return to the Owner dashboard.", "/"],
    ["Full scenario recap", "You practiced the complete member-to-owner loop.", "Member data → attention → action → outcome.", "Mark this scenario complete.", "/training"],
  ]) },
  { id: "practice-demo", title: "Practice Gym Demo", role: "FULL", description: "Rehearse a concise owner-facing product demonstration.", estimate: 7, next: "full-gym", steps: steps([
    ["Lead with the dashboard", "Show the daily decision view first.", "Members needing attention.", "Open the Owner dashboard.", "/"],
    ["Show a declining member", "Explain why the system surfaced Aman.", "Attendance and member state.", "Open Attention and Aman.", "/attention", "attention"],
    ["Show staff follow-through", "Show that insight becomes accountable work.", "Intervention status and trainer ownership.", "Open Trainer actions.", "/trainer", "intervention"],
    ["Show outcome measurement", "Show what changed after action.", "Outcome status and evidence.", "Open Outcomes.", "/outcomes", "outcome"],
    ["Show member experience", "Show that feedback becomes a follow-up record.", "Experience queue.", "Open Experience.", "/experience"],
    ["Show operations", "Show the floor and reception context.", "Equipment issues and reception work.", "Open Gym floor or Reception.", "/floor"],
    ["Demo recap", "You can now explain the end-to-end product story.", "One connected operational loop.", "Mark this scenario complete.", "/training"],
  ]) },
];

export const terminology = {
  "Member State": "A clear description of a member’s current pattern, such as progressing or at risk.",
  Attention: "A system-generated item showing that a member needs staff action.",
  Intervention: "The action a staff member takes to help with a member’s situation.",
  Outcome: "The measured result after an intervention.",
  Journey: "A time-based onboarding plan with practical checkpoints.",
  Plateau: "Progress has stalled and may need review.",
  "At Risk": "A member pattern suggests they may disengage without support.",
  Reassessment: "A scheduled review of goals, progress, or program fit.",
  "Follow-Up": "The next planned check after an action.",
  Milestone: "A meaningful progress point worth recording.",
  Advocate: "A member who is consistently positive and may support community growth.",
  "PT Opportunity": "A possible personal-training conversation based on a stated need.",
  "Renewal Opportunity": "A timely membership conversation before an end date.",
} as const;

export function scenarioFor(id: string) { return trainingScenarios.find((scenario) => scenario.id === id); }
export function canUseScenario(role: Role, scenario: TrainingScenario) { return ["OWNER", "MANAGER"].includes(role) || scenario.role === role || scenario.role === "FULL" && role === "OWNER"; }

export function pageHelp(path: string) {
  const page = path.startsWith("/attention") ? ["Attention", "Shows members who need action.", "Priority, state, reason, and recommended action.", "Open a member or intervention.", "Assigned staff follow through and later measure an outcome."] :
    path.startsWith("/trainer") ? ["Trainer actions", "Keeps trainer follow-through focused.", "Due, overdue, and high-priority member work.", "Start or complete an assigned intervention.", "A follow-up becomes available for outcome review."] :
    path.startsWith("/outcomes") ? ["Outcomes", "Records what changed after an intervention.", "Follow-up timing and before/after evidence.", "Evaluate the result with a short explanation.", "The dashboard reflects measured operational results."] :
    path.startsWith("/floor") ? ["Gym floor", "Tracks simulated occupancy and durable equipment records.", "Busy zones, safety, and maintenance issues.", "Report or resolve an equipment issue.", "The operational queue and audit record update."] :
    path.startsWith("/reception") ? ["Reception", "A today-first front-desk workspace.", "Visitors, handovers, renewals, requests, and access issues.", "Record the next operational action.", "The next shift has a durable handover."] :
    path.startsWith("/community") ? ["Community", "Opt-in groups and personal challenge progress.", "Available groups and upcoming activities.", "Join a group or review your own progress.", "Participation remains private and consent-based."] :
    path.startsWith("/member") || path.startsWith("/members") ? ["Member information", "Shows one member’s membership, progress, and support context.", "Goals, visits, state, and open follow-through.", "Open the relevant progress or experience view.", "Updates remain linked to that member’s record."] :
    path.startsWith("/experience") ? ["Experience", "Tracks feedback, complaints, and safe follow-up.", "Repeated or serious concerns.", "Record a resolution or follow-up.", "The concern remains traceable until resolved."] :
    ["Dashboard", "A daily decision view for this role.", "What is due, overdue, or needs attention.", "Open the relevant work queue.", "The assigned team member completes the next action."];
  return { title: page[0], purpose: page[1], lookAt: page[2], action: page[3], next: page[4] };
}
