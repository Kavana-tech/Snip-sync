const mongoose = require('mongoose');
const inviteSchema = new mongoose.Schema({
    token:{
        type: String,
        required: true,
        unique: true
    },
    
    createdBy:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});

const invite = mongoose.model('invite', inviteSchema);

module.exports = invite;