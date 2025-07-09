const express = require('express');
const router = express.Router();
const project = require('../models/projectModel');
const authentication = require('../middleware/authentication');
const user = require('../models/userModel');
const notification = require('../models/notificationModel');

router.post('/reject-deletefolder/:projectId/:pendingDeleteId', authentication, async (req, res) => {
    const { projectId, pendingDeleteId } = req.params;
    const io = req.app.get('io');
    try {
        
        const foundProject = await project.findById(projectId);
        if (!foundProject) {
            return res.status(404).json({ message: "Project not found" });
        }
        const pendingDelete = foundProject.pendingDeleteFolders.id(pendingDeleteId);
        console.log("Pending Delete Request:", pendingDelete);
        if (!pendingDelete || pendingDelete.status !== 'pending') {
            return res.status(404).json({ message: "Pending delete request not found" });
        }
    
         foundProject.pendingDeleteFolders = foundProject.pendingDeleteFolders.filter(
            req => String(req._id) !== String(pendingDeleteId)
        );

        const requesterUser = await user.findById(pendingDelete.requestedBy);
        if (requesterUser) {
            const notif = await notification.create({
                user: requesterUser._id,
                message: `Your request to delete "${pendingDelete.folderName}" folder in "${foundProject.title}" has been rejected by the creator.`,
                read: false
            });
            console.log("Notification created for requester:", notif);
        }

        const creatorUser = await user.findOne({ email: foundProject.creatorEmail });
        if (creatorUser) {
            const creatorNotif = await notification.create({
                user: creatorUser._id,
                message: `You have rejected the request to delete "${pendingDelete.folderName}" folder in "${foundProject.title}".`,
                read: false
            });
            console.log("Notification created for creator:", creatorNotif);
        }

        await foundProject.save();
        console.log("Emitting new-notification event");
        io.emit("new-notification");
        res.status(200).json({ message: "Delete request rejected" });
    } catch (error) {
        console.error("Error rejecting folder delete:", error);
        res.status(500).json({ message: "Server error while rejecting folder delete" });
    }
});

module.exports = router;