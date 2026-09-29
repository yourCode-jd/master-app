import assert from "node:assert/strict";
import test from "node:test";
import { db } from "@/lib/db";
import { goalProgress, metricTrend } from "@/lib/progress";

test("goal progress handles increasing and decreasing targets", () => {
  assert.equal(goalProgress(60, 80, 70), 50);
  assert.equal(goalProgress(92, 82, 87), 50);
  assert.equal(goalProgress(92, 82, 75), 100);
});

test("progress history remains as multiple immutable records", async () => {
  const member = await db.member.findFirstOrThrow({ where: { metrics: { some: {} } } });
  const metrics = await db.progressMetric.findMany({ where: { memberId: member.id }, orderBy: { recordedAt: "asc" } });
  assert.ok(metrics.length >= 2);
  assert.notEqual(metrics[0].id, metrics[1].id);
  assert.ok(metricTrend(metrics.map((metric) => Number(metric.value))).length > 0);
});

test("seeded progress members have assessments, goals, and milestones", async () => {
  const member = await db.member.findFirstOrThrow({ where: { goals: { some: {} } }, include: { goals: true, assessments: true, milestones: true } });
  assert.ok(member.goals.length >= 1);
  assert.ok(member.assessments.length >= 2);
});
