"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { audit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { runIntelligenceV2 } from "@/lib/intelligence-run-v2";
import { addMemberActivity, assertMemberAccess } from "@/lib/members";
import { outcomeStatuses, serializeSnapshot, suggestOutcome } from "@/lib/outcomes";

const id = z.string().cuid();
const impactTypes = ["", "RENEWAL_RETAINED", "PT_SALE", "MEMBERSHIP_RECOVERED", "OTHER"] as const;
const refresh = (memberId: string, interventionId: string) => { revalidatePath("/outcomes"); revalidatePath("/outcomes/effectiveness"); revalidatePath(`/outcomes/${interventionId}`); revalidatePath(`/trainer/interventions/${interventionId}`); revalidatePath(`/members/${memberId}`); revalidatePath(`/members/${memberId}/outcomes`); revalidatePath("/"); };

export async function evaluateOutcome(formData: FormData) {
  const data = z.object({ interventionId: id, outcomeStatus: z.enum(outcomeStatuses), notes: z.string().trim().max(1800).optional(), nextAction: z.string().trim().max(800).optional(), businessImpactType: z.enum(impactTypes).optional(), businessImpactValue: z.coerce.number().int().min(0).max(10_000_000).optional() }).parse(Object.fromEntries(formData));
  const actor = await requireUser("members:write"); const suggested = await suggestOutcome(data.interventionId, actor.gymId); const item = suggested.intervention; await assertMemberAccess(actor, item.memberId, true); if (actor.role === "TRAINER" && item.assignedToId !== actor.id) throw new Error("Only the assigned trainer can evaluate this intervention.");
  const outcomeStatus = data.outcomeStatus; const followUp = ["PARTIALLY_IMPROVED", "UNCHANGED", "DECLINED", "MEMBER_UNREACHABLE", "INSUFFICIENT_DATA"].includes(outcomeStatus); const declined = outcomeStatus === "DECLINED"; const resolved = outcomeStatus === "IMPROVED" || outcomeStatus === "NO_LONGER_RELEVANT";
  await db.$transaction(async (tx) => {
    await tx.outcome.upsert({ where: { interventionId: item.id }, create: { gymId: actor.gymId, memberId: item.memberId, interventionId: item.id, outcomeStatus, evaluationWindowStart: suggested.start, evaluationWindowEnd: suggested.end, beforeSnapshot: serializeSnapshot(suggested.before), afterSnapshot: serializeSnapshot(suggested.after), primaryMetric: suggested.template.metric, beforeValue: suggested.beforeValue, afterValue: suggested.afterValue, changeValue: suggested.changeValue, changePercent: suggested.changePercent, evaluatorUserId: actor.id, notes: data.notes || null, nextAction: data.nextAction || null, businessImpactType: data.businessImpactType || null, businessImpactValue: data.businessImpactType ? data.businessImpactValue ?? null : null }, update: { outcomeStatus, evaluationDate: new Date(), evaluationWindowStart: suggested.start, evaluationWindowEnd: suggested.end, beforeSnapshot: serializeSnapshot(suggested.before), afterSnapshot: serializeSnapshot(suggested.after), primaryMetric: suggested.template.metric, beforeValue: suggested.beforeValue, afterValue: suggested.afterValue, changeValue: suggested.changeValue, changePercent: suggested.changePercent, evaluatorUserId: actor.id, notes: data.notes || null, nextAction: data.nextAction || null, businessImpactType: data.businessImpactType || null, businessImpactValue: data.businessImpactType ? data.businessImpactValue ?? null : null } });
    await tx.intervention.update({ where: { id: item.id }, data: { outcomeStatus, status: resolved ? "CLOSED" : followUp ? "FOLLOW_UP_DUE" : item.status, priority: declined ? "CRITICAL" : item.priority, followUpAt: followUp ? new Date(Date.now() + 7 * 86_400_000) : item.followUpAt } });
    if (item.attentionItemId) await tx.attentionItem.update({ where: { id: item.attentionItemId }, data: resolved ? { status: "EXPIRED", resolution: `Outcome evaluated: ${outcomeStatus}.`, resolvedAt: new Date() } : { status: "IN_PROGRESS", priority: declined ? "CRITICAL" : undefined, resolution: `Outcome evaluated: ${outcomeStatus}. ${data.nextAction || "Further follow-up required."}` } });
    const recipient = item.assignedToId ?? null; await tx.notification.create({ data: { gymId: actor.gymId, userId: recipient, type: declined ? "OUTCOME_DECLINED" : resolved ? "OUTCOME_IMPROVED" : "OUTCOME_FOLLOW_UP", title: `Outcome: ${outcomeStatus.replaceAll("_", " ")}`, body: `${item.title} for ${item.memberId} was evaluated. ${suggested.explanation}`, entityType: "Intervention", entityId: item.id } });
  });
  await addMemberActivity({ gymId: actor.gymId, memberId: item.memberId, actorId: actor.id, type: "OUTCOME_EVALUATED", message: `${item.title} outcome recorded as ${outcomeStatus.replaceAll("_", " ")}.` }); await audit({ gymId: actor.gymId, actorId: actor.id, action: "OUTCOME_EVALUATED", entityType: "Outcome", entityId: item.id, after: { outcomeStatus, suggested: suggested.suggestedStatus, businessImpactType: data.businessImpactType, businessImpactValue: data.businessImpactValue } });
  await runIntelligenceV2(actor.gymId); refresh(item.memberId, item.id);
}

export async function runOutcomeChecksNow() {
  const actor = await requireUser("members:manage"); const due = await db.intervention.findMany({ where: { gymId: actor.gymId, outcome: null, completedAt: { not: null }, OR: [{ followUpAt: { lte: new Date() } }, { followUpAt: null, completedAt: { lte: new Date(Date.now() - 7 * 86_400_000) } }] }, select: { id: true, title: true, assignedToId: true } });
  if (due.length) await db.notification.createMany({ data: due.map((item) => ({ gymId: actor.gymId, userId: item.assignedToId, type: "OUTCOME_REVIEW_DUE", title: "Outcome review due", body: `Evaluate the outcome of ${item.title}.`, entityType: "Intervention", entityId: item.id })) });
  await audit({ gymId: actor.gymId, actorId: actor.id, action: "OUTCOME_CHECKS_RUN", entityType: "Gym", entityId: actor.gymId, after: { due: due.length } }); revalidatePath("/outcomes");
}
