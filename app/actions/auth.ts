"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, clearSession, verifyPassword } from "@/lib/auth";

export type LoginState = { error?: string };
const credentials = z.object({ email: z.string().email(), password: z.string().min(1) });
export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = credentials.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "Enter a valid email and password." };
  const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) return { error: "Those demo credentials do not match." };
  await createSession(user);
  redirect("/");
}
export async function logout() { await clearSession(); redirect("/login"); }
