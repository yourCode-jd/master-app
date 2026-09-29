"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { audit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { addMemberActivity, assertMemberAccess } from "@/lib/members";

const id = z.string().cuid();
const types = ["TRAINER_CHECK_IN", "GOAL_REVIEW", "PROGRAM_REASSESSMENT", "PERSONAL_OUTREACH", "PT_CONSULTATION", "RENEWAL_DISCUSSION", "WELCOME_CALL", "PROGRESS_CELEBRATION", "MANAGER_REVIEW", "SAFETY_ESCALATION"] as const;
const refresh = (memberId?: string) => { revalidatePath("/trainer"); revalidatePath("/attention"); if (memberId) { revalidatePath(`/members/${memberId}`); revalidatePath(`/members/${memberId}/intelligence`); } };

export async function createIntervention(formData: FormData) {
  const actor = await requireUser("members:write");
  const data = z.object({ memberId: id, attentionItemId: z.string().cuid().optional().or(z.literal("")), type: z.enum(types), reason: z.string().trim().min(3).max(600), recommendedAction: z.string().trim().min(3).max(300), assignedToId: z.string().cuid().optional().or(z.literal("")), dueAt: z.string().min(10), notes: z.string().trim().max(1600).optional() }).parse(Object.fromEntries(formData));
  const member = await assertMemberAccess(actor, data.memberId, true);
  const assigneeId = data.assignedToId || (actor.role === "TRAINER" ? actor.id : member.trainerId);
  if (actor.role === "TRAINER" && assigneeId !== actor.id) throw new Error("Trainers can only create work assigned to themselves.");
  const assignee = assigneeId ? await db.user.findFirst({ where: { id: assigneeId, gymId: actor.gymId, role: "TRAINER" } }) : null;
  const attention = data.attentionItemId ? await db.attentionItem.findFirst({ where: { id: data.attentionItemId, gymId: actor.gymId, memberId: member.id } }) : null;
  const intervention = await db.intervention.create({ data: { gymId: actor.gymId, memberId: member.id, attentionItemId: attention?.id, type: data.type, reason: data.reason, recommendedAction: data.recommendedAction, assignedToId: assignee?.id, assignedRole: assignee ? "TRAINER" : "UNASSIGNED", status: assignee ? "ASSIGNED" : "OPEN", dueAt: new Date(data.dueAt), notes: data.notes || null } });
  if (attention) await db.attentionItem.update({ where: { id: attention.id }, data: { status: "IN_PROGRESS", assignedUserId: assignee?.id ?? attention.assignedUserId } });
  await addMemberActivity({ gymId: actor.gymId, memberId: member.id, actorId: actor.id, type: "INTERVENTION_CREATED", message: `${data.type.replaceAll("_", " ")} intervention created.` });
  await audit({ gymId: actor.gymId, actorId: actor.id, action: "INTERVENTION_CREATED", entityType: "Intervention", entityId: intervention.id, after: { memberId: member.id, type: data.type, assignedToId: assignee?.id } }); refresh(member.id);
}

export async function startIntervention(formData: FormData) {
  const actor = await requireUser("members:write"); const interventionId = id.parse(formData.get("interventionId"));
  const item = await db.intervention.findFirstOrThrow({ where: { id: interventionId, gymId: actor.gymId } }); await assertMemberAccess(actor, item.memberId, true);
  if (actor.role === "TRAINER" && item.assignedToId !== actor.id) throw new Error("Only the assigned trainer can start this intervention.");
  await db.intervention.update({ where: { id: item.id }, data: { status: "IN_PROGRESS" } }); await audit({ gymId: actor.gymId, actorId: actor.id, action: "INTERVENTION_STARTED", entityType: "Intervention", entityId: item.id }); refresh(item.memberId);
}

export async function completeIntervention(formData: FormData) {
  const actor = await requireUser("members:write"); const data = z.object({ interventionId: id, actionTaken: z.string().trim().min(3).max(1600), memberResponse: z.string().trim().max(1200).optional(), followUpAt: z.string().optional(), notes: z.string().trim().max(1600).optional() }).parse(Object.fromEntries(formData));
  const item = await db.intervention.findFirstOrThrow({ where: { id: data.interventionId, gymId: actor.gymId } }); await assertMemberAccess(actor, item.memberId, true);
  if (actor.role === "TRAINER" && item.assignedToId !== actor.id) throw new Error("Only the assigned trainer can complete this intervention.");
  const followUp = data.followUpAt ? new Date(data.followUpAt) : null; const status = followUp ? "FOLLOW_UP_DUE" : "COMPLETED";
  await db.$transaction([db.intervention.update({ where: { id: item.id }, data: { status, actionTaken: data.actionTaken, memberResponse: data.memberResponse || null, followUpAt: followUp, notes: data.notes || item.notes, completedAt: new Date() } }), ...(item.attentionItemId ? [db.attentionItem.update({ where: { id: item.attentionItemId }, data: { status: "EXPIRED", resolution: "Intervention completed.", resolvedAt: new Date() } })] : [])]);
  await addMemberActivity({ gymId: actor.gymId, memberId: item.memberId, actorId: actor.id, type: "INTERVENTION_COMPLETED", message: `${item.type.replaceAll("_", " ")} intervention completed.` }); await audit({ gymId: actor.gymId, actorId: actor.id, action: "INTERVENTION_COMPLETED", entityType: "Intervention", entityId: item.id, after: { followUpAt: followUp, status } }); refresh(item.memberId);
}

export async function assignIntervention(formData: FormData) {
  const actor = await requireUser("members:manage"); const interventionId = id.parse(formData.get("interventionId")); const assignedToId = id.parse(formData.get("assignedToId"));
  const [item, trainer] = await Promise.all([db.intervention.findFirstOrThrow({ where: { id: interventionId, gymId: actor.gymId } }), db.user.findFirstOrThrow({ where: { id: assignedToId, gymId: actor.gymId, role: "TRAINER" } })]);
  await db.intervention.update({ where: { id: item.id }, data: { assignedToId: trainer.id, assignedRole: "TRAINER", status: item.status === "OPEN" ? "ASSIGNED" : item.status } }); await addMemberActivity({ gymId: actor.gymId, memberId: item.memberId, actorId: actor.id, type: "INTERVENTION_ASSIGNED", message: `Intervention assigned to ${trainer.name}.` }); await audit({ gymId: actor.gymId, actorId: actor.id, action: "INTERVENTION_ASSIGNED", entityType: "Intervention", entityId: item.id, after: { assignedToId: trainer.id } }); refresh(item.memberId);
}
