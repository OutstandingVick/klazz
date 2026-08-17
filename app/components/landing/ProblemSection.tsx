"use client";

import { useEffect, useRef } from "react";

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    section.classList.add("landing-problem--prep");
    if (typeof IntersectionObserver === "undefined") {
      section.classList.add("landing-problem--in");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("landing-problem--in");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.18 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="landing-problem" id="problem" aria-labelledby="problem-title">
      {/* Top row: eyebrow + headline (left) / short intro (right) */}
      <div className="landing-problem-top">
        <div className="landing-problem-top-head">
          <p className="landing-problem-eyebrow reveal reveal-1">The Problem</p>
          <h2 id="problem-title" className="landing-problem-title">
            <span className="reveal reveal-2">Company truth changes.</span>
            <span className="reveal reveal-3">Old information doesn&rsquo;t disappear.</span>
          </h2>
        </div>
        <p className="landing-problem-intro reveal reveal-3">
          Launch dates move, budgets change, owners shift and plans get replaced
          &mdash; while every previous version stays in company history.
        </p>
      </div>

      {/* Main timeline: PREVIOUS → CHANGE → CURRENT */}
      <div className="landing-problem-grid" role="list" aria-label="A single company fact changing over time">
        {/* Previous state */}
        <div className="landing-problem-col landing-problem-col--previous reveal reveal-4" role="listitem">
          <span className="landing-problem-meta">May 14</span>
          <span className="landing-problem-value">SEP 12</span>
          <span className="landing-problem-support">Original launch</span>
          <span className="landing-problem-status">Previous</span>
        </div>

        {/* Change event (connector passes through) */}
        <div className="landing-problem-col landing-problem-col--change reveal reveal-5" role="listitem">
          <span className="landing-problem-change-orb" aria-hidden="true" />
          <span className="landing-problem-meta">Jul 27</span>
          <span className="landing-problem-change-main">Migration delayed</span>
          <span className="landing-problem-support">Launch decision revised</span>
          <span className="landing-problem-meta landing-problem-meta--dim">SESSION 18</span>
        </div>

        {/* Current state */}
        <div className="landing-problem-col landing-problem-col--current reveal reveal-6" role="listitem">
          <span className="landing-problem-meta">Aug 02</span>
          <span className="landing-problem-value landing-problem-value--current">OCT 3</span>
          <span className="landing-problem-support">Current launch</span>
          <span className="landing-problem-status landing-problem-status--current">Current</span>
        </div>
      </div>

      {/* Connector rule spanning the three columns */}
      <div className="landing-problem-rule" aria-hidden="true">
        <span className="landing-problem-rule-line" />
        <span className="landing-problem-rule-orb" />
        <span className="landing-problem-rule-line" />
        <span className="landing-problem-rule-arrow">&rarr;</span>
      </div>

      {/* Secondary examples: broader changing truth */}
      <div className="landing-problem-examples" role="list" aria-label="Other examples of changing company truth">
        <h3 className="landing-problem-examples-head reveal reveal-6">
          Other examples of changing company truth
        </h3>

        <div className="landing-problem-example reveal reveal-7" role="listitem">
          <span className="landing-problem-example-label">Budget</span>
          <span className="landing-problem-example-flow">$120K &rarr; $90K</span>
          <span className="landing-problem-example-caption">Revised</span>
        </div>

        <div className="landing-problem-example reveal reveal-7" role="listitem">
          <span className="landing-problem-example-label">Project owner</span>
          <span className="landing-problem-example-flow">Maya &rarr; Amara</span>
          <span className="landing-problem-example-caption">Reassigned</span>
        </div>

        <div className="landing-problem-example reveal reveal-7" role="listitem">
          <span className="landing-problem-example-label">Hiring</span>
          <span className="landing-problem-example-flow">OPEN &rarr; FROZEN</span>
          <span className="landing-problem-example-caption">Board decision</span>
        </div>
      </div>

      {/* Bottom insight */}
      <div className="landing-problem-insight reveal reveal-8">
        <span className="landing-problem-insight-tag">Relevant &ne; Current</span>
        <span className="landing-problem-insight-body">
          A retrieval system can find the right information and still return the wrong state.
        </span>
        <span className="landing-problem-insight-accent">
          Klazz is designed to understand the difference.
        </span>
      </div>
    </section>
  );
}
