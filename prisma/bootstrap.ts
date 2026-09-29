import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const statements = [
  'CREATE TABLE IF NOT EXISTS "Gym" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)',
  'CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL PRIMARY KEY, "gymId" TEXT NOT NULL, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "role" TEXT NOT NULL, "passwordHash" TEXT NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE)',
  'CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")',
  'CREATE INDEX IF NOT EXISTS "User_gymId_role_idx" ON "User"("gymId", "role")',
  'CREATE TABLE IF NOT EXISTS "Member" ("id" TEXT NOT NULL PRIMARY KEY, "gymId" TEXT NOT NULL, "fullName" TEXT NOT NULL, "email" TEXT NOT NULL, "phone" TEXT NOT NULL, "membershipStatus" TEXT NOT NULL, "memberState" TEXT NOT NULL, "attentionLevel" TEXT NOT NULL, "joinDate" DATETIME NOT NULL, "membershipEnd" DATETIME NOT NULL, "assignedTrainer" TEXT, "goal" TEXT NOT NULL, "lastVisit" DATETIME, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE)',
  'CREATE INDEX IF NOT EXISTS "Member_gymId_memberState_idx" ON "Member"("gymId", "memberState")',
  'CREATE INDEX IF NOT EXISTS "Member_gymId_membershipStatus_idx" ON "Member"("gymId", "membershipStatus")',
  'CREATE TABLE IF NOT EXISTS "Visit" ("id" TEXT NOT NULL PRIMARY KEY, "gymId" TEXT NOT NULL, "memberId" TEXT NOT NULL, "visitedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE)',
  'CREATE INDEX IF NOT EXISTS "Visit_gymId_visitedAt_idx" ON "Visit"("gymId", "visitedAt")',
  'CREATE INDEX IF NOT EXISTS "Visit_memberId_visitedAt_idx" ON "Visit"("memberId", "visitedAt")',
  'CREATE TABLE IF NOT EXISTS "AuditLog" ("id" TEXT NOT NULL PRIMARY KEY, "gymId" TEXT NOT NULL, "actorId" TEXT, "action" TEXT NOT NULL, "entityType" TEXT NOT NULL, "entityId" TEXT NOT NULL, "before" TEXT, "after" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE, FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL)',
  'CREATE INDEX IF NOT EXISTS "AuditLog_gymId_createdAt_idx" ON "AuditLog"("gymId", "createdAt")',
];
async function main() { for (const statement of statements) await prisma.$executeRawUnsafe(statement); console.log("Local Prisma schema initialized."); }
main().finally(() => prisma.$disconnect());
