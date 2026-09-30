import assert from "node:assert/strict";
import test from "node:test";
import { db } from "@/lib/db";
import { outcomeTemplates, suggestOutcome, templateFor } from "@/lib/outcomes";

test("outcome templates centralize metric windows", () => {
  assert.equal(templateFor("PERSONAL_OUTREACH").metric, "ATTENDANCE_PER_WEEK");
  assert.equal(templateFor("PROGRAM_REASSESSMENT").windowDays, 28);
  assert.equal(outcomeTemplates.WELCOME_CHECK_IN.windowDays, 7);
});

test("outcome suggestion creates transparent before and after attendance data", async () => {
  const intervention = await db.intervention.findFirstOrThrow({ where: { title: "Attendance recovery" } });
  const suggestion = await suggestOutcome(intervention.id, intervention.gymId);
  assert.equal(suggestion.intervention.id, intervention.id);
  assert.equal(suggestion.template.metric, "ATTENDANCE_PER_WEEK");
  assert.ok("attendancePerWeek" in suggestion.before);
  assert.ok("attendancePerWeek" in suggestion.after);
  assert.ok(suggestion.explanation.includes("Attendance changed"));
});

test("outcome records are tenant-scoped and linked one-to-one to interventions", async () => {
  const outcome = await db.outcome.findFirst({ include: { intervention: true } });
  if (!outcome) return;
  assert.equal(outcome.gymId, outcome.intervention.gymId);
  assert.equal(outcome.interventionId, outcome.intervention.id);
});
