const express = require('express');
const user = require('../models/userModel');
const router = express.Router();
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.post('/signup', async (req, res) => {
    try {
        const {username, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const userFound = await user.findOne({email});
        if(!userFound)
        {
            const newUser = new user({username, email, password: hash });
            const createdUser = await newUser.save();
            let token = jwt.sign({email}, process.env.JWT_SECRET);
            res.cookie("token", token, {
                httpOnly: true,
                secure: false, 
                sameSite: 'Lax'  
            });
            console.log(token);
            res.status(200).json({createdUser, message:"Signed up Successfully"});
        }
        else
        {
            res.status(404).json({message:"User already Exits!"});
        }
        
    } catch (error) {
        console.log(error);
        console.log("Error while signing up!");
        res.status(500).json({ message: "Something went wrong" });
    }
});

module.exports = router;
