import { notFound } from "next/navigation";
import { DsBadge, DsCard } from "@/components/design-system";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { assertMemberAccess } from "@/lib/members";

type Params = Promise<{ id: string }>;
const label = (value: string) => value.replaceAll("_", " ");
const tone = (priority: string) => priority === "CRITICAL" ? "danger" : priority === "HIGH" ? "warning" : "info" as const;
export default async function MemberInterventionHistory({ params }: { params: Params }) {
  const user = await requireUser(); const { id } = await params;
  try { await assertMemberAccess(user, id, false); } catch { notFound(); }
  const [member, interventions] = await Promise.all([db.member.findFirst({ where: { id, gymId: user.gymId }, select: { fullName: true } }), db.intervention.findMany({ where: { gymId: user.gymId, memberId: id, ...(user.role === "TRAINER" ? { assignedToId: user.id } : {}) }, include: { assignedTo: { select: { name: true } }, interactions: { orderBy: { occurredAt: "desc" }, take: 1 } }, orderBy: { createdAt: "desc" } })]);
  if (!member) notFound();
  return <><header className="page-header"><div><p className="eyebrow">Member history</p><h1>Interventions for {member.fullName}</h1><p>A complete record of assigned actions, staff contact, and follow-up.</p></div><a className="button button-outline" href={`/members/${id}`}>Back to member</a></header><DsCard>{interventions.length ? <div className="list">{interventions.map((item) => <article className="trainer-work-item" key={item.id}><div><a className="member-link" href={`/trainer/interventions/${item.id}`}><strong>{item.title}</strong><span>{label(item.type)} · {label(item.status)}</span></a><p className="small">{item.reason}</p><p className="small">Assigned: {item.assignedTo?.name ?? "Unassigned"} · Due {item.dueAt.toLocaleDateString("en-IN")}</p>{item.interactions[0] && <p className="small">Latest contact: {item.interactions[0].occurredAt.toLocaleDateString("en-IN")}</p>}</div><DsBadge tone={tone(item.priority)}>{item.priority}</DsBadge></article>)}</div> : <p className="empty-state"><strong>No interventions yet</strong><br/>Actions created from intelligence or by staff will appear here.</p>}</DsCard></>;
}
