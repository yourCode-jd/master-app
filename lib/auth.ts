import "server-only";
import { createHmac, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hasPermission, type Permission, type Role } from "@/lib/permissions";

const cookieName = "gym_demo_session";
const secret = process.env.SESSION_SECRET ?? "development-only-secret";
type SessionPayload = { userId: string; gymId: string; role: Role; expiresAt: number };

function signature(input: string) { return createHmac("sha256", secret).update(input).digest("base64url"); }
function encode(payload: SessionPayload) { const body = Buffer.from(JSON.stringify(payload)).toString("base64url"); return `${body}.${signature(body)}`; }
function decode(value?: string): SessionPayload | null {
  if (!value) return null;
  const [body, supplied] = value.split(".");
  if (!body || !supplied || supplied.length !== signature(body).length) return null;
  if (!timingSafeEqual(Buffer.from(supplied), Buffer.from(signature(body)))) return null;
  try { const data = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload; return data.expiresAt > Date.now() ? data : null; } catch { return null; }
}

export function verifyPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const actual = scryptSync(password, salt, 64).toString("hex");
  return actual.length === expected.length && timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}
export async function createSession(user: { id: string; gymId: string; role: string }) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, encode({ userId: user.id, gymId: user.gymId, role: user.role as Role, expiresAt: Date.now() + 8 * 60 * 60 * 1000 }), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 8 * 60 * 60 });
}
export async function clearSession() { (await cookies()).delete(cookieName); }
export async function getSession() { return decode((await cookies()).get(cookieName)?.value); }
export async function requireUser(permission?: Permission) {
  const session = await getSession();
  if (!session) redirect("/login");
  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user || !user.active || user.gymId !== session.gymId) redirect("/login");
  if (permission && !hasPermission(user.role, permission)) redirect("/forbidden");
  return user;
}
export async function requireRole(allowed: Role[]) { const user = await requireUser(); if (!allowed.includes(user.role as Role)) redirect("/forbidden"); return user; }
