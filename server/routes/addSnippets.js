const express = require('express');
const snippetNode = require('../models/snippetNode');
const router = express.Router();

router.post('/addsnippet', async (req, res) => {
    const { fileId, content, snippetName, parentId, tags, authorId } = req.body;
    if (!content || content.trim() === "") {
        return res.status(400).json({ message: 'Snippet content cannot be empty' });
    }
    try {

        const newSnippet = new snippetNode({
            fileId,
            content,
            snippetName,
            parentId: parentId || null,
            tags: tags || [],
            // authorId
        });

        const savedSnippet = await newSnippet.save();

        if (parentId) {
            await snippetNode.findByIdAndUpdate(parentId, {
                $push: { children: savedSnippet._id }
            });
        }

        res.status(201).json({
            message: 'Snippet added successfully',
            snippet: savedSnippet
        });
    } catch (error) {
        console.error('Error adding snippet:', error);
        res.status(500).json({ message: 'Failed to add snippet' });
    }
});

module.exports = router;
