const express = require('express');
const snippetNode = require('../models/snippetNode');
const authentication = require('../middleware/authentication');
const user = require('../models/userModel');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/addsnippet', authentication, async (req, res) => {
    const { fileId, content, snippetName, parentId, tags } = req.body;
    const userToken = req.cookies.token;
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
    const currentUser = await user.findOne({ email: decoded.email });
    const author = currentUser.username;
    const io = req.app.get('io');
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
            author
        });

        const savedSnippet = await newSnippet.save();

        if (parentId) {
            await snippetNode.findByIdAndUpdate(parentId, {
                $push: { children: savedSnippet._id }
            });
        }

        io.to(fileId).emit("snippet-added", { fileId, snippet: savedSnippet });

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
