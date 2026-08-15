import test from "node:test";
import assert from "node:assert/strict";
import { answer, facts, resolveFactAtTime } from "./resolver.mjs";

test("current truth follows explicit supersession", () => {
  const result = answer(facts, "launch_date");
  assert.equal(result.state, "answer");
  assert.equal(result.answer, "October 3, 2026");
  assert.equal(result.supersededFacts[0].fact_value, "September 12, 2026");
});

test("historical truth selects the state valid at the requested time", () => {
  const result = answer(facts, "launch_date", "2026-06-30T23:59:59Z");
  assert.equal(result.answer, "September 12, 2026");
});

test("unknown fact abstains", () => {
  assert.deepEqual(answer(facts, "company_lawyer"), {
    state: "abstain",
    answer: "I don’t have a recorded company memory that answers that yet.",
    evidence: []
  });
});

test("two active terminal states are a conflict", () => {
  const candidates = facts.map(item => ({ ...item, status: "active", supersedes_id: null }));
  assert.equal(resolveFactAtTime(candidates).status, "conflict");
});

test("a time before the first fact is not found", () => {
  assert.equal(resolveFactAtTime(facts, "2026-01-01T00:00:00Z").status, "not_found");
});
