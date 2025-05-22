const express = require('express');
const project = require('../models/projectModel');
const folder = require('../models/folderModel');
const router = express.Router();

router.get('/deleteproject/:id', async (req, res) => {
    try{
        const {id} = req.params;
        let deletedProject = await project.findByIdAndDelete(id);
        if(!deletedProject)
        {
            return res.status(404).json({message: "Project not found"});
        }
        await folder.deleteMany({ projectId: id });
        res.status(200).json({message: "Project Deleted Successfully!"});
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({message: "Something Went Wrong!"})
    }
})

module.exports = router;