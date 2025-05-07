const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock data
const members = [
  { id: 1, name: 'John Doe', role: 'President' },
  { id: 2, name: 'Jane Smith', role: 'Treasurer' },
];

const organizations = [
  { id: 1, name: 'Tech Club', description: 'A club for tech enthusiasts' },
  { id: 2, name: 'Art Society', description: 'A club for art lovers' },
];

// Routes
app.get('/api/members', (req, res) => {
  res.json(members);
});

app.get('/api/organizations', (req, res) => {
  res.json(organizations);
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});