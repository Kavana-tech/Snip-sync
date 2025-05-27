const express = require('express');
const authentication = require('../middleware/authentication');
const project = require('../models/projectModel');
const user = require('../models/userModel');
const router = express.Router();

router.post('/addproject', authentication, async(req, res) => {
    try{
        const {title, description, workingAs, inviteToken, teamMembers} = req.body;
        console.log(inviteToken)
        let newProject;
        const userEmail = req.user.email;
        const foundUser = await user.findOne({email: userEmail})
        if(workingAs === 'team')
            newProject = new project({title, description, workingAs, createdBy: foundUser.username, inviteToken, teamMembers});
        else
        {
            newProject = new project({title, description, workingAs, createdBy: foundUser.username});
        }
        const createdProject = await newProject.save();
        res.status(200).json({message: "Project added successfully!", project: createdProject});
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({message: "Error while adding project"});
    }
})

module.exports = router;