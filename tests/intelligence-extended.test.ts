import assert from "node:assert/strict";
import test from "node:test";
import { db } from "@/lib/db";
import { evaluateOnboarding, evaluateProgress, evaluateTrainerInteraction } from "@/lib/intelligence";
import { runIntelligenceV2 } from "@/lib/intelligence-run-v2";

test("onboarding covers no first workout and baseline assessment", () => {
  const rules = evaluateOnboarding({ daysSinceJoin: 5, visits: 0, hasAssessment: false });
  assert.ok(rules.some((rule) => rule.ruleId === "onboarding-first-visit"));
  assert.ok(rules.some((rule) => rule.ruleId === "onboarding-assessment"));
});

test("progress rules distinguish completed goals from advancing goals", () => {
  const completed = evaluateProgress({ daysSinceMetric: 1, reviewOverdue: false, goalProgress: 100, goalCompleted: true });
  assert.ok(completed.some((rule) => rule.ruleId === "goal-complete"));
  assert.equal(completed.some((rule) => rule.ruleId === "goal-advancing"), false);
});

test("trainer interaction gap has a deterministic next action", () => {
  const [rule] = evaluateTrainerInteraction(21);
  assert.equal(rule.ruleId, "trainer-interaction-gap");
  assert.equal(rule.role, "TRAINER");
});

test("repeated runs deduplicate active attention items", async () => {
  const gym = await db.gym.findFirstOrThrow();
  await runIntelligenceV2(gym.id);
  const first = await db.attentionItem.count({ where: { gymId: gym.id, status: { in: ["OPEN", "ASSIGNED", "IN_PROGRESS"] } } });
  const secondRun = await runIntelligenceV2(gym.id);
  const second = await db.attentionItem.count({ where: { gymId: gym.id, status: { in: ["OPEN", "ASSIGNED", "IN_PROGRESS"] } } });
  assert.equal(second, first);
  assert.equal(secondRun.newItems, 0);
});
