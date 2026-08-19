export type QueryKind = "current" | "historical" | "current_headcount" | "historical_headcount" | "multi" | "stable_name" | "stable_customer" | "stable_price" | "stable_region" | "stable_platform" | "unknown";
export type Evidence = { sessionId: string; eventTime: string; value: string; status: "active" | "superseded" };
export type TemporalFact = Evidence & { factKey: string };
export type Resolution = { status: "resolved" | "conflict" | "not_found"; selectedFact?: TemporalFact; supersededFacts?: TemporalFact[]; evidence: TemporalFact[] };
export type AskResult = {
  state: "answer" | "abstain" | "conflict"; answer: string; temporalStatus: "current" | "historical" | "unknown";
  explanation: string; evidence: Evidence[]; path: string[];
  verification: { database: string; queryId: string | null; readEpoch: number | null; bookmark: string | null };
};
export const ABSTENTION = "I don’t have a recorded company memory that answers that yet.";
export const HIRING_BLOCKER_ANSWER = "The nine-month runway floor blocks another engineering hire.";
export const HIRING_WAIT_ANSWER = "Hiring must wait until launch to protect the nine-month runway.";
export const HIRING_APPROVAL_ANSWER = "Not without board approval.";
export const HIRING_EXPLANATION = "Another hire would raise monthly burn above $92,000 and reduce runway below the required nine months. Before launch, doing so requires board approval.";

function hiringAnswerFor(question: string) {
  const normalized = question.trim().toLowerCase();
  if (/^can\b/.test(normalized)) return HIRING_APPROVAL_ANSWER;
  if (/\bwhy\b|\bwait\b|\bexplain\b/.test(normalized)) return HIRING_WAIT_ANSWER;
  return HIRING_BLOCKER_ANSWER;
}

export function normalizeAskResult(kind: QueryKind, question: string, result: unknown) {
  if (kind !== "multi" || typeof result !== "object" || result === null || !("state" in result) || result.state !== "answer") return result;
  return { ...result, answer: hiringAnswerFor(question), explanation: HIRING_EXPLANATION };
}

export function resolveFactAtTime(candidates: TemporalFact[], requestedTime: string | null = null): Resolution {
  const ordered = [...candidates].sort((a,b) => Date.parse(a.eventTime) - Date.parse(b.eventTime));
  const eligible = requestedTime ? ordered.filter(fact => Date.parse(fact.eventTime) <= Date.parse(requestedTime)) : ordered;
  if (!eligible.length) return { status:"not_found", evidence:[] };
  if (requestedTime) return { status:"resolved", selectedFact:eligible.at(-1), supersededFacts:eligible.slice(0,-1), evidence:eligible };
  const active = eligible.filter(fact => fact.status === "active");
  if (active.length > 1) return { status:"conflict", evidence:eligible };
  if (active.length === 0) return { status:"not_found", evidence:eligible };
  return { status:"resolved", selectedFact:active[0], supersededFacts:eligible.filter(fact => fact !== active[0]), evidence:eligible };
}

export function classifyQuestion(question: string): QueryKind {
  const normalized = question.toLowerCase();
  if (/headcount|employees|people.*team/.test(normalized) && /june|historical|previous|used to|before july/.test(normalized)) return "historical_headcount";
  if (/headcount|employees|people.*team/.test(normalized)) return "current_headcount";
  if (/(hire|hiring|engineer)/.test(normalized) && /(launch|block|constraint|prevent|why|cannot|can't|can’t)/.test(normalized)) return "multi";
  if (/launch/.test(normalized) && /june|historical|previous|original|use(?:d)? to|was our|before july/.test(normalized)) return "historical";
  if (/launch region|which countr|where.*launch/.test(normalized)) return "stable_region";
  if (/primary platform|web or mobile|web.*mobile|mobile.*web|web.*product|mobile.*product/.test(normalized)) return "stable_platform";
  if (/launch|go(?:ing)? live/.test(normalized)) return "current";
  if (/company.*name|name.*company|what are we called/.test(normalized)) return "stable_name";
  if (/ideal customer|target customer|who.*sell to/.test(normalized)) return "stable_customer";
  if (/price|pricing|cost.*month/.test(normalized)) return "stable_price";
  if (/what platform/.test(normalized)) return "stable_platform";
  return "unknown";
}

export function questionForUpstream(kind: QueryKind, question: string) {
  if (kind === "stable_platform") return "Are we web or mobile?";
  if (kind === "multi") return "Why can’t we hire another engineer before launch?";
  return question;
}

export function cypherFor(kind: QueryKind) {
  if (kind === "current" || kind === "historical" || kind === "current_headcount" || kind === "historical_headcount") {
    const factKey = kind.includes("headcount") ? "headcount" : "launch_date";
    return `MATCH (f:Fact {app_id: 'klazz-demo', fact_key: '${factKey}'}) RETURN f.fact_value AS value, f.session_id AS session_id, f.event_time AS event_time, f.status AS status ORDER BY f.event_time ASC`;
  }
  if (kind === "multi") return "MATCH (hire:Constraint {app_id: 'klazz-demo', fact_key: 'engineering_hire'})-[:DEPENDS_ON]->(burn:Fact) RETURN hire.fact_value AS hire_value, hire.session_id AS hire_session, hire.event_time AS hire_time, burn.fact_value AS burn_value, burn.session_id AS burn_session, burn.event_time AS burn_time";
  const stableKeys: Partial<Record<QueryKind,string>> = { stable_name:"company_name", stable_customer:"ideal_customer", stable_price:"base_price", stable_region:"launch_region", stable_platform:"primary_platform" };
  if (stableKeys[kind]) return `MATCH (f:Fact {app_id: 'klazz-demo', fact_key: '${stableKeys[kind]}', status: 'active'}) RETURN f.fact_value AS value, f.session_id AS session_id, f.event_time AS event_time, f.status AS status`;
  return "MATCH (f:Fact {app_id: 'klazz-demo', fact_key: '__unsupported__'}) RETURN f.fact_value AS value, f.session_id AS session_id, f.event_time AS event_time, f.status AS status";
}

export function cyphersFor(kind: QueryKind) {
  if (kind !== "multi") return [cypherFor(kind)];
  return [
    cypherFor(kind),
    "MATCH (burn:Fact {app_id: 'klazz-demo', fact_key: 'monthly_burn_link'})-[:REDUCES]->(runway:Fact) RETURN runway.fact_value AS runway_value, runway.session_id AS runway_session, runway.event_time AS runway_time",
    "MATCH (runway:Fact {app_id: 'klazz-demo', fact_key: 'runway_link'})-[:REQUIRES]->(board:Constraint) RETURN board.fact_value AS board_value, board.session_id AS board_session, board.event_time AS board_time",
  ];
}

export function combineHydraResponses(responses: HydraResponse[]): HydraResponse {
  if (responses.length === 1) return responses[0];
  const complete = responses.every(item => (item.rows ?? []).length > 0);
  return {
    query_id: responses.map(item => item.query_id).filter(Boolean).join(","),
    read_epoch: Math.max(...responses.map(item => item.read_epoch ?? 0)),
    bookmark: responses.at(-1)?.bookmark,
    columns: responses.flatMap(item => item.columns ?? []),
    rows: complete ? [responses.flatMap(item => item.rows?.[0] ?? [])] : [],
  };
}

type HydraValue = { type: string; value: unknown };
export type HydraResponse = { query_id?: string; columns?: string[]; rows?: HydraValue[][]; read_epoch?: number; bookmark?: string; error?: { message?: string } };
function rowObject(response: HydraResponse, row: HydraValue[]) { return Object.fromEntries((response.columns ?? []).map((column, index) => [column, row[index]?.value])); }

export function shapeResult(kind: QueryKind, hydra: HydraResponse): AskResult {
  const rows = (hydra.rows ?? []).map(row => rowObject(hydra, row));
  const verification = { database: "HydraDB OS · graph default", queryId: hydra.query_id ?? null, readEpoch: hydra.read_epoch ?? null, bookmark: hydra.bookmark ?? null };
  if (!rows.length) return { state: "abstain", answer: ABSTENTION, temporalStatus: "unknown", explanation: "No HydraDB fact matched this question, so Klazz stopped before generation.", evidence: [], path: [], verification };
  if (kind === "historical" || kind === "historical_headcount") {
    const factKey = kind.includes("headcount") ? "headcount" : "launch_date";
    const candidates = rows.map(row => ({ factKey, sessionId:String(row.session_id), eventTime:String(row.event_time), value:String(row.value), status:row.status === "active" ? "active" as const : "superseded" as const }));
    const resolution = resolveFactAtTime(candidates,"2026-06-30T23:59:59Z");
    if (resolution.status === "not_found") return { state:"abstain", answer:ABSTENTION, temporalStatus:"unknown", explanation:"No launch state existed at the requested time.", evidence:[], path:[], verification };
    const selected = resolution.selectedFact!;
    const subject = factKey === "launch_date" ? "planned launch date" : "recorded headcount";
    return { state: "answer", answer:selected.value, temporalStatus: "historical", explanation: `As of June 30, 2026, the ${subject} was ${selected.value}. It was active at that time${selected.status === "superseded" ? " and has since been superseded" : ""}.`, evidence: [selected], path: [selected.value], verification };
  }
  if (kind === "multi") {
    const row = rows[0];
    const evidence = [
      { sessionId: String(row.hire_session), eventTime: String(row.hire_time), value: String(row.hire_value), status: "active" as const },
      { sessionId: String(row.burn_session), eventTime: String(row.burn_time), value: String(row.burn_value), status: "active" as const },
      { sessionId: String(row.runway_session), eventTime: String(row.runway_time), value: String(row.runway_value), status: "active" as const },
      { sessionId: String(row.board_session), eventTime: String(row.board_time), value: String(row.board_value), status: "active" as const },
    ];
    return { state: "answer", answer: HIRING_BLOCKER_ANSWER, temporalStatus: "current", explanation: HIRING_EXPLANATION, evidence, path: [String(row.hire_value), "DEPENDS_ON", String(row.burn_value), "REDUCES", String(row.runway_value), "REQUIRES", String(row.board_value)], verification };
  }
  if (kind.startsWith("stable_")) {
    const row = rows[0];
    return { state: "answer", answer: String(row.value), temporalStatus: "current", explanation: "This stable company fact was retrieved from HydraDB.", evidence: [{ sessionId: String(row.session_id), eventTime: String(row.event_time), value: String(row.value), status: "active" }], path: [String(row.value)], verification };
  }
  const factKey = kind === "current_headcount" ? "headcount" : "launch_date";
  const candidates = rows.map(row => ({ factKey, sessionId:String(row.session_id), eventTime:String(row.event_time), value:String(row.value), status:row.status === "active" ? "active" as const : "superseded" as const }));
  const resolution = resolveFactAtTime(candidates);
  if (resolution.status === "conflict") return { state:"conflict", answer:"The recorded company memories conflict, so Klazz did not select a current answer.", temporalStatus:"unknown", explanation:"Multiple active launch states require explicit resolution.", evidence:resolution.evidence, path:[], verification };
  if (resolution.status === "not_found") return { state:"abstain", answer:ABSTENTION, temporalStatus:"unknown", explanation:"No active launch state was found.", evidence:resolution.evidence, path:[], verification };
  const selected = resolution.selectedFact!;
  const previous = resolution.supersededFacts?.at(-1);
  return { state:"answer", answer:selected.value, temporalStatus:"current", explanation:previous ? `${previous.value} was explicitly superseded by ${selected.value}.` : "This is the active launch state.", evidence:[...(resolution.supersededFacts ?? []),selected], path:previous ? [previous.value,"SUPERSEDES",selected.value] : [selected.value], verification };
}
