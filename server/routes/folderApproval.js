const express = require('express');
const authentication = require('../middleware/authentication');
const project = require('../models/projectModel');
const folder = require('../models/folderModel');
const router = express.Router();

router.post('/folderapproval/:projectId/:pendingFolderId', authentication, async (req, res) => {
    const io = req.app.get('io');
    const { projectId, pendingFolderId } = req.params;
    const { status } = req.body;
    const useremail = req.user.email;

    try {
        const foundProject = await project.findById(projectId);
        if (!projectId) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (String(foundProject.createdBy) !== String(useremail)) {
            return res.status(403).json({ message: "Only creator can approve!" });
        }

        const pendingFolder = foundProject.pendingFolders.id(pendingFolderId);
        if (!pendingFolder) {
            return res.json(404).json({ message: "No pending folders found" });
        }

        const newFolder = await folder.create({
            folderName: pendingFolder.name,
            files: [],
            projectId: foundProject._id
        })

        foundProject.folders.push(newFolder._id);
        pendingFolder.remove();

        await foundProject.save();

        io.emit("folder-approved", {
            projectId,
            folderId: newFolder._id,
            folderName: newFolder.folderName,
        })
        res.status(200).json({ message: "Folder approved and added to project", folder: newFolder });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong!" });
    }
})

module.exports = router;