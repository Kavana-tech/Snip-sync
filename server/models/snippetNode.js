const mongoose = require('mongoose');

const snippetNodeSchema = new mongoose.Schema({
    fileId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'folder.files',
        required: true
    },
    snippetName: {
        type: String,
    },
    content: {
        type: String,
        required: true
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
    authorId:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    tags: [String],
    branch: {
        type: String,
        default: 'main'
    }
});

const snippetNode = mongoose.model('snippetNode', snippetNodeSchema);

module.exports = snippetNode;