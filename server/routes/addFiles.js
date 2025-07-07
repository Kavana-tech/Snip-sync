const express = require('express');
const folder = require('../models/folderModel');
const snippetNode = require('../models/snippetNode');
const router = express.Router();

router.post('/addfiles/:folderId', async (req, res) => {
    const { folderId } = req.params;
    const { fileName } = req.body;
    const io = req.app.get('io');

    try {
        const existingFolder = await folder.findById(folderId);
        if (!existingFolder) {
            return res.status(404).json({ message: 'Folder not found' });
        }
        const duplicateFile = existingFolder.files.find(file => file.fileName.toLowerCase() === fileName.toLowerCase());
        if (duplicateFile) {
            return res.status(400).json({ message: 'File already exists' });
        }

        existingFolder.files.push({ fileName });
        const updatedFolder = await existingFolder.save();
        const newFile = updatedFolder.files[updatedFolder.files.length - 1];

        
        const rootSnippet = new snippetNode({
            fileId: newFile._id,
            content: "Start writing your code by Modifying this Root snippet.", 
            parentId: null,
            branch: 'main',
            // authorId: authorId || null
        });

        await rootSnippet.save();

        io.to(folderId).emit("file-created", {
            folderId, 
            file:newFile
        });

        res.status(200).json({
            message: 'File created successfully',
            file: newFile,
            rootSnippet
        });
    } catch (error) {
        console.error('Error adding file:', error);
        res.status(500).json({ message: 'Server error while adding file' });
    }
});

module.exports = router;
