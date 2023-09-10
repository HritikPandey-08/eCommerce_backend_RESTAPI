const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchAdmin = require('../middleware/fetchAdmin');
const fetchUser = require('../middleware/fetchUser');
const OrderDetail = require('../models/OrderDetails');

//ROUTE 1 :-Get all order using GET "api/order/viewUserOrder" Admin Login Required

router.get("/viewUserOrder", fetchAdmin, async (req, res) => {
    try {
        const orderDetails = await orders.find({})
        res.json(orderDetails);

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error occurred");

    }
});

//ROUTE 2: Add order using POST "api/order/addOrder" User Login Required

router.post("/addOrder", fetchUser,
    [
        body("productId", "Enter a valid product ID").isLength({ min: 3 }),
        body("productPrice", "Enter a valid product price").isLength({ min: 2 })
    ],
    async (req, res) => {
        try {
            const { productId, productPrice } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            order = new OrderDetail({
                productId, productPrice, user_id : req.user.id
            })
            const saveOrder = await order.save();
            res.json(saveOrder);

        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error occurred");

        }
    }
)

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