const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContactMeSchema = new mongoose.Schema({
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
  message : {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const ContactMe = mongoose.model('ContactMe', ContactMeSchema);
module.exports = ContactMe;
