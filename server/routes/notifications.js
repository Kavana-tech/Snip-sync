const express = require('express');
const authentication = require('../middleware/authentication');
const notification = require('../models/notificationModel');
const router = express.Router();

router.get('/notification', authentication, async (req, res) => {
    try {
        //console.log(req.user.id);
        const userDoc = await require('../models/userModel').findOne({ email: req.user.email });
        if (!userDoc) return res.status(404).json({ message: "User not found" });

        const notifications = await notification.find({ user: userDoc._id }).sort({ createdAt: -1 });
        console.log(notifications);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/notification/unread/count', authentication, async (req, res) => {
    try {
        const userDoc = await require('../models/userModel').findOne({ email: req.user.email });
        if (!userDoc) return res.status(404).json({ message: "User not found" });

        const count = await notification.countDocuments({ user: userDoc._id, read: false });
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/notification/mark-all-read', authentication, async (req, res) => {
    try {
        const userDoc = await require('../models/userModel').findOne({ email: req.user.email });
        if (!userDoc) return res.status(404).json({ message: "User not found" });

        await notification.updateMany({ user: userDoc._id, read: false }, { $set: { read: true } });
        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;