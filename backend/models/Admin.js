const mongoose = require('mongoose');
const { Schema } = mongoose;

const AdminSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  mobile_number: {
    type: String,
    unique : true
  },
  password: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
