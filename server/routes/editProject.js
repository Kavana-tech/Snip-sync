const express = require('express');
const project = require('../models/projectModel');
const router = express.Router();

router.post('/editproject/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const {title, description, workingAs} = req.body;
        const updatedProject = await project.findByIdAndUpdate(id, { title, description, workingAs });
        if(!updatedProject)
        {
            return res.status(404).json({message: "Project can't be updated"});
        }
        res.status(200).json({updatedProject, message: "Changes Saved Successfully!"});
    }
    
    catch(error)
    {
        console.log(error);
        res.status(500).json({message: "Error while Updating"});
    }
})

module.exports = router;