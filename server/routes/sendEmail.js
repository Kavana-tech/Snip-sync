const express = require('express');
const router = express.Router();
const {Resend} = require('resend');
const resend = new Resend("re_CLuQLXyL_29ngJU4XPKz1gwH5kHWydEpy");

router.post('/:email',async (req, res) => {
    const {email} = req.params;
    let otp = Math.floor(100000 + Math.random() * 900000);
    
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: "snipsync42@gmail.com",
            subject: 'Email Verification',
            html:  `<h3>OTP to verify your Email to SnipSync</h3><br><p>OTP is ${otp}`,
          });
    
    if(error)
    {
        res.json({error});
        console.error({ error });
        return;
    }
    res.status(200).json({data, message: "OTP Sent Successfully!", otp});
})

module.exports = router;
