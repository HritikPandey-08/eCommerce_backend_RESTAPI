const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  gender: {
    type: String
  },
  mobile_number: {
    type: String,
    unique : true
  },
  password: {
    type: String,
  },
  added_on: {
    type: Date,
    default: Date.now
  }
})

const User = mongoose.model('User', UserSchema);
module.exports = User;
