const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchAdmin = require('../middleware/fetchAdmin');
const Products = require("../models/Products");

// This file defines the routes for the product management API.
//ROUTE 1 :-Get all product using GET "api/product/viewProduct" Admin Login Required

// Get all products records.
router.get("/viewProduct", fetchAdmin, async (req, res) => {
    try {
        // Get all products records.
        const productDetails = await Products.find({})
        // Send the response.
        res.json(productDetails);

    } catch (error) {
        console.log(error.message);
        // Handle the error.
        res.status(500).send("Internal Server Error occurred");

    }
});

//ROUTE 2: Add product using POST "api/product/addProduct" Admin Login Required
// Add Product into DB.
router.post("/addProduct", fetchAdmin,
    [
        // Validate the input data.
        body("product_name", "Enter a valid product name").isLength({ min: 3 }),
        body("product_quantity", "Number must be greater than 0").custom((value) => value > 0),
        body("categories", "Enter a valid categories name").isLength({ min: 3 }),
        body("product_description", "Enter a valid product name").isLength({ min: 20 }),
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
            const { categories, product_brand, product_name, product_mrp, product_price, product_quantity, product_images, product_description, specification_id, feature_id, product_bestseller, meta_title, meta_description, meta_keyword, product_status } = req.body;

            //Check if product already exists or not.
            let product = await Products.findOne({ $or: [{ product_name: product_name }, { product_description: product_description }] });
            //If exists send error message.
            if (product) {
                return res.status(404).json({ success, error: "Product already exists" });
            }

            // Create a new product record.
            product = new Products({
                categories, product_brand, product_name, product_mrp, product_price, product_quantity, product_images, product_description, specification_id, feature_id, product_bestseller, meta_title, meta_description, meta_keyword, product_status
            })

            // Save the new product record.
            const saveProduct = await product.save();
            // Send the response.
            res.json(saveProduct);

        } catch (error) {
            // Handle the error.
            console.log(error.message);
            res.status(500).send("Internal Server Error occurred");

        }
    }
)

// ROUTE 3: Update product using POST "api/product/updateProduct" Admin Login Required

// Updating the product for the current user.
router.put("/updateProduct/:product_id", fetchAdmin,
    [
        // Validate the input data.
        body("product_name", "Enter a valid product name").isLength({ min: 3 }),
        body("product_quantity", "Number must be greater than 0").custom((value) => value > 0),
        body("", "Enter a valid product name").isLength({ min: 15 }),
        body("product_description", "Enter a valid product name").isLength({ min: 20 }),
    ],
    async (req, res) => {
        try {
            // Getting proudct_id from url.
            const product_id = req.params.product_id;

            // Get the input data.
            const { categories, product_brand, product_name, product_mrp, product_price, product_quantity, product_images, product_description, specification_id, feature_id, product_bestseller, meta_title, meta_description, meta_keyword, product_status } = req.body;

            //Getting product detail
            const existingProduct = await Products.findById(product_id);

            //Check if product for particular id exists or not
            if (!existingProduct) {
                return res.status(404).json({ message: "Product not found" });
            }

            //updating the data 
            existingProduct.categories = categories;
            existingProduct.product_brand = product_brand;
            existingProduct.product_name = product_name;
            existingProduct.product_mrp = product_mrp;
            existingProduct.product_price = product_price;
            existingProduct.product_quantity = product_quantity;
            existingProduct.product_images = product_images;
            existingProduct.product_description = product_description;
            existingProduct.specification_id = specification_id;
            existingProduct.feature_id = feature_id;
            existingProduct.product_bestseller = product_bestseller;
            existingProduct.meta_title = meta_title;
            existingProduct.meta_description = meta_description;
            existingProduct.meta_keyword = meta_keyword;
            existingProduct.product_status = product_status;

            // Save the updated product
            const updatedProduct = await existingProduct.save();
            res.json(updatedProduct);
        } catch (error) {
            //Handle the error..
            console.log(error.message);
            res.status(500).send("Internal Server Error occurred");
        }

    })

//ROUTE 4: Delete product using DELETE "api/product/deleteProduct" Admin Login Required
// Delete the product.


router.delete("/deleteProduct/:product_id", fetchAdmin, async (req, res) => {
    try {
        // Getting proudct_id from url.
        const product_id = req.params.product_id;

        //Getting product detail
        let product = await Products.findById(product_id);

         //Check if product for particular id exists or not
        if (!product) {
            return res.status(404).send("Not Found")
        }

        //Deleting the product
        product = await Products.findByIdAndDelete(product_id);

        //Send the response
        res.status(200).send({ "sucess": "successfully delete the product", product: product })
    } catch (error) {
        //Handle the error.
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");
    }
})

module.exports = router;