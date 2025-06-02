const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: 'Lax',
        secure: false
    });
    // Optional: You can also destroy the session here if you use sessions
    // req.session?.destroy();

    res.json({
        message: "Logged out Successfully!",
        confirm: true
    });
});

module.exports = router;