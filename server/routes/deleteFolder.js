const express = require('express');
const folder = require('../models/folderModel');
const project = require('../models/projectModel');
const router = express.Router();
const authentication = require('../middleware/authentication');
const user = require('../models/userModel');
const notification = require('../models/notificationModel');
const snippetNode = require('../models/snippetNode');

router.delete('/deletefolder/:projectId/:folderId', authentication, async (req, res) => {
    const { projectId, folderId } = req.params;
    const userEmail = req.user.email;

    try {
        const foundProject = await project.findById(projectId);
        if (!foundProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        const foundUser = await user.findOne({ email: userEmail });
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const foundFolder = await folder.findById(folderId);

         if (foundFolder && foundFolder.files && foundFolder.files.length > 0) {
            for (const file of foundFolder.files) {
                await snippetNode.deleteMany({ fileId: file._id });
            }
        }

        if (String(foundProject.createdBy) === String(foundUser.username)) {
            await folder.findByIdAndDelete(folderId);
            foundProject.folders = foundProject.folders.filter(fId => String(fId) !== String(folderId));

            await foundProject.save();

            for (const member of foundProject.teamMembers) {
                const memberUser = await user.findOne({ email: member.email });
                if (memberUser) {
                    await notification.create({
                        user: memberUser._id,
                        message: `${foundFolder.folderName} folder was deleted by the project creator in "${foundProject.title}".`,
                        read: false
                    });
                }
            }

            const io = req.app.get('io');
            io && io.emit("folder-deleted", { projectId, folderId });

            return res.status(200).json({
                message: "Folder deleted successfully by creator."
            });
        }

        // If a team member is requesting deletion
        if (foundProject.pendingDeleteFolders.some(f => String(f.folderId) === folderId && f.status === 'pending')) {
            return res.status(400).json({ message: "Delete request already pending for this folder" });
        }

        foundProject.pendingDeleteFolders.push({
            folderId,
            folderName: foundFolder.folderName,
            requestedBy: foundUser._id,
            requester: foundUser.username,
            status: 'pending'
        });
        await foundProject.save();

        const creatorUser = await user.findOne({ username: foundProject.createdBy });
        if (creatorUser) {
            await notification.create({
                user: creatorUser._id,
                message: `${foundUser.username} has requested to delete a "${foundFolder.folderName}" folder in "${foundProject.title}".`,
                read: false
            });
        }

        //Notify the requester
        await notification.create({
            user: foundUser._id,
            message: `Your request to delete a folder in "${foundFolder.folderName}" folder has been submitted for approval.`,
            read: false
        });

        res.status(200).json({ message: "Delete request submitted for approval" });
    } catch (error) {
        console.error("Error requesting folder delete:", error);
        res.status(500).json({ message: "Server error while requesting folder delete" });
    }
});

module.exports = router;