const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategoriesSchema = new mongoose.Schema({
  categories: {
    type: String
  },
  status: {
    type: String
  }
})
const Categories = mongoose.model('Categories', CategoriesSchema);
module.exports = Categories;