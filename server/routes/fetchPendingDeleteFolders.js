const express = require('express');
const project = require('../models/projectModel');
const authentication = require('../middleware/authentication');
const router = express.Router();

router.get('/fetchpendingdeletefolders/:projectId',authentication, async (req, res) => {   
    const { projectId } = req.params;
    //const userEmail = req.user.email;

    try {
        const foundProject = await project.findById(projectId);
        if (!foundProject) {
            return res.status(404).json({ message: "Project not found" });
        }

       const pendingProjects = foundProject.pendingDeleteFolders.filter(req => req.status === 'pending' );   
       res.status(200).json({ pendingProjects });
    } catch (error) {
        console.error("Error fetching pending delete folders:", error);
        res.status(500).json({ message: "Server error while fetching pending delete folders" });
    }
})

module.exports = router;