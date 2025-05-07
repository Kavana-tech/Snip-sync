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
    createdBy: {
        type: String,
        required : true
    },
    inviteToken: {
        type:String
    },
    teamMember:{
        type: String
    }
})

const project = mongoose.model("projects", projectSchema);
module.exports = project;