const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new mongoose.Schema({
    categories: {
        type: String,
        required: true
    },
    product_brand: {
        type: String,
        required: true
    },
    product_name: {
        type: String,
        required: true
    },
    product_mrp: {
        type: Number,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_quantity:
    {
        type: Number,
        required: true
    },
    product_images:
    {
        type: String,
        required: true
    },
    product_description:
    {
        type: String,
        required: true
    },
    specification_id: {
        type: String,
        required: true
    },
    feature_id: {
        type: String,
        required: true
    },
    product_bestseller:
    {
        type: Boolean
    },
    meta_title:
    {
        type: String
    },
    meta_description:
    {
        type: String
    },
    meta_keyword:
    {
        type: String
    },
    product_status:
    {
        type: String
    },
    product_registration:
    {
        type: Date,
        default: Date.now
    },

})
const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;