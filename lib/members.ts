import "server-only";
import { db } from "@/lib/db";
import type { User } from "@prisma/client";

export async function assertMemberAccess(user: User, memberId: string, write = false) {
  const member = await db.member.findFirst({ where: { id: memberId, gymId: user.gymId } });
  if (!member) throw new Error("Member not found in this gym.");
  if (["OWNER", "MANAGER"].includes(user.role)) return member;
  if (user.role === "TRAINER" && member.trainerId === user.id) return member;
  if (!write && user.role === "RECEPTION") return member;
  if (!write && user.role === "MEMBER" && member.userId === user.id) return member;
  throw new Error("You do not have permission to access this member.");
}

export async function addMemberActivity(input: { gymId: string; memberId: string; actorId?: string; type: string; message: string }) {
  return db.memberActivity.create({ data: input });
}
