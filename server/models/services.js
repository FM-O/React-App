const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


// Define the User model schema
const ServicesSchema = new mongoose.Schema({
  api_key: {
    type: String,
    index: {unique: true}
  },
  api_name: String
});

module.exports = mongoose.model('Services', ServicesSchema);
