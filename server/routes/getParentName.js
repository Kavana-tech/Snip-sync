const express = require('express');
const router = express.Router();

const snippetNode = require('../models/snippetNode');

router.get('/getParentName/:snippetId', async (req, res) => {
    const {snippetId} = req.params;
    try{
        const snippet = await snippetNode.findById(snippetId);
        if (!snippet) {
            return res.status(404).json({ message: 'Snippet not found' });
        }

        res.json({parentName: snippet.snippetName || 'No name available' });
    }
    catch(error) {
        console.error('Error fetching parent name:', error);
        res.status(500).json({ message: 'Server error while fetching parent name' });
    }
})

module.exports = router;