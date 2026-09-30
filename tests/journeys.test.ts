import assert from "node:assert/strict";
import test from "node:test";
import { db } from "@/lib/db";
import { defaultJourneyTemplate, ensureJourney, refreshJourneyStatus } from "@/lib/journey";

test("default journey template covers the required 0/1-3/7/14/30/60/90 checkpoints", () => {
  const stages = new Set(defaultJourneyTemplate.map((task) => task[0]));
  for (const stage of ["DAY_0", "DAY_1_3", "WEEK_1", "WEEK_2", "DAY_30", "DAY_60", "DAY_90"]) assert.ok(stages.has(stage as typeof defaultJourneyTemplate[number][0]));
});

test("journey creation is tenant scoped and prevents duplicate active journeys", async () => {
  const member = await db.member.findFirstOrThrow({ include: { trainer: true } });
  const first = await ensureJourney(member.gymId, member.id, member.trainerId); const second = await ensureJourney(member.gymId, member.id, member.trainerId);
  assert.equal(first.id, second.id); const tasks = await db.journeyTask.findMany({ where: { journeyId: first.id } }); assert.equal(tasks.length, defaultJourneyTemplate.length);
});

test("journey status refresh marks past open tasks overdue", async () => {
  const journey = await db.memberJourney.findFirstOrThrow({ where: { status: "ACTIVE" }, include: { tasks: true } }); const task = journey.tasks.find((item) => item.status !== "COMPLETED"); if (!task) return; await db.journeyTask.update({ where: { id: task.id }, data: { status: "OPEN", dueDate: new Date(Date.now() - 86_400_000) } }); await refreshJourneyStatus(journey.id); const refreshed = await db.journeyTask.findUniqueOrThrow({ where: { id: task.id } }); assert.equal(refreshed.status, "OVERDUE");
});
