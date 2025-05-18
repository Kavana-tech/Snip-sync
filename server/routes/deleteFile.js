const express = require('express');
const router = express.Router();
const folder = require('../models/folderModel');


router.delete('/deletefile/:folderId/:fileId', async (req, res) => {
    const { folderId, fileId } = req.params;

    try {
        const foundFolder = await folder.findById(folderId);
        if (!foundFolder) return res.status(404).json({ message: 'Folder not found' });

  
        foundFolder.files = foundFolder.files.filter(file => file._id.toString() !== fileId);

        await foundFolder.save();

        return res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error("Error deleting file:", error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
