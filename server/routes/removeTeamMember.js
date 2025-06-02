const express = require('express');
const router = express.Router();
const project = require('../models/projectModel');

router.post('/removeteammember', async (req, res) => {
    const { projectId, memberEmail } = req.body;
    try {
        const updatedProject = await project.findByIdAndUpdate(
            projectId,
            { $pull: { teamMembers: { email: memberEmail } } },
            { new: true }
        );
        if (!updatedProject) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        res.json({ success: true, updatedProject });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to remove team member" });
    }
});

module.exports = router;