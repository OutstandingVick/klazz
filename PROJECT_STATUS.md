# Klazz Engineering Status

## Step 1 — Public production access

- Status: complete
- Sites access mode: public
- Fresh unauthenticated API result: HTTP 200
- Verified answer: October 3, 2026
- HydraDB verification: query ID and read epoch returned from production

## Step 2 — Production benchmark

- Status: complete
- Target: `https://klazz-company-memory.outstandingvick.chatgpt.site`
- Result: 40/40 passed
- Abstention: 6/6 passed
- Categories: stable, current, historical, multi-session, abstention

## Step 3 — Generic temporal resolver

- Status: complete
- Contract: `resolved | conflict | not_found`
- Live current and historical answers now pass through the resolver
- Multiple active facts produce a conflict rather than an arbitrary answer
- Validation: 10/10 HTTP tests and 40/40 local benchmark

## Step 4 — Third mutable fact

- Status: complete
- Added headcount history: 8 employees in June → 10 employees currently
- Storage: real HydraDB `SUPERSEDES` relationship
- Both historical and current headcount queries pass through `/api/ask`

## Step 5 — Seed readiness, reset, and idempotence

- Status: complete
- Readiness: seed waits for the HydraDB query engine
- Reset scope: only Klazz demo `Fact`, `Constraint`, and `Session` nodes
- Clean reset result: 40 records
- Idempotence: two consecutive seeds produce identical counts and golden rows

## Step 6 — Automated outage and recovery

- Status: complete
- Before outage: HTTP 200 with HydraDB query ID
- Paused HydraDB: HTTP 503, retryable, explicit no-fallback message
- Unpaused HydraDB: HTTP 200 with a new query ID and the original answer

## Step 7 — Evidence-constrained wording decision

- Status: complete
- Decision: deterministic formatting; no LLM in the hackathon MVP
- Guardrail: answer formatting only follows non-empty resolved HydraDB evidence
- PRD amendment: `PRD_AMENDMENTS.md` A-01

## Step 8 — Independent result verification

- Status: complete
- Command: `npm run verify -- "<question>"`
- Verification: public application evidence is compared with direct strong-consistency HydraDB rows
- Receipt: JSON includes app/direct query IDs, read epochs, evidence, and match result
- Explorer limitation: HydraDB OS exposes query IDs but no public explorer URL

## Final deployed integration check

- Sites version: 6
- Access: public
- Production HTTP tests: 11/11 passed
- Production benchmark: 40/40 passed
- Production corpus: 40 records with three mutable fact families
- URL: `https://klazz-company-memory.outstandingvick.chatgpt.site`
