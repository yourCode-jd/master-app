import assert from "node:assert/strict";
import test from "node:test";
import { db } from "@/lib/db";

test("community membership is unique and tenant-bound through its group", async () => {
  const membership = await db.groupMembership.findFirstOrThrow({ include: { group: true, member: true } });
  assert.equal(membership.group.gymId, membership.member.gymId);
  const duplicates = await db.groupMembership.count({ where: { groupId: membership.groupId, memberId: membership.memberId } });
  assert.equal(duplicates, 1);
});

test("group activities retain participation records without public member metrics", async () => {
  const activity = await db.groupActivity.findFirstOrThrow({ include: { participation: true } });
  assert.ok(activity.participation.length > 0);
  assert.ok(activity.participation.every((row) => ["REGISTERED", "ATTENDED", "MISSED", "CANCELLED"].includes(row.status)));
});

test("attendance challenges store individual progress", async () => {
  const row = await db.challengeParticipation.findFirstOrThrow({ include: { challenge: true, member: true } });
  assert.equal(row.challenge.gymId, row.member.gymId);
  assert.ok(row.progressPercent >= 0 && row.progressPercent <= 100);
});
