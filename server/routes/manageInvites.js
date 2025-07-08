const express = require('express');
const authentication = require('../middleware/authentication');
const project = require('../models/projectModel');
const user = require('../models/userModel');
const notification = require('../models/notificationModel');
const router = express.Router();

router.get('/admin/manageinvites', authentication, async (req, res) => {
    try {
        const creator = await user.findOne({ email: req.user.email });
        if (!creator) return res.status(404).json({ message: "User not found" });

        const projects = await project.find({ creatorEmail: creator.email });
        res.json({ projects });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.post('/admin/manageinvites/approve', authentication, async (req, res) => {
    const { projectId, email } = req.body;
    const io = req.app.get('io');
    const adminEmail = req.user.email;
    try {
        const proj = await project.findById(projectId);
        if (!proj) return res.status(404).json({ message: "Project not found" });

        const foundUser = await user.findOne({ email });

        proj.pendingJoinRequests = proj.pendingJoinRequests.filter(req => req.email !== email);

        let addedMember = null;
        if (foundUser && !proj.teamMembers.some(tm => tm.email === email)) {
            proj.teamMembers.push({ email: foundUser.email, username: foundUser.username });
            addedMember = foundUser;
        }
        await proj.save();

        const creator = await user.findOne({ email: adminEmail });
        if(creator) {
            await notification.create({ 
                user: creator._id,
                message: `You have approved the join request from ${foundUser.username} for project "${proj.title}".`,
                read: false
            });
        }

        if (foundUser) {
            await notification.create({
                user: foundUser._id,
                message: `Your request to join "${proj.title}" has been approved by the creator.`,
                read: false
            });
        }

        if (addedMember) {
            const otherMembers = proj.teamMembers.filter(tm => tm.email !== addedMember.email);
            const usersToNotify = await user.find({ email: { $in: otherMembers.map(tm => tm.email) } });
            for (const member of usersToNotify) {
                await notification.create({
                    user: member._id,
                    message: `${addedMember.username} has joined your team for "${proj.title}".`,
                    read: false
                });
            }
        }
        io.emit("new-notification");
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.post('/admin/manageinvites/reject', authentication, async (req, res) => {
    const { projectId, email } = req.body;
    const io = req.app.get('io');
    try {
        const proj = await project.findById(projectId);
        if (!proj) return res.status(404).json({ message: "Project not found" });

        proj.pendingJoinRequests = proj.pendingJoinRequests.filter(req => req.email !== email);
        await proj.save();
        if (foundUser) {
            await notification.create({
                user: foundUser._id,
                message: `Your request to join "${proj.title}" has been rejected by the creator.`,
                read: false
            });
        }
        io.emit("new-notification");
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;