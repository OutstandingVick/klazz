import assert from "node:assert/strict";
import test from "node:test";
import { classifyQuestion, shapeResult } from "../lib/klazz.ts";

test("routes current, historical, and absent questions deterministically", () => {
  assert.equal(classifyQuestion("When are we launching now?"), "current");
  assert.equal(classifyQuestion("What was our launch date in June?"), "historical");
  assert.equal(classifyQuestion("Who is our lawyer?"), "unknown");
});

test("shapes a HydraDB current-state row with provenance", () => {
  const result = shapeResult("current", { query_id:"q-1", read_epoch:4, bookmark:"b-4", columns:["current_value","current_session","current_time","previous_value","previous_session","previous_time"], rows:[[
    {type:"string",value:"October 3, 2026"},{type:"string",value:"s2"},{type:"string",value:"2026-07-18T15:00:00Z"},{type:"string",value:"September 12, 2026"},{type:"string",value:"s1"},{type:"string",value:"2026-06-03T10:00:00Z"}
  ]] });
  assert.equal(result.answer, "October 3, 2026");
  assert.deepEqual(result.path, ["September 12, 2026", "SUPERSEDES", "October 3, 2026"]);
  assert.equal(result.evidence.length, 2);
  assert.equal(result.verification.readEpoch, 4);
});

test("empty HydraDB rows produce canonical abstention", () => {
  const result = shapeResult("unknown", { query_id:"q-2", columns:["value"], rows:[] });
  assert.equal(result.state, "abstain");
  assert.equal(result.answer, "I don’t have a recorded company memory that answers that yet.");
  assert.equal(result.evidence.length, 0);
});
