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
    },
    image: {
        url: {
            type: String,
            default: null
        },
        public_id: {
            type: String,
            default: null
        }
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likesCount: {
        type: Number,
        default: 0
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