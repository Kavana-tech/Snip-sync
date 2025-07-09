const mongoose = require('mongoose');

const snippetNodeSchema = new mongoose.Schema({
    fileId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'folder.files',
        required: true
    },
    snippetName: {
        type: String,
       // required: true,
    },
    content: {
        type: String,
        //required: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'snippetNode',
        default: null
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'snippetNode'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    author:{
        type:  String,
    },
    tags: [String],
    branch: {
        type: String,
        default: 'main'
    },
    description:{
        type: String,
        //required: true
    },
    language:{
        type: String,
        //required: true
    },
    deletionStatus: {
        type: String,
        enum: ['active', 'pending', 'approved', 'rejected'],
        default: 'active'
    }
});

const snippetNode = mongoose.model('snippetNode', snippetNodeSchema);

module.exports = snippetNode;