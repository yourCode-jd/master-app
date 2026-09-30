import { db } from "../lib/db";

async function runAll() {
  const now = new Date();
  const overdueComplaints = await db.complaint.findMany({ where: { status: "OPEN", followUpDate: { lt: now } }, select: { id: true, gymId: true, description: true } });
  for (const complaint of overdueComplaints) {
    await db.complaint.update({ where: { id: complaint.id }, data: { status: "ESCALATED" } });
    await db.notification.create({ data: { gymId: complaint.gymId, type: "COMPLAINT_ESCALATED", title: "Complaint follow-up overdue", body: complaint.description, entityType: "Complaint", entityId: complaint.id } });
  }
  const dueDiscomfort = await db.discomfortReport.findMany({ where: { status: "ACTIVE", followUpDate: { lte: now } }, select: { id: true, gymId: true, bodyArea: true } });
  for (const report of dueDiscomfort) await db.notification.create({ data: { gymId: report.gymId, type: "PAIN_FOLLOW_UP_DUE", title: "Discomfort follow-up due", body: `Check in about ${report.bodyArea}; record a non-medical training update.`, entityType: "DiscomfortReport", entityId: report.id } });
  console.log(`Experience checks completed: ${overdueComplaints.length} complaint escalation(s), ${dueDiscomfort.length} discomfort reminder(s).`);
}
runAll().catch((error) => { console.error(error); process.exitCode = 1; });
