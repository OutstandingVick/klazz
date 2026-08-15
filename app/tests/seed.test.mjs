import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import test from "node:test";

const exec = promisify(execFile);
async function seed() {
  const { stdout } = await exec(process.execPath,["scripts/seed-hydra.mjs"],{ cwd:new URL("..",import.meta.url), env:process.env });
  return JSON.parse(stdout);
}

test("seed waits for readiness and is idempotent", async () => {
  const first = await seed();
  const second = await seed();
  assert.ok(first.ready_attempts >= 1);
  assert.equal(first.session_count,second.session_count);
  assert.equal(second.dependency_queries.length,3);
  assert.deepEqual(first.rows,second.rows);
});
