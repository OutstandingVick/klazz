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
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("landing-think--in");
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="landing-think" id="how-it-works" aria-labelledby="think-title">
      <div className="landing-think-inner">
        <header className="landing-think-top">
          <p className="landing-think-eyebrow reveal think-1">How Klazz thinks</p>
          <h2 id="think-title" className="landing-think-title reveal think-2">
            <span>Company memory only works when the system understands</span>
            <span className="text-blue-950">what happened, how it connects, and what still applies.</span>
          </h2>
          <p className="landing-think-intro reveal think-3">
            Klazz turns fragmented company history into usable organizational context.
          </p>
        </header>

        <div className="landing-think-gallery" role="list" aria-label="The four ways Klazz turns company history into context">
          <article className="landing-think-tile landing-think-tile--remember reveal think-4" role="listitem">
            <span className="landing-think-number">01</span>
            <div className="tk-memory-scene" aria-hidden="true">
              <span className="tk-memory-axis" />
              <span className="tk-memory-fragment tk-memory-fragment--one"><b>May 14</b><i>Launch → Sep 12</i></span>
              <span className="tk-memory-fragment tk-memory-fragment--two"><b>Jun 03</b><i>Burn → $72k/mo</i></span>
              <span className="tk-memory-fragment tk-memory-fragment--three"><b>Jul 27</b><i>Migration delayed</i></span>
              <span className="tk-memory-fragment tk-memory-fragment--four"><b>Aug 02</b><i>Launch → Oct 3</i></span>
              <span className="tk-memory-orbit" />
            </div>
            <div className="landing-think-overlay">
              <h3>Remember</h3>
              <span className="landing-think-divider" />
              <p>Company history remains available across sessions.</p>
            </div>
          </article>

          <article className="landing-think-tile landing-think-tile--connect reveal think-5" role="listitem">
            <span className="landing-think-number">02</span>
            <div className="tk-connect-scene" aria-hidden="true">
              <span className="tk-connect-node tk-connect-node--hiring">Hiring</span>
              <span className="tk-connect-line tk-connect-line--one"><i>affects</i></span>
              <span className="tk-connect-node tk-connect-node--burn">Burn</span>
              <span className="tk-connect-line tk-connect-line--two"><i>affects</i></span>
              <span className="tk-connect-node tk-connect-node--runway">Runway</span>
              <span className="tk-connect-glow" />
            </div>
            <div className="landing-think-overlay">
              <h3>Connect</h3>
              <span className="landing-think-divider" />
              <p>Related decisions and dependencies become context.</p>
            </div>
          </article>

          <article className="landing-think-tile landing-think-tile--resolve reveal think-6" role="listitem">
            <span className="landing-think-number">03</span>
            <div className="tk-resolve-scene" aria-label="September 12, previous, superseded by October 3, current">
              <span className="tk-resolve-date tk-resolve-date--old"><b>SEP 12</b><i>Previous</i></span>
              <span className="tk-resolve-flow" aria-hidden="true"><i>Superseded</i></span>
              <span className="tk-resolve-date tk-resolve-date--new"><b>OCT 3</b><i>Current</i></span>
            </div>
            <div className="landing-think-overlay">
              <h3>Resolve</h3>
              <span className="landing-think-divider" />
              <p>Old truth stays in history. Current truth wins now.</p>
            </div>
          </article>

          <article className="landing-think-tile landing-think-tile--abstain reveal think-7" role="listitem">
            <span className="landing-think-number">04</span>
            <div className="tk-abstain-scene" aria-label="Who is our lawyer? No supported memory">
              <span className="tk-abstain-query">Who is our lawyer?</span>
              <span className="tk-abstain-track"><i /></span>
              <span className="tk-abstain-result">No supported memory</span>
              <span className="tk-abstain-space" aria-hidden="true" />
            </div>
            <div className="landing-think-overlay">
              <h3>Know when not to answer</h3>
              <span className="landing-think-divider" />
              <p>No evidence. No invented answer.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
