const mongoose = require('mongoose');

// Step 1: Create Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

// Step 2: Create Model
const userModel = mongoose.model('User', userSchema);

// Step 3: Export Model
module.exports = userModel;