const express = require('express');
const folder = require('../models/folderModel');
const router = express.Router();

router.get('/getfolders/:projectId',async (req, res) => {
    try{
        const {projectId} = req.params;
        const folders = await folder.find({ projectId });
        res.json(folders);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({message: "Something Went Wrong"});
    }
})

module.exports = router;