import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./docs.module.css";

export const metadata: Metadata = {
  title: "Klazz Documentation — Company Memory Powered by HydraDB",
  description: "Architecture, HydraDB integration, API, setup, testing, and demo guidance for Klazz.",
  openGraph: {
    title: "Klazz Documentation — Company Memory Powered by HydraDB",
    description: "Architecture, HydraDB integration, API, setup, testing, and demo guidance for Klazz.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Klazz Documentation — Company Memory Powered by HydraDB",
    description: "Architecture, HydraDB integration, API, setup, testing, and demo guidance for Klazz.",
    images: [],
  },
};

const sections = [
  ["problem", "The problem"],
  ["solution", "What Klazz does"],
  ["hydradb", "Why HydraDB"],
  ["architecture", "Architecture"],
  ["questions", "Demo questions"],
  ["data-model", "Data model"],
  ["setup", "Run locally"],
  ["api", "API reference"],
  ["testing", "Testing"],
  ["limitations", "Limitations"],
] as const;

const demoQuestions = [
  ["When are we launching now?", "Current state", "October 3, 2026"],
  ["What was our launch date in June?", "Historical state", "September 12, 2026"],
  ["What is our current headcount?", "Mutable fact", "10 employees"],
  ["Why must hiring wait until launch?", "Connected context", "Protect the nine-month runway"],
  ["Under what condition could we hire?", "Decision gate", "Only with board approval"],
  ["Who is our lawyer?", "Safe abstention", "No supported company memory"],
] as const;

export default function DocsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Klazz home">
          <span className={styles.brandMark} aria-hidden="true">
            <Image src="/klazz-mark.svg" alt="" width={27} height={27} />
          </span>
          <span>Klazz</span>
        </Link>
        <nav className={styles.nav} aria-label="Documentation navigation">
          <Link className={styles.activeNav} href="/docs">Documentation</Link>
          <a href="https://github.com/OutstandingVick/klazz" target="_blank" rel="noopener noreferrer">GitHub</a>
          <Link className={styles.navCta} href="/app">Ask Klazz</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Documentation · HackHydra 2026</p>
          <h1>Institutional memory that knows what still applies.</h1>
          <p className={styles.heroCopy}>
            Learn how Klazz uses HydraDB to preserve company history, connect related decisions,
            resolve superseded facts, and return evidence-backed answers.
          </p>
          <div className={styles.heroActions}>
            <Link href="/app">Open the product <span aria-hidden="true">↗</span></Link>
            <a href="#setup">Run locally</a>
          </div>
        </div>
        <aside className={styles.heroProof} aria-label="Project summary">
          <span>System</span><strong>HydraDB-backed</strong>
          <span>Corpus</span><strong>40 graph records</strong>
          <span>Evaluation</span><strong>40 questions</strong>
          <span>Answers</span><strong>Evidence constrained</strong>
        </aside>
      </section>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <p>On this page</p>
          <nav aria-label="On this page">
            {sections.map(([id, label], index) => (
              <a href={`#${id}`} key={id}><span>{String(index + 1).padStart(2, "0")}</span>{label}</a>
            ))}
          </nav>
          <div className={styles.sideNote}>
            <span>Live application</span>
            <a href="https://useklazz.vercel.app">useklazz.vercel.app</a>
          </div>
        </aside>

        <article className={styles.content}>
          <section id="problem" className={styles.section}>
            <p className={styles.sectionIndex}>01 · The problem</p>
            <h2>Relevant does not always mean current.</h2>
            <p className={styles.lead}>
              Company truth changes continuously, but old launch dates, budgets, owners, and plans remain
              scattered across meetings, documents, and previous conversations.
            </p>
            <p>
              A conventional retrieval system can find a related memory without knowing whether it still
              applies. Klazz separates retrieval from temporal resolution so an outdated fact is not treated
              as the current answer.
            </p>
            <div className={styles.stateExample}>
              <div><span>Previous</span><strong>SEP 12</strong><small>Recorded Jun 03</small></div>
              <div className={styles.stateEdge}><span>Superseded</span><i aria-hidden="true">→</i><small>Jul 18</small></div>
              <div><span>Current</span><strong>OCT 3</strong><small>Active launch</small></div>
            </div>
          </section>

          <section id="solution" className={styles.section}>
            <p className={styles.sectionIndex}>02 · What Klazz does</p>
            <h2>Memory becomes usable organizational context.</h2>
            <div className={styles.behaviorGrid}>
              <div><span>01</span><h3>Remember</h3><p>Preserve facts with their source and event time.</p></div>
              <div><span>02</span><h3>Connect</h3><p>Retrieve dependencies and related decisions together.</p></div>
              <div><span>03</span><h3>Resolve</h3><p>Select the current or historically valid company state.</p></div>
              <div><span>04</span><h3>Abstain</h3><p>Stop when the graph contains no supported answer.</p></div>
            </div>
          </section>

          <section id="hydradb" className={`${styles.section} ${styles.hydraSection}`}>
            <p className={styles.sectionIndex}>03 · Why HydraDB</p>
            <h2>HydraDB is Klazz&rsquo;s persistent memory layer.</h2>
            <p className={styles.lead}>
              HydraDB performs the product&rsquo;s essential work. It stores dated company facts and relationships,
              retrieves connected context, and returns the provenance needed to verify every answer.
            </p>
            <ul className={styles.checkList}>
              <li>Persistent facts, constraints, timestamps, and source sessions</li>
              <li>Real `SUPERSEDES`, `DEPENDS_ON`, `REDUCES`, and `REQUIRES` relationships</li>
              <li>Authenticated OpenCypher queries with strong consistency</li>
              <li>Query IDs, read epochs, and bookmarks for independent verification</li>
              <li>Durable graph state across service restarts</li>
            </ul>
            <div className={styles.endpoint}>
              <span>HydraDB query endpoint</span>
              <code>POST /v1/graphs/default/query</code>
              <small>X-Graph-Namespace: default · consistency: strong</small>
            </div>
          </section>

          <section id="architecture" className={styles.section}>
            <p className={styles.sectionIndex}>04 · Architecture</p>
            <h2>From question to verifiable result.</h2>
            <div className={styles.architecture} aria-label="Klazz architecture flow">
              <div><span>01</span><strong>User question</strong><small>Next.js interface</small></div>
              <i aria-hidden="true">→</i>
              <div><span>02</span><strong>Classify</strong><small>Current · historical · connected</small></div>
              <i aria-hidden="true">→</i>
              <div className={styles.architectureCore}><span>03</span><strong>HydraDB</strong><small>Store · retrieve · traverse</small></div>
              <i aria-hidden="true">→</i>
              <div><span>04</span><strong>Resolve</strong><small>State valid for the question</small></div>
              <i aria-hidden="true">→</i>
              <div><span>05</span><strong>Answer</strong><small>Evidence attached</small></div>
            </div>
            <div className={styles.infoGrid}>
              <div><h3>Current questions</h3><p>Select the single active fact and retain superseded records as evidence.</p></div>
              <div><h3>Historical questions</h3><p>Apply a time cutoff and select the latest fact valid at that moment.</p></div>
              <div><h3>Connected questions</h3><p>Combine multiple relationship queries only when every required path returns evidence.</p></div>
              <div><h3>Unknown questions</h3><p>Return a canonical abstention when HydraDB finds no matching company memory.</p></div>
            </div>
          </section>

          <section id="questions" className={styles.section}>
            <p className={styles.sectionIndex}>05 · Demo questions</p>
            <h2>See each memory behavior in action.</h2>
            <div className={styles.questionTable} role="table" aria-label="Klazz demo questions">
              <div className={styles.tableHead} role="row"><span>Question</span><span>Behavior</span><span>Expected result</span></div>
              {demoQuestions.map(([question, behavior, result]) => (
                <div className={styles.tableRow} role="row" key={question}>
                  <strong>{question}</strong><span>{behavior}</span><span>{result}</span>
                </div>
              ))}
            </div>
            <Link className={styles.inlineCta} href="/app">Try these questions in Klazz <span aria-hidden="true">→</span></Link>
          </section>

          <section id="data-model" className={styles.section}>
            <p className={styles.sectionIndex}>06 · Data model</p>
            <h2>Company memory is stored as a graph.</h2>
            <div className={styles.modelGrid}>
              <div><span>Node</span><h3>Session</h3><p>Source event containing a session ID and event time.</p></div>
              <div><span>Node</span><h3>Fact</h3><p>A company state with a key, value, status, source, and timestamp.</p></div>
              <div><span>Node</span><h3>Constraint</h3><p>A rule or decision gate connected to operational context.</p></div>
            </div>
            <div className={styles.relationships}>
              {[
                ["ASSERTS", "Session introduced a fact"],
                ["SUPERSEDES", "New state replaced an older state"],
                ["DEPENDS_ON", "Decision relies on another fact"],
                ["REDUCES", "Operational change lowers a metric"],
                ["REQUIRES", "Condition triggers an approval gate"],
              ].map(([name, description]) => <div key={name}><code>{name}</code><span>{description}</span></div>)}
            </div>
          </section>

          <section id="setup" className={styles.section}>
            <p className={styles.sectionIndex}>07 · Run locally</p>
            <h2>Start HydraDB, seed memory, then run Klazz.</h2>
            <p>Prerequisites: Node.js 22.13+, Docker, and Git.</p>
            <h3 className={styles.codeTitle}>1. Clone and start HydraDB</h3>
            <pre><code>{`git clone https://github.com/OutstandingVick/klazz.git
cd klazz
docker build -t klazz-hydradb ./deploy/hydradb
docker run -d --name klazz-hydradb \\
  -p 18443:8443 -p 17687:7687 -p 19090:9090 \\
  -e HYDRADB_TOKEN=local-development-token-32-bytes \\
  -v klazz-hydradb-data:/data/store klazz-hydradb`}</code></pre>
            <h3 className={styles.codeTitle}>2. Configure and seed Klazz</h3>
            <pre><code>{`cd app
cp .env.example .env.local
npm install
npm run seed:reset
npm run dev`}</code></pre>
            <div className={styles.envGrid}>
              <div><code>HYDRADB_URL</code><span>HydraDB HTTP endpoint</span></div>
              <div><code>HYDRADB_TOKEN</code><span>Bearer token used by the graph API</span></div>
              <div><code>KLAZZ_UPSTREAM_URL</code><span>Optional existing Klazz API proxy</span></div>
            </div>
          </section>

          <section id="api" className={styles.section}>
            <p className={styles.sectionIndex}>08 · API reference</p>
            <h2>Ask company memory over HTTP.</h2>
            <div className={styles.apiHeading}><span>POST</span><code>/api/ask</code></div>
            <div className={styles.codeColumns}>
              <div><h3>Request</h3><pre><code>{`{
  "question": "When are we launching now?"
}`}</code></pre></div>
              <div><h3>Response</h3><pre><code>{`{
  "state": "answer",
  "answer": "October 3, 2026",
  "temporalStatus": "current",
  "evidence": [ ... ],
  "path": ["SEP 12", "SUPERSEDES", "OCT 3"],
  "verification": {
    "database": "HydraDB OS · graph default",
    "queryId": "...",
    "readEpoch": 34
  }
}`}</code></pre></div>
            </div>
            <p>Possible states are <code>answer</code>, <code>abstain</code>, and <code>conflict</code>. Invalid input returns HTTP 400; HydraDB timeouts or outages return a retryable HTTP 503 without a fallback answer.</p>
          </section>

          <section id="testing" className={styles.section}>
            <p className={styles.sectionIndex}>09 · Testing and verification</p>
            <h2>The golden path is independently testable.</h2>
            <pre><code>{`# Unit, integration, landing, and responsive tests
npm test

# 40-question evaluation
KLAZZ_TEST_URL=http://localhost:3000 npm run evaluate

# Compare app evidence with direct HydraDB rows
KLAZZ_TEST_URL=http://localhost:3000 \\
HYDRADB_URL=http://127.0.0.1:18443 \\
HYDRADB_TOKEN=local-development-token-32-bytes \\
npm run verify -- "When are we launching now?"`}</code></pre>
            <p>The verification command returns the application evidence, direct strong-consistency HydraDB rows, query IDs, read epochs, and an evidence-match result.</p>
          </section>

          <section id="limitations" className={styles.section}>
            <p className={styles.sectionIndex}>10 · Current limitations</p>
            <h2>A focused, evidence-first MVP.</h2>
            <ul className={styles.limitations}>
              <li>The demo uses a synthetic Lumen Labs corpus instead of a real company workspace.</li>
              <li>Question classification and wording are deterministic for the demonstrated fact families.</li>
              <li>The MVP intentionally does not call an LLM; answers are formatted only from resolved HydraDB evidence.</li>
              <li>HydraDB provides query IDs but no public explorer link for them.</li>
              <li>Authentication, multi-tenant ingestion, and administrative memory editing are future work.</li>
            </ul>
          </section>
        </article>
      </div>

      <footer className={styles.footer}>
        <div><strong>Klazz</strong><span>Institutional Memory for AI Executives</span></div>
        <nav aria-label="Documentation footer">
          <Link href="/">Home</Link><Link href="/app">Product</Link>
          <a href="https://github.com/OutstandingVick/klazz" target="_blank" rel="noopener noreferrer">GitHub</a>
        </nav>
        <span>Built for HackHydra 2026</span>
      </footer>
    </main>
  );
}
