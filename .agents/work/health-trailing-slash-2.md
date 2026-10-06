# health-trailing-slash-2 — plan

thread: 1791322028.406439
lead-session: ses_eeceef15fffduz4cKTYbh2tbyD
repo: diggerhq/opencomputer-fixture-acme-service
branch: agent/health-trailing-slash-2
base: main
version: 3

```kevin-state
{
  "version": 3,
  "leadSessionId": "ses_eeceef15fffduz4cKTYbh2tbyD",
  "threadId": "1791322028.406439",
  "subscriptionId": "evs_2df49cc80899442e8ee2efd1310961c6",
  "streams": [
    {
      "stream": "alias",
      "attempt": 1,
      "sessionId": "e204ab8b-ad4d-7322-6ca2-849ad856bf04",
      "branch": "agent/health-trailing-slash-2--alias",
      "state": "landed"
    }
  ]
}
```

## Design (summary)

`GET /health/` currently falls through to the 404 handler in `src/server.js`
because routing compares `req.url` to the literal `"/health"`. The fix: treat
`/health/` exactly like `/health` — same 200 status, same
`content-type: application/json`, same body `{"status":"ok"}`. No redirect, no
general trailing-slash normalisation (the owner chose the narrow alias;
`/customers.csv/` stays a 404). No dependencies added.

## Code map

- `src/server.js` — `createApp()`: hand-rolled `node:http` router; the
  `/health` branch is the first `if`. The alias goes there.
- `test/csv.test.js` — holds the existing `GET /health` test (server started on
  port 0, `fetch`, close). Do not modify; the new test mirrors its pattern.
- `test/server.test.js` — new; `npm test` globs `test/*.test.js`.

## Streams

### alias

- files: `src/server.js`, `test/server.test.js`
- checks: `npm test`
- done when: `GET /health/` returns 200, `content-type: application/json`,
  body `{"status":"ok"}`; `GET /health` unchanged; a test in
  `test/server.test.js` asserts both paths and that `/customers.csv/` is still
  404; `npm test` passes.
- depends on: nothing

## Order

One stream.

## Verification

`npm test` green on `agent/health-trailing-slash-2`; the new test fails on
`main` (route 404s) and passes on the branch.

## How to resume

`where_are_we` with thread `1791322028.406439`; the kevin-state block above is
the truth for stream sessions.

## Build record

- v3: plan skeleton committed; stream `alias` dispatched (attempt 1).
- alias@1 landed `c4670d39e2df7e7ca4485473856633575f06bfa9` "Serve GET /health/
  as an alias of GET /health". Checks: `npm test` pass, 7/7 (new: `/health/`
  200 JSON ok; `/customers.csv/` still 404). Files touched: `src/server.js`,
  `test/server.test.js` only. Blocked: none. Plan amendments: none. Note from
  the implementer: sandbox had no git author, commit authored as Kevin.
  Next: integrate into `agent/health-trailing-slash-2`.

## Prompts

- Igor Zalutski: "GET /health/ answers 404 in
  diggerhq/opencomputer-fixture-acme-service; it should answer like GET /health"
  → brief v1.
- Igor Zalutski: "revise" → brief v2 (slug re-assigned to
  `health-trailing-slash-2`; asked what to change).
- Igor Zalutski: "Brief is fine, build now" → this plan, v3.
