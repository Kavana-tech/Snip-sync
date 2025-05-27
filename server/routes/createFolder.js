const express = require('express');
const folder = require('../models/folderModel');
const router = express.Router();
const mongoose = require('mongoose');
const authentication = require('../middleware/authentication');
const user = require('../models/userModel');

router.post('/createfolder/:projectId',authentication, async (req, res) => {
    const io = req.app.get('io');
    try {
        const { folderName } = req.body;
        const {projectId} = req.params;
        const userEmail = req.user.email;
         const existingFolder = await folder.findOne({
            folderName: { $regex: `^${folderName}$`, $options: 'i' },
            projectId: new mongoose.Types.ObjectId(projectId)
        });

        if(existingFolder)
            return res.status(400).json({message: "Folder Already Exists!"});
        const foundUser = await user.findOne({ email: userEmail });
        const folders = new folder({ folderName, projectId, createdBy: foundUser.username });
        const createdFolder = await folders.save();
        io.emit("folder-created", createdFolder);
        res.status(200).json({ message: "Folder Created Successfully", createdFolder });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
})

module.exports = router;