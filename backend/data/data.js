let DUMMY_PLACES = [
  {
    id: 1,
    title: "First Object",
    description: "Description of the first object",
    location: { lat: 40.7128, long: -74.006 },
    address: "123 Main Street",
    creator: "u1",
  },
  {
    id: 2,
    title: "Second Object",
    description: "Description of the second object",
    location: { lat: 34.0522, long: -118.2437 },
    address: "456 Elm Street",
    creator: "u1",
  },
  {
    id: 3,
    title: "Third Object",
    description: "Description of the third object",
    location: { lat: 51.5074, long: -0.1278 },
    address: "789 Oak Street",
    creator: "u2",
  },
];

let DUMMY_USERS = [
  { id: 1, name: "John Doe", email: "john@example.com", pwd: "password123" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", pwd: "abc@123" },
  { id: 3, name: "Alice Johnson", email: "alice@example.com", pwd: "pass1234" },
];

module.exports = { DUMMY_USERS, DUMMY_PLACES };
