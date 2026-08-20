import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <header className="landing-hero">
      <nav className="landing-nav" aria-label="Primary">
        <Link className="landing-wordmark" href="/" aria-label="Klazz home">
          <span className="landing-wordmark-mark" aria-hidden="true">
            <Image src="/klazz-mark.svg" alt="" width={29} height={29} />
          </span>
          <span className="landing-wordmark-text">Klazz</span>
        </Link>

        <div className="landing-nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#product">Product</a>
          <a href="#hydradb">HydraDB</a>
          <a
            href="https://github.com/OutstandingVick/klazz/blob/docs/klazz-documentation/README.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </a>
          <Link className="landing-nav-cta" href="/app">Try Klazz</Link>
        </div>
      </nav>

      <div className="landing-hero-inner">
        <div className="landing-copy">
          <p className="landing-eyebrow">Institutional memory for AI executives</p>

          <h1 className="landing-title">
            <span className="landing-title-line">Your company remembers everything.</span>
            <span className="landing-title-line landing-title-line--emphasis">
              Klazz knows what&rsquo;s still true.
            </span>
          </h1>

          <p className="landing-lede">
            An AI Chief of Staff that understands what happened, what changed,
            and which decisions, facts and commitments still matter now.
          </p>

          <div className="landing-cta-row">
            <Link href="/app" className="landing-cta landing-cta--primary">
              Try Klazz <span aria-hidden="true">↗</span>
            </Link>
            <a href="#how-it-works" className="landing-cta landing-cta--secondary">
              See how it works
            </a>
          </div>
        </div>

        <div className="landing-stage" aria-label="Abstract Klazz memory sculpture">
          <Image
            className="landing-stage-image"
            src="/hero-memory-sculpture.png"
            alt="Abstract glass and chrome memory sculpture on a dark architectural stage"
            fill
            priority
            sizes="(max-width: 820px) 100vw, 62vw"
          />
          <span className="landing-stage-vignette" aria-hidden="true" />
          <span className="landing-stage-frame" aria-hidden="true" />
          <span className="landing-stage-index" aria-hidden="true">K / 01</span>

          <div className="landing-cue" aria-label="September 12 was superseded by October 3">
            <span className="landing-cue-label">Temporal state</span>
            <span className="landing-cue-pair">
              <span><i>Previous</i> SEP&nbsp;12</span>
              <span className="landing-cue-arrow" aria-hidden="true">→</span>
              <span className="landing-cue-now"><i>Current</i> OCT&nbsp;3</span>
            </span>
          </div>
        </div>
      </div>

      <div className="landing-hero-rail" aria-hidden="true">
        <span>Memory</span><i /><span>Context</span><i /><span>Current truth</span>
      </div>
    </header>
  );
}
