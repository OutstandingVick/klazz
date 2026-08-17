import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const base = process.env.KLAZZ_TEST_URL;
const clientSource = await readFile(new URL("../app/KlazzClient.tsx", import.meta.url), "utf8");
const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("landing page ships all seven sections in order", { skip: !base }, async () => {
  const html = await (await fetch(`${base}/`)).text();
  const ids = ["how-it-works", "problem", "product", "then-now", "hydradb", "closing"];
  for (const id of ids) assert.ok(html.includes(`id="${id}"`), `missing section #${id}`);
  assert.ok(html.includes("landing-title"), "missing hero title");
  assert.ok(html.indexOf('id="product"') > html.indexOf('id="problem"'), "sections out of order");
});

test("product demo reflects the real Lumen Labs HydraDB corpus", { skip: !base }, async () => {
  const html = await (await fetch(`${base}/`)).text();
  assert.ok(html.includes("Lumen Labs"), "brand company should be Lumen Labs");
  assert.ok(html.includes("38 sessions"), "session count should be 38");
  assert.ok(html.includes("Updated Jul 25"), "latest corpus event is Jul 25");
  assert.ok(html.includes("session-2026-07-18-launch"), "evidence should cite the real launch session");
  assert.ok(html.includes("October 3, 2026"), "current launch answer is October 3, 2026");
});

test("Try Klazz calls to action reach the /app workspace", { skip: !base }, async () => {
  const html = await (await fetch(`${base}/`)).text();
  assert.ok(html.includes('href="/app"'), "landing CTA links to /app");
  const app = await (await fetch(`${base}/app`)).text();
  assert.ok(app.includes("Institutional Memory for AI Executives"), "/app renders the Klazz shell");
  assert.ok(app.includes("Ask Klazz"), "/app renders the question form");
});

test("the four demo questions resolve to their expected states", { skip: !base }, async () => {
  const cases = [
    ["When are we launching now?", "answer", "October 3, 2026"],
    ["What was our launch date in June?", "answer", "September 12, 2026"],
    ["Why can’t we hire another engineer before launch?", "answer", "Do not hire another engineer before launch"],
    ["Who is our lawyer?", "abstain", "I don’t have a recorded company memory that answers that yet."]
  ];
  for (const [question, state, answer] of cases) {
    const response = await fetch(`${base}/api/ask`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({question}) });
    assert.equal(response.status, 200, question);
    const body = await response.json();
    assert.equal(body.state, state, question);
    assert.ok(body.answer.toLowerCase().includes(answer.toLowerCase()), `${question}: expected ${answer}`);
  }
});

test("demo evidence grid adapts to a variable number of sources", () => {
  assert.match(css, /repeat\(auto-fit,\s*minmax\(180px,\s*1fr\)\)/, "evidence grid must be adaptive");
});

test("failure and retry affordances remain present", () => {
  assert.match(clientSource, /errorCard/, "app renders an error state");
  assert.match(clientSource, />Retry</, "app exposes a retry control");
  assert.match(clientSource, /Checking memory…/, "app shows a loading state while retrying");
});
