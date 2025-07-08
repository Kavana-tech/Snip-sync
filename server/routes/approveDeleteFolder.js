const express = require('express');
const folder = require('../models/folderModel');
const project = require('../models/projectModel');
const router = express.Router();
const authentication = require('../middleware/authentication');
const notification = require('../models/notificationModel');
const user = require('../models/userModel');

router.post('/approve-deletefolder/:projectId/:pendingDeleteId', authentication, async (req, res) => {
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

        const pendingDelete = foundProject.pendingDeleteFolders.id(pendingDeleteId);
        if (!pendingDelete || pendingDelete.status !== 'pending') {
            return res.status(404).json({ message: "Pending delete request not found" });
        }


        await folder.findByIdAndDelete(pendingDelete.folderId);

        foundProject.pendingDeleteFolders = foundProject.pendingDeleteFolders.filter(
            req => String(req._id) !== String(pendingDeleteId)
        );
        foundProject.folders = foundProject.folders.filter(fId => String(fId) !== String(pendingDelete.folderId));
        pendingDelete.status = 'approved';
        await foundProject.save();

        const requesterUser = await user.findById(pendingDelete.requestedBy);
        if (requesterUser) {
            await notification.create({
                user: requesterUser._id,
                message: `Your request to delete "${pendingDelete.folderName}" folder in "${foundProject.title}" has been approved by the creator.`,
                read: false
            });
        }
        io.emit("new-notification");

        res.status(200).json({ message: "Folder deletion approved and folder deleted" });
    } catch (error) {
        console.error("Error approving folder delete:", error);
        res.status(500).json({ message: "Server error while approving folder delete" });
    }
});

module.exports = router;