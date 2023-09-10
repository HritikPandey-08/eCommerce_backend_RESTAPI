const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchAdmin = require('../middleware/fetchAdmin');
const fetchUser = require('../middleware/fetchUser');
const Wishlist = require('../models/Wishlist');

//ROUTE 1 :-Get all Wishlist using GET "api/wishlist/viewUserWishlist" Admin Login Required

router.get("/viewUserWishlists", fetchAdmin, async (req, res) => {
    try {
        const wishlistDetails = await Wishlist.find({})
        res.json(wishlistDetails);

    } catch (error) {
        console.log(error.message);
        res.productId(500).send("Internal Server Error occurred");

    }
});

//For user 

//ROUTE 1 :-Get all Wishlist using GET "api/wishlist/viewWishlist" user Login Required

router.get("/viewWishlist", fetchUser, async (req, res) => {
    try {
        const wishlistDetails = await Wishlist.find({ user_id : req.user.id})
        res.json(wishlistDetails);

    } catch (error) {
        console.log(error.message);
        res.productId(500).send("Internal Server Error occurred");

    }
});
//ROUTE 2: Add wishlist using POST "api/wishlist/addWishlist" user Login Required

router.post("/addWishlist", fetchUser,
    [
        body("productId", "productId is invalid ").isLength({"min":3})
    ],
    async (req, res) => {
        try {
            const { productId } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const wishlist = new Wishlist({
                user_id : req.user.id, productId
            })
            const saveWishlist = await wishlist.save();
            res.json(saveWishlist);

        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error occurred");

        }
    }
)

//ROUTE 3: Delete wishlist using DELETE "api/wishlist/deleteWishlist" user Login Required

router.delete("/deleteWishlist/:wishlistId",fetchUser,async(req,res)=>{
    try {

        const wishlistId = req.params.wishlistId;
        let wishlist = await Wishlist.findById(wishlistId);

         // Checking for user
        if (wishlist.user_id.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        // checking for specific note id
        if(!wishlist)
        {
            return res.status(404).send("Not Found")
        }

        wishlist = await Wishlist.findByIdAndDelete(wishlistId);
        res.status(200).send({"sucess": "successfully delete the wishlist", wishlist: wishlist })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");
    }
})

module.exports = router;