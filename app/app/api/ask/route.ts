import { classifyQuestion, combineHydraResponses, cyphersFor, shapeResult } from "../../../lib/klazz";

export const runtime = "edge";
export async function POST(request: Request) {
  let payload: { question?: unknown };
  try { payload = await request.json(); } catch { return Response.json({ state: "error", message: "Enter a valid question and try again." }, { status: 400 }); }
  const question = typeof payload.question === "string" ? payload.question.trim() : "";
  if (question.length < 3 || question.length > 500) return Response.json({ state: "error", message: "Enter a question between 3 and 500 characters." }, { status: 400 });
  const baseUrl = process.env.HYDRADB_URL ?? "http://127.0.0.1:18443";
  const token = process.env.HYDRADB_TOKEN;
  if (!token) return Response.json({ state: "error", message: "Company memory is not configured. Please contact the workspace owner.", retryable: false }, { status: 503 });
  const kind = classifyQuestion(question);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const bodies = await Promise.all(cyphersFor(kind).map(async query => {
      const response = await fetch(`${baseUrl}/v1/graphs/default/query`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "X-Graph-Namespace": "default", "Content-Type": "application/json" }, body: JSON.stringify({ cell_id: "cell-0", query, consistency: "strong" }), signal: controller.signal });
      const body = await response.json() as { error?: { message?: string } };
      if (!response.ok) throw new Error(body.error?.message ?? `HydraDB returned HTTP ${response.status}`);
      return body;
    }));
    return Response.json(shapeResult(kind, combineHydraResponses(bodies)));
  } catch (error) {
    const message = error instanceof DOMException && error.name === "AbortError" ? "Company memory took too long to respond. Please retry." : "Company memory is temporarily unavailable. Your question was not answered from a fallback.";
    return Response.json({ state: "error", message, retryable: true }, { status: 503 });
  } finally { clearTimeout(timeout); }
}
