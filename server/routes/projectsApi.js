const express = require('express');
const router = express.Router();

// Example data (replace with DB logic as needed)
const projects = [
  {
    name: "Project A",
    teams: [
      { name: "Team 1", members: ["Alice", "Bob"] },
      { name: "Team 2", members: ["Charlie"] }
    ]
  },
  {
    name: "Project B",
    teams: [
      { name: "Team X", members: ["David", "Eve"] }
    ]
  }
];

router.get('/', (req, res) => {
  res.json(projects);
});

module.exports = router;