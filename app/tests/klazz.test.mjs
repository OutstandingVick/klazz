import assert from "node:assert/strict";
import test from "node:test";
import { classifyQuestion, combineHydraResponses, cyphersFor, resolveFactAtTime, shapeResult } from "../lib/klazz.ts";

test("routes current, historical, and absent questions deterministically", () => {
  assert.equal(classifyQuestion("When are we launching now?"), "current");
  assert.equal(classifyQuestion("What was our launch date in June?"), "historical");
  assert.equal(classifyQuestion("Who is our lawyer?"), "unknown");
  assert.equal(classifyQuestion("What is our revenue?"), "unknown");
  assert.equal(classifyQuestion("Why can’t we hire another engineer before launch?"), "multi");
  assert.equal(classifyQuestion("What is our company name?"), "stable_name");
  assert.equal(classifyQuestion("Which countries are we launching in?"), "stable_region");
});

test("a zero-row HydraDB response remains empty through combination", () => {
  const result = combineHydraResponses([{ query_id:"q-empty", columns:["value"], rows:[] }]);
  assert.deepEqual(result.rows, []);
  assert.equal(shapeResult("unknown", result).state, "abstain");
});

test("multi-session answers require three real HydraDB relationship queries", () => {
  assert.equal(cyphersFor("multi").length, 3);
  const hydra = combineHydraResponses([
    { query_id:"q1", read_epoch:7, columns:["hire_value","hire_session","hire_time","burn_value","burn_session","burn_time"], rows:[[
      {type:"string",value:"Do not hire another engineer before launch"},{type:"string",value:"s1"},{type:"string",value:"2026-07-22"},{type:"string",value:"Burn exceeds $92,000"},{type:"string",value:"s2"},{type:"string",value:"2026-07-20"}
    ]]},
    { query_id:"q2", read_epoch:7, columns:["runway_value","runway_session","runway_time"], rows:[[{type:"string",value:"Runway below nine months"},{type:"string",value:"s3"},{type:"string",value:"2026-07-21"}]]},
    { query_id:"q3", read_epoch:7, columns:["board_value","board_session","board_time"], rows:[[{type:"string",value:"Board approval required"},{type:"string",value:"s4"},{type:"string",value:"2026-07-23"}]]},
  ]);
  const result = shapeResult("multi", hydra);
  assert.equal(result.state, "answer");
  assert.equal(result.evidence.length, 4);
  assert.deepEqual(result.path.filter((_, index) => index % 2 === 1), ["DEPENDS_ON","REDUCES","REQUIRES"]);
  assert.equal(result.verification.queryId, "q1,q2,q3");
});

test("shapes a HydraDB current-state row with provenance", () => {
  const result = shapeResult("current", { query_id:"q-1", read_epoch:4, bookmark:"b-4", columns:["value","session_id","event_time","status"], rows:[
    [{type:"string",value:"September 12, 2026"},{type:"string",value:"s1"},{type:"string",value:"2026-06-03T10:00:00Z"},{type:"string",value:"superseded"}],
    [{type:"string",value:"October 3, 2026"},{type:"string",value:"s2"},{type:"string",value:"2026-07-18T15:00:00Z"},{type:"string",value:"active"}],
  ] });
  assert.equal(result.answer, "October 3, 2026");
  assert.deepEqual(result.path, ["September 12, 2026", "SUPERSEDES", "October 3, 2026"]);
  assert.equal(result.evidence.length, 2);
  assert.equal(result.verification.readEpoch, 4);
});

test("generic resolver surfaces conflict and not-found states", () => {
  const base = { factKey:"launch_date", eventTime:"2026-07-01T00:00:00Z", status:"active" };
  assert.equal(resolveFactAtTime([{...base,sessionId:"s1",value:"A"},{...base,sessionId:"s2",value:"B"}]).status,"conflict");
  assert.equal(resolveFactAtTime([],null).status,"not_found");
});

test("empty HydraDB rows produce canonical abstention", () => {
  const result = shapeResult("unknown", { query_id:"q-2", columns:["value"], rows:[] });
  assert.equal(result.state, "abstain");
  assert.equal(result.answer, "I don’t have a recorded company memory that answers that yet.");
  assert.equal(result.evidence.length, 0);
});
