export type QueryKind = "current" | "historical" | "unknown";
export type Evidence = { sessionId: string; eventTime: string; value: string; status: "active" | "superseded" };
export type AskResult = {
  state: "answer" | "abstain"; answer: string; temporalStatus: "current" | "historical" | "unknown";
  explanation: string; evidence: Evidence[]; path: string[];
  verification: { database: string; queryId: string | null; readEpoch: number | null; bookmark: string | null };
};
export const ABSTENTION = "I don’t have a recorded company memory that answers that yet.";

export function classifyQuestion(question: string): QueryKind {
  const normalized = question.toLowerCase();
  if (/lawyer|attorney|legal counsel/.test(normalized)) return "unknown";
  if (/june|historical|previous|original|used to|was our/.test(normalized)) return "historical";
  return "current";
}

export function cypherFor(kind: QueryKind) {
  if (kind === "current") return "MATCH (current:Fact {app_id: 'klazz-demo', fact_key: 'launch_date', status: 'active'})-[:SUPERSEDES]->(old:Fact) RETURN current.fact_value AS current_value, current.session_id AS current_session, current.event_time AS current_time, old.fact_value AS previous_value, old.session_id AS previous_session, old.event_time AS previous_time";
  if (kind === "historical") return "MATCH (f:Fact {app_id: 'klazz-demo', fact_key: 'launch_date'}) WHERE f.event_time <= '2026-06-30T23:59:59Z' RETURN f.fact_value AS value, f.session_id AS session_id, f.event_time AS event_time, f.status AS status ORDER BY f.event_time DESC LIMIT 1";
  return "MATCH (f:Fact {app_id: 'klazz-demo', fact_key: 'company_lawyer'}) RETURN f.fact_value AS value, f.session_id AS session_id, f.event_time AS event_time, f.status AS status";
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
  const row = rows[0];
  return { state: "answer", answer: String(row.current_value), temporalStatus: "current", explanation: `${row.previous_value} was superseded after the database migration delay.`, evidence: [{ sessionId: String(row.previous_session), eventTime: String(row.previous_time), value: String(row.previous_value), status: "superseded" }, { sessionId: String(row.current_session), eventTime: String(row.current_time), value: String(row.current_value), status: "active" }], path: [String(row.previous_value), "SUPERSEDES", String(row.current_value)], verification };
}
