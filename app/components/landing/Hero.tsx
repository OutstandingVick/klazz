import Link from "next/link";

export default function Hero() {
  return (
    <header className="landing-hero">
      <nav className="landing-nav" aria-label="Primary">
        <Link className="landing-wordmark" href="/" aria-label="Klazz home">
          <span className="landing-wordmark-mark" aria-hidden="true">
            <svg viewBox="0 0 240 240" width="26" height="26">
              <line x1="80" y1="55" x2="80" y2="185" stroke="#CADCFC" strokeWidth="26" strokeLinecap="square" />
              <line x1="80" y1="120" x2="160" y2="55" stroke="#CADCFC" strokeWidth="26" strokeLinecap="round" />
              <line x1="80" y1="120" x2="160" y2="185" stroke="#CADCFC" strokeWidth="26" strokeLinecap="round" />
              <rect x="73" y="113" width="14" height="14" fill="#00246B" transform="rotate(45 80 120)" />
            </svg>
          </span>
          <span className="landing-wordmark-text">Klazz</span>
        </Link>

        <div className="landing-nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#product">Product</a>
          <a href="#hydradb">HydraDB</a>
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
            An AI Chief of Staff that understands what happened, what
            changed, and which decisions, facts and commitments still matter now.
          </p>

          <div className="landing-cta-row">
            <Link href="/app" className="landing-cta landing-cta--primary">
              Try Klazz
            </Link>
            <a href="#how-it-works" className="landing-cta landing-cta--secondary">
              See how it works
            </a>
          </div>
        </div>

        {/* Decorative flowing liquid-chrome form, part of the environment */}
        <div className="landing-liquid" aria-hidden="true">
          <div className="landing-liquid-glow" />
          <svg
            className="landing-liquid-svg"
            viewBox="0 0 1200 1200"
            preserveAspectRatio="xMidYMid slice"
            role="presentation"
          >
            <defs>
              <linearGradient id="lcMain" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#0a2f86" />
                <stop offset="0.4" stopColor="#00246B" />
                <stop offset="0.75" stopColor="#0b3d96" />
                <stop offset="1" stopColor="#12306e" />
              </linearGradient>
              <linearGradient id="lcMid" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#8AB6F9" />
                <stop offset="0.55" stopColor="#5f9df0" />
                <stop offset="1" stopColor="#2f6cc4" />
              </linearGradient>
              <linearGradient id="lcRim" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f2f7ff" />
                <stop offset="0.6" stopColor="#CADCFC" />
                <stop offset="1" stopColor="#8AB6F9" />
              </linearGradient>
              <radialGradient id="lcDeep" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#001633" stopOpacity="0" />
                <stop offset="0.7" stopColor="#001633" stopOpacity="0.55" />
                <stop offset="1" stopColor="#001633" stopOpacity="0.9" />
              </radialGradient>
              <radialGradient id="lcSpec" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
              <filter id="lcBlur" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="18" />
              </filter>
              <filter id="lcSoft" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="34" />
              </filter>
              <filter id="lcShadow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="40" stdDeviation="50" floodColor="#000c22" floodOpacity="0.55" />
              </filter>
            </defs>

            {/* deep reflected anchor behind */}
            <path
              className="lc-deep"
              d="M940 300 C 1020 420 1100 560 1080 760 C 1060 940 940 1180 720 1180 C 560 1180 480 1030 520 880 C 550 770 640 740 660 640 C 680 540 700 420 940 300 Z"
              filter="url(#lcSoft)"
              fill="url(#lcDeep)"
            />

            {/* main flowing chrome mass */}
            <g filter="url(#lcShadow)">
              <path
                d="M900 0 C 760 120 960 300 1120 360 C 1240 405 1200 560 1120 660 C 1040 790 1060 940 960 1080 C 900 1180 820 1200 760 1130 C 660 1020 700 880 560 780 C 420 674 300 600 260 480 C 232 390 300 320 402 300 C 524 275 600 320 662 382 C 722 442 780 290 880 160 C 940 96 900 30 900 0 Z"
                fill="url(#lcMain)"
              />
              {/* mid blue body ribbon */}
              <path
                d="M420 252 C 600 182 780 262 900 420 C 980 540 960 700 882 850 C 842 930 782 980 720 940 C 640 880 700 700 620 590 C 560 502 502 482 462 412 C 434 362 404 304 420 252 Z"
                fill="url(#lcMid)"
                opacity="0.9"
              />
            </g>

            {/* specular rim running along the top crest of the form */}
            <path
              className="lc-rim"
              d="M430 300 C 560 215 740 252 892 388 C 982 470 990 620 918 748"
              fill="none"
              stroke="url(#lcRim)"
              strokeWidth="34"
              strokeLinecap="round"
              opacity="0.85"
              filter="url(#lcBlur)"
            />
            <path
              className="lc-rim"
              d="M432 298 C 560 214 742 250 894 386 C 982 468 990 620 918 748"
              fill="none"
              stroke="#eef4ff"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.7"
            />

            {/* white specular streaks catching light */}
            <ellipse className="lc-spec" cx="560" cy="330" rx="150" ry="26" fill="url(#lcSpec)" opacity="0.8" filter="url(#lcBlur)" transform="rotate(-18 560 330)" />
            <ellipse className="lc-spec" cx="832" cy="600" rx="120" ry="20" fill="url(#lcSpec)" opacity="0.5" filter="url(#lcBlur)" transform="rotate(24 832 600)" />
            <ellipse className="lc-spec" cx="700" cy="1020" rx="200" ry="30" fill="#CADCFC" opacity="0.35" filter="url(#lcBlur)" transform="rotate(-8 700 1020)" />
          </svg>
        </div>

        {/* subtle temporal-memory cue */}
        <div className="landing-cue" aria-hidden="true">
          <span className="landing-cue-label">superseded</span>
          <span className="landing-cue-pair">
            <span>SEP&nbsp;12</span>
            <span className="landing-cue-arrow">&rarr;</span>
            <span className="landing-cue-now">OCT&nbsp;3</span>
          </span>
        </div>
      </div>
    </header>
  );
}