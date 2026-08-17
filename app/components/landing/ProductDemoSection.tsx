"use client";

import { useEffect, useRef, useState } from "react";
import EvidenceItem from "./EvidenceItem";
import TemporalState from "./TemporalState";
import DemoQuestionSelector from "./DemoQuestionSelector";

type Evidence = {
  meta: string;
  value: string;
  caption: string;
  state: string;
  tone?: "muted" | "current";
};

type Demo = {
  id: string;
  chip: string;
  question: string;
  answerLabel: string;
  answer: string;
  supporting: string;
  temporal?: {
    previous?: { value: string; label: string };
    current: { value: string; label: string };
    currentLabel?: string;
    asOf?: string;
  };
  connection?: { nodes: string[]; edges: string[] };
  abstain?: { q: string; line: string };
  evidence: Evidence[];
  trace: { retrieved: string; resolved: string; result: string };
};

const DEMOS: Record<string, Demo> = {
  current: {
    id: "current",
    chip: "When are we launching now?",
    question: "When are we launching now?",
    answerLabel: "CURRENT ANSWER",
    answer: "October 3",
    supporting:
      "The September 12 launch date was superseded after the migration delay recorded on July 27.",
    temporal: {
      previous: { value: "SEP 12", label: "PREVIOUS" },
      current: { value: "OCT 3", label: "CURRENT" },
      currentLabel: "CURRENT",
    },
    evidence: [
      { meta: "SESSION 06 · MAY 14", value: "Launch → Sep 12", caption: "Original decision", state: "PREVIOUS" },
      { meta: "SESSION 24 · JUL 27", value: "Migration delayed", caption: "Reason for change", state: "CONTEXT" },
      { meta: "SESSION 29 · AUG 02", value: "Launch → Oct 3", caption: "Revised decision", state: "CURRENT", tone: "current" },
    ],
    trace: { retrieved: "3 sessions", resolved: "1 superseded fact", result: "Current state" },
  },
  historical: {
    id: "historical",
    chip: "What was our launch date in June?",
    question: "What was our launch date in June?",
    answerLabel: "AS OF JUNE",
    answer: "September 12",
    supporting:
      "In June, before the migration delay, the recorded launch date was still September 12.",
    temporal: {
      current: { value: "SEP 12", label: "ACTIVE" },
      asOf: "June 2026",
    },
    evidence: [
      { meta: "SESSION 06 · MAY 14", value: "Launch → Sep 12", caption: "Original decision", state: "ACTIVE", tone: "current" },
      { meta: "SESSION 24 · JUL 27", value: "Migration delayed", caption: "Reason for change", state: "LATER" },
      { meta: "SESSION 29 · AUG 02", value: "Launch → Oct 3", caption: "Revised decision", state: "LATER" },
    ],
    trace: { retrieved: "3 sessions", resolved: "1 historical state", result: "State as of June" },
  },
  connected: {
    id: "connected",
    chip: "Why can’t we hire another engineer?",
    question: "Why can’t we hire another engineer?",
    answerLabel: "EXPLAINED",
    answer: "Hiring is constrained by runway",
    supporting:
      "Engineering hiring affects burn, burn reduces runway, and falling below the runway floor requires board approval.",
    connection: {
      nodes: ["Engineer", "Burn", "Runway", "Board target"],
      edges: ["affects", "affects", "constrained by"],
    },
    evidence: [
      { meta: "SESSION 11 · MAR 02", value: "Engineering hiring open", caption: "Business rule", state: "CONTEXT" },
      { meta: "SESSION 18 · JUN 30", value: "Burn → $84k/mo", caption: "Metric", state: "CONTEXT" },
      { meta: "SESSION 20 · JUL 27", value: "Runway floor", caption: "Constraint", state: "CONTEXT" },
    ],
    trace: { retrieved: "4 sessions", resolved: "1 constraint chain", result: "Constrained state" },
  },
  unknown: {
    id: "unknown",
    chip: "Who is our lawyer?",
    question: "Who is our lawyer?",
    answerLabel: "ABSTAINED",
    answer: "I don’t have a recorded company memory that answers that yet.",
    supporting: "Klazz abstains rather than inventing a plausible guess from unrelated memory.",
    abstain: {
      q: "WHO IS OUR LAWYER?",
      line: "No supported company memory found.",
    },
    evidence: [
      { meta: "SESSION — · —", value: "No matching record", caption: "Search across history", state: "ABSTAIN" },
    ],
    trace: { retrieved: "0 sessions", resolved: "0 facts", result: "Abstained" },
  },
};

const ORDER = ["current", "historical", "connected", "unknown"];

export default function ProductDemoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState("current");
  const [active, setActive] = useState<Demo>(DEMOS.current);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    section.classList.add("landing-product--prep");
    if (typeof IntersectionObserver === "undefined") {
      section.classList.add("landing-product--in");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("landing-product--in");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const select = (id: string) => {
    if (id === activeId) return;
    setActiveId(id);
    setLoading(true);
    window.setTimeout(() => {
      setActive(DEMOS[id]);
      setLoading(false);
    }, 320);
  };

  return (
    <section ref={sectionRef} className="landing-product" id="product" aria-labelledby="product-title">
      <div className="landing-product-top">
        <p className="landing-product-eyebrow reveal prod-1">Ask Klazz</p>
        <h2 id="product-title" className="landing-product-title reveal prod-2">
          Ask about the company.
          <span>Get the state that actually applies.</span>
        </h2>
        <p className="landing-product-intro reveal prod-3">
          Klazz retrieves the relevant company history, resolves what changed, and
          shows the evidence behind the answer.
        </p>
      </div>

      <div className="landing-product-frame reveal prod-4">
        {/* Product header */}
        <div className="pd-header">
          <div className="pd-brand">
            <span className="pd-brand-name">Klazz</span>
            <span className="pd-company">Acme AI &middot; Company Memory</span>
          </div>
          <div className="pd-meta">
            <span>Updated Aug 02</span>
            <span>32 sessions</span>
          </div>
        </div>

        {/* Query area */}
        <div className="pd-ask">
          <span className="pd-ask-label">Ask</span>
          <div className="pd-ask-row">
            <span className="pd-input" aria-hidden="true">
              {active.question}
            </span>
            <span className="pd-ask-btn">Ask</span>
          </div>
          <DemoQuestionSelector options={ORDER.map((id) => DEMOS[id])} activeId={activeId} onSelect={select} />
        </div>

        {/* Answer + state + evidence (remounts per question to re-run entrance) */}
        <div className="pd-output" key={active.id}>
          {loading ? (
            <div className="pd-loading" role="status">
              <span className="pd-loading-dot" /> Resolving against company history&hellip;
            </div>
          ) : (
            <>
              <div className="pd-answer">
                <span className="pd-answer-label">{active.answerLabel}</span>
                <span className="pd-answer-value">{active.answer}</span>
                <span className="pd-answer-support">{active.supporting}</span>
              </div>

              {active.temporal && (
                <TemporalState
                  previous={active.temporal.previous}
                  current={active.temporal.current}
                  currentLabel={active.temporal.currentLabel}
                  asOf={active.temporal.asOf}
                />
              )}

              {active.connection && (
                <div className="pd-connection" aria-label="Relationship path">
                  {active.connection.nodes.map((node, i) => (
                    <span className="pd-conn-chain" key={i}>
                      <span className="pd-conn-node">{node}</span>
                      {active.connection!.edges[i] && (
                        <span className="pd-conn-edge">{active.connection!.edges[i]}</span>
                      )}
                    </span>
                  ))}
                </div>
              )}

              {active.abstain && (
                <div className="pd-abstain">
                  <span className="pd-abstain-q">{active.abstain.q}</span>
                  <span className="pd-abstain-line">{active.abstain.line}</span>
                  <span className="pd-abstain-halt">Klazz stops here.</span>
                </div>
              )}

              <div className="pd-evidence-grid" role="list" aria-label="Supporting evidence">
                {active.evidence.map((e, i) => (
                  <EvidenceItem key={i} {...e} />
                ))}
              </div>

              <div className="pd-trace">
                <span className="pd-trace-label">Why this answer</span>
                <span className="pd-trace-row">
                  <i>RETRIEVED</i> {active.trace.retrieved}
                  <i>RESOLVED</i> {active.trace.resolved}
                  <i>RESULT</i> {active.trace.result}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
