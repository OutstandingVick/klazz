# Klazz Gate 0 Technical Spike Report

Date: 2026-08-15
Deadline: 2026-08-20, 11:59 PM PT
Gate: **PROVEN**, with required PRD changes

## Critical Integration

The highest-risk dependency is the open-source HydraDB graph node performing durable temporal-state storage and graph-native supersession queries.

| Risk | Core | Sponsor | Uncertainty | External | Difficulty | Demo | Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| HydraDB temporal graph write/query/durability | 6 | 6 | 6 | 5 | 6 | 6 | 35 |
| Retrieval over 30–40 sessions | 6 | 6 | 5 | 3 | 6 | 6 | 32 |
| Automatic graph/path quality | 4 | 6 | 5 | 3 | 5 | 5 | 28 |
| Temporal resolver and abstention | 6 | 5 | 3 | 1 | 4 | 6 | 25 |
| LLM synthesis | 3 | 1 | 2 | 3 | 2 | 3 | 14 |
| UI/deployment | 2 | 1 | 2 | 3 | 2 | 3 | 13 |

This must precede application work because the hackathon requires the open-source repository to perform real work. A hosted retrieval API alone does not prove the required sponsor technology.

## Technical Flow

Two dated `Fact` nodes → authenticated OpenCypher write → `SUPERSEDES` edge → strong-consistency current/historical queries → zero-row absent-fact result → full node restart → durable verification read.

Verification consists of HTTP statuses, typed rows, query IDs, bookmarks/read epochs, the exact image digest, and the read after restart.

## Proof Built

`os-spike.mjs` starts the official graph node, waits for readiness, writes the temporal graph, executes current/historical/unknown queries, sends malformed OpenCypher, restarts the node against the same object-store directory, and saves machine-readable evidence.

The deterministic resolver has tests for current truth, historical truth, abstention, conflict, and a time before the first known state.

## Failure Behaviour

Malformed `MATCH (` must return HTTP 400 with `invalid_request`. The future application should expose a controlled dependency error and must not call an LLM.

Actual engine limitations found during the original proof:

- `CREATE ... RETURN` is not executable as one statement.
- `CREATE` accepts a one-hop edge pattern.
- Created vertices require numeric `id` properties.

## Sponsor Essentiality

In the corrected design, company facts and temporal relationships live in HydraDB and the golden path queries the graph. Removing HydraDB removes persistence and supersession traversal, requiring replacement of the product core.

The original PRD's hosted Knowledge API architecture is invalid for this hackathon because the official rules require the open-source repository.

## Competitive Assessment

Current proof: moderately difficult and credible, but not yet memorable.

Easy to replicate: two nodes, a one-hop edge, and an empty result. Genuine depth: explicit temporal modeling, strong reads, restart durability, exact runtime evidence, and adapting to HydraDB's actual Cypher subset.

The smallest strengthening step is a three-concept native traversal for the hiring-constraint question over 6–8 representative sessions.

## Required PRD Changes

1. Replace “HydraDB Knowledge + hosted SDK” with “HydraDB OS graph-node + HTTP/Bolt OpenCypher API.”
2. Model `Session`, `Fact`, and business entities as nodes with `ASSERTS`, `SUPERSEDES`, and dependency edges.
3. Add a Klazz-owned ingestion pipeline for the 30–40 sessions.
4. Add candidate retrieval plus HydraDB traversal; do not assume managed semantic recall or automatic extraction.
5. Make full-corpus retrieval quality and one native multi-hop path the next build gate.

## Next Action

Do not build the UI yet. Convert 6–8 representative sessions into the graph schema and prove the three-concept hiring traversal plus candidate retrieval. Then scale immediately to the complete benchmark.
