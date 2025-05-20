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
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'projects',
        // required: true
    },
    // createdBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'user',
    //     required: true
    // },
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