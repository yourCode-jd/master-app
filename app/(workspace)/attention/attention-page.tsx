import { AttentionQueue } from "@/components/attention-queue";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";

type Search = Promise<{ q?: string; priority?: string; state?: string; status?: string; role?: string }>;
export default async function AttentionPage({ searchParams }: { searchParams: Search }) {
  const user = await requireUser("members:view");
  const filter = await searchParams;
  const scoped = user.role === "TRAINER" ? { member: { trainerId: user.id } } : {};
  const status = filter.status === "RESOLVED" ? ["EXPIRED"] : filter.status ? [filter.status] : ["OPEN", "ASSIGNED", "IN_PROGRESS"];
  const where = { gymId: user.gymId, ...scoped, status: { in: status }, ...(filter.priority ? { priority: filter.priority } : {}), ...(filter.state ? { relatedState: filter.state } : {}), ...(filter.role ? { assignedRole: filter.role } : {}), ...(filter.q ? { OR: [{ member: { fullName: { contains: filter.q, mode: "insensitive" as const } } }, { member: { trainer: { name: { contains: filter.q, mode: "insensitive" as const } } } }] } : {}) };
  const [items, latest] = await Promise.all([
    db.attentionItem.findMany({ where, include: { member: { include: { trainer: { select: { name: true } } } } }, orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }], take: 100 }),
    db.intelligenceRun.findFirst({ where: { gymId: user.gymId }, orderBy: { createdAt: "desc" } }),
  ]);
  return <><form className="filter-bar" action="/attention"><input className="input" name="q" defaultValue={filter.q} placeholder="Search member or trainer" aria-label="Search member or trainer" /><select className="input select" name="priority" defaultValue={filter.priority ?? ""}><option value="">All priorities</option><option>CRITICAL</option><option>HIGH</option><option>MEDIUM</option><option>LOW</option><option>OPPORTUNITY</option></select><select className="input select" name="state" defaultValue={filter.state ?? ""}><option value="">All states</option><option>ONBOARDING</option><option>PLATEAU</option><option>DECLINING</option><option>AT_RISK</option><option>ADVANCING</option></select><select className="input select" name="role" defaultValue={filter.role ?? ""}><option value="">All roles</option><option>TRAINER</option><option>RECEPTION</option></select><select className="input select" name="status" defaultValue={filter.status ?? ""}><option value="">Open items</option><option value="RESOLVED">Resolved items</option></select><button className="button button-outline" type="submit">Filter</button></form><AttentionQueue items={items} latest={latest} canRun={hasPermission(user.role, "settings:view")} /></>;
}
