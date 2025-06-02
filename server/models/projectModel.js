const mongoose = require('mongoose');
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
        requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
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

const project = mongoose.model("projects", projectSchema);
module.exports = project;