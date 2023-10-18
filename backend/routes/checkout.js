const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchAdmin = require('../middleware/fetchAdmin');
const fetchUser = require('../middleware/fetchUser');
const OrderCheckOut = require("../models/Checkout");
const Products = require("../models/Products");

// This file defines the routes for the checkout management API.
//ROUTE 1 :-Get all checkout using GET "api/checkout/viewCheckout" Admin Login Required
//Getting all users checkout detail 

router.get("/viewCheckout", fetchAdmin, async (req, res) => {
    try {
        //Get all the records.
        const checkoutDetails = await OrderCheckOut.find({})
        //Send response.
        res.json(checkoutDetails);

    } catch (error) {
        //Handle the error.
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");

    }
});

// User 

//ROUTE 2: Add checkout using POST "api/checkout/addCheckout" User Login Required

//Add checkout detail of user
//Date function
const order_delivery_date = () => {
    const currentDate = new Date();
    const minDaysToAdd = 1; // Minimum number of days to add
    const maxDaysToAdd = 10; // Maximum number of days to add

    const numberOfDaysToAdd = Math.floor(Math.random() * (maxDaysToAdd - minDaysToAdd + 1)) + minDaysToAdd;
    currentDate.setDate(currentDate.getDate() + numberOfDaysToAdd);

    // Set the time to midnight (00:00:00)
    currentDate.setHours(0, 0, 0, 0);

    return currentDate;
}

const deliveryDate = order_delivery_date();

router.post("/addCheckout", fetchUser,
    [
        // Validate the input data.
        body("payment_type", "Enter a valid payment_type").isLength({ min: 3 }),
        body("total_price", "Number must be greater than 0").custom((value) => value > 0),
        body("payment_status", "Enter a valid product name").isLength({ min: 3 }),
        body("order_status", "Enter a valid product name").isLength({ min: 3 })
    ],
    async (req, res) => {
        try {
            let success = false;

            // Validate the input data.
            // if there are errors, return bad request and error
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            // Get the input data.
            const { payment_type, total_price, payment_status, order_status } = req.body;

            // Create a new check record.
            const userCheckOut = new OrderCheckOut({
                user_id: req.user.id, payment_type, total_price, payment_status, order_status, order_delivery_date: deliveryDate
            })

            // Save the new check record.
            const saveCheckOutData = await userCheckOut.save();
            // Send the response.
            res.json(saveCheckOutData);

        } catch (error) {
            console.log(error.message);
            // Handle the error.
            res.status(500).send("Internal Server Error occurred");

        }
    }
)

// ROUTE 3: Update checkout using POST "api/checkout/updateCheckoutDetail" Admin Login Required
router.put("/updateCheckoutDetail/:CheckOutDetailId", fetchAdmin, async (req, res) => {
    try {
        // Getting checkout from url.
        const CheckOutDetailId = req.params.CheckOutDetailId;

        // Get the input data.
        const { payment_status, order_status } = req.body;

        //Getting checkout detail
        const existingCheckoutDetail = await OrderCheckOut.findById(CheckOutDetailId);

        //Check if checkout for particular id exists or not
        if (!existingCheckoutDetail) {
            return res.status(404).json({ message: "CheckOut Detail not found" });
        }

        //updating the data
        existingCheckoutDetail.payment_status = payment_status;
        existingCheckoutDetail.order_status = order_status;

        // Save the updated checkout Detail
        const updateCheckOut = await existingCheckoutDetail.save();
        
        //Send the response
        res.json(updateCheckOut);
    } catch (error) {
        //Handle the error.
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");
    }

})

module.exports = router;