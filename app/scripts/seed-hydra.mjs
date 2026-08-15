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

async function waitForReady() {
  let lastError;
  for (let attempt = 1; attempt <= 30; attempt++) {
    try {
      await query("MATCH (f:Fact {app_id: '__readiness__'}) RETURN f.id AS id");
      return attempt;
    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, 1_000));
    }
  }
  throw new Error(`HydraDB query engine did not become ready: ${lastError?.message}`);
}

const readyAttempts = await waitForReady();
if (process.argv.includes("--reset")) {
  for (const label of ["Fact","Constraint","Session"]) await query(`MATCH (n:${label} {app_id: 'klazz-demo'}) DETACH DELETE n`);
}

const q = value => `'${String(value).replaceAll("\\", "\\\\").replaceAll("'", "\\'")}'`;
async function exists(id, label = "Fact") {
  const result = await query(`MATCH (n:${label} {id: ${id}}) RETURN n.id AS id`);
  return (result.rows ?? []).length > 0;
}
async function createNode(node) {
  if (await exists(node.id, node.label ?? "Fact")) return;
  await query(`CREATE (s:Session {id: ${node.id + 100000}, app_id: 'klazz-demo', session_id: ${q(node.session)}, event_time: ${q(node.time)}})-[:ASSERTS]->(n:${node.label ?? "Fact"} {id: ${node.id}, app_id: 'klazz-demo', session_id: ${q(node.session)}, fact_key: ${q(node.key)}, fact_value: ${q(node.value)}, event_time: ${q(node.time)}, status: ${q(node.status ?? "active")}})`);
}
async function createEdgePair(left, relationship, right) {
  if (await exists(left.id, left.label ?? "Fact")) return;
  const props = node => `id: ${node.id}, app_id: 'klazz-demo', session_id: ${q(node.session)}, fact_key: ${q(node.key)}, fact_value: ${q(node.value)}, event_time: ${q(node.time)}, status: ${q(node.status ?? "active")}`;
  await query(`CREATE (a:${left.label ?? "Fact"} {${props(left)}})-[:${relationship}]->(b:${right.label ?? "Fact"} {${props(right)}})`);
}

const existing = await query("MATCH (f:Fact {app_id: 'klazz-demo', fact_key: 'launch_date'}) RETURN f.id AS id");
if ((existing.rows ?? []).length === 0) {
  await query("CREATE (current:Fact {id: 91002, app_id: 'klazz-demo', session_id: 'session-2026-07-18-launch', fact_key: 'launch_date', fact_value: 'October 3, 2026', event_time: '2026-07-18T15:00:00Z', status: 'active'})-[:SUPERSEDES]->(old:Fact {id: 91001, app_id: 'klazz-demo', session_id: 'session-2026-06-03-launch', fact_key: 'launch_date', fact_value: 'September 12, 2026', event_time: '2026-06-03T10:00:00Z', status: 'superseded'})");
}

await createEdgePair(
  { id: 92001, session: "session-2026-07-22-hiring", key: "engineering_hire", value: "Do not hire another engineer before launch", time: "2026-07-22T09:00:00Z", label: "Constraint" },
  "DEPENDS_ON",
  { id: 92002, session: "session-2026-07-20-finance", key: "monthly_burn", value: "The additional hire would raise monthly burn above $92,000", time: "2026-07-20T14:00:00Z" }
);
await createEdgePair(
  { id: 92003, session: "session-2026-07-20-finance", key: "monthly_burn_link", value: "Monthly burn must stay below $92,000", time: "2026-07-20T14:00:00Z" },
  "REDUCES",
  { id: 92004, session: "session-2026-07-21-runway", key: "runway", value: "Runway must remain above nine months through launch", time: "2026-07-21T11:00:00Z" }
);
await createEdgePair(
  { id: 92005, session: "session-2026-07-21-runway", key: "runway_link", value: "Runway would fall below the nine-month floor", time: "2026-07-21T11:00:00Z" },
  "REQUIRES",
  { id: 92006, session: "session-2026-07-23-board", key: "board_constraint", value: "Board approval is required for hiring below the runway floor", time: "2026-07-23T16:00:00Z", label: "Constraint" }
);

await createEdgePair(
  { id: 92103, session: "session-2026-07-20-burn", key: "burn_plan_current", value: "$84,000 monthly burn", time: "2026-07-20T14:00:00Z" },
  "SUPERSEDES",
  { id: 92104, session: "session-2026-05-10-burn", key: "burn_plan", value: "$71,000 monthly burn", time: "2026-05-10T10:00:00Z", status: "superseded" }
);

await createEdgePair(
  { id: 92401, session: "session-2026-07-25-headcount", key: "headcount", value: "10 employees", time: "2026-07-25T10:00:00Z" },
  "SUPERSEDES",
  { id: 92400, session: "session-2026-06-12-headcount", key: "headcount", value: "8 employees", time: "2026-06-12T10:00:00Z", status: "superseded" }
);

const stable = [
  [92201,"session-2026-01-05-company","company_name","Lumen Labs"],
  [92202,"session-2026-01-09-customer","ideal_customer","Seed-stage B2B software companies"],
  [92203,"session-2026-02-14-pricing","base_price","$499 per month"],
  [92204,"session-2026-03-02-region","launch_region","United States and Canada"],
  [92205,"session-2026-03-18-platform","primary_platform","Web application"],
];
for (const [id, session, key, value] of stable) await createNode({ id, session, key, value, time: "2026-03-18T12:00:00Z" });

for (let index = 0; index < 23; index++) {
  await createNode({ id: 92300 + index, session: `session-2026-${String((index % 7) + 1).padStart(2,"0")}-${String((index % 24) + 1).padStart(2,"0")}-update-${index + 1}`, key: `background_update_${index + 1}`, value: `Background company update ${index + 1}`, time: `2026-${String((index % 7) + 1).padStart(2,"0")}-${String((index % 24) + 1).padStart(2,"0")}T12:00:00Z` });
}
const verify = await query("MATCH (current:Fact {app_id: 'klazz-demo', fact_key: 'launch_date', status: 'active'})-[:SUPERSEDES]->(old:Fact) RETURN current.fact_value AS current_value, old.fact_value AS previous_value");
if ((verify.rows ?? []).length !== 1) throw new Error("Expected one Klazz launch supersession path");
const counts = await Promise.all([
  query("MATCH (n:Fact {app_id: 'klazz-demo'}) RETURN n.id AS id"),
  query("MATCH (n:Constraint {app_id: 'klazz-demo'}) RETURN n.id AS id"),
]);
const multi = await Promise.all([
  query("MATCH (hire:Constraint {app_id: 'klazz-demo', fact_key: 'engineering_hire'})-[:DEPENDS_ON]->(burn:Fact) RETURN hire.fact_value, burn.fact_value"),
  query("MATCH (burn:Fact {app_id: 'klazz-demo', fact_key: 'monthly_burn_link'})-[:REDUCES]->(runway:Fact) RETURN runway.fact_value"),
  query("MATCH (runway:Fact {app_id: 'klazz-demo', fact_key: 'runway_link'})-[:REQUIRES]->(board:Constraint) RETURN board.fact_value"),
]);
if (multi.some(result => (result.rows ?? []).length !== 1)) throw new Error(`Expected all three Klazz hiring dependency relationships; got ${multi.map(result => (result.rows ?? []).length).join(",")}`);
console.log(JSON.stringify({ seeded: true, ready_attempts: readyAttempts, reset:process.argv.includes("--reset"), query_id: verify.query_id, read_epoch: verify.read_epoch, session_count: counts.reduce((total, result) => total + (result.rows ?? []).length, 0), dependency_queries: multi.map(result => result.query_id), rows: verify.rows }, null, 2));
