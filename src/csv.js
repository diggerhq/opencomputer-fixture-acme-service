// CSV export/import for the customer list.
//
// NOTE: exportCustomersCsv joins fields with a plain "," and does not quote
// or escape field values. A customer name containing a comma will produce
// an extra column and shift the row out of alignment. This is a known,
// deliberately seeded defect in this demo fixture (see README "Known issue").

const HEADERS = ["id", "name", "email", "city"];

export function exportCustomersCsv(customers) {
  const lines = [HEADERS.join(",")];
  for (const customer of customers) {
    const row = HEADERS.map((field) => String(customer[field]));
    lines.push(row.join(","));
  }
  return lines.join("\n") + "\n";
}

// Naive round-trip parser matching the writer above: splits on newlines and
// commas with no quoting/escaping support. Only correct for values that
// contain neither a comma nor a newline.
export function parseCsv(text) {
  const lines = text.split("\n").filter((line) => line.length > 0);
  const [headerLine, ...rowLines] = lines;
  const headers = headerLine.split(",");
  return rowLines.map((line) => {
    const values = line.split(",");
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index];
    });
    return record;
  });
}
