const express = require('express');
const project = require('../models/projectModel');
const authentication = require('../middleware/authentication');
const router = express.Router();

router.get("/addmember/:projectId", authentication, (req, res) => {
    const {projectId} = req.params; 
    try{
       const foundProject = project.findById(projectId);
       const inviteToken = foundProject.inviteToken;
       res.status(200).json({inviteToken});
        
    }
    catch(error) {
        console.error("Error in addMember route:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
})

module.exports = router;