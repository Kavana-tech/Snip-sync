const mongoose = require('mongoose');
const folder = require('./folderModel');

const projectSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    workingAs: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        required: true
    },
    inviteToken: {
        type: String
    },
    creatorEmail: {
        type: String,
        required: true
    },
    pendingDeleteFolders: [{
        folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'folder' },
        folderName: { type: String },
        requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        requester: {type: String},
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
    }],
    pendingJoinRequests: [{
        email: { type: String, required: true },
        username: { type: String },
        requestedAt: { type: Date, default: Date.now }
    }],
    folders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'folder'
    }],
    teamMembers: [{
        email: { type: String },
        username: { type: String }
    }]
})

const project = mongoose.model("project", projectSchema);
module.exports = project;