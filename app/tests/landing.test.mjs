import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const base = process.env.KLAZZ_TEST_URL;
const clientSource = await readFile(new URL("../app/KlazzClient.tsx", import.meta.url), "utf8");
const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const thinkingSource = await readFile(new URL("../components/landing/HowKlazzThinks.tsx", import.meta.url), "utf8");
const heroSource = await readFile(new URL("../components/landing/Hero.tsx", import.meta.url), "utf8");
const problemSource = await readFile(new URL("../components/landing/ProblemSection.tsx", import.meta.url), "utf8");
const closingSource = await readFile(new URL("../components/landing/ClosingSection.tsx", import.meta.url), "utf8");

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
    ["Why can’t we hire another engineer before launch?", "answer", "Hiring must wait until launch to protect the nine-month runway."],
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

test("hero is the cinematic Klazz memory campaign", () => {
  assert.match(heroSource, /Your company remembers everything\./);
  assert.match(heroSource, /Klazz knows what&rsquo;s still true\./);
  assert.match(heroSource, /hero-memory-sculpture\.png/);
  assert.match(heroSource, /Previous[\s\S]*SEP&nbsp;12[\s\S]*Current[\s\S]*OCT&nbsp;3/);
  assert.doesNotMatch(heroSource, /landing-liquid|<svg/);
  for (const item of ["How it works", "Product", "HydraDB", "Try Klazz"]) {
    assert.ok(heroSource.includes(item), `missing ${item} navigation item`);
  }
  assert.match(css, /@media \(max-width: 860px\)[\s\S]*?\.landing-hero-inner\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.landing-stage-image\s*\{\s*animation:\s*none/);
});

test("documentation is linked from the navbar and footer", () => {
  const docsUrl = "https://github.com/OutstandingVick/klazz/blob/docs/klazz-documentation/README.md";
  assert.ok(heroSource.includes(docsUrl), "navbar must link to the documentation");
  assert.ok(closingSource.includes(docsUrl), "footer must link to the documentation");
});

test("The Problem is a responsive editorial memory grid", () => {
  assert.match(problemSource, /Company truth changes\. Old information doesn&rsquo;t disappear\./);
  assert.match(problemSource, /The system can retrieve both the old answer and the new one/);
  for (const change of ["SEP 12", "OCT 3", "$120K", "$90K", "OPEN", "FROZEN", "Maya", "Amara"]) {
    assert.ok(problemSource.includes(change), `missing ${change} state`);
  }
  assert.match(problemSource, /Relevant &ne; Current/);
  assert.match(css, /\.problem-collage\s*\{[\s\S]*?grid-template-columns:\s*repeat\(4,/);
  assert.match(css, /@media \(max-width: 680px\)[\s\S]*?\.problem-collage\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\)/);
});

test("How Klazz Thinks is an editorial four-scene gallery", () => {
  assert.match(thinkingSource, /Company memory only works when the system understands/);
  for (const behavior of ["Remember", "Connect", "Resolve", "Know when not to answer"]) {
    assert.ok(thinkingSource.includes(`<h3>${behavior}</h3>`), `missing ${behavior} story tile`);
  }
  assert.doesNotMatch(thinkingSource, /landing-think-ribbon|Memory is useful/);
  assert.match(css, /\.landing-think-gallery\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,/);
  assert.match(css, /\.landing-think-tile--abstain\s*\{[\s\S]*?grid-column:\s*1 \/ -1/);
  assert.match(css, /@media \(max-width: 680px\)[\s\S]*?\.landing-think-gallery\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\)/);
});

test("How Klazz Thinks headline uses a centered two-line editorial lockup", () => {
  assert.match(thinkingSource, /<span>Company memory only works when the system understands<\/span>/);
  assert.match(thinkingSource, /<span[^>]*>what happened, how it connects, and what still applies\.<\/span>/);
  assert.match(css, /\.landing-think-top\s*\{[\s\S]*?text-align:\s*center/);
  assert.match(css, /\.landing-think-title span\s*\{\s*display:\s*block/);
});

test("failure and retry affordances remain present", () => {
  assert.match(clientSource, /errorCard/, "app renders an error state");
  assert.match(clientSource, />Retry</, "app exposes a retry control");
  assert.match(clientSource, /Checking memory…/, "app shows a loading state while retrying");
});

test("historical evidence distinguishes past validity from current status", () => {
  assert.match(clientSource, /As of June 30, 2026/, "historical answers name their knowledge cutoff");
  assert.match(clientSource, /Active at that time — now superseded/, "historical evidence explains its status transition");
});
