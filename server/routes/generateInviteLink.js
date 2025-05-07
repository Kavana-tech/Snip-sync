const express = require("express");
const authentication = require("../middleware/authentication");
const router = express.Router();
const crypto = require('crypto');
const invite = require("../models/inviteModel");

router.post('/generateinvite',authentication,async (req, res) => {
    const token = crypto.randomUUID();
    const inviteData = new invite({
        token, createdBy: req.user.email, expiresAt:Date.now() + 24 * 60 * 60 * 1000
    });

    await inviteData.save();

    const inviteToken = token;
    res.json(inviteToken);
});

module.exports = router;