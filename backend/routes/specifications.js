const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchAdmin = require('../middleware/fetchAdmin');
const Specifications = require("../models/Specification");
const Products = require("../models/Products");

// This file defines the routes for the specification management API.

//ROUTE 1 :-Get all specification using GET "api/specification/viewSpecifications" Admin Login Required

// Get all Specifications records.
router.get("/viewSpecifications", fetchAdmin, async (req, res) => {
    try {
        // Get all Specifications records.
        const specificationDetails = await Specifications.find({})
        // Send the response.
        res.json(specificationDetails);

    } catch (error) {
        console.log(error.message);
        // Handle the error.
        res.status(500).send("Internal Server Error occurred");

    }
});

//ROUTE 2: Add specification using POST "api/specification/addspecification" Admin Login Required
// Add specification into DB.
router.post("/addSpecification", fetchAdmin,
    [
        // Validate the input data.
        body("laptop_id", "Enter a valid Laptop Id").isLength({ min: 12 }),
        body("processor", "Enter a valid processor detail").isLength({ min: 2 }),
        body("ram", "Enter a valid specification name").isLength({ min: 3 }),
        body("storage", "Enter a valid storage detail").isLength({ min: 3 }),
        body("display", "Enter a valid display detail").isLength({ min: 2 }),
        body("operating_system", "Enter a valid operating_system detail").isLength({ min: 2 }),
        body("battery_life", "Enter a valid battery_life detail").isLength({ min: 2 })
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
            const { laptop_id, processor, ram, storage, display, operating_system, battery_life } = req.body;

            // Check if laptop_id exists in products table or not.
            const product = await Products.findOne({ _id: laptop_id });
            if (!product) {
                return res.status(404).json({ success, error: "Laptop id does not exist" });
            }

            //Check if specification already exists or not.
            let specification = await Specifications.findOne({ laptop_id: laptop_id });
            //If exists send error message.
            if (specification) {
                return res.status(404).json({ success, error: "specification already exists for particular laptop" });
            }

            // Create a new specification record.
            specification = new Specifications({
                laptop_id, processor, ram, storage, display, operating_system, battery_life
            })

            // Save the new specification record.
            const savedSpecification = await specification.save();
            if (savedSpecification) {
                // Update the product record with the new specification_id.
                const updatedProduct = await Products.findOneAndUpdate(
                    { _id: laptop_id },
                    { specification_id: savedSpecification._id },
                    { new: true } // Return the updated laptop record
                );
                // Send the response with the updated laptop record.
                return res.json(updatedProduct);
            }
            else {
                // Handle the case when the specification update fails.
                return res.status(500).json({ success: false, error: "Failed to update specification" });
            }





        } catch (error) {
            // Handle the error.
            console.log(error.message);
            res.status(500).send("Internal Server Error occurred");

        }
    }
)

// ROUTE 3: Update specification using POST "api/specification/updateSpecification" Admin Login Required

// Updating the specification for the current user.
router.put("/updateSpecification/:specification_id", fetchAdmin,
    [
        // Validate the input data.
        body("laptop_id", "Enter a valid Laptop Id").isLength({ min: 3 }),
        body("processor", "Enter a valid processor detail").isLength({ min: 2 }),
        body("ram", "Enter a valid specification name").isLength({ min: 3 }),
        body("storage", "Enter a valid storage detail").isLength({ min: 3 })
    ],
    async (req, res) => {
        try {
            // Getting proudct_id from url.
            const specification_id = req.params.specification_id;

            // Get the input data.
            const { laptop_id, processor, ram, storage, display, operating_system, battery_life } = req.body;

            // Check if laptop_id exists in products table or not.
            const product = await Products.findOne({ _id: laptop_id });
            if (!product) {
                return res.status(404).json({ success: false, error: "Laptop id does not exist" });
            }

            //Getting specification detail
            const existingSpecification = await Specifications.findById(specification_id);

            //Check if specification for particular id exists or not
            if (!existingSpecification) {
                return res.status(404).json({ message: "specification not found" });
            }

            //updating the data 
            existingSpecification.laptop_id = laptop_id;
            existingSpecification.processor = processor;
            existingSpecification.ram = ram;
            existingSpecification.storage = storage;
            existingSpecification.display = display;
            existingSpecification.operating_system = operating_system;
            existingSpecification.battery_life = battery_life;

            // Save the updated specification
            const updateSpecification = await existingSpecification.save();
            if (updateSpecification) {
                // Update the product record with the new specification_id.
                const updatedProduct = await Products.findOneAndUpdate(
                    { _id: laptop_id },
                    { specification_id: updateSpecification._id },
                    { new: true } // Return the updated laptop record
                );

                // Send the response with the updated laptop record.
                res.send(updatedProduct);
            }
            else {
                // Handle the case when the specification update fails.
                return res.status(500).json({ success: false, error: "Failed to update specification" });
            }

        } catch (error) {
            //Handle the error.
            console.log(error.message);
            res.status(500).send("Internal Server Error occurred");
        }

    })

//ROUTE 4: Delete specification using DELETE "api/specification/deleteSpecification" Admin Login Required
// Delete the specification.

router.delete("/deleteSpecification/:specification_id", fetchAdmin, async (req, res) => {
    try {
        // Getting proudct_id from url.
        const specification_id = req.params.specification_id;

        //Getting specification detail
        let specification = await Specifications.findById(specification_id);

        //Check if specification for particular id exists or not
        if (!specification) {
            return res.status(404).send("Not Found")
        }

        //Deleting the specification
        specification = await Specifications.findByIdAndDelete(specification_id);
        if(specification)
        {
             // Update the product record with the new specification_id.
             const updatedProduct = await Products.findOneAndUpdate(
                { _id: specification.laptop_id },
                { specification_id: "" },
                { new: true } // Return the updated laptop record
            );
            // Send the response with the updated laptop record.
            return res.json(updatedProduct);
        }
        else 
        {
            // Handle the case when the specification update fails.
                res.status(500).json({ success: false, error: "Failed to update specification" });
        }
        //Send the response
        res.status(200).send({ "sucess": "successfully delete the specification", specification: specification })
    } catch (error) {
        //Handle the error.
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");
    }
})

module.exports = router;