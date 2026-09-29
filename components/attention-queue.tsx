import { runIntelligenceNow } from "@/app/actions/intelligence";
import { DsBadge, DsButton, DsCard } from "@/components/design-system";

type Attention = {
  id: string; memberId: string; title: string; reason: string; priority: string; recommendedAction: string;
  relatedState: string | null; dueAt: Date; assignedRole: string; status: string;
  member: { fullName: string; trainer: { name: string } | null };
};
const tone = (priority: string) => priority === "CRITICAL" ? "danger" : priority === "HIGH" ? "warning" : priority === "OPPORTUNITY" ? "success" : "info" as const;

export function AttentionQueue({ items, canRun, latest }: { items: Attention[]; canRun: boolean; latest: { createdAt: Date; membersEvaluated: number; newItems: number } | null }) {
  return <>
    <header className="page-header"><div><p className="eyebrow">Deterministic intelligence</p><h1>Who needs attention today?</h1><p>Every item explains what changed, why it matters, and what should happen next.</p></div>{canRun && <form action={runIntelligenceNow}><DsButton type="submit">Run intelligence now</DsButton></form>}</header>
    {latest && <p className="small">Last run: {latest.createdAt.toLocaleString("en-IN")} · {latest.membersEvaluated} members evaluated · {latest.newItems} new items</p>}
    <DsCard><div className="attention-table"><table className="table"><thead><tr><th>Member</th><th>Priority</th><th>State</th><th>Reason</th><th>Next action</th><th>Due</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><a className="member-link" href={`/members/${item.memberId}`}><strong>{item.member.fullName}</strong><span>{item.member.trainer?.name ?? item.assignedRole}</span></a></td><td><DsBadge tone={tone(item.priority)}>{item.priority}</DsBadge></td><td>{item.relatedState ?? "—"}</td><td>{item.reason}</td><td><p>{item.recommendedAction}</p><a className="button button-outline button-sm" href={`/trainer/new?attentionId=${item.id}`}>Create intervention</a></td><td>{item.dueAt.toLocaleDateString("en-IN")}</td></tr>)}</tbody></table></div><div className="attention-mobile">{items.map((item) => <article className="member-card-row" key={item.id}><div><a className="member-link" href={`/members/${item.memberId}`}><strong>{item.member.fullName}</strong></a><span>{item.reason}</span></div><DsBadge tone={tone(item.priority)}>{item.priority}</DsBadge><div className="member-card-meta"><span>{item.relatedState ?? "No state change"} · Due {item.dueAt.toLocaleDateString("en-IN")}</span><span>{item.recommendedAction}</span><a className="button button-outline button-sm" href={`/trainer/new?attentionId=${item.id}`}>Create intervention</a></div></article>)}</div>{items.length === 0 && <p className="empty-state"><strong>No matching attention items</strong><br />Try clearing a filter or run the intelligence engine.</p>}</DsCard>
  </>;
}
