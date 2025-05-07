const express = require('express');
const user = require('../models/userModel');
const authentication = require('../middleware/authentication');
const router = express.Router();

router.get('/getuser',authentication, async (req, res) => {
    try{
        const userEmail = req.user.email;
        let userData = await user.findOne({email: userEmail});
        console.log(userData);
        res.status(200).json({userData});
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({message:"Error While Fetching User Data"})
    }
})

module.exports = router;