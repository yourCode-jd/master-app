import assert from "node:assert/strict";
import { homeForRole } from "@/lib/role-routing";
import test from "node:test";
import { db } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";
import { simulatorMessagingProvider } from "@/lib/providers";

test("permission matrix prevents reception from member mutations", () => {
  assert.equal(hasPermission("OWNER", "members:manage"), true);
  assert.equal(hasPermission("TRAINER", "members:write"), true);
  assert.equal(hasPermission("RECEPTION", "members:write"), false);
  assert.equal(hasPermission("MEMBER", "members:view"), false);
});

test("messaging simulator is explicitly labeled", async () => {
  const result = await simulatorMessagingProvider.send({ recipient: "+919000000000", template: "check-in", body: "Demo message" });
  assert.equal(result.status, "SIMULATED");
});

test("PostgreSQL seed contains tenant-scoped member and membership records", async () => {
  const gym = await db.gym.findFirstOrThrow();
  const [members, memberships] = await Promise.all([db.member.count({ where: { gymId: gym.id } }), db.membership.count({ where: { gymId: gym.id } })]);
  assert.ok(members >= 100);
  assert.equal(memberships, members);
});
test("member accounts use the member dashboard and have a linked seed profile", async () => { const user = await db.user.findUniqueOrThrow({ where: { email: "member@demo.gym" } }); const member = await db.member.findFirst({ where: { gymId: user.gymId, userId: user.id } }); assert.equal(user.role, "MEMBER"); assert.equal(homeForRole(user.role), "/member"); assert.ok(member); });
