"use server";

import { randomBytes, scryptSync } from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { db } from "@/lib/db";

const staffRoles = ["MANAGER", "TRAINER", "RECEPTION"] as const;
const staffInput = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  role: z.enum(staffRoles),
  password: z.string().min(8).max(128).optional(),
});

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

async function owner() {
  const actor = await requireUser("settings:view");
  if (actor.role !== "OWNER") throw new Error("Owner access required.");
  return actor;
}

export async function createStaff(formData: FormData) {
  const actor = await owner();
  const data = staffInput.extend({ password: z.string().min(8).max(128) }).parse(Object.fromEntries(formData));
  const email = data.email.toLowerCase();
  if (await db.user.findUnique({ where: { email } })) throw new Error("That email is already used by an account.");
  const staff = await db.user.create({ data: { gymId: actor.gymId, name: data.name, email, role: data.role, passwordHash: hashPassword(data.password), active: true } });
  await audit({ gymId: actor.gymId, actorId: actor.id, action: "STAFF_CREATED", entityType: "User", entityId: staff.id, after: { role: staff.role, active: true } });
  revalidatePath("/staff");
}

export async function updateStaff(formData: FormData) {
  const actor = await owner();
  const data = staffInput.extend({ staffId: z.string().cuid(), active: z.enum(["true", "false"]) }).parse(Object.fromEntries(formData));
  const staff = await db.user.findFirstOrThrow({ where: { id: data.staffId, gymId: actor.gymId } });
  if (staff.id === actor.id || staff.role === "OWNER") throw new Error("The Owner account cannot be changed here.");
  const email = data.email.toLowerCase();
  const duplicate = await db.user.findFirst({ where: { email, NOT: { id: staff.id } } });
  if (duplicate) throw new Error("That email is already used by another account.");
  const updated = await db.user.update({ where: { id: staff.id }, data: { name: data.name, email, role: data.role, active: data.active === "true", ...(data.password ? { passwordHash: hashPassword(data.password) } : {}) } });
  await audit({ gymId: actor.gymId, actorId: actor.id, action: "STAFF_UPDATED", entityType: "User", entityId: updated.id, before: { role: staff.role, active: staff.active }, after: { role: updated.role, active: updated.active } });
  revalidatePath("/staff");
}
