const express = require('express');
const router = express.Router();
const Project = require('../models/projectModel'); // Make sure this model exists

// Get all projects (with teams)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Add a team to a project
router.post('/', async (req, res) => {
  const { projectName, team } = req.body;
  try {
    const project = await Project.findOne({ title: projectName });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    project.teams.push(team);
    await project.save();
    res.status(201).json({ message: 'Team added', project });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add team' });
  }
});

module.exports = router;