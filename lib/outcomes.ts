import { db } from "@/lib/db";

export const outcomeStatuses = ["IMPROVED", "PARTIALLY_IMPROVED", "UNCHANGED", "DECLINED", "MEMBER_UNREACHABLE", "NO_LONGER_RELEVANT", "INSUFFICIENT_DATA"] as const;
export type OutcomeStatus = (typeof outcomeStatuses)[number];

export const outcomeTemplates: Record<string, { metric: string; windowDays: number; description: string }> = {
  TRAINER_CHECK_IN: { metric: "ATTENDANCE_PER_WEEK", windowDays: 14, description: "Compare attendance and renewed trainer contact." },
  PERSONAL_OUTREACH: { metric: "ATTENDANCE_PER_WEEK", windowDays: 14, description: "Check whether the member returned and attendance resumed." },
  WELCOME_CHECK_IN: { metric: "ATTENDANCE_PER_WEEK", windowDays: 7, description: "Check first-week onboarding participation." },
  PROGRAM_REASSESSMENT: { metric: "PROGRESS_METRIC", windowDays: 28, description: "Check whether measurable progress resumed." },
  GOAL_REVIEW: { metric: "PROGRESS_METRIC", windowDays: 28, description: "Check goal-trend progress." },
  RENEWAL_DISCUSSION: { metric: "MEMBERSHIP_STATUS", windowDays: 14, description: "Check whether membership was renewed." },
  PT_CONSULTATION: { metric: "MEMBERSHIP_STATUS", windowDays: 14, description: "Check whether a PT plan was started." },
};
export const templateFor = (type: string) => outcomeTemplates[type] ?? { metric: "FOLLOW_UP_REVIEW", windowDays: 14, description: "Review the member response and current state." };

const round = (value: number) => Math.round(value * 100) / 100;
const date = (value: Date) => value.toISOString();
export async function suggestOutcome(interventionId: string, gymId: string) {
  const intervention = await db.intervention.findFirstOrThrow({ where: { id: interventionId, gymId }, include: { member: { include: { visits: { select: { visitedAt: true } }, metrics: { orderBy: { recordedAt: "asc" } }, memberships: { orderBy: { endDate: "desc" } } } } } });
  const template = templateFor(intervention.type); const start = intervention.completedAt ?? intervention.startedAt ?? intervention.createdAt; const end = intervention.followUpAt ?? new Date(start.getTime() + template.windowDays * 86_400_000); const now = new Date();
  const beforeStart = new Date(start.getTime() - template.windowDays * 86_400_000); const before: Record<string, unknown> = { memberState: intervention.member.memberState, membershipStatus: intervention.member.membershipStatus, capturedAt: date(start) }; const after: Record<string, unknown> = { memberState: intervention.member.memberState, membershipStatus: intervention.member.membershipStatus, capturedAt: date(now) };
  if (template.metric === "ATTENDANCE_PER_WEEK") {
    const count = (from: Date, to: Date) => intervention.member.visits.filter((visit) => visit.visitedAt >= from && visit.visitedAt <= to).length;
    const beforeValue = round(count(beforeStart, start) / template.windowDays * 7); const afterDays = Math.max(1, Math.min(template.windowDays, Math.ceil((Math.min(now.getTime(), end.getTime()) - start.getTime()) / 86_400_000))); const afterValue = round(count(start, new Date(Math.min(now.getTime(), end.getTime()))) / afterDays * 7); const changeValue = round(afterValue - beforeValue); before.attendancePerWeek = beforeValue; after.attendancePerWeek = afterValue;
    const status: OutcomeStatus = now < end ? "INSUFFICIENT_DATA" : afterValue >= Math.max(2, beforeValue + 0.5) ? "IMPROVED" : afterValue > beforeValue ? "PARTIALLY_IMPROVED" : afterValue < beforeValue ? "DECLINED" : "UNCHANGED";
    return { intervention, template, start, end, before, after, beforeValue, afterValue, changeValue, changePercent: beforeValue ? round(changeValue / beforeValue * 100) : null, suggestedStatus: status, explanation: `Attendance changed from ${beforeValue} to ${afterValue} visits/week over comparable windows.` };
  }
  if (template.metric === "PROGRESS_METRIC") {
    const metricType = intervention.member.metrics.at(-1)?.type; const values = metricType ? intervention.member.metrics.filter((metric) => metric.type === metricType) : []; const beforeMetric = [...values].reverse().find((metric) => metric.recordedAt <= start); const afterMetric = values.find((metric) => metric.recordedAt >= start); const beforeValue = beforeMetric ? Number(beforeMetric.value) : null; const afterValue = afterMetric ? Number(afterMetric.value) : null; const changeValue = beforeValue !== null && afterValue !== null ? round(afterValue - beforeValue) : null; before.progressMetric = beforeMetric ? { type: metricType, value: beforeValue, unit: beforeMetric.unit } : null; after.progressMetric = afterMetric ? { type: metricType, value: afterValue, unit: afterMetric.unit } : null;
    const status: OutcomeStatus = now < end || changeValue === null ? "INSUFFICIENT_DATA" : changeValue > 0 ? "IMPROVED" : changeValue < 0 ? "DECLINED" : "UNCHANGED";
    return { intervention, template, start, end, before, after, beforeValue, afterValue, changeValue, changePercent: beforeValue && changeValue !== null ? round(changeValue / Math.abs(beforeValue) * 100) : null, suggestedStatus: status, explanation: changeValue === null ? "No comparable progress measurement is available yet." : `${metricType} changed by ${changeValue}.` };
  }
  const membership = intervention.member.memberships[0]; const renewed = membership?.endDate && membership.endDate > start && membership.status === "ACTIVE"; before.membership = intervention.member.membershipStatus; after.membership = membership?.status ?? intervention.member.membershipStatus;
  return { intervention, template, start, end, before, after, beforeValue: null, afterValue: renewed ? 1 : 0, changeValue: null, changePercent: null, suggestedStatus: now < end ? "INSUFFICIENT_DATA" : renewed ? "IMPROVED" : "UNCHANGED" as OutcomeStatus, explanation: renewed ? "An active membership extends beyond the intervention date." : "No qualifying membership change is recorded." };
}

export const serializeSnapshot = (value: Record<string, unknown>) => JSON.stringify(value);
