"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function ClosingSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    section.classList.add("landing-close--prep");
    if (typeof IntersectionObserver === "undefined") {
      section.classList.add("landing-close--in");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("landing-close--in");
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
    <section ref={sectionRef} className="landing-close" id="closing" aria-labelledby="close-title">
      {/* Large liquid chrome form rising from the bottom */}
      <div className="landing-close-liquid" aria-hidden="true">
        <svg viewBox="0 0 1440 780" preserveAspectRatio="none">
          <defs>
            <linearGradient id="clBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8AB6F9" stopOpacity="0.55" />
              <stop offset="0.5" stopColor="#CADCFC" stopOpacity="0.9" />
              <stop offset="1" stopColor="#eef4ff" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="clDeep" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#00246B" />
              <stop offset="1" stopColor="#0a3b9e" />
            </linearGradient>
          </defs>

          <path
            d="M-40 560 C 220 480 380 640 640 600 C 900 560 1040 360 1480 470 L 1480 820 L -40 820 Z"
            fill="url(#clBody)"
            opacity="0.85"
          />
          <path
            className="cl-deep"
            d="M-40 720 C 300 640 560 780 900 700 C 1120 650 1280 560 1480 610 L 1480 820 L -40 820 Z"
            fill="url(#clDeep)"
            opacity="0.35"
          />
          {/* specular rim along the crest */}
          <path
            className="cl-rim"
            d="M-40 560 C 220 480 380 640 640 600 C 900 560 1040 360 1480 470"
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Final CTA */}
      <div className="landing-close-main">
        <p className="landing-close-eyebrow reveal cl-1">Klazz</p>

        <h2 id="close-title" className="landing-close-title">
          <span className="reveal cl-2">Know what happened.</span>
          <span className="reveal cl-3">Know what changed.</span>
          <span className="landing-close-title-line reveal cl-4">
            Know what&rsquo;s true now.
          </span>
        </h2>

        <p className="landing-close-support reveal cl-4">
          An AI Chief of Staff that remembers the history and understands what still applies.
        </p>

        <div className="landing-close-cta reveal cl-5">
          <Link href="/app" className="landing-close-btn">
            Ask Klazz
          </Link>
          <a
            className="landing-close-ghost"
            href="https://github.com/OutstandingVick/klazz"
            target="_blank"
            rel="noopener noreferrer"
          >
            View GitHub
          </a>
        </div>

        {/* small memory reward */}
        <div className="landing-close-cue reveal cl-5" aria-hidden="true">
          <span className="cl-cue-old">SEP 12</span>
          <span className="cl-cue-arrow">&rarr;</span>
          <span className="cl-cue-new">OCT 3</span>
          <span className="cl-cue-label">previous &middot; current</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="landing-close-footer">
        <div className="landing-close-footer-grid">
          <div className="landing-close-brand">
            <span className="landing-close-brand-name">Klazz</span>
            <span className="landing-close-brand-tag">Institutional Memory for AI Executives</span>
            <span className="landing-close-brand-line">What happened. What changed. What&rsquo;s still true.</span>
          </div>

          <div className="landing-close-footcol">
            <span className="landing-close-footcol-label">Product</span>
            <a href="#how-it-works">How it works</a>
            <a href="#product">Product</a>
            <a href="#hydradb">HydraDB</a>
          </div>

          <div className="landing-close-footcol">
            <span className="landing-close-footcol-label">Project</span>
            <a
              href="https://github.com/OutstandingVick/klazz/blob/docs/klazz-documentation/README.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
            <a
              href="https://github.com/OutstandingVick/klazz"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <span>HackHydra 2026</span>
          </div>
        </div>

        <div className="landing-close-footer-bottom">
          <span>&copy; 2026 Klazz</span>
          <span>Built for HackHydra 2026</span>
        </div>
      </footer>
    </section>
  );
}
