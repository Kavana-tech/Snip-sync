const express = require('express');
const snippetNode = require('../models/snippetNode');
const router = express.Router();


router.delete('/deletesnippet/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const snippet = await snippetNode.findByIdAndDelete(id);
        if (!snippet) {
            return res.status(404).json({ message: "Snippet not found" });
        }
        res.status(200).json({ message: "Snippet deleted successfully" });
    } catch (err) {
        console.error("Error deleting snippet:", err);
        res.status(500).json({ message: "Server error while deleting snippet" });
    }
});

module.exports = router;
