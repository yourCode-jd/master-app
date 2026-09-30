import assert from "node:assert/strict";
import test from "node:test";
import { db } from "@/lib/db";

test("member feedback is persisted with a valid rating and tenant", async () => {
  const feedback = await db.memberFeedback.findFirstOrThrow({ include: { member: true } });
  assert.ok(feedback.rating >= 1 && feedback.rating <= 4);
  assert.equal(feedback.gymId, feedback.member.gymId);
  assert.ok(["POSITIVE", "NEUTRAL", "NEGATIVE"].includes(feedback.sentiment));
});

test("complaints retain a recorded owner, severity, and follow-up state", async () => {
  const complaint = await db.complaint.findFirstOrThrow({ include: { member: true } });
  assert.equal(complaint.gymId, complaint.member.gymId);
  assert.ok(["OPEN", "ESCALATED", "RESOLVED"].includes(complaint.status));
  assert.ok(["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(complaint.severity));
});

test("discomfort reports use a non-medical follow-up record", async () => {
  const report = await db.discomfortReport.findFirstOrThrow({ include: { member: true } });
  assert.equal(report.gymId, report.member.gymId);
  assert.equal(report.status, "ACTIVE");
  assert.ok(report.followUpDate);
});
