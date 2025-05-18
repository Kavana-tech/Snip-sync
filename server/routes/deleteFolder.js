const express = require('express');
const folder = require('../models/folderModel');
const router = express.Router();


router.delete('/deletefolder/:id', async (req, res) => {
    const folderId = req.params.id;

    try {
        const deletedFolder = await folder.findByIdAndDelete(folderId);
        if (!deletedFolder) {
            return res.status(404).json({ message: "Folder not found" });
        }
        res.status(200).json({ message: "Folder deleted successfully" });
    } catch (error) {
        console.error("Error deleting folder:", error);
        res.status(500).json({ message: "Server error while deleting folder" });
    }
});

module.exports = router;
