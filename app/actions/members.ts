"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { audit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { addMemberActivity, assertMemberAccess } from "@/lib/members";
import { ensureJourney } from "@/lib/journey";

const createSchema = z.object({ fullName: z.string().trim().min(2).max(100), email: z.string().trim().email(), phone: z.string().trim().min(6).max(30), goal: z.string().trim().min(2).max(140), planName: z.string().trim().min(2).max(80), trainerId: z.string().optional() });
const memberIdSchema = z.string().cuid();
function refresh(memberId?: string) { revalidatePath("/members"); if (memberId) revalidatePath(`/members/${memberId}`); revalidatePath("/"); }

export async function createMember(formData: FormData) {
  const actor = await requireUser("members:manage");
  const parsed = createSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error("Please provide a name, valid email, phone, goal, and membership plan.");
  const duplicate = await db.member.findUnique({ where: { gymId_email: { gymId: actor.gymId, email: parsed.data.email.toLowerCase() } } });
  if (duplicate) throw new Error("A member with this email already exists in this gym.");
  const start = new Date(); const end = new Date(start); end.setMonth(end.getMonth() + 3);
  const trainer = parsed.data.trainerId ? await db.user.findFirst({ where: { id: parsed.data.trainerId, gymId: actor.gymId, role: "TRAINER" } }) : null;
  const member = await db.$transaction(async (tx) => tx.member.create({ data: { gymId: actor.gymId, fullName: parsed.data.fullName, email: parsed.data.email.toLowerCase(), phone: parsed.data.phone, goal: parsed.data.goal, membershipStatus: "ACTIVE", memberState: "NEW", attentionLevel: "LOW", joinDate: start, membershipEnd: end, trainerId: trainer?.id, assignedTrainer: trainer?.name, memberships: { create: { gymId: actor.gymId, planName: parsed.data.planName, amount: 9000, status: "ACTIVE", startDate: start, endDate: end } }, attentionPreference: { create: { gymId: actor.gymId } }, activities: { create: { gymId: actor.gymId, actorId: actor.id, type: "MEMBER_CREATED", message: "Member profile and initial membership created." } } } }));
  await ensureJourney(actor.gymId, member.id, trainer?.id, start);
  await audit({ gymId: actor.gymId, actorId: actor.id, action: "MEMBER_CREATED", entityType: "Member", entityId: member.id, after: { fullName: member.fullName } });
  refresh(member.id);
}

export async function recordVisit(formData: FormData) {
  const actor = await requireUser("members:write"); const memberId = memberIdSchema.parse(formData.get("memberId")); const member = await assertMemberAccess(actor, memberId, true);
  await db.$transaction([db.visit.create({ data: { gymId: actor.gymId, memberId } }), db.member.update({ where: { id: memberId }, data: { lastVisit: new Date() } })]);
  await addMemberActivity({ gymId: actor.gymId, memberId, actorId: actor.id, type: "VISIT_RECORDED", message: `${member.fullName} checked in.` });
  await audit({ gymId: actor.gymId, actorId: actor.id, action: "VISIT_RECORDED", entityType: "Member", entityId: memberId }); refresh(memberId);
}

export async function addMemberNote(formData: FormData) {
  const actor = await requireUser("members:write"); const memberId = memberIdSchema.parse(formData.get("memberId")); const body = z.string().trim().min(2).max(1200).parse(formData.get("body"));
  await assertMemberAccess(actor, memberId, true); await db.note.create({ data: { gymId: actor.gymId, memberId, authorId: actor.id, body } });
  await addMemberActivity({ gymId: actor.gymId, memberId, actorId: actor.id, type: "NOTE_ADDED", message: "A staff note was added." }); await audit({ gymId: actor.gymId, actorId: actor.id, action: "MEMBER_NOTE_ADDED", entityType: "Member", entityId: memberId }); refresh(memberId);
}

export async function assignTrainer(formData: FormData) {
  const actor = await requireUser("members:manage"); const memberId = memberIdSchema.parse(formData.get("memberId")); const trainerId = memberIdSchema.parse(formData.get("trainerId")); const member = await assertMemberAccess(actor, memberId, true);
  const trainer = await db.user.findFirstOrThrow({ where: { id: trainerId, gymId: actor.gymId, role: "TRAINER" } }); await db.member.update({ where: { id: memberId }, data: { trainerId, assignedTrainer: trainer.name } });
  await addMemberActivity({ gymId: actor.gymId, memberId, actorId: actor.id, type: "TRAINER_ASSIGNED", message: `${trainer.name} was assigned as trainer.` }); await audit({ gymId: actor.gymId, actorId: actor.id, action: "TRAINER_ASSIGNED", entityType: "Member", entityId: memberId, before: { trainerId: member.trainerId }, after: { trainerId } }); refresh(memberId);
}

export async function updatePreference(formData: FormData) {
  const actor = await requireUser(); const memberId = memberIdSchema.parse(formData.get("memberId")); await assertMemberAccess(actor, memberId, actor.role !== "MEMBER");
  const level = z.enum(["INDEPENDENT", "OCCASIONAL_CHECK_IN", "CLOSE_COACHING", "FORM_CORRECTION", "GOAL_ACCOUNTABILITY", "SOCIAL_MOTIVATION"]).parse(formData.get("level")); const contactMethod = z.enum(["WHATSAPP", "SMS", "EMAIL", "IN_PERSON"]).parse(formData.get("contactMethod")); const trainerGender = z.enum(["ANY", "FEMALE", "MALE"]).parse(formData.get("trainerGender") ?? "ANY"); const noInterruption = formData.get("noInterruption") === "on";
  await db.attentionPreference.upsert({ where: { memberId }, create: { gymId: actor.gymId, memberId, level, contactMethod, noInterruption, trainerGender: trainerGender === "ANY" ? null : trainerGender }, update: { level, contactMethod, noInterruption, trainerGender: trainerGender === "ANY" ? null : trainerGender } });
  await addMemberActivity({ gymId: actor.gymId, memberId, actorId: actor.id, type: "PREFERENCE_UPDATED", message: "Attention preference was updated." }); await audit({ gymId: actor.gymId, actorId: actor.id, action: "PREFERENCE_UPDATED", entityType: "Member", entityId: memberId }); refresh(memberId);
}

export async function updateMember(formData: FormData) {
  const actor = await requireUser("members:manage"); const memberId = memberIdSchema.parse(formData.get("memberId")); const member = await assertMemberAccess(actor, memberId, true);
  const parsed = z.object({ fullName: z.string().trim().min(2).max(100), email: z.string().trim().email(), phone: z.string().trim().min(6).max(30), goal: z.string().trim().min(2).max(140) }).parse(Object.fromEntries(formData));
  const duplicate = await db.member.findFirst({ where: { gymId: actor.gymId, email: parsed.email.toLowerCase(), NOT: { id: memberId } } }); if (duplicate) throw new Error("A member with this email already exists in this gym.");
  const updated = await db.member.update({ where: { id: memberId }, data: { ...parsed, email: parsed.email.toLowerCase() } });
  await addMemberActivity({ gymId: actor.gymId, memberId, actorId: actor.id, type: "PROFILE_UPDATED", message: "Member profile was updated." }); await audit({ gymId: actor.gymId, actorId: actor.id, action: "MEMBER_UPDATED", entityType: "Member", entityId: memberId, before: { fullName: member.fullName, email: member.email, phone: member.phone, goal: member.goal }, after: { fullName: updated.fullName, email: updated.email, phone: updated.phone, goal: updated.goal } }); refresh(memberId);
}

export async function archiveMember(formData: FormData) {
  const actor = await requireUser("members:manage"); const memberId = memberIdSchema.parse(formData.get("memberId")); const member = await assertMemberAccess(actor, memberId, true);
  await db.member.update({ where: { id: memberId }, data: { membershipStatus: "CANCELLED" } }); await addMemberActivity({ gymId: actor.gymId, memberId, actorId: actor.id, type: "MEMBER_ARCHIVED", message: "Membership was cancelled; member record retained." }); await audit({ gymId: actor.gymId, actorId: actor.id, action: "MEMBER_ARCHIVED", entityType: "Member", entityId: memberId, before: { membershipStatus: member.membershipStatus }, after: { membershipStatus: "CANCELLED" } }); refresh(memberId);
}
