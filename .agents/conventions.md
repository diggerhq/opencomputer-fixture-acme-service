# Conventions for the Linear agent

The [Linear agent](https://github.com/diggerhq/opencomputer-linear-agent)
reads this file before proposing how to handle an issue. People own it and
change it by pull request.

## Ship directly

The agent may recommend "just ship it" for:

- A defect confined to one file in `src/`, fixed together with a test that
  fails before the fix and passes after it.
- Changes to tests or documentation only.

## Always a plan first

- Any change to the CSV that `exportCustomersCsv` writes or `parseCsv` reads
  (`src/csv.js`). Customers import this file; the plan says whether existing
  exports still parse.
- A change to the status, headers or body shape of an existing route in
  `src/server.js`.

## Needs a design

- A new route, a new export format, or a change across more than two files
  in `src/`.
- A design decomposes into at most five sub-issues. Each is independent: none
  waits for another's merge, and no two change the same file. Work that cannot
  be split that way stays one sequential task.
- Every sub-issue lists acceptance checks a reviewer can verify on its pull
  request.

## Building

- Branch `agent/<issue identifier>`, e.g. `agent/ACME-13`. This replaces the
  `fix/<short-topic>` naming in `AGENTS.md` for work delegated in Linear.
- Run `npm test` and `npm run lint` before pushing; both must pass.
- Open pull requests as drafts, with the issue's acceptance checks in the
  description. Never merge.
- No new dependencies. `src/customers.js` keeps its data; add fixtures in tests.
