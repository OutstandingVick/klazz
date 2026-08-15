# Klazz — Verified Company Memory

Klazz is an end-to-end company-memory demo for founders. A user can ask for the current launch date, ask what the team believed before a historical cutoff, or ask about an unknown fact. The application answers only from a real HydraDB OS graph and exposes supporting records, the graph path, query ID, and read epoch.

The hackathon MVP intentionally uses deterministic evidence-to-text formatting rather than an LLM. See `PRD_AMENDMENTS.md` for the accepted architecture amendment.

The production web application lives in `app/`; the root scripts preserve the original HydraDB feasibility proof and raw-runtime tests.

## Run the application

Start HydraDB on ports `18443`, `17687`, and `19090`, then configure `app/.env.local` from `app/.env.example`.

```sh
cd app
npm install
npm run seed
npm run seed:reset
npm run test:seed
npm run dev
```

Run the unit and HTTP journey tests with:

```sh
cd app
npm test
KLAZZ_TEST_URL=http://localhost:3000 npm test
KLAZZ_TEST_URL=http://localhost:3000 npm run evaluate
```

The evaluation command runs 40 stable, current, historical, multi-session, and abstention questions through the same HTTP route used by the UI. The hosted application requires `HYDRADB_URL` and `HYDRADB_TOKEN` as runtime environment variables. It never falls back to mocked company data when HydraDB is unavailable.

`seed:reset` removes only nodes labeled `Fact`, `Constraint`, or `Session` with `app_id: 'klazz-demo'`, then recreates the deterministic 40-record corpus. Every seed waits for a successful strong query before writing.

## HydraDB proof

## Primary proof: open-source HydraDB

The Hack Hydra rules require the open-source repository to do real work. `npm run os-spike` therefore:

1. Starts the official `ghcr.io/hydra-db/hydradb:latest` image in local object-store mode.
2. Writes two dated `Fact` nodes and a real `SUPERSEDES` edge through the authenticated HTTP OpenCypher endpoint.
3. Runs strong-consistency current, historical, and absent-fact queries.
4. Records a malformed-query failure.
5. Stops the node, reopens the same durable store, and reads the edge again.
6. Writes raw evidence to `evidence/os-happy-path.json`.

```sh
docker pull ghcr.io/hydra-db/hydradb:latest
npm test
npm run os-spike
```

No npm dependencies are required; use Node 20 or newer and Docker.

## Secondary hosted-API probe

The PRD assumes HydraDB's hosted Knowledge API. That is not the hackathon-required sponsor runtime. `npm run failure` calls the current v2 `/query` endpoint with an intentionally invalid credential and records the real 401 contract without exposing secrets.

The hosted v1 route shown in parts of the web documentation, `/recall/full_recall`, returned HTTP 404 during the original investigation. The published `@hydradb/sdk@2.1.2` instead uses `/context/ingest`, `/context/status`, and `/query` with `API-Version: 2`.

## Gate

- `PROVEN`: graph write, current/historical reads, empty-result abstention signal, controlled failure, and restart durability all pass.
- `PARTIALLY_PROVEN`: the service ran but an assertion failed.
- `BLOCKED`: Docker, runtime startup, or an API error prevented execution.

See `SPIKE_REPORT.md` for the engineering decision and required PRD changes.
