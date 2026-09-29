import { notFound } from "next/navigation";
import { createIntervention, interventionTypes } from "@/app/actions/intervention-workflow";
import { DsButton, DsCard, DsInput, DsSelect, DsTextarea, Field } from "@/components/design-system";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { assertMemberAccess } from "@/lib/members";

type Search = Promise<{ attentionId?: string; memberId?: string }>;
const title = (type: string) => type.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());

export default async function NewInterventionPage({ searchParams }: { searchParams: Search }) {
  const user = await requireUser("members:write");
  const query = await searchParams;
  const attention = query.attentionId ? await db.attentionItem.findFirst({ where: { id: query.attentionId, gymId: user.gymId }, include: { member: true } }) : null;
  const memberId = attention?.memberId ?? query.memberId;
  if (!memberId) notFound();
  const member = await assertMemberAccess(user, memberId, true);
  const trainers = user.role === "TRAINER" ? [] : await db.user.findMany({ where: { gymId: user.gymId, role: "TRAINER" }, select: { id: true, name: true }, orderBy: { name: "asc" } });
  return <><header className="page-header"><div><p className="eyebrow">Trainer action</p><h1>Create intervention</h1><p>Assign a clear, time-bound next step for {member.fullName}.</p></div></header><DsCard><form action={createIntervention} className="form-grid"><input type="hidden" name="memberId" value={member.id}/>{attention && <input type="hidden" name="attentionItemId" value={attention.id}/>}<Field label="Member"><DsInput value={member.fullName} readOnly/></Field><Field label="Intervention type"><DsSelect name="type" defaultValue={attention?.ruleId.includes("review") ? "PROGRAM_REASSESSMENT" : "TRAINER_CHECK_IN"}>{interventionTypes.map((type) => <option value={type} key={type}>{title(type)}</option>)}</DsSelect></Field><Field label="Title"><DsInput name="title" defaultValue={attention?.title ?? ""} placeholder="Short action title"/></Field><Field label="Priority"><DsSelect name="priority" defaultValue={attention?.priority ?? "MEDIUM"}><option>CRITICAL</option><option>HIGH</option><option>MEDIUM</option><option>LOW</option><option>OPPORTUNITY</option></DsSelect></Field>{user.role !== "TRAINER" && <Field label="Assign trainer"><DsSelect name="assignedToId" defaultValue={member.trainerId ?? ""}><option value="">Use member trainer / assign later</option>{trainers.map((trainer) => <option key={trainer.id} value={trainer.id}>{trainer.name}</option>)}</DsSelect></Field>}<Field label="Due date"><DsInput name="dueAt" type="date" defaultValue={(attention?.dueAt ?? new Date(Date.now() + 3 * 86400000)).toISOString().slice(0, 10)} required/></Field><Field label="Reason"><DsTextarea name="reason" defaultValue={attention?.reason ?? ""} required/></Field><Field label="Recommended action"><DsTextarea name="recommendedAction" defaultValue={attention?.recommendedAction ?? ""} required/></Field><Field label="Planning notes"><DsTextarea name="notes" placeholder="Context for the assigned staff member"/></Field><div className="form-actions"><DsButton type="submit">Create intervention</DsButton><a className="button button-outline" href={attention ? "/attention" : `/members/${member.id}`}>Cancel</a></div></form></DsCard></>;
}
