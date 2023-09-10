const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderStatusSchema = new mongoose.Schema({
   status : {
    type : String
   }
})

const OrderStatus = mongoose.model('OrderStatus',OrderStatusSchema);
module.exports = OrderStatus;