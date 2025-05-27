const express = require('express');
const router = express.Router();
const project = require('../models/projectModel');
const authentication = require('../middleware/authentication');

router.post('/reject-deletefolder/:projectId/:pendingDeleteId', authentication, async (req, res) => {
    const { projectId, pendingDeleteId } = req.params;
    try {
        const io = req.app.get('io');
        const foundProject = await project.findById(projectId);
        if (!foundProject) {
            return res.status(404).json({ message: "Project not found" });
        }
        const pendingDelete = foundProject.pendingDeleteFolders.id(pendingDeleteId);
        if (!pendingDelete || pendingDelete.status !== 'pending') {
            return res.status(404).json({ message: "Pending delete request not found" });
        }
        pendingDelete.status = 'rejected';
        await foundProject.save();
        io.to(String(pendingDelete.requestedBy)).emit("folder-delete-rejected", {
            projectId,
            folderId: pendingDelete.folderId,
            message: "Your folder delete request was rejected by the creator."
        });
        res.status(200).json({ message: "Delete request rejected" });
    } catch (error) {
        res.status(500).json({ message: "Server error while rejecting folder delete" });
    }
});

module.exports = router;