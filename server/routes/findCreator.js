const express = require('express');
const project = require('../models/projectModel');
const authentication = require('../middleware/authentication');
const user = require('../models/userModel');
const router = express.Router();

router.get('/findcreator/:projectId',authentication, async (req, res) => {
    
    const {projectId} = req.params; 
    try{
        const foundProject = await project.findById(projectId);
        if (!foundProject) {
            return res.status(404).json({ message: "Project not found" });
        }
        return res.status(200).json({ creator: foundProject.createdBy });
    }
    catch (error) {
        console.error("Error finding project creator:", error);
        return res.status(500).json({ message: "Server error while finding project creator" });
    }
});

module.exports = router;