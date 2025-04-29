const express = require('express');
const user = require('../models/userModel');
const router = express.Router();
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const newUser = new user({ email, password: hash });
        const createdUser = await newUser.save();
        let token = jwt.sign({email}, "secret");
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,   // 👉 set true if using https
            sameSite: 'Lax'  // good default
        });
        console.log(token);
        res.json(createdUser);
    } catch (error) {
        console.log(error);
        console.log("Error while signing up!");
        res.status(500).json({ message: "Something went wrong" });
    }
});

module.exports = router;
