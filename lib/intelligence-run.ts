import "server-only";
import { db } from "@/lib/db";
import { evaluateAttendance, evaluateMembership } from "@/lib/intelligence";

const day = 86_400_000;
export async function runIntelligence(gymId: string) {
  const now = Date.now(); const members = await db.member.findMany({ where: { gymId }, include: { visits: { select: { visitedAt: true } } } }); let triggered = 0; let created = 0; const activeKeys = new Set<string>();
  for (const member of members) {
    const last = member.lastVisit?.getTime() ?? member.joinDate.getTime(); const current = member.visits.filter(v => v.visitedAt.getTime() >= now - 28 * day).length / 4; const baseline = member.visits.filter(v => v.visitedAt.getTime() < now - 28 * day && v.visitedAt.getTime() >= now - 56 * day).length / 4;
    const results = [...evaluateAttendance({ daysSinceVisit: Math.floor((now-last)/day), baselineVisits: baseline, currentVisits: current }), ...evaluateMembership(Math.floor((member.membershipEnd.getTime()-now)/day))];
    for (const result of results) { triggered++; const key = [gymId, member.id, result.ruleId].join(":"); activeKeys.add(key); const existing = await db.attentionItem.findUnique({ where: { deduplicationKey:key } }); if (!existing) { await db.attentionItem.create({ data:{ gymId, memberId:member.id, ruleId:result.ruleId, title:result.title, reason:result.reason, priority:result.priority, recommendedAction:result.action, assignedRole:result.role, dueAt:new Date(now+result.dueDays*day), relatedState:result.state, deduplicationKey:key } }); created++; } if (result.state && member.memberState !== result.state) { await db.member.update({ where:{id:member.id}, data:{memberState:result.state,attentionLevel:result.priority} }); await db.memberStateHistory.create({data:{gymId,memberId:member.id,previousState:member.memberState,state:result.state,reason:result.reason,source:result.ruleId}}); } }
  }
  const resolved = await db.attentionItem.updateMany({ where: { gymId, status: { in: ["OPEN", "ASSIGNED", "IN_PROGRESS"] }, NOT: { deduplicationKey: { in: Array.from(activeKeys) } } }, data: { status: "EXPIRED" } });
  return db.intelligenceRun.create({data:{gymId,membersEvaluated:members.length,rulesTriggered:triggered,newItems:created,resolvedItems:resolved.count}});
}
