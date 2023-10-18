const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderDetailSchema = new mongoose.Schema({
    user_id : {
        type : String
    },
    product_id :{
        type : String
    },
    product_quantity :{
        type :Number,
        default : 1
    },
    product_price:{
        type : Number
    },
    added_on:{
        type : Date,
        default: Date.now
    }
})

const OrderDetail = mongoose.model('OrderDetail',OrderDetailSchema);
module.exports = OrderDetail;