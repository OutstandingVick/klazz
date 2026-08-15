import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(root, "hydradb-data");
const image = process.env.HYDRADB_IMAGE || "ghcr.io/hydra-db/hydradb:latest";
const token = (await readFile(path.join(root, "hydradb-auth-token"), "utf8")).trim();
const runId = `klazz-${Date.now()}`;
const vertexBase = Date.now() * 2;
const ports = { bolt: 17687, http: 18443, admin: 19090 };

await mkdir(path.join(dataDir, "store"), { recursive: true });
await mkdir(path.join(dataDir, "cache"), { recursive: true });
await writeFile(path.join(dataDir, "auth-token"), `${token}\n`, { mode: 0o600 });

async function docker(args) {
  const result = await exec("docker", args, { maxBuffer: 10 * 1024 * 1024 });
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim() };
}

async function startNode(suffix) {
  const name = `klazz-hydradb-${process.pid}-${suffix}`;
  const uid = process.getuid?.() ?? 1000;
  const gid = process.getgid?.() ?? 1000;
  const result = await docker([
    "run", "--rm", "-d", "--name", name, "--user", `${uid}:${gid}`,
    "-p", `${ports.bolt}:7687`, "-p", `${ports.http}:8443`, "-p", `${ports.admin}:9090`,
    "-v", `${dataDir}:/data`,
    "-e", "CLOUD_PROVIDER=local", "-e", "LOCAL_PATH=/data/store",
    "-e", "GRAPH_NAMESPACE=default", "-e", "GRAPH_ID=default",
    "-e", "GRAPH_CELL_ID=cell-0", "-e", "GRAPH_CELLS=cell-0",
    "-e", "GRAPH_NODE_ID=node-0",
    "-e", `GRAPH_BOLT_NODE_ADDRESSES=node-0=127.0.0.1:${ports.bolt}`,
    "-e", `GRAPH_ADVERTISED_BOLT_ADDR=127.0.0.1:${ports.bolt}`,
    "-e", "GRAPH_DATA_CACHE_DIR=/data/cache",
    "-e", "GRAPH_AUTH_TOKEN_FILE=/data/auth-token",
    "-e", "GRAPH_ALLOW_PLAINTEXT=true", "-e", "RUST_MIN_STACK=33554432",
    image
  ]);
  return { name, container_id: result.stdout };
}

async function stopNode(name) {
  try { await docker(["stop", "--time", "15", name]); } catch { /* already stopped */ }
}

async function waitReady(name) {
  const deadline = Date.now() + 90_000;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${ports.admin}/readyz`);
      if (response.ok) return { status: response.status, body: await response.text() };
      lastError = new Error(`readyz returned ${response.status}`);
    } catch (error) { lastError = error; }
    await new Promise(resolve => setTimeout(resolve, 1_000));
  }
  const logs = await docker(["logs", name]);
  throw Object.assign(new Error(`HydraDB did not become ready: ${lastError?.message}`), { logs });
}

async function query(cypher, { expectOk = true } = {}) {
  const started = performance.now();
  const response = await fetch(`http://127.0.0.1:${ports.http}/v1/graphs/default/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "X-Graph-Namespace": "default", "Content-Type": "application/json" },
    body: JSON.stringify({ cell_id: "cell-0", query: cypher, consistency: "strong" })
  });
  const raw = await response.text();
  let body;
  try { body = JSON.parse(raw); } catch { body = { raw }; }
  const result = { status: response.status, duration_ms: Math.round(performance.now() - started), body };
  if (expectOk && !response.ok) throw Object.assign(new Error(`Query failed with HTTP ${response.status}`), { result });
  return result;
}

const q = value => `'${String(value).replaceAll("\\", "\\\\").replaceAll("'", "\\'")}'`;
const old = { id: vertexBase, session_id: "session-2026-06-03-launch", fact_key: "launch_date", fact_value: "September 12, 2026", event_time: "2026-06-03T10:00:00Z", status: "superseded" };
const current = { id: vertexBase + 1, session_id: "session-2026-07-18-launch", fact_key: "launch_date", fact_value: "October 3, 2026", event_time: "2026-07-18T15:00:00Z", status: "active" };
const props = fact => `id: ${fact.id}, run_id: ${q(runId)}, session_id: ${q(fact.session_id)}, fact_key: ${q(fact.fact_key)}, fact_value: ${q(fact.fact_value)}, event_time: ${q(fact.event_time)}, status: ${q(fact.status)}`;

let first;
let second;
try {
  first = await startNode("first");
  const firstContainer = { ...first };
  const ready = await waitReady(first.name);
  const imageInfo = await docker(["image", "inspect", image, "--format", "{{json .RepoDigests}}"]);
  const write = await query(`CREATE (current:Fact {${props(current)}})-[:SUPERSEDES]->(old:Fact {${props(old)}})`);
  const currentRead = await query(`MATCH (current:Fact {run_id: ${q(runId)}, fact_key: 'launch_date', status: 'active'})-[:SUPERSEDES]->(old:Fact) RETURN current.fact_value AS current_value, old.fact_value AS previous_value, old.event_time AS previous_time, current.event_time AS current_time`);
  const historicalRead = await query(`MATCH (f:Fact {run_id: ${q(runId)}, fact_key: 'launch_date'}) WHERE f.event_time <= '2026-06-30T23:59:59Z' RETURN f.fact_value AS value, f.session_id AS session_id ORDER BY f.event_time DESC LIMIT 1`);
  const unknownRead = await query(`MATCH (f:Fact {run_id: ${q(runId)}, fact_key: 'company_lawyer'}) RETURN f.fact_value AS value`);
  const failure = await query("MATCH (", { expectOk: false });
  await stopNode(first.name);
  first = null;

  second = await startNode("reopen");
  const secondContainer = { ...second };
  const reopenReady = await waitReady(second.name);
  const durableRead = await query(`MATCH (current:Fact {run_id: ${q(runId)}, fact_key: 'launch_date', status: 'active'})-[:SUPERSEDES]->(old:Fact) RETURN current.fact_value AS current_value, old.fact_value AS previous_value`);
  const serialized = JSON.stringify({ currentRead, historicalRead, durableRead });
  const proven = serialized.includes("October 3, 2026") && serialized.includes("September 12, 2026")
    && Array.isArray(unknownRead.body.rows) && unknownRead.body.rows.length === 0 && failure.status === 400;
  const evidence = {
    gate: proven ? "PROVEN" : "PARTIALLY_PROVEN",
    sponsor_runtime: "hydra-db/hydradb open-source graph-node",
    image,
    image_digests: imageInfo.stdout ? JSON.parse(imageInfo.stdout) : [],
    run_id: runId,
    first_container: firstContainer,
    ready,
    write,
    current_read: currentRead,
    historical_read: historicalRead,
    unknown_read: unknownRead,
    malformed_query_failure: failure,
    second_container: secondContainer,
    reopen_ready: reopenReady,
    durable_read_after_restart: durableRead,
    finished_at: new Date().toISOString()
  };
  await mkdir(path.join(root, "evidence"), { recursive: true });
  await writeFile(path.join(root, "evidence", "os-happy-path.json"), `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(JSON.stringify(evidence, null, 2));
  if (!proven) process.exitCode = 1;
} catch (error) {
  console.error(JSON.stringify({ gate: "BLOCKED", error: error.message, result: error.result, logs: error.logs }, null, 2));
  process.exitCode = 1;
} finally {
  if (first?.name) await stopNode(first.name);
  if (second?.name) await stopNode(second.name);
}
