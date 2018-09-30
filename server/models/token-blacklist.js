const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


// Define the User model schema
const TokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    index: {unique: true}
  }
});

module.exports = mongoose.model('TokenBlacklist', TokenBlacklistSchema);
