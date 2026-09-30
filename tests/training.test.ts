import assert from "node:assert/strict";
import test from "node:test";
import { db } from "@/lib/db";
import { canUseScenario, pageHelp, scenarioFor, terminology, trainingScenarios } from "@/lib/training";

test("training scenarios are role-scoped and include the full gym practice", () => {
  assert.ok(scenarioFor("full-gym"));
  assert.ok(scenarioFor("practice-demo"));
  assert.equal(canUseScenario("MEMBER", scenarioFor("owner")!), false);
  assert.equal(canUseScenario("TRAINER", scenarioFor("trainer")!), true);
  assert.equal(canUseScenario("OWNER", scenarioFor("reception")!), true);
  assert.ok(trainingScenarios.every((scenario) => scenario.steps.length > 0));
});

test("page help and terminology use concise product guidance", () => {
  const help = pageHelp("/attention");
  assert.equal(help.title, "Attention");
  assert.match(terminology.Intervention, /action/i);
  assert.match(terminology.Outcome, /result/i);
});

test("training progress is tenant-bound and does not alter member data", async () => {
  const user = await db.user.findUniqueOrThrow({ where: { email: "owner@demo.gym" } });
  const memberCount = await db.member.count({ where: { gymId: user.gymId } });
  await db.trainingEvent.deleteMany({ where: { userId: user.id, scenarioId: "test-isolation" } });
  await db.trainingProgress.deleteMany({ where: { userId: user.id, scenarioId: "test-isolation" } });
  const progress = await db.trainingProgress.create({ data: { gymId: user.gymId, userId: user.id, scenarioId: "test-isolation", role: user.role, status: "ACTIVE" } });
  await db.trainingEvent.create({ data: { gymId: user.gymId, userId: user.id, scenarioId: "test-isolation", eventType: "STARTED", stepIndex: 0 } });
  assert.equal((await db.trainingProgress.findUnique({ where: { id: progress.id } }))?.gymId, user.gymId);
  assert.equal(await db.member.count({ where: { gymId: user.gymId } }), memberCount);
  await db.trainingEvent.deleteMany({ where: { userId: user.id, scenarioId: "test-isolation" } });
  await db.trainingProgress.delete({ where: { id: progress.id } });
});
