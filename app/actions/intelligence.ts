"use server";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { runIntelligenceV2 } from "@/lib/intelligence-run-v2";
export async function runIntelligenceNow() { const user=await requireUser("settings:view"); const run=await runIntelligenceV2(user.gymId); await audit({gymId:user.gymId,actorId:user.id,action:"INTELLIGENCE_RUN",entityType:"IntelligenceRun",entityId:run.id,after:{members:run.membersEvaluated,newItems:run.newItems}}); revalidatePath("/"); revalidatePath("/attention"); return; }
