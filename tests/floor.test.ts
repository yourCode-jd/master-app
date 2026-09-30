import assert from "node:assert/strict";
import test from "node:test";
import { db } from "@/lib/db";

test("floor zones retain current state and historical occupancy snapshots", async () => {
  const zone = await db.floorZone.findFirstOrThrow({ include: { snapshots: true } });
  assert.ok(zone.capacity > 0); assert.ok(zone.currentOccupancy >= 0); assert.ok(zone.snapshots.length > 0);
});

test("unsafe equipment is never shown as available", async () => {
  const equipment = await db.equipment.findFirstOrThrow({ where: { condition: "UNSAFE" } });
  assert.equal(equipment.status, "OUT_OF_SERVICE");
});

test("equipment issue and maintenance records are tenant-scoped", async () => {
  const issue = await db.equipmentIssue.findFirstOrThrow({ include: { equipment: true } });
  const task = await db.maintenanceTask.findFirstOrThrow({ include: { equipment: true } });
  assert.equal(issue.gymId, issue.equipment.gymId); assert.equal(task.gymId, task.equipment.gymId);
  assert.ok(["REPORTED", "ACKNOWLEDGED", "IN_PROGRESS", "RESOLVED", "CLOSED"].includes(issue.status));
});
