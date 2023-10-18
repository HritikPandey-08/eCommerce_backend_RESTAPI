const mongoose = require('mongoose');
const { schema } = mongoose;

const WishlistSchema = new mongoose.Schema({
    user_id: {
        type: String
    },
    product_id: {
        type: String
    },
    added_on: {
        type: Date,
        default: Date.now
    }
})

const Wishlist = mongoose.model("Wishlist", WishlistSchema);
module.exports = Wishlist;