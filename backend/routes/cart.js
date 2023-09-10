const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchUser = require('../middleware/fetchUser');
const fetchAdmin = require('../middleware/fetchAdmin');
const Carts = require('../models/Carts');

// This file defines the routes for the cart management API.

//ROUTE 1: Get all cartsDetails using GET "api/brand/viewCartDetails" Admin Login Required

router.get('/viewCartDetail', fetchAdmin, async (req, res) => {
    try {

        //Getting cartitem of all users
        const cartDetails = await Carts.find({})
        //Sending Response
        res.json(cartDetails);

    } catch (error) {
        //Error 
        console.log(error.message);
        //Sending Response
        res.status(500).send("Internal Server Error occurred");

    }
});
//User Login

//ROUTE 1: Get cartsDetails of user using GET "api/cart/viewCartItem" User Login Required
router.get("/viewCartItem", fetchUser, async (req, res) => {
    try {
        //Getting cart item of login user
        const cartDetails = await Carts.find({ user_id: req.user.id })
        //Sending Response
        res.json(cartDetails);

    } catch (error) {

        //Error 
        console.log(error.message);
        //Sending Response
        res.status(500).send("Internal Server Error occurred");

    }
});

//Add product in cart
//ROUTE 2: Add cart using POST "api/cart/addCartItem" User Login Required

router.post("/addCartItem", fetchUser,
    [
        body("product_id", "Enter a valid product Id").isLength({ min: 1 })
    ],
    async (req, res) => {
        try {
            //Getting data.
            const { product_id } = req.body;
            const user_id =  req.user.id;

            //Validation check
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
           

            //Checking if product already exists in the cart of not 
            const existsProduct = await Carts.find({$and : [{product_id : product_id}, {user_id : user_id}] });
            console.log(existsProduct)
            if(existsProduct.length > 0)
            {
                return res.status(400).json({ error: "Item is already in cart" });
            }

             //Add new item to cart(product id and user id)
            const cart = new Carts({
                user_id: user_id, product_id
            })

            //saving into DB table
            const saveCart = await cart.save();
            //Sending Response
            res.json(saveCart);

        } catch (error) {
            //Error 
            console.log(error.message);
            //Sending Response
            res.status(500).send("Internal Server Error occurred");

        }
    }
)

//Delete product from cart
//ROUTE 3: Delete cart using DELETE "api/cart/deleteCartItem" User Login Required

router.delete("/deleteCartItem/:cart_id", fetchUser, async (req, res) => {
    try {
        //Getting Cart Id from URL
        const cart_id = req.params.cart_id;
        let cart = await Carts.findById(cart_id);

        // Checking for user
        if (cart.user_id.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        //Checking if cart item exists or not
        if (!cart) {
            return res.status(404).send("Not Found")
        }

        //Deleting item from cart
        cart = await Carts.findByIdAndDelete(cart_id);
        //Sending Response
        res.status(200).send({ "sucess": "successfully delete the cart", cart: cart })
    } catch (error) {
        //Error 
        console.log(error.message);
        //Sending Response
        res.status(500).send("Internal Server Error occurred");
    }
})

module.exports = router;
