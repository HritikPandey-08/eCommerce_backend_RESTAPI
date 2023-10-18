const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchAdmin = require('../middleware/fetchAdmin');
const Features = require("../models/Features");
const Products = require("../models/Products");

// This file defines the routes for the feature management API.
//ROUTE 1 :-Get all feature using GET "api/feature/viewFeature" Admin Login Required

// Get all Features records.
router.get("/viewFeature", fetchAdmin, async (req, res) => {
    try {
        // Get all Features records.
        const featureDetails = await Features.find({})
        // Send the response.
        res.json(featureDetails);

    } catch (error) {
        console.log(error.message);
        // Handle the error.
        res.status(500).send("Internal Server Error occurred");

    }
});

//ROUTE 2: Add feature using POST "api/feature/addFeature" Admin Login Required
// Add feature into DB.
router.post("/addFeature", fetchAdmin,
    [
        // Validate the input data.
        body("laptop_id", "Enter a valid Laptop Id").isLength({ min: 3 }),
        body("backlit_keyboard", "Enter a valid backlit keyboard").isLength({ min: 2 }),
        body("hd_webcam", "Enter a valid feature name").isLength({ min: 3 }),
        body("wifi_6", "Enter a valid Wifi 6 detail").isLength({ min: 3 }),
        body("bluetooth", "Enter a valid bluetooth detail").isLength({ min: 2 }),
        body("thunderbolt_port", "Enter a valid thunderbolt_port detail").isLength({ min: 2 }),
        body("hdmi_port", "Enter a valid hdmi port detail").isLength({ min: 2 }),
        body("usb_a_port", "Enter a valid usb_a_port detail").isLength({ min: 2 }),
        body("usb_c_port", "Enter a valid usb_c_port detail").isLength({ min: 2 })
    ],
    async (req, res) => {
        try {
            // if there are errors, return bad request and error
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            let success = false;
            // Get the input data.
            const { laptop_id, backlit_keyboard, hd_webcam, wifi_6, bluetooth, thunderbolt_port, hdmi_port, usb_a_port, usb_c_port } = req.body;

            // Check if laptop_id exists in products table or not.
            const product = await Products.findOne({ _id: laptop_id });
            if (!product) {
                return res.status(404).json({ success, error: "Laptop id does not exist" });
            }

            //Check if feature already exists or not.
            let feature = await Features.findOne({ laptop_id: laptop_id });
            //If exists send error message.
            if (feature) {
                return res.status(404).json({ success, error: "feature already exists for particular laptop" });
            }

            // Create a new feature record.
            feature = new Features({
                laptop_id, backlit_keyboard, hd_webcam, wifi_6, bluetooth, thunderbolt_port, hdmi_port, usb_a_port, usb_c_port
            })

            // Save the new feature record.
            const savedFeature = await feature.save();
            if (savedFeature) {
                // Update the product record with the new feature_id.
                const updatedProduct = await Products.findOneAndUpdate(
                    { _id: laptop_id },
                    { feature_id: savedFeature._id },
                    { new: true } // Return the updated laptop record
                );
                // Send the response with the updated laptop record.
                return res.json(updatedProduct);
            }
            else {
                // Handle the case when the feature update fails.
                return res.status(500).json({ success: false, error: "Failed to update feature" });
            }

        } catch (error) {
            // Handle the error.
            console.log(error.message);
            res.status(500).send("Internal Server Error occurred");

        }
    }
)

// ROUTE 3: Update feature using POST "api/feature/updateFeature" Admin Login Required

// Updating the feature for the current user.
router.put("/updateFeature/:feature_id", fetchAdmin,
    [
        // Validate the input data.
        body("laptop_id", "Enter a valid Laptop Id").isLength({ min: 3 }),
        body("backlit_keyboard", "Enter a valid backlit keyboard").isLength({ min: 2 }),
        body("hd_webcam", "Enter a valid feature name").isLength({ min: 3 }),
        body("wifi_6", "Enter a valid Wifi 6 detail").isLength({ min: 3 })
    ],
    async (req, res) => {
        try {
            // Getting proudct_id from url.
            const feature_id = req.params.feature_id;

            // Get the input data.
            const { laptop_id, backlit_keyboard, hd_webcam, wifi_6, bluetooth, thunderbolt_port, hdmi_port, usb_a_port, usb_c_port } = req.body;

            // Check if laptop_id exists in products table or not.
            const product = await Products.findOne({ _id: laptop_id });
            if (!product) {
                return res.status(404).json({ success: false, error: "Laptop id does not exist" });
            }

            //Getting feature detail
            const existingFeature = await Features.findById(feature_id);

            //Check if feature for particular id exists or not
            if (!existingFeature) {
                return res.status(404).json({ message: "feature not found" });
            }

            //updating the data 
            existingFeature.laptop_id = laptop_id;
            existingFeature.backlit_keyboard = backlit_keyboard;
            existingFeature.hd_webcam = hd_webcam;
            existingFeature.wifi_6 = wifi_6;
            existingFeature.bluetooth = bluetooth;
            existingFeature.thunderbolt_port = thunderbolt_port;
            existingFeature.hdmi_port = hdmi_port;
            existingFeature.usb_a_port = usb_a_port;
            existingFeature.usb_c_port = usb_c_port;

            // Save the updated feature
            const updateFeature = await existingFeature.save();
            if (updateFeature) {
                // Update the product record with the new feature_id.
                const updatedProduct = await Products.findOneAndUpdate(
                    { _id: laptop_id },
                    { feature_id: updateFeature._id },
                    { new: true } // Return the updated laptop record
                );
                // Send the response with the updated laptop record.
                return res.json(updatedProduct);
            }
            else {
                // Handle the case when the feature update fails.
                return res.status(500).json({ success: false, error: "Failed to update feature" });
            }
        } catch (error) {
            //Handle the error..
            console.log(error.message);
            res.status(500).send("Internal Server Error occurred");
        }

    })

//ROUTE 4: Delete feature using DELETE "api/feature/deletefeature" Admin Login Required
// Delete the feature.

router.delete("/deleteFeature/:feature_id", fetchAdmin, async (req, res) => {
    try {
        // Getting proudct_id from url.
        const feature_id = req.params.feature_id;

        //Getting feature detail
        let feature = await Features.findById(feature_id);

        //Check if feature for particular id exists or not
        if (!feature) {
            return res.status(404).send("Not Found")
        }

        //Deleting the feature
        feature = await Features.findByIdAndDelete(feature_id);
        if(feature)
        {
             // Update the product record with the new feature_id.
             const updatedProduct = await Products.findOneAndUpdate(
                { _id: feature.laptop_id },
                { feature_id: "" },
                { new: true } // Return the updated laptop record
            );
            // Send the response with the updated laptop record.
            return res.json(updatedProduct);
        }
        else 
        {
            // Handle the case when the feature update fails.
                res.status(500).json({ success: false, error: "Failed to update feature" });
        }

        //Send the response
        res.status(200).send({ "sucess": "successfully delete the feature", feature: feature })

    
    } catch (error) {
        //Handle the error.
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");
    }
})

module.exports = router;