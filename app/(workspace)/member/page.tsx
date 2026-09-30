import { DsBadge, DsCard, StatCard } from "@/components/design-system";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function MemberDashboardPage() {
  const user = await requireRole(["MEMBER"]);
  const member = await db.member.findFirst({
    where: { gymId: user.gymId, userId: user.id },
    include: {
      trainer: { select: { name: true } },
      memberships: { orderBy: { endDate: "desc" }, take: 1 },
      visits: { orderBy: { visitedAt: "desc" }, take: 12 },
      goals: { where: { isPrimary: true }, orderBy: { createdAt: "desc" }, take: 1 },
      journeys: { include: { tasks: true }, orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!member) return <><header className="page-header"><div><p className="eyebrow">Member account</p><h1>Profile setup needed</h1><p>This login is valid, but it is not linked to a member profile.</p></div></header><DsCard><h2 className="section-title">Member profile is not linked to this login account</h2><p className="small">Ask the gym team to link this account before using the member dashboard. No staff or admin pages are available from this account.</p></DsCard></>;

  const membership = member.memberships[0];
  const primaryGoal = member.goals[0];
  const journey = member.journeys[0];
  return <><header className="page-header"><div><p className="eyebrow">My membership</p><h1>Welcome back, {member.fullName.split(" ")[0]}</h1><p>Your membership, progress, and next steps in one private view.</p></div><DsBadge tone={member.memberState === "AT_RISK" ? "warning" : "success"}>{member.memberState.replaceAll("_", " ")}</DsBadge></header><section className="stat-grid"><StatCard label="Membership" value={membership?.status ?? member.membershipStatus} note={membership ? `${membership.planName} · ends ${membership.endDate.toLocaleDateString("en-IN")}` : "No membership record"}/><StatCard label="Recent visits" value={member.visits.length} note={member.visits[0] ? `Last visit ${member.visits[0].visitedAt.toLocaleDateString("en-IN")}` : "No visits recorded yet"}/><StatCard label="Primary goal" value={primaryGoal?.title ?? "Not set"} note={primaryGoal?.targetDate ? `Target ${primaryGoal.targetDate.toLocaleDateString("en-IN")}` : "Set a goal with your trainer"}/><StatCard label="Journey" value={journey ? `${journey.tasks.length} steps` : "Not started"} note={journey ? `${journey.tasks.filter((task) => task.status === "COMPLETED").length} complete` : "Your next steps will appear here"}/></section><section className="detail-grid"><DsCard><h2 className="section-title">Your next steps</h2><p className="small">Trainer: {member.trainer?.name ?? "To be assigned"}</p><div className="profile-actions"><a className="button button-primary" href={`/members/${member.id}`}>View my profile</a><a className="button button-outline" href={`/members/${member.id}/progress`}>My progress</a><a className="button button-outline" href={`/members/${member.id}/journey`}>My journey</a><a className="button button-outline" href={`/members/${member.id}/experience`}>Feedback & support</a></div></DsCard><DsCard><h2 className="section-title">Privacy</h2><p className="small">This account is restricted to your own member information. Team dashboards, staff queues, and admin settings are not available.</p><a className="button button-outline" href="/community">My community</a></DsCard></section></>;
}
