const express = require('express');
const project = require('../models/projectModel');
const router = express.Router();
<<<<<<< HEAD

=======
const Project = require('../models/projectModel'); 
>>>>>>> remotes/origin/features/teams-section

// Get all projects (with teams)
router.get('/api/projects', async (req, res) => {
  try {
    const projects = await project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Add a team to a project
router.post('/', async (req, res) => {
  const { projectName, team } = req.body;
  try {
    const projectFound = await project.findOne({ title: projectName });
    if (!projectFound) return res.status(404).json({ error: 'Project not found' });
    projectFound.teams.push(team);
    await projectFound.save();
    res.status(201).json({ message: 'Team added', projectFound });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add team' });
  }
});

module.exports = router;