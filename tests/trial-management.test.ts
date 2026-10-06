import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { db } from "@/lib/db";

test("trial staff records have an explicit active login state", async () => {
  const staff = await db.user.findUniqueOrThrow({ where: { email: "trainer@demo.gym" } });
  assert.equal(staff.active, true);
});

test("trial management pages are owner-only and tenant-scoped", async () => {
  const [staffPage, reportsPage, auth] = await Promise.all([
    readFile("app/(workspace)/staff/page.tsx", "utf8"),
    readFile("app/(workspace)/reports/page.tsx", "utf8"),
    readFile("lib/auth.ts", "utf8"),
  ]);
  assert.match(staffPage, /requireRole\(\["OWNER"\]\)/);
  assert.match(reportsPage, /requireRole\(\["OWNER"\]\)/);
  assert.match(reportsPage, /gymId: user\.gymId/);
  assert.match(auth, /!user\.active/);
});
