const express = require('express');
const router = express.Router();
const resuableSnippet = require('../models/resuableSnipModel');

// DELETE /deletesnip/:id
router.delete('/deletesnip/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await resuableSnippet.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Snippet not found' });
        }
        res.status(200).json({ message: 'Snippet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;