export const ABSTENTION = "I don’t have a recorded company memory that answers that yet.";

export const facts = [
  {
    id: 1,
    session_id: "session-2026-06-03-launch",
    event_time: "2026-06-03T10:00:00Z",
    fact_key: "launch_date",
    fact_value: "September 12, 2026",
    status: "superseded",
    supersedes_id: null
  },
  {
    id: 2,
    session_id: "session-2026-07-18-launch",
    event_time: "2026-07-18T15:00:00Z",
    fact_key: "launch_date",
    fact_value: "October 3, 2026",
    status: "active",
    supersedes_id: "session-2026-06-03-launch"
  }
];

export function resolveFactAtTime(candidates, requestedTime = null) {
  const ordered = [...candidates].sort((a, b) => Date.parse(a.event_time) - Date.parse(b.event_time));
  const eligible = requestedTime
    ? ordered.filter(fact => Date.parse(fact.event_time) <= Date.parse(requestedTime))
    : ordered;
  if (!eligible.length) return { status: "not_found", evidence: [] };
  if (requestedTime) {
    const selectedFact = eligible.at(-1);
    return { status: "resolved", selectedFact, supersededFacts: eligible.slice(0, -1), evidence: eligible };
  }
  const supersededIds = new Set(ordered.map(fact => fact.supersedes_id).filter(Boolean));
  const active = ordered.filter(fact => fact.status === "active" && !supersededIds.has(fact.session_id));
  if (active.length !== 1) return { status: active.length ? "conflict" : "not_found", evidence: ordered };
  return {
    status: "resolved",
    selectedFact: active[0],
    supersededFacts: ordered.filter(fact => fact.session_id !== active[0].session_id),
    evidence: ordered
  };
}

export function answer(candidates, factKey, requestedTime = null) {
  const resolution = resolveFactAtTime(candidates.filter(fact => fact.fact_key === factKey), requestedTime);
  if (resolution.status === "not_found") return { state: "abstain", answer: ABSTENTION, evidence: [] };
  if (resolution.status === "conflict") return { state: "conflict", answer: "The recorded company memories conflict.", evidence: resolution.evidence };
  return { state: "answer", answer: resolution.selectedFact.fact_value, ...resolution };
}
