import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto";

import { runIntelligenceV2 } from "../lib/intelligence-run-v2";
import { ensureJourney } from "../lib/journey";
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
  await prisma.notification.deleteMany();
  await prisma.groupUpdate.deleteMany();
  await prisma.groupParticipation.deleteMany();
  await prisma.groupActivity.deleteMany();
  await prisma.challengeParticipation.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.groupMembership.deleteMany();
  await prisma.communityGroup.deleteMany();
  await prisma.shiftHandover.deleteMany();
  await prisma.accessIssue.deleteMany();
  await prisma.memberRequest.deleteMany();
  await prisma.visitor.deleteMany();
  await prisma.maintenanceTask.deleteMany();
  await prisma.equipmentIssue.deleteMany();
  await prisma.occupancySnapshot.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.floorZone.deleteMany();
  await prisma.discomfortReport.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.memberFeedback.deleteMany();
  await prisma.outcome.deleteMany();
  await prisma.trainerInteraction.deleteMany();
  await prisma.interventionAssignment.deleteMany();
  await prisma.intervention.deleteMany();
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
  const floorZones = await prisma.$transaction([
    prisma.floorZone.create({ data: { gymId: gym.id, name: "Cardio", description: "Treadmills and cycles", zoneType: "CARDIO", capacity: 24, currentOccupancy: 8, busyState: "NORMAL", sortOrder: 1 } }),
    prisma.floorZone.create({ data: { gymId: gym.id, name: "Free Weights", description: "Racks and dumbbells", zoneType: "FREE_WEIGHTS", capacity: 30, currentOccupancy: 28, busyState: "VERY_BUSY", sortOrder: 2 } }),
    prisma.floorZone.create({ data: { gymId: gym.id, name: "Functional", description: "Open training space", zoneType: "FUNCTIONAL", capacity: 18, currentOccupancy: 3, busyState: "QUIET", sortOrder: 3 } })
  ]);
  const cable = await prisma.equipment.create({ data: { gymId: gym.id, zoneId: floorZones[1].id, name: "Cable crossover", equipmentType: "CABLE_MACHINE", brand: "Forge", assetCode: "FW-CC-01", status: "OUT_OF_SERVICE", condition: "NEEDS_ATTENTION", nextMaintenanceDate: daysAgo(1) } });
  const treadmill = await prisma.equipment.create({ data: { gymId: gym.id, zoneId: floorZones[0].id, name: "Treadmill 03", equipmentType: "TREADMILL", assetCode: "CA-TM-03", condition: "POOR", nextMaintenanceDate: daysAgo(2) } });
  const bench = await prisma.equipment.create({ data: { gymId: gym.id, zoneId: floorZones[1].id, name: "Adjustable bench", equipmentType: "BENCH", assetCode: "FW-BN-04" } });
  await prisma.occupancySnapshot.createMany({ data: floorZones.flatMap((zone, index) => [0, 2, 5, 8].map((hour) => ({ gymId: gym.id, zoneId: zone.id, timestamp: new Date(Date.now() - hour * 3600000), occupancyCount: index === 1 ? 26 + (hour % 3) : index === 0 ? 8 + hour : 3, capacity: zone.capacity, occupancyPercent: index === 1 ? 90 : index === 0 ? 50 : 17, state: index === 1 ? "VERY_BUSY" : index === 0 ? "NORMAL" : "QUIET" }))) });
  await prisma.equipmentIssue.createMany({ data: [{ gymId: gym.id, equipmentId: cable.id, issueType: "BROKEN", severity: "HIGH", description: "Cable handle is worn; taken out of service.", status: "ACKNOWLEDGED" }, { gymId: gym.id, equipmentId: treadmill.id, issueType: "NOISE", severity: "MEDIUM", description: "Belt noise reported during peak period.", status: "REPORTED" }, { gymId: gym.id, equipmentId: treadmill.id, issueType: "PERFORMANCE_PROBLEM", severity: "MEDIUM", description: "Speed control intermittently pauses.", status: "REPORTED" }, { gymId: gym.id, equipmentId: bench.id, issueType: "UNSAFE", severity: "CRITICAL", description: "Loose adjustment pin; do not use.", status: "ACKNOWLEDGED" }] });
  await prisma.equipment.update({ where: { id: bench.id }, data: { status: "OUT_OF_SERVICE", condition: "UNSAFE" } });
  await prisma.maintenanceTask.createMany({ data: [{ gymId: gym.id, equipmentId: cable.id, maintenanceType: "Repair inspection", scheduledDate: daysFromNow(1), status: "SCHEDULED" }, { gymId: gym.id, equipmentId: treadmill.id, maintenanceType: "Preventive maintenance", scheduledDate: daysAgo(2), status: "OVERDUE" }] });
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
  const journeyMembers = await prisma.member.findMany({ where: { gymId: gym.id }, take: 6, orderBy: { fullName: "asc" } }); for (let index = 0; index < journeyMembers.length; index += 1) { const starts = [35, 15, 7, 62, 92, 20]; const journey = await ensureJourney(gym.id, journeyMembers[index].id, trainer.id, daysAgo(starts[index])); if (index === 0) await prisma.journeyTask.updateMany({ where: { journeyId: journey.id, dueDate: { lte: new Date() } }, data: { status: "COMPLETED", completedAt: daysAgo(1), notes: "Healthy onboarding demo." } }); if (index === 1) await prisma.journeyTask.updateMany({ where: { journeyId: journey.id, taskType: "WEEK_2_ADHERENCE" }, data: { status: "OVERDUE", notes: "Only one visit in the first 14 days." } }); if (index === 5) await prisma.memberJourney.update({ where: { id: journey.id }, data: { status: "PAUSED" } }); }
  console.log("Seeded Forge Fitness demo. Login with any demo email and password: demo123");
  const scenarioMembers = await prisma.member.findMany({ where: { gymId: gym.id }, take: 6, orderBy: { fullName: "asc" } }); const scenarioStatuses = ["IMPROVED", "IMPROVED", "UNCHANGED", "DECLINED", "IMPROVED", "INSUFFICIENT_DATA"]; const scenarioTypes = ["PERSONAL_OUTREACH", "PROGRAM_REASSESSMENT", "TRAINER_CHECK_IN", "TRAINER_CHECK_IN", "RENEWAL_DISCUSSION", "WELCOME_CHECK_IN"]; for (let index = 0; index < scenarioMembers.length; index += 1) { const member = scenarioMembers[index]; const status = scenarioStatuses[index]; const intervention = await prisma.intervention.create({ data: { gymId: gym.id, memberId: member.id, type: scenarioTypes[index], title: ["Attendance recovery", "Plateau reassessment", "No improvement follow-up", "Escalated disengagement", "Renewal retained", "Onboarding data review"][index], reason: "Persisted Phase 6 demo scenario.", recommendedAction: "Review the outcome after the planned follow-up window.", priority: status === "DECLINED" ? "CRITICAL" : "HIGH", assignedToId: trainer.id, assignedRole: "TRAINER", createdByUserId: trainer.id, assignedAt: daysAgo(28), startedAt: daysAgo(25), completedAt: daysAgo(21), status: status === "IMPROVED" ? "CLOSED" : "FOLLOW_UP_DUE", dueAt: daysAgo(14), followUpAt: status === "IMPROVED" ? daysAgo(7) : daysFromNow(7), actionTaken: "Trainer completed the planned member follow-up.", outcomeStatus: status } }); await prisma.outcome.create({ data: { gymId: gym.id, memberId: member.id, interventionId: intervention.id, outcomeStatus: status, evaluationDate: daysAgo(2), evaluationWindowStart: daysAgo(21), evaluationWindowEnd: daysAgo(7), beforeSnapshot: JSON.stringify({ attendancePerWeek: 1.5, state: member.memberState }), afterSnapshot: JSON.stringify({ attendancePerWeek: status === "IMPROVED" ? 3.2 : 1.0, state: member.memberState }), primaryMetric: index === 1 ? "PROGRESS_METRIC" : "ATTENDANCE_PER_WEEK", beforeValue: 1.5, afterValue: status === "IMPROVED" ? 3.2 : 1, changeValue: status === "IMPROVED" ? 1.7 : -0.5, changePercent: status === "IMPROVED" ? 113.33 : -33.33, evaluatorUserId: trainer.id, notes: "Persisted demo outcome.", nextAction: status === "IMPROVED" ? null : "Continue or escalate follow-up.", businessImpactType: index === 4 ? "RENEWAL_RETAINED" : null, businessImpactValue: index === 4 ? 28000 : null } }); }
  const experienceMembers = await prisma.member.findMany({ where: { gymId: gym.id }, take: 6, orderBy: { fullName: "asc" } });
  await prisma.memberFeedback.createMany({ data: [{ gymId: gym.id, memberId: experienceMembers[0].id, feedbackType: "GENERAL", rating: 4, sentiment: "POSITIVE", primaryReason: "Helpful staff", freeText: "Loved the check-in and clean floor.", requestReason: "POST_VISIT" }, { gymId: gym.id, memberId: experienceMembers[1].id, feedbackType: "GENERAL", rating: 1, sentiment: "NEGATIVE", primaryReason: "Gym was crowded", freeText: "The evening floor was too crowded twice this week.", requestReason: "POST_VISIT" }, { gymId: gym.id, memberId: experienceMembers[1].id, feedbackType: "EQUIPMENT", rating: 1, sentiment: "NEGATIVE", primaryReason: "Equipment broken", freeText: "Cable station handle is worn.", requestReason: "POST_VISIT" }, { gymId: gym.id, memberId: experienceMembers[2].id, feedbackType: "SAFETY", rating: 1, sentiment: "NEGATIVE", primaryReason: "Felt uncomfortable", freeText: "Wet surface near the changing room.", requestReason: "POST_VISIT" }, { gymId: gym.id, memberId: experienceMembers[3].id, feedbackType: "TRAINER", rating: 1, sentiment: "NEGATIVE", primaryReason: "Trainer issue", freeText: "Requested a manager-only follow-up.", confidential: true, requestReason: "CHECK_IN" }] });
  const seededFeedback = await prisma.memberFeedback.findMany({ where: { gymId: gym.id }, orderBy: { createdAt: "asc" } });
  await prisma.complaint.createMany({ data: [{ gymId: gym.id, memberId: experienceMembers[1].id, feedbackId: seededFeedback[2].id, category: "EQUIPMENT", severity: "MEDIUM", description: "Cable station handle is worn.", status: "OPEN", followUpRequired: true, followUpDate: daysFromNow(2) }, { gymId: gym.id, memberId: experienceMembers[2].id, feedbackId: seededFeedback[3].id, category: "SAFETY", severity: "CRITICAL", description: "Wet surface near the changing room.", status: "ESCALATED", followUpRequired: true, followUpDate: daysFromNow(1) }, { gymId: gym.id, memberId: experienceMembers[3].id, feedbackId: seededFeedback[4].id, category: "TRAINER", severity: "HIGH", description: "Requested a manager-only follow-up.", status: "OPEN", followUpRequired: true, followUpDate: daysFromNow(3) }] });
  await prisma.discomfortReport.create({ data: { gymId: gym.id, memberId: experienceMembers[4].id, reportedBy: trainer.id, bodyArea: "Right shoulder", description: "Discomfort during overhead press; no diagnosis recorded.", severity: "MEDIUM", triggeringExercise: "Overhead press", temporaryModification: "Use a pain-free range and avoid overhead loading until check-in.", followUpDate: daysFromNow(7) } });
  await prisma.notification.create({ data: { gymId: gym.id, type: "SAFETY_COMPLAINT", title: "Critical member safety complaint", body: "Wet surface near the changing room.", entityType: "Complaint", entityId: seededFeedback[3].id } });
  const receptionMembers = await prisma.member.findMany({ where: { gymId: gym.id }, orderBy: { fullName: "asc" }, take: 4 });
  await prisma.visitor.createMany({ data: [{ gymId: gym.id, name: "Neha Kulkarni", phone: "+91 9000012345", visitType: "TRIAL", expectedAt: daysFromNow(0), status: "EXPECTED", notes: "Evening strength trial." }, { gymId: gym.id, name: "Samir Khan", visitType: "TOUR", expectedAt: daysAgo(0), arrivedAt: daysAgo(0), status: "ARRIVED", notes: "Interested in annual plan." }] });
  await prisma.memberRequest.create({ data: { gymId: gym.id, memberId: receptionMembers[0].id, category: "TRAINER_REQUEST", description: "Would like to discuss a trainer change.", priority: "HIGH", status: "OPEN", dueAt: daysFromNow(1) } });
  await prisma.accessIssue.create({ data: { gymId: gym.id, memberId: receptionMembers[1].id, problem: "QR check-in was denied although membership is active.", status: "OPEN" } });
  await prisma.shiftHandover.create({ data: { gymId: gym.id, createdBy: trainer.id, shiftDate: new Date(), shiftType: "EVENING", note: "Renewal follow-up, cable machine outage, and 6 PM trial still need attention.", priority: "HIGH" } });
  const communityMembers = await prisma.member.findMany({ where: { gymId: gym.id }, orderBy: { fullName: "asc" }, take: 6 });
  const beginnerGroup = await prisma.communityGroup.create({ data: { gymId: gym.id, name: "Beginner Accountability — Group A", description: "Three weekly sessions and a simple check-in.", groupType: "ACCOUNTABILITY", capacity: 10, trainerId: trainer.id, createdByUserId: trainer.id } });
  const runningGroup = await prisma.communityGroup.create({ data: { gymId: gym.id, name: "Weekend Running Group", description: "Supportive Saturday 5K preparation.", groupType: "RUNNING", capacity: 20, trainerId: trainer.id, createdByUserId: trainer.id } });
  await prisma.groupMembership.createMany({ data: communityMembers.slice(0,4).map((member) => ({ groupId: beginnerGroup.id, memberId: member.id, status: "ACTIVE" })) });
  const activity = await prisma.groupActivity.create({ data: { gymId: gym.id, groupId: beginnerGroup.id, title: "Weekly accountability check-in", scheduledAt: daysFromNow(2), location: "Studio", trainerId: trainer.id } });
  await prisma.groupParticipation.createMany({ data: communityMembers.slice(0,3).map((member,index) => ({ groupActivityId: activity.id, memberId: member.id, status: index < 2 ? "ATTENDED" : "MISSED", checkedInAt: index < 2 ? daysAgo(1) : null })) });
  await prisma.groupActivity.create({ data: { gymId: gym.id, groupId: runningGroup.id, title: "Saturday group run", scheduledAt: daysFromNow(4), location: "Reception meeting point", trainerId: trainer.id } });
  await prisma.groupUpdate.create({ data: { groupId: runningGroup.id, title: "Saturday start", message: "The group run starts at 6 AM; bring water.", createdBy: trainer.id } });
  const challenge = await prisma.challenge.create({ data: { gymId: gym.id, groupId: beginnerGroup.id, title: "30-day consistency", description: "Complete 12 gym visits in 30 days.", challengeType: "ATTENDANCE", targetValue: 12, unit: "visits", startDate: daysAgo(14), endDate: daysFromNow(16), createdBy: trainer.id } });
  await prisma.challengeParticipation.createMany({ data: communityMembers.slice(0,4).map((member,index) => ({ challengeId: challenge.id, memberId: member.id, progressValue: 4 + index, progressPercent: Math.round((4 + index) / 12 * 100) })) });
}
main().finally(() => prisma.$disconnect());
