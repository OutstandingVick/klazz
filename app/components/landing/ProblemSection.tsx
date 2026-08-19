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
      ([entry]) => {
        if (entry?.isIntersecting) {
          section.classList.add("landing-problem--in");
          observer.disconnect();
        }
      },
      { threshold: 0.14 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="landing-problem" id="problem" aria-labelledby="problem-title">
      <div className="landing-problem-shell">
        <div className="landing-problem-lead">
          <article className="problem-statement problem-tile reveal reveal-2">
            <div>
              <p className="problem-kicker">The problem</p>
              <h2 id="problem-title">Company truth changes. Old information doesn&rsquo;t disappear.</h2>
            </div>
            <p>The system can retrieve both the old answer and the new one &mdash; but only one may still apply.</p>
            <span className="problem-ghost-mark" aria-hidden="true">K</span>
          </article>

          <div className="problem-memory problem-tile reveal reveal-1" aria-label="Company memory accumulating over time">
            <div className="problem-memory-glow" aria-hidden="true" />
            <p className="problem-kicker">Company memory / accumulating</p>
            <div className="problem-memory-stack">
              <div className="problem-memory-fragment problem-memory-fragment--one"><time>May 14</time><span>Launch &rarr; Sep 12</span></div>
              <div className="problem-memory-fragment problem-memory-fragment--two"><time>Jul 27</time><span>Migration delayed</span></div>
              <div className="problem-memory-fragment problem-memory-fragment--three"><time>Aug 02</time><span>Launch &rarr; Oct 3</span></div>
            </div>
            <span className="problem-memory-axis" aria-hidden="true" />
            <p className="problem-memory-note">Every version remains retrievable.</p>
          </div>
        </div>

        <p className="problem-support reveal reveal-3">Launch dates move, budgets change, ownership shifts and plans get replaced &mdash; while every previous version stays in company history.</p>

        <div className="problem-collage" aria-label="Examples of company truth changing over time">
          <article className="problem-launch problem-tile reveal reveal-4">
            <p className="problem-kicker">Launch</p>
            <div className="problem-state-pair">
              <div><span className="problem-state-label">Previous</span><strong>SEP 12</strong></div>
              <span className="problem-state-arrow" aria-hidden="true">&darr;</span>
              <div><span className="problem-state-label">Current</span><strong>OCT 3</strong></div>
            </div>
            <div className="problem-event"><span>Migration delay</span><time>Jul 27</time></div>
          </article>

          <article className="problem-budget problem-tile reveal reveal-5">
            <p className="problem-kicker">Budget</p>
            <p className="problem-inline-change"><span>$120K</span><i aria-hidden="true">&rarr;</i><strong>$90K</strong></p>
            <div className="problem-tile-meta"><span>Revised</span><span>Session 18</span></div>
          </article>

          <div className="problem-budget-visual problem-tile reveal reveal-6" aria-label="Budget revised from 120 thousand dollars to 90 thousand dollars">
            <span className="problem-budget-old">$120K</span><span className="problem-budget-arc" aria-hidden="true" />
            <strong>$90K</strong><small>Current allocation</small>
          </div>

          <article className="problem-hiring problem-tile reveal reveal-5">
            <p className="problem-kicker">Hiring</p>
            <div className="problem-state-pair">
              <div><span className="problem-state-label">Previous</span><strong>OPEN</strong></div>
              <span className="problem-state-arrow" aria-hidden="true">&darr;</span>
              <div><span className="problem-state-label">Current</span><strong>FROZEN</strong></div>
            </div>
            <div className="problem-event"><span>Board decision</span><time>Aug 01</time></div>
          </article>

          <article className="problem-owner problem-tile reveal reveal-6">
            <p className="problem-kicker">Project owner</p>
            <p className="problem-inline-change"><span>Maya</span><i aria-hidden="true">&rarr;</i><strong>Amara</strong></p>
            <div className="problem-tile-meta"><span>Reassigned</span><span>Session 22</span></div>
          </article>

          <div className="problem-owner-visual problem-tile reveal reveal-7" aria-label="Migration is now owned by Amara">
            <span>Migration</span><i aria-hidden="true" /><strong>owned by Amara</strong>
          </div>

          <aside className="problem-insight problem-tile reveal reveal-8">
            <strong>Relevant &ne; Current</strong><span>Finding the right memory does not guarantee the right state.</span>
          </aside>
        </div>
      </div>
    </section>
  );
}
