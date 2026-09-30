import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Role } from "@/lib/permissions";
export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) { const user = await requireUser("dashboard:view"); const training = await db.trainingProgress.findFirst({ where: { userId: user.id, status: "ACTIVE" }, select: { scenarioId: true } }); return <AppShell user={{ name: user.name, role: user.role as Role }} training={training}>{children}</AppShell>; }
