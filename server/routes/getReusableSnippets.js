const express = require('express');
const router = express.Router();
const resuableSnippet = require('../models/resuableSnipModel');

router.get('/getresuablesnippets/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const snips = await resuableSnippet.find({ projectId }).sort({ createdAt: -1 });
        res.json({ snips });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reusable snippets" });
    }
});

module.exports = router;