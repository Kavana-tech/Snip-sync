const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: String,
  members: [String]
});

const projectSchema = new mongoose.Schema({
<<<<<<< HEAD
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
=======
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
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
  inviteToken: String,
  teamMembers: [{
    email: { type: String },
    username: { type: String }
  }],
  teams: [teamSchema] // <-- Add this line for Teams support
});
>>>>>>> origin/features/teams-section

module.exports = mongoose.model("Project", projectSchema);