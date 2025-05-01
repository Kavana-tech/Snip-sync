
const nodemailer = require('nodemailer');
const express = require('express');
const user = require('../models/userModel');
const router = express.Router();
require('dotenv').config();

router.post('/:email', async (req, res) => {
    const { email } = req.params;
    const userFound = await user.findOne({ email });
    if (!userFound) {
        let otp = Math.floor(100000 + Math.random() * 900000);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: "Email Verification",
            html: `<h3>OTP to verify your Email to Snipsync</h3><br><p>Your OTP is: ${otp}</p>`,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully");
            res.status(200).json({ message: "OTP Sent Successfully!", otp });
        } catch (error) {
            console.error("Error sending email:", error.message);
            res.status(500).json({ message: "Failed to send email", error: error.message });
        }
    }
    else{
        res.status(404).json({message:"User already Exits!"});
    }

});

module.exports = router;
