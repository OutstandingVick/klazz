import { execFile } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execFile);
const baseUrl = process.env.KLAZZ_TEST_URL;
const container = process.env.HYDRADB_CONTAINER ?? "klazz-app-hydra";
if (!baseUrl) throw new Error("Set KLAZZ_TEST_URL to the running local Klazz application");

async function ask() {
  const response = await fetch(`${baseUrl}/api/ask`,{ method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:"When are we launching now?"}) });
  return { status:response.status, body:await response.json() };
}

const before = await ask();
if (before.status !== 200) throw new Error(`Precondition failed with HTTP ${before.status}`);
let outage;
let recovered;
try {
  await exec("docker",["pause",container]);
  outage = await ask();
  if (outage.status !== 503 || !outage.body.retryable || !/fallback/.test(outage.body.message ?? "")) throw new Error(`Unsafe outage response: ${JSON.stringify(outage)}`);
} finally {
  await exec("docker",["unpause",container]);
}

for (let attempt = 1; attempt <= 30; attempt++) {
  try {
    recovered = await ask();
    if (recovered.status === 200) break;
  } catch (pollError) { void pollError; }
  await new Promise(resolve => setTimeout(resolve,1_000));
}
if (recovered?.status !== 200 || recovered.body.answer !== before.body.answer) throw new Error("Klazz did not recover its original HydraDB-backed answer");
console.log(JSON.stringify({ before:{status:before.status,query_id:before.body.verification.queryId}, outage:{status:outage.status,message:outage.body.message}, recovered:{status:recovered.status,query_id:recovered.body.verification.queryId,answer:recovered.body.answer} },null,2));
