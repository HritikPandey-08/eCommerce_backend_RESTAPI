const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchAdmin = require('../middleware/fetchAdmin');
const Categories = require('../models/Categories');
// This file defines the routes for the categories management API.

//ROUTE 1 :-Get all categories using GET "api/category/viewCategories" Admin Login Required

// Get all categories records.
router.get("/viewCategories", fetchAdmin, async (req, res) => {
    try {
        // Get all categories records.
        const CategoryDetails = await Categories.find({})
        // Send the response.
        res.json(CategoryDetails);

    } catch (error) {
        // Handle the error.
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");

    }
});

//ROUTE 2: Add category using POST "api/category/addCategory" Admin Login Required
// Add categories into DB.
router.post("/addCategory", fetchAdmin,
    [
        // Validate the input data.
        body("categories", "Enter a valid category name").isLength({ min: 3 }),
        body("status", "Enter active or deactive").isLength({ min: 5 })
    ],
    async (req, res) => {
        try {
            // if there are errors, return bad request and error
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Get the input data.
            const { categories, status } = req.body;

            //Check if category already exists or not.
            let existsCategory = await Categories.findOne({ categories: categories });
            //If exists send error message.
            if (existsCategory) {
                return res.status(404).json({ success, error: "category already exists" });
            }

            // Create a new category record.
            const category = new Categories({
                categories, status
            })
            // Save the new category record.
            const savecategory = await category.save();
            // Send the response.
            res.json(savecategory);

        } catch (error) {
            // Handle the error.
            console.log(error.message);
            res.status(500).send("Internal Server Error occurred");

        }
    }
)

// ROUTE 3: Update Category using POST "api/category/updateCategory" Admin Login Required
// Updating the category.
router.put("/updateCategory/:category_id", fetchAdmin,
    [
        // Validate the input data.
        body("categories", "Enter a valid category name").isLength({ min: 3 }),
        body("status", "Enter active or deactive").isLength({ min: 5 })
    ],
    async (req, res) => {
        try {
            // Getting category from url.
            const category_id = req.params.category_id;

            // Get the input data.
            const { categories, status } = req.body;

            //Getting category detail
            const existingCategory = await Categories.findById(category_id);

            //Check if category for particular id exists or not
            if (!existingCategory) {
                return res.status(404).json({ message: "Category not found" });
            }
            //updating the data
            existingCategory.categories = categories;
            existingCategory.status = status;

            // Save the updated category
            const updatedCategory = await existingCategory.save();

            //Send the response
            res.json(updatedCategory);
        } catch (error) {
            //Handle the error.
            console.log(error.message);
            res.status(500).send("Internal Server Error occurred");

        }

    })

//ROUTE 4: Delete Category using DELETE "api/category/deleteCategory" Admin Login Required
// Delete the Category.
router.delete("/deleteCategory/:category_id", fetchAdmin, async (req, res) => {
    try {
        // Getting category id from url.
        const category_id = req.params.category_id;

        // Get the input data.
        let category = await Categories.findById(category_id);

        //Check if category for particular id exists or not
        if (!category) {
            return res.status(404).send("Not Found")
        }

        //Delete the category
        category = await Categories.findByIdAndDelete(category_id);

        //Send the response
        res.status(200).send({ "sucess": "successfully delete the category", category: category })
    } catch (error) {
        //Handle the error.
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");
    }
})

module.exports = router;