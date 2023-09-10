const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchAdmin = require('../middleware/fetchAdmin');
const fetchUser = require('../middleware/fetchUser');
const OrderCheckOut = require("../models/Checkout");

//ROUTE 1 :-Get all checkout using GET "api/checkout/viewCheckout" Admin Login Required

router.get("/viewCheckout", fetchAdmin, async (req, res) => {
    try {
        const checkoutDetails = await checkouts.find({})
        res.json(checkoutDetails);

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");

    }
});
// User 


//TODO: checkout feature
//RND on how ecommerce website backend made
// and docker image 



//ROUTE 2: Add checkout using POST "api/checkout/addCheckout" User Login Required

router.post("/addCheckout", fetchUser,
    [
        body("productName", "Enter a valid product name").isLength({ min: 3 }),
        body("productQuantity", "Number must be greater than 0").custom((value) => value > 0),
        body("productShortDesc", "Enter a valid product name").isLength({ min: 15 }),
        body("productLongDesc", "Enter a valid product name").isLength({ min: 20 }),
    ],
    async (req, res) => {
        try {
            let success = false;
            const { categories, productBrand, productName, productMrp, productPrice, productQuantity, productImages, productShortDesc, productLongDesc, productBestSeller, metaTitle, metaDesc, metaKeyword, productStatus } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            let product = await Products.findOne({$or: [{productName: req.body.productName }, { productShortDesc: req.body.productShortDesc },{productLongDesc:req.body.productLongDesc}] });
            //Email Check and Mobile number check
            if (product) {
              return res.status(404).json({ success, error: "Product already exists" });
            }
            product = new Products({
                categories, productBrand, productName, productMrp, productPrice, productQuantity, productImages, productShortDesc, productLongDesc, productBestSeller, metaTitle, metaDesc, metaKeyword, productStatus
            })
            const saveProduct = await product.save();
            res.json(saveProduct);

        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error occurred");

        }
    }
)

// ROUTE 3: Update product using POST "api/product/updateProduct" Admin Login Required
router.put("/updateProduct/:productId",fetchAdmin,async(req,res)=>{
    try {

        const productId = req.params.productId;

        const { categories, productBrand, productName, productMrp, productPrice, productQuantity, productImages, productShortDesc, productLongDesc, productBestSeller, metaTitle, metaDesc, metaKeyword, productStatus } = req.body;

        const existingProduct = await Products.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        existingProduct.categories = categories;
        existingProduct.productBrand = productBrand;
        existingProduct.productName = productName;
        existingProduct.productMrp = productMrp;
        existingProduct.productPrice = productPrice;
        existingProduct.productQuantity = productQuantity;
        existingProduct.productImages = productImages;
        existingProduct.productShortDesc = productShortDesc;
        existingProduct.productLongDesc = productLongDesc;
        existingProduct.productBestSeller = productBestSeller;
        existingProduct.metaTitle = metaTitle;
        existingProduct.metaDesc = metaDesc;metaDesc
        existingProduct.metaKeyword = metaKeyword;
        existingProduct.productStatus = productStatus;
              
        // Save the updated product
        const updatedProduct = await existingProduct.save();
        res.json(updatedProduct);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");
        
    }

})

//ROUTE 4: Delete product using DELETE "api/product/deleteProduct" Admin Login Required

router.delete("/deleteProduct/:productId",fetchAdmin,async(req,res)=>{
    try {
        const productId = req.params.productId;
        let product = await Products.findById(productId);

        if(!product)
        {
            return res.status(404).send("Not Found")
        }

        product = await Products.findByIdAndDelete(productId);
        res.status(200).send({"sucess": "successfully delete the product", product: product })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");
    }
})

module.exports = router;