const express = require('express');
const resuableSnippet = require('../models/resuableSnipModel');

const router = express.Router();


router.post('/addresuablesnippet', async (req, res) => {
    const { projectId, title, code } = req.body;
    if (!projectId || !title || !code) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const newSnippet = new resuableSnippet({ projectId, title, code });
        await newSnippet.save();
        res.status(201).json({ message: "Reusable snippet added", snippet: newSnippet });
    } catch (error) {
        res.status(500).json({ message: "Failed to add snippet" });
    }
});

module.exports = router;