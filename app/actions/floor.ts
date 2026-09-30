"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { audit } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

const id = z.string().cuid();
const refresh = () => { revalidatePath("/floor"); revalidatePath("/"); };
const stateFor = (current: number, capacity: number) => current / Math.max(capacity, 1) >= .9 ? "VERY_BUSY" : current / Math.max(capacity, 1) >= .7 ? "BUSY" : current / Math.max(capacity, 1) >= .35 ? "NORMAL" : "QUIET";

export async function simulateOccupancy(formData: FormData) {
  const data = z.object({ zoneId: id, occupancy: z.coerce.number().int().min(0) }).parse(Object.fromEntries(formData));
  const actor = await requireUser("members:manage"); const zone = await db.floorZone.findFirstOrThrow({ where: { id: data.zoneId, gymId: actor.gymId } }); const count = Math.min(data.occupancy, zone.capacity); const state = stateFor(count, zone.capacity);
  await db.$transaction([db.floorZone.update({ where: { id: zone.id }, data: { currentOccupancy: count, busyState: state } }), db.occupancySnapshot.create({ data: { gymId: actor.gymId, zoneId: zone.id, occupancyCount: count, capacity: zone.capacity, occupancyPercent: Math.round(count / zone.capacity * 100), state } })]);
  await audit({ gymId: actor.gymId, actorId: actor.id, action: "FLOOR_SIMULATOR_OVERRIDE", entityType: "FloorZone", entityId: zone.id, after: { count, state } }); refresh();
}

export async function reportEquipmentIssue(formData: FormData) {
  const data = z.object({ equipmentId: id, issueType: z.string().min(2).max(60), severity: z.enum(["LOW","MEDIUM","HIGH","CRITICAL"]), description: z.string().min(4).max(1200) }).parse(Object.fromEntries(formData));
  const actor = await requireUser(); const equipment = await db.equipment.findFirstOrThrow({ where: { id: data.equipmentId, gymId: actor.gymId } }); const unsafe = data.severity === "CRITICAL" || data.issueType === "UNSAFE"; const issue = await db.equipmentIssue.create({ data: { gymId: actor.gymId, equipmentId: equipment.id, reportedByUserId: actor.id, issueType: data.issueType, severity: data.severity, description: data.description } });
  if (unsafe || data.severity === "HIGH") await db.equipment.update({ where: { id: equipment.id }, data: { status: "OUT_OF_SERVICE", condition: unsafe ? "UNSAFE" : "NEEDS_ATTENTION" } });
  if (unsafe) await db.notification.create({ data: { gymId: actor.gymId, type: "CRITICAL_EQUIPMENT_ISSUE", title: "Equipment marked out of service", body: `${equipment.name}: ${data.description}`, entityType: "EquipmentIssue", entityId: issue.id } });
  await audit({ gymId: actor.gymId, actorId: actor.id, action: "EQUIPMENT_ISSUE_REPORTED", entityType: "EquipmentIssue", entityId: issue.id, after: { severity: data.severity, unsafe } }); refresh();
}

export async function resolveEquipmentIssue(formData: FormData) {
  const data = z.object({ issueId: id, resolutionNotes: z.string().min(3).max(1200), returnAvailable: z.coerce.boolean().optional() }).parse(Object.fromEntries(formData)); const actor = await requireUser("members:manage"); const issue = await db.equipmentIssue.findFirstOrThrow({ where: { id: data.issueId, gymId: actor.gymId } });
  await db.$transaction([db.equipmentIssue.update({ where: { id: issue.id }, data: { status: "RESOLVED", resolvedAt: new Date(), resolutionNotes: data.resolutionNotes, assignedToUserId: actor.id } }), ...(data.returnAvailable ? [db.equipment.update({ where: { id: issue.equipmentId }, data: { status: "AVAILABLE", condition: "GOOD" } })] : [])]);
  await audit({ gymId: actor.gymId, actorId: actor.id, action: "EQUIPMENT_ISSUE_RESOLVED", entityType: "EquipmentIssue", entityId: issue.id }); refresh();
}
