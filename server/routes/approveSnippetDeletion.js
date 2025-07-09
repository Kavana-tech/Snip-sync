const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authentication');
const notification = require('../models/notificationModel');
const user = require('../models/userModel');
const project = require('../models/projectModel');
const snippetNode = require('../models/snippetNode');


router.post('/approve-deletesnippet/:projectId/:pendingDeleteId', authentication, async (req, res) => {
    const { projectId, pendingDeleteId } = req.params;

    try {
        const io = req.app.get('io');
        const foundProject = await project.findById(projectId);
        if (!foundProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (String(foundProject.creatorEmail) !== String(req.user.email)) {
            return res.status(403).json({ message: "Only the creator can approve deletions" });
        }

        const pendingDelete = foundProject.pendingDeleteSnippets.id(pendingDeleteId);
        if (!pendingDelete || pendingDelete.status !== 'pending') {
            return res.status(404).json({ message: "Pending delete request not found" });
        }

        await snippetNode.findByIdAndDelete(pendingDelete.snippetId);

        foundProject.pendingDeleteSnippets = foundProject.pendingDeleteSnippets.filter(
            req => String(req._id) !== String(pendingDeleteId)
        );
        foundProject.snippets = foundProject.snippets.filter(sId => String(sId) !== String(pendingDelete.snippetId));
        pendingDelete.status = 'approved';
        await foundProject.save();

        const requesterUser = await user.findById(pendingDelete.requestedBy);
        if (requesterUser) {
            await notification.create({
                user: requesterUser._id,
                message: `Your request to delete snippet "${pendingDelete.snippetTitle}" in "${foundProject.title}" has been approved by the creator.`,
                read: false
            });
        }
        io.emit("new-notification");

        res.status(200).json({ message: "Snippet deletion approved and snippet deleted" });
    } catch (error) {
        console.error("Error approving snippet delete:", error);
        res.status(500).json({ message: "Server error while approving snippet delete" });
    }
});

module.exports = router;