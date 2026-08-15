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
