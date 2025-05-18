const express = require('express');
const router = express.Router();
const folder = require('../models/folderModel');

router.get('/getfiles/:folderId', async (req, res) => {
    const { folderId } = req.params;

    try {
        const foundFolder = await folder.findById(folderId);
        if (!foundFolder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        res.status(200).json({ files: foundFolder.files });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ message: 'Server error while fetching files' });
    }
});

module.exports = router;
