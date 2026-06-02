const mongoose = require('mongoose');

// Step 1: Create Schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
    {
        timestamps: true
    }
);

// Step 2: Create Model
const postModel = mongoose.model('Post', postSchema);

// Step 3: Export Model
module.exports = postModel;