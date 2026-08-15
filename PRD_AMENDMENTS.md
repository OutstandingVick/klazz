# Klazz MVP PRD Amendments

These amendments supersede conflicting statements in `Klazz_HackHydra_MVP_PRD.docx` for the hackathon implementation.

## A-01 — Deterministic answer wording

Status: accepted

The hackathon MVP does not call an LLM. HydraDB retrieval, temporal resolution, conflict detection, evidence sufficiency, abstention, and final answer wording are deterministic application code.

Rationale:

- The sponsor-critical behavior is HydraDB-backed memory and temporal/context reasoning.
- An LLM is not required by the definition of done or the sponsor runtime.
- Deterministic wording makes the 40-query evaluation repeatable and independently auditable.
- Removing model availability, latency, credentials, and hallucination risk improves the three-minute demo.

Revised query-time flow:

`Question → HydraDB retrieval → temporal resolver → evidence gate → deterministic formatter → answer + evidence`

The formatter may only receive a `resolved` result with non-empty evidence. `conflict` and `not_found` return their controlled responses directly.
