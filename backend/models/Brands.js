const mongoose = require('mongoose');
const { Schema } = mongoose;

const BrandsSchema = new mongoose.Schema({
  brand_name : {
    type: String
  },
  status: {
    type: String
  }
})
const Brands = mongoose.model('Brands', BrandsSchema);
module.exports = Brands;