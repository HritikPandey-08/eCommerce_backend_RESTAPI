const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchAdmin = require('../middleware/fetchAdmin');
const UserAddress = require('../models/UserAddress');
const fetchUser = require('../middleware/fetchUser');

// This file defines the routes for the address management API.

// ROUTE 1 :-Get all UserAddress using GET "api/address/viewUserAddress" Admin Login Required

// Get all UserAddress records.
router.get("/viewUserAddress", fetchAdmin, async (req, res) => {
    try {
        // Get all UserAddress records.
        const userAddress = await UserAddress.find({});
        // Send the response.
        res.json(userAddress);
    } catch (error) {
        // Handle the error.
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");
    }
});

// For User

// ROUTE 1 :-Get Address using GET "api/address/viewAddress" User Login Required

// Get the address for the current user.
router.get("/viewAddress", fetchUser, async (req, res) => {
    try {
        // Get the address for the current user.
        const addressDetails = await UserAddress.find({ user_id: req.user.id });
        // Send the response.
        res.json(addressDetails);
    } catch (error) {
        // Handle the error.
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");
    }
});

// ROUTE 2: Add Address using POST "api/address/addAddress" User Login Required

// Add a new address for the current user.
router.post("/addAddress", fetchUser,
    [
        // Validate the input data.
        body("locality", "Enter a valid Locality").isLength({ min: 3 }),
        body("address", "Enter a valid address").isLength({ min: 5 }),
        body("alternate_mobile_number", "Enter a valid Mobile Number").isLength({ min: 10 }),
        body("landmark", "Enter a valid landmark ").isLength({ min: 5 })
    ],
    async (req, res) => {
        try {
            // Get the input data.
            const { pin_code, locality, address, city, state, landmark, alternate_mobile_number, address_type } = req.body;
            // Validate the input data.
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Return an error if the input data is invalid.
                return res.status(400).json({ errors: errors.array() });
            }
            // Create a new UserAddress record.
            const userAddress = new UserAddress({
                pin_code, locality, address, city, state, landmark, alternate_mobile_number, address_type, user_id: req.user.id
            });
            // Save the new UserAddress record.
            const saveAddress = await userAddress.save();
            // Send the response.
            res.json(saveAddress);
        } catch (error) {
            // Handle the error.
            console.log(error.message);
            res.status(500).send("Internal Server Error occurred");
        }
    }
)

// ROUTE 3: Update Address using PUT "api/address/updateAddress" User Login Required

// Updating the address for the current user.

router.put('/updateAddress/:address_id', fetchUser,
    [
        // Validate the input data.
        body("locality", "Enter a valid Locality").isLength({ min: 3 }),
        body("address", "Enter a valid address").isLength({ min: 5 }),
        body("alternate_mobile_number", "Enter a valid Mobile Number").isLength({ min: 10 }),
        body("landmark", "Enter a valid landmark ").isLength({ min: 5 })
    ],
    async (req, res) => {
        try {
            // Getting address_id of current user.
            const address_id = req.params.address_id;

            // Get the input data.
            const { pin_code, locality, address, city, state, landmark, alternate_mobile_number, address_type } = req.body;

            //Getting User id 
            const user_id = req.user.id;

            //Getting address detail
            const existingAddress = await UserAddress.findById(address_id);

            //Check if address for particular id exists or not
            if (!existingAddress) {
                return res.status(404).json({ message: "Address not found" });
            }

            //check if user is authenticate
            if (user_id !== existingAddress.user_id) {
                return res.status(401).json({ message: "Not allowed" });
            }

            //updating the data 
            existingAddress.pin_code = pin_code;
            existingAddress.locality = locality;
            existingAddress.address = address;
            existingAddress.city = city;
            existingAddress.state = state;
            existingAddress.landmark = landmark;
            existingAddress.alternate_mobile_number = alternate_mobile_number;
            existingAddress.address_type = address_type;

            // Save the updated address
            const updateAddress = await existingAddress.save();
            res.json(updateAddress);

        } catch (error) {
            //Handle error.
            console.log(error.message);
            res.status(500).send("Internal Server Error occurred");
        }
    });

// ROUTE 4: Delete Address using DELETE "api/address/deleteAddress" User Login Required

// Delete the address for the current user.

router.delete("/deleteAddress/:address_id", fetchUser, async (req, res) => {
    try {
        // Getting address_id of current user.
        const address_id = req.params.address_id;

        //Getting User id 
        const user_id = req.user.id;

        //Getting address detail
        const existingAddress = await UserAddress.findById(address_id);

        //Check if address for particular id exists or not
        if (!existingAddress) {
            return res.status(404).json({ message: "Address not found" });
        }

        //check if user is authenticate
        if (user_id !== existingAddress.user_id) {
            return res.status(401).json({ message: "Not allowed" });
        }

        //delete address
        const deleteAddress = await UserAddress.findByIdAndDelete(address_id);
        res.json({ message: "Address delete successfuly", address: deleteAddress })

    } catch (error) {
        //Handle error..
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");
    }
})


module.exports = router;