import { classifyQuestion, cyphersFor } from "../lib/klazz.ts";

const appUrl = process.env.KLAZZ_TEST_URL;
const hydraUrl = process.env.HYDRADB_URL;
const token = process.env.HYDRADB_TOKEN;
const question = process.argv.slice(2).join(" ") || "When are we launching now?";
if (!appUrl || !hydraUrl || !token) throw new Error("Set KLAZZ_TEST_URL, HYDRADB_URL, and HYDRADB_TOKEN");

const appResponse = await fetch(`${appUrl}/api/ask`,{ method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question}) });
const app = await appResponse.json();
if (!appResponse.ok) throw new Error(`Application returned HTTP ${appResponse.status}: ${app.message}`);

const direct = [];
for (const query of cyphersFor(classifyQuestion(question))) {
  const response = await fetch(`${hydraUrl}/v1/graphs/default/query`,{ method:"POST",headers:{Authorization:`Bearer ${token}`,"X-Graph-Namespace":"default","Content-Type":"application/json"},body:JSON.stringify({cell_id:"cell-0",query,consistency:"strong"}) });
  const body = await response.json();
  if (!response.ok) throw new Error(`Direct HydraDB verification returned HTTP ${response.status}`);
  direct.push({ query_id:body.query_id, read_epoch:body.read_epoch, columns:body.columns, rows:body.rows });
}

const directText = JSON.stringify(direct);
const evidenceMatches = (app.evidence ?? []).every(item => directText.includes(item.sessionId) && directText.includes(item.value));
if (!app.verification?.queryId || !evidenceMatches) throw new Error("Application evidence did not match direct HydraDB rows");
console.log(JSON.stringify({ verified:true, verified_at:new Date().toISOString(), question, application:{ url:appUrl, answer:app.answer, state:app.state, verification:app.verification, evidence:app.evidence }, direct_hydradb:{ url:hydraUrl, queries:direct }, evidence_matches:evidenceMatches },null,2));
