const express = require('express');
const invite = require('../models/inviteModel');
const router = express.Router();
const jwt = require('jsonwebtoken');
const project = require('../models/projectModel');
const User = require('../models/userModel');
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
        if (!invitation || (invitation.expiresAt && invitation.expiresAt < Date.now())) {
            return res.status(410).json({ message: "Link Expired or Invalid" });
        }

        const projectDoc = await project.findOne({ inviteToken: token });
        if (!projectDoc) return res.status(404).json({ message: "Project not found" });

        const alreadyInTeam = projectDoc.teamMembers.some(
            m => m.email === currentUser.email
        );

        if (!alreadyInTeam) {
            projectDoc.teamMembers.push({
                email: currentUser.email,
                username: currentUser.username
            });
            await projectDoc.save();
        }

        res.json({ redirectTo: 'dashboard', projectId: projectDoc._id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router