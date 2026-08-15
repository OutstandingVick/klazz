const baseUrl = process.env.HYDRADB_URL ?? "http://127.0.0.1:18443";
const token = process.env.HYDRADB_TOKEN ?? "local-development-token-32-bytes";

async function query(cypher) {
  const response = await fetch(`${baseUrl}/v1/graphs/default/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "X-Graph-Namespace": "default", "Content-Type": "application/json" },
    body: JSON.stringify({ cell_id: "cell-0", query: cypher, consistency: "strong" })
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body?.error?.message ?? `HydraDB returned ${response.status}`);
  return body;
}

const existing = await query("MATCH (f:Fact {app_id: 'klazz-demo', fact_key: 'launch_date'}) RETURN f.id AS id");
if ((existing.rows ?? []).length === 0) {
  await query("CREATE (current:Fact {id: 91002, app_id: 'klazz-demo', session_id: 'session-2026-07-18-launch', fact_key: 'launch_date', fact_value: 'October 3, 2026', event_time: '2026-07-18T15:00:00Z', status: 'active'})-[:SUPERSEDES]->(old:Fact {id: 91001, app_id: 'klazz-demo', session_id: 'session-2026-06-03-launch', fact_key: 'launch_date', fact_value: 'September 12, 2026', event_time: '2026-06-03T10:00:00Z', status: 'superseded'})");
}
const verify = await query("MATCH (current:Fact {app_id: 'klazz-demo', fact_key: 'launch_date', status: 'active'})-[:SUPERSEDES]->(old:Fact) RETURN current.fact_value AS current_value, old.fact_value AS previous_value");
if ((verify.rows ?? []).length !== 1) throw new Error("Expected one Klazz launch supersession path");
console.log(JSON.stringify({ seeded: true, query_id: verify.query_id, read_epoch: verify.read_epoch, rows: verify.rows }, null, 2));
