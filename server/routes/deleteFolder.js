const express = require('express');
const folder = require('../models/folderModel');
const project = require('../models/projectModel');
const router = express.Router();
const authentication = require('../middleware/authentication');

router.delete('/deletefolder/:projectId/:folderId', authentication, async (req, res) => {
    const { projectId, folderId } = req.params;
    const userId = req.user.id;
    const userEmail = req.user.email;

    try {
        const foundProject = await project.findById(projectId);
        if (!foundProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (String(foundProject.createdBy) === String(userEmail)) {
            await folder.findByIdAndDelete(folderId);
            foundProject.folders = foundProject.folders.filter(fId => String(fId) !== String(folderId));
            await foundProject.save();


            const io = req.app.get('io');
            io && io.emit("folder-deleted", { projectId, folderId });

            return res.status(200).json({
                message: "Folder deleted successfully by creator."

            });
        }


        if (foundProject.pendingDeleteFolders.some(f => String(f.folderId) === folderId && f.status === 'pending')) {
            return res.status(400).json({ message: "Delete request already pending for this folder" });
        }

        foundProject.pendingDeleteFolders.push({
            folderId,
            requestedBy: userId,
            status: 'pending'
        });
        await foundProject.save();

        // Optionally notify creator here

        res.status(200).json({ message: "Delete request submitted for approval" });
    } catch (error) {
        console.error("Error requesting folder delete:", error);
        res.status(500).json({ message: "Server error while requesting folder delete" });
    }
});

module.exports = router;