"use client";

import { useEffect, useRef } from "react";

export default function ThenNowSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    section.classList.add("landing-thennow--prep");
    if (typeof IntersectionObserver === "undefined") {
      section.classList.add("landing-thennow--in");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("landing-thennow--in");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="landing-thennow" id="then-now" aria-labelledby="tn-title">
      {/* Intro */}
      <div className="landing-thennow-top">
        <p className="landing-thennow-eyebrow reveal tn-1">Then / Now</p>
        <h2 id="tn-title" className="landing-thennow-title reveal tn-2">
          The answer changes when the truth changes.
        </h2>
        <p className="landing-thennow-sub reveal tn-3">
          Klazz knows which version belongs to the moment you&rsquo;re asking about.
        </p>
      </div>

      {/* Split-screen comparison */}
      <div className="landing-thennow-split">
        <svg
          className="landing-thennow-ribbon"
          viewBox="0 0 1400 400"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="tnRibbon" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#8AB6F9" stopOpacity="0.55" />
              <stop offset="0.5" stopColor="#CADCFC" stopOpacity="0.9" />
              <stop offset="1" stopColor="#8AB6F9" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <path
            d="M-40 210 C 380 210 420 150 700 150 C 980 150 1020 210 1440 210"
            fill="none"
            stroke="url(#tnRibbon)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        {/* THEN */}
        <div className="tn-side tn-then" role="group" aria-label="Then, June 2026">
          <span className="tn-label reveal tn-4">Then</span>
          <span className="tn-meta reveal tn-4">June 2026</span>
          <p className="tn-question reveal tn-5">What was our launch date in June?</p>
          <span className="tn-value reveal tn-6">SEP 12</span>
          <span className="tn-support reveal tn-6">Valid at the time</span>
          <span className="tn-source reveal tn-6">Session 06 &middot; May 14</span>
        </div>

        {/* Center connector / change event */}
        <div className="tn-connector" aria-hidden="true">
          <span className="tn-axis" />
          <span className="tn-connector-body reveal tn-7">
            <b>SUPERSEDED</b>
            <i>Migration delay &middot; Jul 27</i>
          </span>
          <span className="tn-arrow">&rarr;</span>
        </div>

        {/* NOW */}
        <div className="tn-side tn-now" role="group" aria-label="Now, current state">
          <span className="tn-label reveal tn-8">Now</span>
          <span className="tn-meta reveal tn-8">Current state</span>
          <p className="tn-question reveal tn-9">When are we launching now?</p>
          <span className="tn-value reveal tn-10">OCT 3</span>
          <span className="tn-support reveal tn-10">Current launch</span>
          <span className="tn-source reveal tn-10">Session 29 &middot; Aug 02</span>
        </div>
      </div>

      {/* Final statement */}
      <footer className="landing-thennow-final">
        <p className="landing-thennow-final-line reveal tn-10">
          Same history. Different moment. Both answers correct.
        </p>
        <p className="landing-thennow-final-sub reveal tn-11">
          That&rsquo;s the difference between retrieval and temporal memory.
        </p>
        <span className="landing-thennow-micro reveal tn-11">Temporal state resolved</span>
      </footer>
    </section>
  );
}
