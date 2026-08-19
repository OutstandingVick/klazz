import assert from "node:assert/strict";
import test from "node:test";

const base = process.env.KLAZZ_TEST_URL;
const cases = [
  ["When are we launching now?", "answer", "October 3, 2026"],
  ["What was our launch date in June?", "answer", "September 12, 2026"],
  ["What is our current headcount?", "answer", "10 employees"],
  ["What was our headcount in June?", "answer", "8 employees"],
  ["Are we launching a web or mobile product?", "answer", "Web application"],
  ["What blocks another engineering hire?", "answer", "The nine-month runway floor blocks another engineering hire."],
  ["Why can’t we hire another engineer before launch?", "answer", "Hiring must wait until launch to protect the nine-month runway."],
  ["Why must hiring wait until launch?", "answer", "Hiring must wait until launch to protect the nine-month runway."],
  ["Can we hire another engineer before launch?", "answer", "Not without board approval."],
  ["Under what condition could we approve another engineering hire?", "answer", "Another engineering hire can proceed before launch only with board approval."],
  ["What is our revenue?", "abstain", "I don’t have a recorded company memory that answers that yet."],
  ["Who is our lawyer?", "abstain", "I don’t have a recorded company memory that answers that yet."]
];

test("real HTTP journey reaches HydraDB for every golden query", { skip: !base }, async () => {
  for (const [question, state, answer] of cases) {
    const response = await fetch(`${base}/api/ask`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({question}) });
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.state, state);
    assert.ok(body.answer.includes(answer));
    assert.match(body.verification.database, /HydraDB/);
    assert.ok(body.verification.queryId);
  }
});

test("invalid input is a clear 400", { skip: !base }, async () => {
  const response = await fetch(`${base}/api/ask`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({question:""}) });
  assert.equal(response.status, 400);
  assert.match((await response.json()).message, /between 3 and 500/);
});
