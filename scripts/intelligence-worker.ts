import { db } from "../lib/db";
import { runIntelligenceV2 } from "../lib/intelligence-run-v2";

const intervalMinutes = Number(process.env.INTELLIGENCE_INTERVAL_MINUTES ?? 60);
async function runAll() {
  const gyms = await db.gym.findMany({ select: { id: true } });
  for (const gym of gyms) await runIntelligenceV2(gym.id);
  console.log(`Intelligence completed for ${gyms.length} gym(s).`);
}
runAll().catch((error) => { console.error(error); process.exitCode = 1; });
setInterval(() => { runAll().catch(console.error); }, intervalMinutes * 60_000);
