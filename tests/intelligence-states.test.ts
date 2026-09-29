import assert from "node:assert/strict";
import test from "node:test";
import { evaluateAttendance, evaluateMembership } from "@/lib/intelligence";

test("lapsed attendance and expired membership expose distinct behavioral states", () => {
  assert.ok(evaluateAttendance({ daysSinceVisit: 30, baselineVisits: 2, currentVisits: 0 }).some((rule) => rule.state === "LAPSED"));
  assert.equal(evaluateMembership(-1)[0].state, "WIN_BACK");
});
