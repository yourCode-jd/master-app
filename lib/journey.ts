import { db } from "@/lib/db";

export const journeyStages = ["DAY_0", "DAY_1_3", "WEEK_1", "WEEK_2", "DAY_30", "DAY_60", "DAY_90", "COMPLETED"] as const;
export const journeyStatuses = ["ACTIVE", "COMPLETED", "PAUSED", "CANCELLED"] as const;
export const taskStatuses = ["OPEN", "ASSIGNED", "COMPLETED", "OVERDUE", "SKIPPED", "CANCELLED"] as const;

export const defaultJourneyTemplate = [
  ["DAY_0", "WELCOME_MEMBER", "Welcome member", "Introduce the gym experience and confirm their first next step.", 0, "RECEPTION", true],
  ["DAY_0", "CAPTURE_GOAL", "Capture primary goal", "Confirm a clear primary goal and starting point.", 0, "TRAINER", true],
  ["DAY_0", "ASSIGN_TRAINER", "Assign trainer", "Make sure the member knows who to contact.", 0, "MANAGER", true],
  ["DAY_0", "BASELINE_ASSESSMENT", "Complete baseline assessment", "Capture safe relevant starting measurements.", 0, "TRAINER", true],
  ["DAY_1_3", "FIRST_WORKOUT", "Guided first workout", "Guide the first session and confirm equipment orientation.", 3, "TRAINER", true],
  ["DAY_1_3", "CONFIDENCE_CHECK", "Exercise confidence check", "Ask whether the member feels confident, confused, or needs support.", 3, "TRAINER", true],
  ["WEEK_1", "WEEK_1_CHECKIN", "Week 1 check-in", "Review visits, confidence, satisfaction, pain, and trainer contact.", 7, "TRAINER", true],
  ["WEEK_2", "WEEK_2_ADHERENCE", "Week 2 adherence review", "Review first-14-day visits, adherence, scheduling, and barriers.", 14, "TRAINER", true],
  ["DAY_30", "DAY_30_REVIEW", "Day 30 progress review", "Use existing goals, metrics, attendance, and feedback.", 30, "TRAINER", true],
  ["DAY_60", "DAY_60_REVIEW", "Day 60 mid-journey review", "Review trend, motivation, goal relevance, and support needs.", 60, "TRAINER", true],
  ["DAY_90", "DAY_90_REVIEW", "Day 90 full review", "Review progress, milestones, interventions, and the next programme.", 90, "TRAINER", true],
  ["DAY_30", "DAY_30_CELEBRATION", "Celebrate first 30 days", "Recognize positive attendance or progress milestones.", 30, "TRAINER", false],
] as const;

export async function ensureJourney(gymId: string, memberId: string, trainerId?: string | null, startDate = new Date()) {
  const existing = await db.memberJourney.findFirst({ where: { gymId, memberId, status: "ACTIVE" } }); if (existing) return existing;
  return db.memberJourney.create({ data: { gymId, memberId, journeyTemplateId: "DEFAULT_90_DAY", startDate, assignedTrainerId: trainerId ?? null, tasks: { create: defaultJourneyTemplate.map(([stage, taskType, title, description, days, assignedRole, required]) => ({ gymId, memberId, stage, taskType, title, description, dueDate: new Date(startDate.getTime() + days * 86_400_000), assignedRole, assignedUserId: assignedRole === "TRAINER" ? trainerId ?? null : null, status: assignedRole === "TRAINER" && trainerId ? "ASSIGNED" : "OPEN", required, escalationRule: required ? "ONBOARDING_RISK" : null })) } } });
}

export async function refreshJourneyStatus(journeyId: string) {
  const journey = await db.memberJourney.findUniqueOrThrow({ where: { id: journeyId }, include: { tasks: true } }); const now = new Date(); const overdue = journey.tasks.filter((task) => ["OPEN", "ASSIGNED"].includes(task.status) && task.dueDate < now);
  if (overdue.length) await db.journeyTask.updateMany({ where: { id: { in: overdue.map((task) => task.id) } }, data: { status: "OVERDUE" } }); const latest = journeyStages[Math.max(0, ...journey.tasks.filter((task) => task.status !== "COMPLETED").map((task) => journeyStages.indexOf(task.stage as typeof journeyStages[number])))] ?? "COMPLETED";
  const required = journey.tasks.filter((task) => task.required); const complete = required.length > 0 && required.every((task) => task.status === "COMPLETED"); return db.memberJourney.update({ where: { id: journeyId }, data: { currentStage: complete ? "COMPLETED" : latest, status: complete ? "COMPLETED" : journey.status, completedAt: complete ? now : null } });
}
