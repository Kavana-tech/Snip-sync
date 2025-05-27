const express = require('express');
const snippetNode = require('../models/snippetNode');
const router = express.Router();

router.get('/snippets/:fileId', async (req, res) => {
    try {
        const snippets = await snippetNode.find({ fileId: req.params.fileId }).sort({ createdAt: 1 }).skip(1);;
        console.log(snippets);
        res.status(200).json({ snippets });
    } catch (error) {
        console.error("Error fetching snippets:", error);
        res.status(500).json({ message: "Server error while fetching snippets" });
    }
});

module.exports = router;
