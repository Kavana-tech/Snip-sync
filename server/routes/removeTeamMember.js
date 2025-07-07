const express = require('express');
const router = express.Router();
const project = require('../models/projectModel');
const user = require('../models/userModel');
const notification = require('../models/notificationModel');
const authentication = require('../middleware/authentication');

router.post('/removeteammember',authentication, async (req, res) => {
    const { projectId, memberEmail } = req.body;
    const adminEmail = req.user.email;
    try {
        const foundProject = await project.findById(projectId);
        if(!foundProject) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const removedMember = foundProject.teamMembers.find(member => member.email === memberEmail);

        foundProject.teamMembers = foundProject.teamMembers.filter(member => member.email !== memberEmail);

        const updatedProject = await foundProject.save();

        if (removedMember) {
            const removedUser = await user.findOne({ email: memberEmail });
            if (removedUser) {
                await notification.create({
                    user: removedUser._id,
                    message: `You have been removed from the project "${foundProject.title}".`,
                    read: false
                });
            }
        }

        const adminDetails = await user.findOne({ email: adminEmail });
        if (adminDetails) {
            await notification.create({
                user: adminDetails._id, 
                message: `You have removed ${removedMember?.username || memberEmail} from the project "${foundProject.title}".`,
                read: false 
            });
        }

        const remainingEmails = foundProject.teamMembers.map(member => member.email);
        const remainingUsers = await user.find({ email: { $in: remainingEmails } });
        for (const member of remainingUsers) {
            await notification.create({
                user: member._id,
                message: `${removedMember?.username || memberEmail} has been removed from the project "${foundProject.title}".`,
                read: false
            });
        }

        res.json({ success: true, updatedProject });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to remove team member" });
    }
});

module.exports = router;