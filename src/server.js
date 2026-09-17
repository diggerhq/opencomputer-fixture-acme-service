import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { customers } from "./customers.js";
import { exportCustomersCsv } from "./csv.js";

export function createApp() {
  return createServer((req, res) => {
    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
      return;
    }

    if (req.method === "GET" && req.url === "/customers.csv") {
      const csv = exportCustomersCsv(customers);
      res.writeHead(200, { "content-type": "text/csv" });
      res.end(csv);
      return;
    }

    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "not found" }));
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = process.env.PORT || 3000;
  createApp().listen(port, () => {
    console.log(`acme-service listening on port ${port}`);
  });
}
