const express = require('express');
const user = require('../models/userModel');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        let incomingUser = await user.findOne({ email });
        if (!incomingUser)
            return res.json({ message: "Email or password is incorrect!" });
        bcrypt.compare(password, incomingUser.password, (err, result) => {
            if(result)
            {
                res.json({message: "Logged In Successfully!", isLogin: true})
            }
            else
            {
                res.json({message: "Email or password is incorrect!", isLogin: false});
            }
        })
    }
    catch(error)
    {
        console.log(error);
        res.json({ message: "Email or password is incorrect!" });
    }
})

module.exports = router;