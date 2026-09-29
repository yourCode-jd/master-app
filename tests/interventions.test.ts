import assert from "node:assert/strict";
import test from "node:test";
import { db } from "@/lib/db";

test("seeded trainer work is linked to persisted attention and assignment", async () => {
  const item = await db.intervention.findFirst({ include: { attentionItem: true, assignedTo: true }, orderBy: { createdAt: "desc" } });
  assert.ok(item);
  assert.equal(item.assignedRole, "TRAINER");
  assert.ok(item.attentionItemId);
  assert.ok(item.assignedTo?.id);
});

test("intervention lifecycle persists completion and follow-up", async () => {
  const [gym, member, trainer] = await Promise.all([db.gym.findFirstOrThrow(), db.member.findFirstOrThrow(), db.user.findFirstOrThrow({ where: { role: "TRAINER" } })]);
  const created = await db.intervention.create({ data: { gymId: gym.id, memberId: member.id, type: "TRAINER_CHECK_IN", reason: "Lifecycle test", recommendedAction: "Contact member", assignedToId: trainer.id, assignedRole: "TRAINER", status: "ASSIGNED", dueAt: new Date() } });
  const followUp = new Date(Date.now() + 7 * 86_400_000);
  const completed = await db.intervention.update({ where: { id: created.id }, data: { status: "FOLLOW_UP_DUE", actionTaken: "Called member", memberResponse: "Will return this week", followUpAt: followUp, completedAt: new Date() } });
  assert.equal(completed.status, "FOLLOW_UP_DUE"); assert.equal(completed.actionTaken, "Called member"); assert.ok(completed.completedAt);
  await db.intervention.delete({ where: { id: created.id } });
});
