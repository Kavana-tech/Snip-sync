const express = require('express');
const invite = require('../models/inviteModel');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/processinvite', async (req, res)=>{
    const {token} = req.body;
    const userToken = req.cookies.token
    if(!userToken)
        {
            return res.json({redirectTo: 'login'});
        }
    let decodedInfo = jwt.verify(userToken, process.env.JWT_SECRET);
    const invitation = await invite.findOne({token});
    if(invitation.expiresAt && invitation.expiresAt < Date.now())
        return res.status(410).json({message: "Link Expired"});
    
    res.json({redirectTo: 'dashboard'});
})

module.exports = router;