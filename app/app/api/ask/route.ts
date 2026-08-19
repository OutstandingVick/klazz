import { classifyQuestion, combineHydraResponses, cyphersFor, normalizeAskResult, questionForUpstream, shapeResult } from "../../../lib/klazz";
import type { HydraResponse } from "../../../lib/klazz";

export async function POST(request: Request) {
  let payload: { question?: unknown };
  try { payload = await request.json(); } catch { return Response.json({ state: "error", message: "Enter a valid question and try again." }, { status: 400 }); }
  const question = typeof payload.question === "string" ? payload.question.trim() : "";
  if (question.length < 3 || question.length > 500) return Response.json({ state: "error", message: "Enter a question between 3 and 500 characters." }, { status: 400 });
  const upstreamUrl = process.env.KLAZZ_UPSTREAM_URL?.replace(/\/$/, "");
  const baseUrl = process.env.HYDRADB_URL ?? "http://127.0.0.1:18443";
  const token = process.env.HYDRADB_TOKEN;
  const kind = classifyQuestion(question);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    if (upstreamUrl) {
      if (new URL(upstreamUrl).origin === new URL(request.url).origin) throw new Error("Klazz upstream cannot point to itself");
      const response = await fetch(`${upstreamUrl}/api/ask`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: questionForUpstream(kind, question) }), signal: controller.signal });
      const body = await response.json();
      return Response.json(normalizeAskResult(kind, question, body), { status: response.status });
    }
    if (!token) return Response.json({ state: "error", message: "Company memory is not configured. Please contact the workspace owner.", retryable: false }, { status: 503 });
    const bodies = await Promise.all(cyphersFor(kind).map(async query => {
      const response = await fetch(`${baseUrl}/v1/graphs/default/query`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "X-Graph-Namespace": "default", "Content-Type": "application/json" }, body: JSON.stringify({ cell_id: "cell-0", query, consistency: "strong" }), signal: controller.signal });
      const body = await response.json() as HydraResponse;
      if (!response.ok) throw new Error(body.error?.message ?? `HydraDB returned HTTP ${response.status}`);
      return body;
    }));
    return Response.json(normalizeAskResult(kind, question, shapeResult(kind, combineHydraResponses(bodies))));
  } catch (error) {
    const isAbortError = typeof error === "object" && error !== null && "name" in error && error.name === "AbortError";
    const message = isAbortError ? "Company memory took too long to respond. No fallback answer was used; please retry." : "Company memory is temporarily unavailable. Your question was not answered from a fallback.";
    return Response.json({ state: "error", message, retryable: true }, { status: 503 });
  } finally { clearTimeout(timeout); }
}
