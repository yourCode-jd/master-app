import { db } from "../lib/db";

async function runAll() {
  const now = new Date(); const due = await db.intervention.findMany({ where: { outcome: null, completedAt: { not: null }, OR: [{ followUpAt: { lte: now } }, { followUpAt: null, completedAt: { lte: new Date(now.getTime() - 7 * 86_400_000) } }] }, select: { id: true, gymId: true, title: true, assignedToId: true, followUpAt: true } });
  if (due.length) await db.notification.createMany({ data: due.map((item) => ({ gymId: item.gymId, userId: item.assignedToId, type: item.followUpAt && item.followUpAt < now ? "OUTCOME_REVIEW_OVERDUE" : "OUTCOME_REVIEW_DUE", title: item.followUpAt && item.followUpAt < now ? "Outcome review overdue" : "Outcome review due", body: `Evaluate the outcome of ${item.title}.`, entityType: "Intervention", entityId: item.id })) });
  console.log(`Outcome checks completed: ${due.length} review notification(s).`);
}
runAll().catch((error) => { console.error(error); process.exitCode = 1; });
