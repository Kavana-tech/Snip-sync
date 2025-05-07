const express = require('express');
const project = require('../models/projectModel');
const router = express.Router();

router.get("/getproject",async (req, res) => {
    try{
        const {token} = req.query;
        console.log(token);
        let fetchedProject = await project.findOne({inviteToken: token});
        console.log(fetchedProject);
        res.json({fetchedProject});
    }
    catch(error)
    {
        console.log(error);
        res.status(404).json({message:"Invalid Token"})
    }
})

module.exports = router;