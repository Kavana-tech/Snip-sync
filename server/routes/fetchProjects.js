const express = require('express');
const authentication = require('../middleware/authentication');
const project = require('../models/projectModel');
const user = require('../models/userModel');
const router = express.Router();

router.get('/fetchprojects', authentication, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const foundUser = await user.findOne({email: userEmail});
        const projects = await project.find({
            $or: [
                { createdBy: foundUser.username },
                { "teamMembers.email": userEmail }
            ]
        });
        res.status(200).json({ fetchedProjects: projects });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching projects" });
    }
});


module.exports = router;