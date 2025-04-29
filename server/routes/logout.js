const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
    res.cookie("token", "");
    res.redirect('/');
})

module.exports = router;