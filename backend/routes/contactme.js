const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchAdmin = require('../middleware/fetchAdmin');
const fetchUser = require('../middleware/fetchUser');
const ContactMe = require('../models/ContactMe');

// This file defines the routes for the contactme management API.

//For Admin

//ROUTE 1 :-Get all UserContactMe Form using GET "api/contactme/viewUserContactMe" Admin Login Required

router.get("/viewUserContactMe", fetchAdmin, async (req, res) => {
    try {
        //Get all the records.
        const userContactMe = await ContactMe.find({})
        //Send response.
        res.json(userContactMe);

    } catch (error) {
        //Handle the error.
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");

    }
});

//For User
//ROUTE 1: Add ContactMe using POST "api/contactme/addContactMe" login Not Required

router.post("/addContactMe",
    [
        // Validate the input data.
        body("name", "Enter a valid name").isLength({ min: 3 }),
        body("email", "Enter a valid email").isEmail(),
        body("mobile_number", "Enter a valid Mobile Number").isLength({ min: 10 }),
        body("message", "Enter a valid Message ").isLength({ min: 10 })
    ],
    async (req, res) => {
        try {
            // Validate the input data.
            // if there are errors, return bad request and error
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Return an error if the input data is invalid.
                return res.status(400).json({ errors: errors.array() });
            }
            // Get the input data.
            const { name, email, mobileNumber, message } = req.body;

            // Create a new contact record.
            const userContactMe = new ContactMe({
                name, email, mobileNumber, message

            })
            // Save the new contact record.
            const saveContactMe = await userContactMe.save();
            // Send the response.
            res.json(saveContactMe);

        } catch (error) {
            // Handle the error.
            console.log(error.message);
            res.status(500).send("Internal Server Error occurred");

        }
    }
)

module.exports = router;