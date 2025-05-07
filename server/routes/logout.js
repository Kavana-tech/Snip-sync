const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: 'Lax', 
        secure: false     
    });
    res.json({message: "Logged out Successfully!"});
})

module.exports = router;