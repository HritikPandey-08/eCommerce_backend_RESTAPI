const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchAdmin = require('../middleware/fetchAdmin');
const fetchUser = require('../middleware/fetchUser');
const OrderDetail = require('../models/OrderDetails');
// This file defines the routes for the order management API.

//ROUTE 1 :-Get all order using GET "api/order/viewUserOrder" Admin Login Required

// Get all order records.

router.get("/viewUserOrder", fetchAdmin, async (req, res) => {
    try {
        // Get all orders records.
        const orderDetails = await orders.find({})

        // Send the response.
        res.json(orderDetails);

    } catch (error) {
        // Handle the error.
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");

    }
});
//User
//ROUTE 2 :-Get all order using GET "api/order/viewOrderDetails" User Login Required

router.get("/viewOrderDetails", fetchUser, async (req, res) => {
    try {
        // Get all order records.
        const orderDetails = await orders.find({})

        // Send the response.
        res.json(orderDetails);

    } catch (error) {
        // Handle the error.
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");

    }
});
//ROUTE 3: Add order using POST "api/order/addOrder" User Login Required
router.post("/addOrder", fetchUser,
    [
        // Validate the input data.
        body("product_id", "Enter a valid product ID").isLength({ min: 3 }),
        body("product_qunantity", "Enter a valid Quantity").isLength({ min: 1 }),
        body("product_price", "Enter a valid product price").isLength({ min: 2 })
    ],
    async (req, res) => {
        try {
            // if there are errors, return bad request and error
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Get the input data.
            const { product_id, product_price } = req.body;

            //Check if Order already exists or not.
            let existsOrder = await OrderDetail.findOne({ product_id: product_id });
            //If exists send error message.
            if (existsOrder) {
                return res.status(404).json({ success, error: "Order already exists" });
            }

            // Create a new order record.
            order = new OrderDetail({
                product_id, product_price, user_id: req.user.id
            })

            // Save the new order record.
            const saveOrder = await order.save();
            // Send the response.
            res.json(saveOrder);

        } catch (error) {
            // Handle the error.
            console.log(error.message);
            res.status(500).send("Internal Server Error occurred");
        }
    }
)

//ROUTE 4: Delete Order using DELETE "api/order/deleteOrder" User Login Required

router.delete("/deleteOrder/:order_id", fetchUser, async (req, res) => {
    try {
        // Getting order from url.
        const order_id = req.params.order_id;

        // Get the input data.
        let Order = await OrderDetail.findById(order_id);

        //Check if categorderory for particular id exists or not
        if (!Order) {
            return res.status(404).send("Not Found")
        }

        //Delete the order
        Order = await OrderDetail.findByIdAndDelete(order_id);
       
        //Send the response
        res.status(200).send({ "sucess": "successfully delete the Order", product: product })
    } catch (error) {
        //Handle the error.
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");
    }
})

module.exports = router;