const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchAdmin = require('../middleware/fetchAdmin');
const fetchUser = require('../middleware/fetchUser');
const ContactMe = require('../models/ContactMe');

//ROUTE 1 :-Get all UserContactMe Form using GET "api/contactme/viewUserContactMe" Admin Login Required

router.get("/viewUserContactMe", fetchAdmin, async (req, res) => {
    try {
        const userContactMe = await ContactMe.find({})
        res.json(userContactMe);

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");

    }
});

//For User
//ROUTE 1: Add ContactMe using POST "api/contactme/addContactMe" login Not Required

router.post("/addContactMe",
    [
        body("name","Enter a valid name").isLength({min:3}),
        body("email","Enter a valid email").isEmail(),
        body("mobileNumber", "Enter a valid Mobile Number").isLength({ min: 10 }),
        body("message", "Enter a valid Message ").isLength({min:10})
    ],
    async (req, res) => {
        try {
            const { name, email, mobileNumber, message } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const userContactMe = new ContactMe({
                name, email, mobileNumber, message
              
            })
            const saveContactMe = await userContactMe.save();
            res.json(saveContactMe);

        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error occurred");

        }
    }
)

module.exports = router;