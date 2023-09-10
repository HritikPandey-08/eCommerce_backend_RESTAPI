const mongoose = require('mongoose');
const { Schema } = mongoose;


const CartSchema = new mongoose.Schema({
    user_id : {
        type : String
    },
    product_id : {
        type : String
    },
    added_on : {
        type  : Date,
        default : Date.now
    }
});

const Carts = mongoose.model('Carts', CartSchema);
module.exports = Carts;