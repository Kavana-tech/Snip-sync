const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    rootSnippetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'snippetNode'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const folderSchema = new mongoose.Schema({
    folderName: {
        type: String,
        required: true
    },
    files: [fileSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'projects',
            required: true
        },
    createdBy: {
        type: String,
        required: true
    }
});

const folder = mongoose.model('folder', folderSchema)
module.exports = folder;
