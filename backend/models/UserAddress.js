const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserAddressSchema = new mongoose.Schema({
  user_id: {
    type: String
  },
  pin_code: {
    type: Number
  },
  locality: {
    type: String,
  },
  address: {
    type: String
  },
  alternate_mobile_number: {
    type: String,
  },
  city: {
    type: String,
  },
  state : {
    type:String
  },
  landmark : {
    type : String
  },
  address_type : {
    type: String
  },
  added_on: {
    type: Date,
    default: Date.now
  }
})

const UserAddress = mongoose.model('UserAddress', UserAddressSchema);
module.exports = UserAddress;
