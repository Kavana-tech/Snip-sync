const express = require('express');
const project = require('../models/projectModel');
const router = express.Router();

router.get("/getaproject/:id",async (req, res) => {
    try{
        const {id} = req.params;
        const foundProject = await project.findById(id);
        if(!foundProject)
        {
            return res.status(404).json({message: "Project not found"});
        }
        res.status(200).json({foundProject});
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({message: "Server not responding"});
    }
})

module.exports = router;