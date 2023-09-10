const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchAdmin = require('../middleware/fetchAdmin');
const Brands = require('../models/Brands');

// This file defines the routes for the brand management API.

// Admin

//ROUTE 1 :-Get all brands using GET "api/brand/viewBrands" Admin Login Required
router.get("/viewBrands", fetchAdmin, async (req, res) => {
    try {
        // Get all UserAddress records.
        const brandDetails = await Brands.find({})
        // Send the response.
        res.json(brandDetails);
    }
    catch (error) {
        // Handle the error.
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");
    }
});

//ROUTE 2: Add brand using POST "api/brand/addBrand" Admin Login Required
// Add a new brand.
router.post("/addBrand", fetchAdmin,
    [
        // Validate the input data.
        body("brand_name", "Enter a valid brand name").isLength({ min: 1 }),
        body("status", "Enter active or deactive").isLength({ min: 5 })
    ],
    async (req, res) => {
        try {
            // Get the input data.
            const { brand_name, status } = req.body;
            // Validate the input data.
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const brandDetails = await Brands.findOne({ brand_name: brand_name })
            if (brandDetails) {
                return res.status(404).json({ message: "Brand Name already exists" })
            }

            // Create a new brand record.
            const brand = new Brands({
                brand_name, status
            })
            // Save the new brand record.
            const savebrand = await brand.save();
            // Send the response.
            res.json(savebrand);

        } catch (error) {
            // Handle the error.
            console.log(error.message);
            res.status(500).send("Internal Server Error occurred");

        }
    }
)

// ROUTE 3: Update brand using POST "api/brand/updatebrand" Admin Login Required
//Update Brand
router.put("/updateBrand/:brand_id", fetchAdmin, async (req, res) => {
    try {
        // Get the brand id from URL.
        const brand_id = req.params.brand_id;

        // Get the input data.
        const { brand_name, status } = req.body;

        // Get the records of brand id .
        const existingBrand = await Brands.findById(brand_id);

        // check if brand exists or not.
        if (!existingBrand) {
            return res.status(404).json({ message: "brand not found" });
        }

        //Updating the brand name and status
        existingBrand.brand_name = brand_name;
        existingBrand.status = status;

        // Save the updated brand
        const updateBrand = await existingBrand.save();

        // Send the response.
        res.json(updateBrand);
    } catch (error) {
        // Handle the error.
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");

    }

})

//ROUTE 4: Delete brand using DELETE "api/brand/deleteBrand" Admin Login Required
//Delete Brand 
router.delete("/deleteBrand/:brand_id", fetchAdmin, async (req, res) => {
    try {
        // Get the brand id from URL.
        const brand_id = req.params.brand_id;

        //Get brand details 
        let brand = await Brands.findById(brand_id);

        //check if brand exists or not.
        if (!brand) {
            return res.status(404).send("Not Found")
        }

        //Delete the brand.
        brand = await Brands.findByIdAndDelete(brand_id);
        //send response
        res.status(200).send({ "sucess": "successfully delete the brand", brand: brand })
    } catch (error) {
        //Handle the error.
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");
    }
})

module.exports = router;