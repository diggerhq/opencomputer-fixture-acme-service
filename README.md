# acme-service (demo fixture)

This is a demo fixture repository for the [OpenComputer Slack coder example](https://github.com/diggerhq/opencomputer-slack-coder). It contains a deliberately seeded defect in CSV export. It is not a real service.

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
