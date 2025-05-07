const express = require('express');
const authentication = require('../middleware/authentication');
const project = require('../models/projectModel');
const router = express.Router();

router.get('/fetchprojects', authentication, async (req, res) => {
    try{
        const userEmail = req.user.email;
        const projects = await project.find({createdBy: userEmail});
        res.status(200).json({fetchedProjects: projects});
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({message: "Error fetching projects"})
    }
})

module.exports = router;