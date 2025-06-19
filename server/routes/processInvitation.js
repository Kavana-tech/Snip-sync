const express = require('express');
const invite = require('../models/inviteModel');
const router = express.Router();
const jwt = require('jsonwebtoken');
const project = require('../models/projectModel');
const User = require('../models/userModel');
const notification = require('../models/notificationModel');
require('dotenv').config();

router.post('/processinvite', async (req, res) => {
    const { token } = req.body;
    const userToken = req.cookies.token;

    if (!userToken) {
        return res.status(401).json({ redirectTo: 'login' });
    }

    try {
        const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
        const currentUser = await User.findOne({ email: decoded.email });

        const invitation = await invite.findOne({ token });
        if (!invitation) {
            return res.status(410).json({ message: "Link Expired or Invalid" });
        }

        const projectDoc = await project.findOne({ inviteToken: token });
        if (!projectDoc) return res.status(404).json({ message: "Project not found" });

        const alreadyRequested = projectDoc.pendingJoinRequests.some(
            req => req.email === currentUser.email
        );
        if (!alreadyRequested) {
            projectDoc.pendingJoinRequests.push({
                email: currentUser.email,
                username: currentUser.username
            });
            await projectDoc.save();
        }

        await notification.create({
            user: currentUser._id,
            message: "Your joining request has been sent successfully! Please wait for approval.",
            read: false
        });

        const creatorUser = await User.findOne({ email: projectDoc.creatorEmail });
        if (creatorUser) {
            await notification.create({
                user: creatorUser._id,
                message: `${currentUser.username} has requested to join your project "${projectDoc.title}".`,
                read: false
            });
        }

        res.json({ redirectTo: 'request', notification: "Joining request sent successfully! Please wait for approval." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router