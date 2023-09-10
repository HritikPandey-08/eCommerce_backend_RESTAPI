const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderCheckOutSchema = new mongoose.Schema({
    user_id : {
        type : String
    },
    payment_type : {
        type : String
    },
    total_price : {
        type : Number
    },
    payment_status : {
        type : String
    },
    order_status : {
        type : String
    },
    order_delivery_date : {
        type : Date
    },
    added_on : {
        type: Date,
        default: Date.now
    }

});
const OrderCheckOut = mongoose.model('OrderCheckOut', OrderCheckOutSchema);
module.exports = OrderCheckOut;