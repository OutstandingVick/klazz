"use client";

import { useEffect, useRef } from "react";

export default function HowKlazzThinks() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    section.classList.add("landing-think--prep");
    if (typeof IntersectionObserver === "undefined") {
      section.classList.add("landing-think--in");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("landing-think--in");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="landing-think" id="how-it-works" aria-labelledby="think-title">
      <div className="landing-think-top">
        <p className="landing-think-eyebrow reveal think-1">How Klazz thinks</p>
        <h2 id="think-title" className="landing-think-title">
          <span className="reveal think-2">Memory is useful.</span>
          <span className="reveal think-3">Context makes it intelligent.</span>
        </h2>
        <p className="landing-think-intro reveal think-3">
          Klazz doesn&rsquo;t simply retrieve old company information. It connects
          what happened across time, resolves which facts still apply, and refuses
          to invent answers when the evidence isn&rsquo;t there.
        </p>
      </div>

      {/* Continuous chrome ribbon travelling through all four behaviors */}
      <div className="landing-think-ribbon" aria-hidden="true">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="tkRibbon" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#00246B" />
              <stop offset="0.35" stopColor="#8AB6F9" />
              <stop offset="0.7" stopColor="#CADCFC" />
              <stop offset="1" stopColor="#8AB6F9" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M0 60 C 300 60 360 30 600 30 C 840 30 900 90 1200 90"
            fill="none"
            stroke="url(#tkRibbon)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* The four behaviors as one sequence */}
      <div className="landing-think-flow" role="list" aria-label="How Klazz thinks: remember, connect, resolve, and know when not to answer">

        {/* 01 — REMEMBER */}
        <article className="landing-think-item think-item-1 reveal think-4" role="listitem">
          <span className="landing-think-label">01 &mdash; Remember</span>
          <h3 className="landing-think-head">The history stays available.</h3>
          <p className="landing-think-body">
            Decisions, updates, commitments and changing facts remain part of the
            company&rsquo;s memory across sessions.
          </p>
          <div className="landing-think-snippet" aria-label="Historical company moments">
            <span className="tk-snip tk-snip-1">
              <b>May 14</b> Launch &rarr; Sep 12
            </span>
            <span className="tk-snip tk-snip-2">
              <b>June 03</b> Burn &rarr; $72k/mo
            </span>
            <span className="tk-snip tk-snip-3">
              <b>July 27</b> Migration delayed
            </span>
          </div>
        </article>

        {/* 02 — CONNECT */}
        <article className="landing-think-item think-item-2 reveal think-5" role="listitem">
          <span className="landing-think-label">02 &mdash; Connect</span>
          <h3 className="landing-think-head">Facts become context.</h3>
          <p className="landing-think-body">
            Klazz connects people, projects, decisions, metrics and constraints
            instead of treating each memory like an isolated document.
          </p>
          <div className="landing-think-link" aria-label="Hiring affects burn, burn affects runway">
            <span className="tk-link-node">Hiring</span>
            <span className="tk-link-edge">affects</span>
            <span className="tk-link-node">Burn</span>
            <span className="tk-link-edge">affects</span>
            <span className="tk-link-node">Runway</span>
          </div>
        </article>

        {/* 03 — RESOLVE (emphasized) */}
        <article className="landing-think-item landing-think-item--resolve think-item-3 reveal think-6" role="listitem">
          <span className="landing-think-label">03 &mdash; Resolve</span>
          <h3 className="landing-think-head">Klazz knows what changed.</h3>
          <p className="landing-think-body">
            When a newer decision replaces an older one, Klazz keeps both in history
            while returning the state that is valid for the question being asked.
          </p>
          <div className="landing-think-resolve" aria-label="September 12 superseded by October 3">
            <span className="tk-resolve-old">
              <b>SEP 12</b>
              <i>Previous</i>
            </span>
            <span className="tk-resolve-edge">
              <i>superseded by</i>
            </span>
            <span className="tk-resolve-new">
              <b>OCT 3</b>
              <i>Current</i>
            </span>
          </div>
        </article>

        {/* 04 — KNOW WHEN NOT TO ANSWER */}
        <article className="landing-think-item think-item-4 reveal think-7" role="listitem">
          <span className="landing-think-label">04 &mdash; Know when not to answer</span>
          <h3 className="landing-think-head">No memory. No made-up answer.</h3>
          <p className="landing-think-body">
            When the company history doesn&rsquo;t contain enough evidence, Klazz says
            so instead of filling the gap with a plausible guess.
          </p>
          <div className="landing-think-abstain" aria-label="No supported company memory found">
            <span className="tk-abstain-q">WHO IS OUR LAWYER?</span>
            <span className="tk-abstain-line">No supported company memory found.</span>
            <span className="tk-abstain-halt">Klazz stops here.</span>
          </div>
        </article>
      </div>
    </section>
  );
}
