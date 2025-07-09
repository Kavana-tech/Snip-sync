const express = require('express');
const snippetNode = require('../models/snippetNode');
const project = require('../models/projectModel');
const notification = require('../models/notificationModel');
const user = require('../models/userModel');
const router = express.Router();

router.delete('/deletesnippet/:projectId/:snippetId', async (req, res) => {
    const io = req.app.get('io');
    try {
        const { projectId, snippetId } = req.params;
        const snippet = await snippetNode.findById(snippetId);
        if (!snippet) {
            return res.status(404).json({ message: "Snippet not found" });
        }

        const foundProject = await project.findById(projectId);
        if (!foundProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Add a pending delete request
        const pendingDelete = {
            snippetId: snippetId,
            snippetTitle: snippet.title,
            requestedBy: req.user._id, // Make sure req.user is set by authentication middleware
            status: 'pending',
            requestedAt: new Date()
        };
        foundProject.pendingDeleteSnippets.push(pendingDelete);
        await foundProject.save();

        // Notify the creator
        const creatorUser = await user.findOne({ email: foundProject.creatorEmail });
        if (creatorUser) {
            await notification.create({
                user: creatorUser._id,
                message: `A request to delete snippet "${snippet.title}" in "${foundProject.title}" requires your approval.`,
                read: false
            });
        }
        io.emit("new-notification");

        res.status(200).json({ message: "Delete request submitted for approval." });
    } catch (err) {
        console.error("Error requesting snippet delete:", err);
        res.status(500).json({ message: "Server error while requesting snippet delete" });
    }
});

module.exports = router;