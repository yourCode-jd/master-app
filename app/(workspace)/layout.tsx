import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import type { Role } from "@/lib/permissions";
export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) { const user = await requireUser("dashboard:view"); return <AppShell user={{ name: user.name, role: user.role as Role }}>{children}</AppShell>; }
