import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const started = performance.now();
const response = await fetch("https://api.hydradb.com/query", {
  method: "POST",
  headers: {
    Authorization: `Bearer intentionally-invalid-${Date.now()}`,
    "API-Version": "2",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ database: "klazz-hackhydra-spike", type: "knowledge", query: "When are we launching now?" })
});
const raw = await response.text();
let body;
try { body = JSON.parse(raw); } catch { body = { raw }; }
const evidence = {
  expected: "authentication rejection",
  observed: { method: "POST", endpoint: "/query", status: response.status, duration_ms: Math.round(performance.now() - started), body }
};
await mkdir(path.join(root, "evidence"), { recursive: true });
await writeFile(path.join(root, "evidence", "failure-invalid-credential.json"), `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify(evidence, null, 2));
if (response.status !== 401) process.exitCode = 1;
