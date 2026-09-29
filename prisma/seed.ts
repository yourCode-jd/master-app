import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto";

import { runIntelligenceV2 } from "../lib/intelligence-run-v2";
const prisma = new PrismaClient();
const daysAgo = (days: number) => new Date(Date.now() - days * 86_400_000);
const daysFromNow = (days: number) => new Date(Date.now() + days * 86_400_000);

function passwordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

const roles = [
  ["Olivia Shah", "owner@demo.gym", "OWNER"],
  ["Maya Patel", "manager@demo.gym", "MANAGER"],
  ["Ravi Mehta", "trainer@demo.gym", "TRAINER"],
  ["Nina Roy", "reception@demo.gym", "RECEPTION"],
  ["Aman Verma", "member@demo.gym", "MEMBER"],
] as const;
const firstNames = ["Aarav", "Anaya", "Kabir", "Isha", "Vihaan", "Meera", "Arjun", "Priya", "Rohan", "Kavya", "Dev", "Sana"];
const lastNames = ["Sharma", "Iyer", "Kapoor", "Singh", "Nair", "Das", "Reddy", "Khan", "Joshi", "Bose"];
const states = ["NEW", "ONBOARDING", "CONSISTENT", "PROGRESSING", "PLATEAU", "DECLINING", "AT_RISK", "LAPSED", "ADVANCING"];
const goals = ["Build strength", "Lose body fat", "Improve mobility", "Run 5K", "Feel more energetic"];

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.attentionItem.deleteMany();
  await prisma.memberStateHistory.deleteMany();
  await prisma.intelligenceRun.deleteMany();
  await prisma.memberActivity.deleteMany();
  await prisma.note.deleteMany();
  await prisma.attentionPreference.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.visit.deleteMany();
  await prisma.member.deleteMany();
  await prisma.user.deleteMany();
  await prisma.gym.deleteMany();

  const gym = await prisma.gym.create({ data: { name: "Forge Fitness — Demo Gym" } });
  await prisma.user.createMany({
    data: roles.map(([name, email, role]) => ({ gymId: gym.id, name, email, role, passwordHash: passwordHash("demo123") })),
  });

  const trainer = await prisma.user.findUniqueOrThrow({ where: { email: "trainer@demo.gym" } });
  const memberUser = await prisma.user.findUniqueOrThrow({ where: { email: "member@demo.gym" } });

  for (let index = 0; index < 120; index += 1) {
    const state = states[index % states.length];
    const fullName = `${firstNames[index % firstNames.length]} ${lastNames[index % lastNames.length]}`;
    const visitGap = state === "AT_RISK" ? 17 : state === "DECLINING" ? 9 : state === "LAPSED" ? 31 : (index % 5) + 1;
    const member = await prisma.member.create({
      data: {
        gymId: gym.id,
        fullName: `${fullName} ${index + 1}`,
        email: `member${index + 1}@example.test`, phone: `+91 90000 ${String(10000 + index).slice(-5)}`,
        membershipStatus: state === "LAPSED" ? "EXPIRED" : index % 10 === 0 ? "EXPIRING" : "ACTIVE",
        memberState: state, attentionLevel: ["AT_RISK", "DECLINING"].includes(state) ? "HIGH" : state === "PLATEAU" ? "MEDIUM" : "LOW",
        joinDate: daysAgo(15 + index * 3), membershipEnd: daysFromNow(index % 10 === 0 ? 12 : 75 + index),
        assignedTrainer: "Ravi Mehta", trainerId: trainer.id, userId: index === 0 ? memberUser.id : undefined, goal: goals[index % goals.length], lastVisit: daysAgo(visitGap),
        memberships: { create: { gymId: gym.id, planName: index % 3 === 0 ? "Quarterly Fitness" : "Annual Membership", amount: index % 3 === 0 ? 9000 : 28000, status: state === "LAPSED" ? "EXPIRED" : "ACTIVE", startDate: daysAgo(15 + index * 3), endDate: daysFromNow(index % 10 === 0 ? 12 : 75 + index) } },
        attentionPreference: { create: { gymId: gym.id, level: index % 4 === 0 ? "CLOSE_COACHING" : "OCCASIONAL_CHECK_IN", contactMethod: "WHATSAPP", noInterruption: index % 7 === 0 } },
        activities: { create: { gymId: gym.id, actorId: trainer.id, type: "MEMBER_JOINED", message: "Member profile created in demo seed." } },
      },
    });
    const recentVisits = state === "LAPSED" ? 0 : state === "AT_RISK" ? 1 : state === "DECLINING" ? 2 : 7;
    if (recentVisits) await prisma.visit.createMany({ data: Array.from({ length: recentVisits }, (_, visit) => ({ gymId: gym.id, memberId: member.id, visitedAt: daysAgo(visitGap + visit * 3) })) });
  }
  const progressMembers = await prisma.member.findMany({ where: { gymId: gym.id }, take: 30, orderBy: { fullName: "asc" } });
  for (let index = 0; index < progressMembers.length; index += 1) {
    const member = progressMembers[index]; const strengthGoal = index % 3 === 1; const startValue = strengthGoal ? 60 : 92; const targetValue = strengthGoal ? 80 : 82; const currentValue = strengthGoal ? 60 + (index % 6) * 4 + 4 : 92 - (index % 6) * 1.8;
    await prisma.goal.create({ data: { gymId: gym.id, memberId: member.id, type: strengthGoal ? "STRENGTH" : "WEIGHT", title: strengthGoal ? "Improve squat strength" : "Healthy weight change", startingValue: startValue, targetValue, unit: strengthGoal ? "kg" : "kg", startDate: daysAgo(75), targetDate: daysFromNow(45), status: index % 11 === 0 ? "COMPLETED" : "ACTIVE", isPrimary: true, notes: "Synthetic demo goal." } });
    await prisma.assessment.create({ data: { gymId: gym.id, memberId: member.id, trainerId: trainer.id, assessedAt: daysAgo(75), weight: strengthGoal ? 78 : 92, bodyFat: strengthGoal ? 24 : 31, strength: strengthGoal ? "Squat 60 kg" : "Squat 40 kg", notes: "Baseline assessment." } });
    await prisma.assessment.create({ data: { gymId: gym.id, memberId: member.id, trainerId: trainer.id, assessedAt: daysAgo(7), weight: strengthGoal ? 78 : currentValue, bodyFat: strengthGoal ? 23 : 28, strength: strengthGoal ? `Squat ${currentValue} kg` : "Squat 52 kg", notes: "Reassessment." } });
    await prisma.progressMetric.createMany({ data: [{ gymId: gym.id, memberId: member.id, type: strengthGoal ? "SQUAT" : "WEIGHT", value: startValue, unit: "kg", recordedAt: daysAgo(75), source: "ASSESSMENT" }, { gymId: gym.id, memberId: member.id, type: strengthGoal ? "SQUAT" : "WEIGHT", value: currentValue, unit: "kg", recordedAt: daysAgo(7), source: "ASSESSMENT" }] });
    if (index % 2 === 0) await prisma.progressReview.create({ data: { gymId: gym.id, memberId: member.id, trainerId: trainer.id, reviewedAt: daysAgo(7), attendance: "Consistent", adherence: "Good", improvements: strengthGoal ? "Strength is increasing" : "Body measurement trend is improving", nextReviewDate: daysFromNow(23), notes: "Synthetic progress review." } });
    if (index % 4 === 0) await prisma.milestone.create({ data: { gymId: gym.id, memberId: member.id, type: "VISIT_10", title: "First 10 visits", achievedAt: daysAgo(10), isAutomatic: true } });
  }
  await prisma.auditLog.create({ data: { gymId: gym.id, action: "DEMO_SEEDED", entityType: "Gym", entityId: gym.id, after: JSON.stringify({ members: 120 }) } });
  await runIntelligenceV2(gym.id);
  const seededAttention = await prisma.attentionItem.findMany({ where: { gymId: gym.id, assignedRole: "TRAINER" }, orderBy: { dueAt: "asc" }, take: 3 });
  for (let index = 0; index < seededAttention.length; index += 1) { const item = seededAttention[index]; await prisma.intervention.create({ data: { gymId: gym.id, memberId: item.memberId, attentionItemId: item.id, type: index === 0 ? "TRAINER_CHECK_IN" : "PROGRAM_REASSESSMENT", reason: item.reason, recommendedAction: item.recommendedAction, assignedToId: trainer.id, assignedRole: "TRAINER", status: index === 0 ? "IN_PROGRESS" : "ASSIGNED", dueAt: item.dueAt, notes: "Seeded trainer action scenario." } }); await prisma.attentionItem.update({ where: { id: item.id }, data: { status: "IN_PROGRESS", assignedUserId: trainer.id } }); }
  console.log("Seeded Forge Fitness demo. Login with any demo email and password: demo123");
}
main().finally(() => prisma.$disconnect());
