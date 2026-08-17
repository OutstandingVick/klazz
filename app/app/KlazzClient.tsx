"use client";
import { FormEvent, useState } from "react";
import type { AskResult } from "../lib/klazz";
const prompts = ["When are we launching now?", "What was our launch date in June?", "Why can’t we hire another engineer before launch?", "Who is our lawyer?"];

export default function KlazzClient() {
  const [question, setQuestion] = useState(prompts[0]);
  const [result, setResult] = useState<AskResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(true);
  async function ask(nextQuestion = question) {
    setQuestion(nextQuestion); setLoading(true); setError(null);
    try {
      const response = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: nextQuestion }) });
      const body = await response.json();
      if (!response.ok || body.state === "error") throw new Error(body.message ?? "Klazz could not answer that question.");
      setResult(body); setEvidenceOpen(true);
    } catch (cause) { setResult(null); setError(cause instanceof Error ? cause.message : "Klazz could not answer that question."); } finally { setLoading(false); }
  }
  function submit(event: FormEvent) { event.preventDefault(); void ask(); }
  return <main className="shell">
    {/* eslint-disable-next-line @next/next/no-img-element -- static SVG brand mark sized via CSS */}
    <header className="topbar"><img className="brandMark" src="/klazz-mark.svg" alt="" /><div><strong>Klazz</strong><span>Institutional Memory for AI Executives</span></div><div className="systemStatus"><i /> HydraDB-backed</div></header>
    <section className="workspace">
      <div className="intro"><p className="eyebrow">Lumen Labs · Company memory</p><h1>Ask what changed.<br />Know what’s still true.</h1><p className="lede">Klazz traces company decisions across time, resolves what superseded what, and shows the evidence behind every answer.</p></div>
      <form className="askCard" onSubmit={submit}><label htmlFor="question">Ask about the company</label><div className="questionRow"><input id="question" value={question} onChange={event => setQuestion(event.target.value)} disabled={loading} aria-label="Company question" /><button disabled={loading || question.trim().length < 3}>{loading ? "Checking memory…" : <>Ask Klazz <span>→</span></>}</button></div><div className="promptRow"><span>Try</span>{prompts.slice(1).map(prompt => <button type="button" key={prompt} onClick={() => void ask(prompt)} disabled={loading}>{prompt}</button>)}</div></form>
      {error && <section className="errorCard" role="alert"><div><strong>Klazz couldn’t reach company memory</strong><p>{error}</p></div><button type="button" onClick={() => void ask()} disabled={loading}>Retry</button></section>}
      {!result && !error && <section className="emptyCard"><span>01</span><div><strong>Ask one question to begin</strong><p>Klazz will query HydraDB and show the supporting company memory here.</p></div></section>}
      {result && <section className={`answerCard ${result.state !== "answer" ? "abstainCard" : ""}`} aria-live="polite"><div className="answerHead"><span className="stateBadge">{result.state === "conflict" ? "Conflicting memories" : result.temporalStatus === "current" ? "Current state" : result.temporalStatus === "historical" ? "Historical state" : "No supported memory"}</span><span className="verified">Verified from HydraDB</span></div><h2>{result.answer}</h2><p>{result.explanation}</p>
        {result.path.length === 3 && <div className="timeline"><div><small>{result.evidence[0].eventTime.slice(0,10)}</small><strong>{result.path[0]}</strong><span>Superseded plan</span></div><div className="edge"><span>{result.path[1]}</span></div><div className="activeNode"><small>{result.evidence[1].eventTime.slice(0,10)}</small><strong>{result.path[2]}</strong><span>Current plan</span></div></div>}
        {result.path.length > 3 && <div className="dependencyPath" aria-label="HydraDB dependency path">{result.path.map((item,index) => index % 2 === 0 ? <strong key={`${item}-${index}`}>{item}</strong> : <span key={`${item}-${index}`}>{item}</span>)}</div>}
        {result.evidence.length > 0 && <div className="sourceLine"><span>{result.evidence.length}</span> company {result.evidence.length === 1 ? "memory" : "memories"} used <button type="button" onClick={() => setEvidenceOpen(value => !value)}>{evidenceOpen ? "Hide evidence" : "View evidence"}</button></div>}
        {evidenceOpen && result.evidence.length > 0 && <div className="evidenceGrid">{result.evidence.map(item => <article key={item.sessionId}><div><span className={`evidenceState ${item.status}`}>{item.status}</span><time>{item.eventTime.slice(0,10)}</time></div><strong>{item.value}</strong><code>{item.sessionId}</code></article>)}</div>}
        <footer className="verification">Query {result.verification.queryId ?? "—"} · read epoch {result.verification.readEpoch ?? "—"}</footer></section>}
    </section>
  </main>;
}
