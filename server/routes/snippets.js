const express = require('express');
const snippetNode = require('../models/snippetNode');
const { decrypt } = require('../utils/contentCrypto');
const router = express.Router();

function isHex(str) {
    return typeof str === 'string' && /^[0-9a-fA-F]+$/.test(str);
}

router.get('/snippets/:fileId', async (req, res) => {
    try {
        const snippets = await snippetNode.find({ fileId: req.params.fileId }).sort({ createdAt: 1 });
        for (let snippet of snippets) {
            if (snippet.content && isHex(snippet.content)) {
                try {
                    snippet.content = decrypt(snippet.content);
                } catch (e) {
                    console.error("Decryption failed for snippet:", snippet._id, e.message);
                    snippet.content = "[Decryption failed]";
                }
            }
        }
        res.status(200).json({ snippets });
    } catch (error) {
        console.error("Error fetching snippets:", error);
        res.status(500).json({ message: "Server error while fetching snippets" });
    }
});

module.exports = router;