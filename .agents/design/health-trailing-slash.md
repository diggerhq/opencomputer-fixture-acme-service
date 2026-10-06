# health-trailing-slash — design

repo: diggerhq/opencomputer-fixture-acme-service
branch: agent/health-trailing-slash
base: main
version: 5
thread: 1791317211.416529

## 1. Brief

**What** — `GET /health/` answers the same as `GET /health` (same status, headers and body) instead of 404.

**Why** — Load balancers and uptime probes that append a trailing slash see the service as down.

**In** — `src/server.js` (the health route), one test in `test/csv.test.js`.

**Out** — generic trailing-slash normalisation for every route; redirects (301/308); query-string handling.

## 2. Kernel

The health check accepts `/health/` as well as `/health`. One extra string comparison in the health route, plus one test. Nothing else in routing moves.

## 3. Constraints

- Routing is hand-rolled: `createServer` with `req.method === "GET" && req.url === "/health"` as an exact string match (`src/server.js`, the first `if` in `createApp`). There is no framework and no path parser; the fix is therefore a literal alias, not a rewrite.
- `AGENTS.md`: no new dependencies; a test for every fixed defect; minimal change; pull requests as drafts.
- `.agents/conventions.md`: anything touching `src/server.js` routing needs a plan first; `npm test` must pass before a PR; add a test for every fix. This is why the work runs design → plan → build → PR rather than build-now.
- `package.json`: `npm test` = `node --test test/*.test.js`, Node ≥ 22; `npm run lint` = `node --check src/*.js`.

## 4. Components and boundaries

| Component | Role | Changes |
|---|---|---|
| `src/server.js` | hand-rolled router; health route, CSV route, 404 fallback | the health `if` accepts a second path |
| `test/csv.test.js` | the only test file; already holds `GET /health responds with ok status` | one new test beside the existing health test |
| `src/csv.js`, `src/customers.js` | CSV export and seeded data | untouched |

Blast radius: one `if` condition. The CSV route and the 404 fallback are not read or modified.

## 5. Contracts

### HealthResponse (unchanged shape)

- status: `200`
- headers: `content-type: application/json`
- body: `{"status":"ok"}`

### Route table after the change

| Request | Before | After |
|---|---|---|
| `GET /health` | 200 HealthResponse | 200 HealthResponse |
| `GET /health/` | 404 `{"error":"not found"}` | 200 HealthResponse (byte-identical to `/health`) |
| `GET /customers.csv` | 200 text/csv | 200 text/csv |
| `GET /customers.csv/` | 404 | 404 |
| `GET /health?x=1` | 404 | 404 (query strings were never matched; out of scope) |
| any other method or path | 404 | 404 |

### Test contract

A test `GET /health/ responds like /health` in `test/csv.test.js`: start `createApp()` on port 0, fetch `/health/`, assert status 200 and body deep-equal `{ status: "ok" }`; close the server in `finally`, mirroring the existing health test.

## 6. Interactions

Request → `createServer` callback → health `if` (now `req.url === "/health" || req.url === "/health/"`) → `HealthResponse`. No other branch is consulted when the health branch matches, exactly as today.

## 7. Risks

- Widening beyond one URL: the only way is to normalise `req.url` (e.g. `new URL(req.url, base).pathname` or a trailing-slash strip), which would silently change query-string and `/customers.csv/` behaviour for every route. Rejected; the design matches two literal strings only.
- Rollback: revert two lines.
- Who notices: anything probing `/health/` goes from "down" to "ok". Nobody else sees a change.

## 8. Decisions

1. **D1 — Match form.** Inline `req.url === "/health" || req.url === "/health/"`. Alternative: a `pathMatches(url, path)` helper. Recommended: inline; there is no second caller, and a helper invites generalising to all routes, which is out of scope.
2. **D2 — Test placement.** Append the new test beside the existing `GET /health` test in `test/csv.test.js`. Alternative: a new `test/server.test.js`. Recommended: append; keeps the two server tests together and leaves `npm test`'s glob untouched.

## Prompts

> _GET /health/ answers 404 in diggerhq/opencomputer-fixture-acme-service; it should answer like GET /health_

→ brief v1 (message only, no commit) — 2026-10-06, Claude via OpenCode

> design

→ design preview v2 (message only) — 2026-10-06, Claude via OpenCode

> not quite that, id like to see more of an at-a-glance summary to understand the nature of the change and its impact

→ design preview v3 (message only) — 2026-10-06, Claude via OpenCode

> try again

→ design preview v4 (message only) — 2026-10-06, Claude via OpenCode

> id like to better undrstand why you are using this particular structure of the response

> do we have it committed already?

> so working doc wasnt created yet? lets create it

→ this file, design v5 — 2026-10-06, Claude via OpenCode
