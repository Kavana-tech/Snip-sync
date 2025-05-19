const express = require('express');
const folder = require('../models/folderModel');
const router = express.Router();

router.post('/createfolder', async (req, res) => {
    const io = req.app.get('io');
    try {
        const { folderName } = req.body;
         const existingFolder = await folder.findOne({
            folderName: { $regex: `^${folderName}$`, $options: 'i' }
        });

        if(existingFolder)
            return res.status(400).json({message: "Folder Already Exists!"});
        const folders = new folder({ folderName });
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