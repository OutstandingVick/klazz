"use client";

import { useEffect, useRef } from "react";

export default function HydraDBSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    section.classList.add("landing-hydra--prep");
    if (typeof IntersectionObserver === "undefined") {
      section.classList.add("landing-hydra--in");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("landing-hydra--in");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="landing-hydra" id="hydradb" aria-labelledby="hydra-title">
      {/* Intro */}
      <div className="landing-hydra-top">
        <p className="landing-hydra-eyebrow reveal hy-1">Powered by HydraDB</p>
        <h2 id="hydra-title" className="landing-hydra-title reveal hy-2">
          Connected context in.
          <span>Current truth out.</span>
        </h2>
        <p className="landing-hydra-intro reveal hy-3">
          HydraDB stores and retrieves Klazz&rsquo;s organizational context &mdash;
          connecting company history, sources and relationships so Klazz can determine
          what still applies.
        </p>
      </div>

      {/* Technical flow pipeline */}
      <div className="landing-hydra-flow">
        {/* 01 · INGEST */}
        <div className="hd-step reveal hy-4">
          <span className="hd-label">01 &middot; Ingest</span>
          <span className="hd-main">Company history</span>
          <ul className="hd-items">
            <li>decisions</li>
            <li>meetings</li>
            <li>metrics</li>
            <li>ownership</li>
            <li>commitments</li>
          </ul>
          <span className="hd-meta">30&ndash;40 sessions</span>
        </div>

        <div className="hd-conn" aria-hidden="true">
          <span className="hd-conn-line" />
          <span className="hd-conn-arrow">&rarr;</span>
        </div>

        {/* 02 · STORE + RETRIEVE */}
        <div className="hd-step hd-step--core reveal hy-5">
          <span className="hd-label">02 &middot; Store + Retrieve</span>
          <span className="hd-main">HydraDB</span>
          <span className="hd-body">
            Persistent company knowledge with metadata, provenance and connected context.
          </span>
          <span className="hd-orb" aria-hidden="true" />
        </div>

        <div className="hd-conn" aria-hidden="true">
          <span className="hd-conn-line" />
          <span className="hd-conn-arrow">&rarr;</span>
        </div>

        {/* 03 · CONNECT */}
        <div className="hd-step reveal hy-6">
          <span className="hd-label">03 &middot; Connect</span>
          <span className="hd-main">Relevant relationships</span>
          <div className="hd-path" aria-label="Hiring affects burn, burn affects runway">
            <span className="hd-path-node">Hiring</span>
            <span className="hd-path-edge">affects</span>
            <span className="hd-path-node">Burn</span>
            <span className="hd-path-edge">affects</span>
            <span className="hd-path-node">Runway</span>
          </div>
          <span className="hd-meta">Graph / context-aware retrieval</span>
        </div>

        <div className="hd-conn" aria-hidden="true">
          <span className="hd-conn-line" />
          <span className="hd-conn-arrow">&rarr;</span>
        </div>

        {/* 04 · RESOLVE */}
        <div className="hd-step reveal hy-7">
          <span className="hd-label">04 &middot; Resolve</span>
          <span className="hd-main">Temporal truth</span>
          <div className="hd-resolve" aria-label="September 12 superseded by October 3">
            <span className="hd-resolve-old">SEP 12</span>
            <span className="hd-resolve-edge">superseded by</span>
            <span className="hd-resolve-new">OCT 3</span>
          </div>
          <span className="hd-meta">Klazz selects the state valid for the question.</span>
        </div>

        <div className="hd-conn" aria-hidden="true">
          <span className="hd-conn-line" />
          <span className="hd-conn-arrow">&rarr;</span>
        </div>

        {/* 05 · ANSWER */}
        <div className="hd-step reveal hy-8">
          <span className="hd-label">05 &middot; Answer</span>
          <span className="hd-main">Answer + evidence</span>
          <div className="hd-output" aria-label="Current launch is October 3">
            <b>OCT 3</b>
            <i>Current launch</i>
          </div>
          <span className="hd-meta">Evidence attached &middot; 3 supporting sessions</span>
        </div>
      </div>

      {/* Secondary technical proof row */}
      <div className="landing-hydra-proof" role="list" aria-label="Why HydraDB matters">
        <div className="hd-proof reveal hy-8" role="listitem">
          <span className="hd-proof-label">Persistent Context</span>
          <span className="hd-proof-copy">Company history remains available across sessions.</span>
          <span className="hd-proof-meta">Long-history retrieval</span>
        </div>
        <div className="hd-proof reveal hy-8" role="listitem">
          <span className="hd-proof-label">Connected Retrieval</span>
          <span className="hd-proof-copy">
            Related people, projects, decisions and constraints can be retrieved together.
          </span>
          <span className="hd-proof-meta">Graph / context aware</span>
        </div>
        <div className="hd-proof reveal hy-8" role="listitem">
          <span className="hd-proof-label">Provenance</span>
          <span className="hd-proof-copy">Answers retain the sessions and evidence they came from.</span>
          <span className="hd-proof-meta">Inspectable sources</span>
        </div>
      </div>

      {/* Sponsor annotation */}
      <div className="landing-hydra-foot">
        <p className="landing-hydra-note reveal hy-9">
          Without HydraDB, Klazz loses its connected organizational context layer.
        </p>
      </div>
    </section>
  );
}
