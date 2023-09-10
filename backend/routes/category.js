const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchAdmin = require('../middleware/fetchAdmin');
const Categories = require('../models/Categories');

//ROUTE 1 :-Get all categories using GET "api/category/viewCategories" Admin Login Required

router.get("/viewCategories", fetchAdmin, async (req, res) => {
    try {
        const CategoryDetails = await Categories.find({})
        res.json(CategoryDetails);

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");

    }
});

//ROUTE 2: Add category using POST "api/category/addCategory" Admin Login Required

router.post("/addCategory", fetchAdmin,
    [
        body("categories", "Enter a valid category name").isLength({ min: 3 }),
        body("status", "Enter active or deactive").isLength({min:5})
    ],
    async (req, res) => {
        try {
            const { categories, status } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const category = new Categories({
                categories, status
            })
            const savecategory = await category.save();
            res.json(savecategory);

        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error occurred");

        }
    }
)

// ROUTE 3: Update Category using POST "api/category/updateCategory" Admin Login Required
router.put("/updateCategory/:categoryId",fetchAdmin,async(req,res)=>{
    try {

        const categoryId = req.params.categoryId;

        const { categories, status } = req.body;

        const existingCategory = await Categories.findById(categoryId);

        if (!existingCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        existingCategory.categories = categories;
        existingCategory.status = status;
                      
        // Save the updated category
        const updatedCategory = await existingCategory.save();
        res.json(updatedCategory);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");
        
    }

})

//ROUTE 4: Delete Category using DELETE "api/category/deleteCategory" Admin Login Required

router.delete("/deleteCategory/:categoryId",fetchAdmin,async(req,res)=>{
    try {
        const categoryId = req.params.categoryId;
        let category = await Categories.findById(categoryId);

        if(!category)
        {
            return res.status(404).send("Not Found")
        }

        category = await Categories.findByIdAndDelete(categoryId);
        res.status(200).send({"sucess": "successfully delete the category", category: category })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");
    }
})

module.exports = router;