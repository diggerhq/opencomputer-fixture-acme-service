import test from "node:test";
import assert from "node:assert/strict";
import { exportCustomersCsv, parseCsv } from "../src/csv.js";
import { createApp } from "../src/server.js";

// Plain customers with no commas or newlines in any field, used to test
// the happy path without tripping the seeded CSV defect.
const plainCustomers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", city: "Austin" },
  { id: 2, name: "Bob Lee", email: "bob@example.com", city: "Denver" },
  { id: 3, name: "Cara Kim", email: "cara@example.com", city: "Seattle" },
];

test("exportCustomersCsv writes the expected header row", () => {
  const csv = exportCustomersCsv(plainCustomers);
  const [header] = csv.split("\n");
  assert.equal(header, "id,name,email,city");
});

test("exportCustomersCsv writes one row per customer", () => {
  const csv = exportCustomersCsv(plainCustomers);
  const lines = csv.split("\n").filter((line) => line.length > 0);
  // 1 header row + 1 row per customer
  assert.equal(lines.length, plainCustomers.length + 1);
});

test("round-trips a customer without special characters", () => {
  const csv = exportCustomersCsv(plainCustomers);
  const parsed = parseCsv(csv);
  assert.equal(parsed.length, plainCustomers.length);
  assert.deepEqual(parsed[0], {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    city: "Austin",
  });
});

test("GET /health responds with ok status", async () => {
  const server = createApp();
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/health`);
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.deepEqual(body, { status: "ok" });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
