// In-memory customer list for the acme-service demo fixture.
// One name deliberately contains a comma to exercise the seeded CSV defect.
export const customers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", city: "Austin" },
  { id: 2, name: "Smith, Jr., John", email: "john.smith@example.com", city: "Denver" },
  { id: 3, name: "Priya Natarajan", email: "priya@example.com", city: "Seattle" },
  { id: 4, name: "Miguel Santos", email: "miguel@example.com", city: "Miami" },
  { id: 5, name: "Chen Wei", email: "chen.wei@example.com", city: "Boston" },
  { id: 6, name: "Olivia Brown", email: "olivia@example.com", city: "Chicago" },
];
