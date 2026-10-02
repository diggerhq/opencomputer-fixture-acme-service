# Conventions for agents working on acme-service

Read by the Linear agent before it decides how much process an issue
deserves. Keep each section short; the agent quotes it back when it asks.

## Ship directly

- A bug in one endpoint or one module that comes with a failing test, or
  for which a test can be written in a few lines.
- Wording, logging and error-message changes.

## Always a plan first

- Anything that changes the CSV export format, the customer record shape,
  or an endpoint's response.
- Anything touching `src/server.js` routing.

## Needs a design

- New endpoints, new modules, or a change that touches more than one of
  `src/csv.js`, `src/customers.js`, `src/server.js`.
- Any change to how customer data is stored or loaded.

## Building

- One branch per issue, named `agent/<ISSUE-KEY>`.
- `npm test` passes before a pull request is opened; add a test for every
  fix.
- Pull requests are drafts with the issue's acceptance checks in the
  description; a human merges.
- Do not change `package.json` name, the license, or the seeded demo data
  unless the issue says so.
