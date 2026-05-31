const mongoose = require('mongoose');
const config=require('./config')

async function connectDB() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Connection error:', err.message);
    process.exit(1); 
  }
}

module.exports=connectDB;