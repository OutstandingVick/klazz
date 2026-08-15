export type QueryKind = "current" | "historical" | "multi" | "stable_name" | "stable_customer" | "stable_price" | "stable_region" | "stable_platform" | "unknown";
export type Evidence = { sessionId: string; eventTime: string; value: string; status: "active" | "superseded" };
export type AskResult = {
  state: "answer" | "abstain"; answer: string; temporalStatus: "current" | "historical" | "unknown";
  explanation: string; evidence: Evidence[]; path: string[];
  verification: { database: string; queryId: string | null; readEpoch: number | null; bookmark: string | null };
};
export const ABSTENTION = "I don’t have a recorded company memory that answers that yet.";

export function classifyQuestion(question: string): QueryKind {
  const normalized = question.toLowerCase();
  if (/(hire|hiring|engineer).*(launch)|launch.*(hire|hiring|engineer)/.test(normalized)) return "multi";
  if (/launch/.test(normalized) && /june|historical|previous|original|use(?:d)? to|was our|before july/.test(normalized)) return "historical";
  if (/launch region|which countr|where.*launch/.test(normalized)) return "stable_region";
  if (/launch|go(?:ing)? live/.test(normalized)) return "current";
  if (/company.*name|name.*company|what are we called/.test(normalized)) return "stable_name";
  if (/ideal customer|target customer|who.*sell to/.test(normalized)) return "stable_customer";
  if (/price|pricing|cost.*month/.test(normalized)) return "stable_price";
  if (/primary platform|web or mobile|what platform/.test(normalized)) return "stable_platform";
  return "unknown";
}

export function cypherFor(kind: QueryKind) {
  if (kind === "current") return "MATCH (current:Fact {app_id: 'klazz-demo', fact_key: 'launch_date', status: 'active'})-[:SUPERSEDES]->(old:Fact) RETURN current.fact_value AS current_value, current.session_id AS current_session, current.event_time AS current_time, old.fact_value AS previous_value, old.session_id AS previous_session, old.event_time AS previous_time";
  if (kind === "historical") return "MATCH (f:Fact {app_id: 'klazz-demo', fact_key: 'launch_date'}) WHERE f.event_time <= '2026-06-30T23:59:59Z' RETURN f.fact_value AS value, f.session_id AS session_id, f.event_time AS event_time, f.status AS status ORDER BY f.event_time DESC LIMIT 1";
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
type HydraResponse = { query_id?: string; columns?: string[]; rows?: HydraValue[][]; read_epoch?: number; bookmark?: string };
function rowObject(response: HydraResponse, row: HydraValue[]) { return Object.fromEntries((response.columns ?? []).map((column, index) => [column, row[index]?.value])); }

export function shapeResult(kind: QueryKind, hydra: HydraResponse): AskResult {
  const rows = (hydra.rows ?? []).map(row => rowObject(hydra, row));
  const verification = { database: "HydraDB OS · graph default", queryId: hydra.query_id ?? null, readEpoch: hydra.read_epoch ?? null, bookmark: hydra.bookmark ?? null };
  if (!rows.length) return { state: "abstain", answer: ABSTENTION, temporalStatus: "unknown", explanation: "No HydraDB fact matched this question, so Klazz stopped before generation.", evidence: [], path: [], verification };
  if (kind === "historical") {
    const row = rows[0];
    return { state: "answer", answer: String(row.value), temporalStatus: "historical", explanation: "This was the launch state recorded at the end of June.", evidence: [{ sessionId: String(row.session_id), eventTime: String(row.event_time), value: String(row.value), status: "superseded" }], path: [String(row.value)], verification };
  }
  if (kind === "multi") {
    const row = rows[0];
    const evidence = [
      { sessionId: String(row.hire_session), eventTime: String(row.hire_time), value: String(row.hire_value), status: "active" as const },
      { sessionId: String(row.burn_session), eventTime: String(row.burn_time), value: String(row.burn_value), status: "active" as const },
      { sessionId: String(row.runway_session), eventTime: String(row.runway_time), value: String(row.runway_value), status: "active" as const },
      { sessionId: String(row.board_session), eventTime: String(row.board_time), value: String(row.board_value), status: "active" as const },
    ];
    return { state: "answer", answer: `${row.hire_value}: ${row.burn_value}; ${row.runway_value}; ${row.board_value}.`, temporalStatus: "current", explanation: "HydraDB returned three connected dependency relationships across four company memories.", evidence, path: [String(row.hire_value), "DEPENDS_ON", String(row.burn_value), "REDUCES", String(row.runway_value), "REQUIRES", String(row.board_value)], verification };
  }
  if (kind.startsWith("stable_")) {
    const row = rows[0];
    return { state: "answer", answer: String(row.value), temporalStatus: "current", explanation: "This stable company fact was retrieved from HydraDB.", evidence: [{ sessionId: String(row.session_id), eventTime: String(row.event_time), value: String(row.value), status: "active" }], path: [String(row.value)], verification };
  }
  const row = rows[0];
  return { state: "answer", answer: String(row.current_value), temporalStatus: "current", explanation: `${row.previous_value} was superseded after the database migration delay.`, evidence: [{ sessionId: String(row.previous_session), eventTime: String(row.previous_time), value: String(row.previous_value), status: "superseded" }, { sessionId: String(row.current_session), eventTime: String(row.current_time), value: String(row.current_value), status: "active" }], path: [String(row.previous_value), "SUPERSEDES", String(row.current_value)], verification };
}
