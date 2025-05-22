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
        required : true
    },
    inviteToken: {
        type:String
    },
   teamMembers: [{
  email: { type: String },
  username: { type: String}
}]

})

const project = mongoose.model("projects", projectSchema);
module.exports = project;