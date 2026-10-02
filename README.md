# acme-service (demo fixture)

This is a demo fixture repository for OpenComputer examples: the [Slack coder](https://github.com/diggerhq/opencomputer-slack-coder) and the [Linear agent](https://github.com/diggerhq/opencomputer-linear-agent). It contains a deliberately seeded defect in CSV export, and `.agents/conventions.md`, which the Linear agent reads before deciding how much process an issue deserves. It is not a real service.

## How to run

```
npm test
node src/server.js
```

## Endpoints

- `GET /customers.csv` — exports the in-memory customer list as CSV.
- `GET /health` — returns `{ "status": "ok" }`.

## Known issue

Customer names containing commas are not exported correctly.
