const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: String,
  members: [String]
});

const projectSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Project", projectSchema);