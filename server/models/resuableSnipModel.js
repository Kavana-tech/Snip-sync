const mongoose = require('mongoose');

const reusableSnippetSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const resuableSnippet = mongoose.model('reusableSnippet', reusableSnippetSchema);
module.exports = resuableSnippet;