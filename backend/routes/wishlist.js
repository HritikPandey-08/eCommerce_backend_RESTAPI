const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchAdmin = require('../middleware/fetchAdmin');
const fetchUser = require('../middleware/fetchUser');
const Wishlist = require('../models/Wishlist');
// This file defines the routes for the wishlist management API.

//ROUTE 1 :-Get all Wishlist using GET "api/wishlist/viewUserWishlist" Admin Login Required

// Get all wishlist records.

router.get("/viewUserWishlists", fetchAdmin, async (req, res) => {
    try {
        // Get all wishlist records.
        const wishlistDetails = await Wishlist.find({})

        // Send the response.
        res.json(wishlistDetails);

    } catch (error) {
        // Handle the error.
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");

    }
});

//For user 

//ROUTE 1 :-Get all Wishlist using GET "api/wishlist/viewWishlist" user Login Required

// Get all wishlist records.
router.get("/viewWishlist", fetchUser, async (req, res) => {
    try {
        // Get all wishlist records.
        const wishlistDetails = await Wishlist.find({ user_id: req.user.id })

        // Send the response.
        res.json(wishlistDetails);

    } catch (error) {
        // Handle the error.
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");

    }
});
//ROUTE 2: Add wishlist using POST "api/wishlist/addWishlist" user Login Required

router.post("/addWishlist", fetchUser,
    [
        // Validate the input data.
        body("product_id", "product id is invalid ").isLength({ "min": 3 })
    ],
    async (req, res) => {
        try {
            // if there are errors, return bad request and error
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            // Get the input data.
            const { product_id } = req.body;

            //Check if Wishlist already exists or not.
            let existsWishlist = await Wishlist.findOne({ product_id: product_id });
            //If exists send error message.
            if (existsWishlist) {
                return res.status(404).json({ success, error: "Wishlist already exists" });
            }

            // Create a new wishlist record.

            const wishlist = new Wishlist({
                user_id: req.user.id, product_id
            })
            // Save the new wishlist record.
            const saveWishlist = await wishlist.save();
            // Send the response.
            res.json(saveWishlist);

        } catch (error) {
            // Handle the error.
            console.log(error.message);
            res.status(500).send("Internal Server Error occurred");

        }
    }
)

//ROUTE 3: Delete wishlist using DELETE "api/wishlist/deleteWishlist" user Login Required
// Removing item from wishlist.
router.delete("/deleteWishlist/:wishlist_id", fetchUser, async (req, res) => {
    try {

        // Getting wishlist id from url.
        const wishlist_id = req.params.wishlist_id;

        // Get the input data.
        let wishlist = await Wishlist.findById(wishlist_id);

        // Checking for user
        if (wishlist.user_id.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        //Check if wishlist for particular id exists or not
        if (!wishlist) {
            return res.status(404).send("Not Found")
        }

        //Delete the wishlist
        wishlist = await Wishlist.findByIdAndDelete(wishlist_id);
        //Send the response
        res.status(200).send({ "sucess": "successfully delete the wishlist", wishlist: wishlist })
    } catch (error) {
        //Handle the error.
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");
    }
})

module.exports = router;