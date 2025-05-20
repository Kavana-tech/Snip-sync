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

// const mongoose = require("mongoose"); // Make sure this is imported

// router.get('/snippets/:fileId', async (req, res) => {
//     try {
//         const snippets = await snippetNode.find({ fileId: req.params.fileId }).sort({ createdAt: 1 });

//         // Attach parent content if exists
//         const enrichedSnippets = await Promise.all(snippets.map(async (snippet) => {
//             if (snippet.parentId) {
//                 let parent = null;
//                 try {
//                     parent = await snippetNode.findById(new mongoose.Types.ObjectId(snippet.parentId));
//                 } catch (e) {
//                     console.warn(`Invalid parentId for snippet ${snippet._id}:`, snippet.parentId);
//                 }
//                 return { ...snippet._doc, parentContent: parent?.content || "" };
//             }
//             return snippet;
//         }));

//         res.status(200).json({ snippets: enrichedSnippets });
//     } catch (error) {
//         console.error("Error fetching snippets:", error);
//         res.status(500).json({ message: "Server error while fetching snippets" });
//     }
// });
// module.exports = router;