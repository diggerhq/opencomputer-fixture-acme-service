import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/server.js";

async function withServer(fn) {
  const server = createApp();
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();

  try {
    await fn(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

for (const path of ["/health", "/health/"]) {
  test(`GET ${path} responds with ok status as JSON`, async () => {
    await withServer(async (base) => {
      const response = await fetch(`${base}${path}`, { redirect: "manual" });
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("content-type"), "application/json");
      const body = await response.json();
      assert.deepEqual(body, { status: "ok" });
    });
  });
}

test("GET /customers.csv/ is still 404 (no trailing-slash normalisation)", async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/customers.csv/`, { redirect: "manual" });
    assert.equal(response.status, 404);
    await response.body?.cancel();
  });
});
