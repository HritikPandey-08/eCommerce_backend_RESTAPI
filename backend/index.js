const express = require('express');
const connectToMongoDb = require("./db")
const app = express();
require('dotenv').config();
// var cors = require('cors') //CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

connectToMongoDb();

const port = 5000;


// Adding middleware to send json file
app.use(express.json())
// app.use(cors())


app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.use('/api/auth',require('./routes/auth'))
app.use('/api/product',require('./routes/product'))
app.use('/api/category',require('./routes/category'))
app.use('/api/brand',require('./routes/brand'))
app.use('/api/wishlist',require('./routes/wishlist'))
app.use('/api/address',require('./routes/address'))
app.use('/api/contactme',require('./routes/contactme'))
app.use('/api/cart',require('./routes/cart'))
app.use('/api/checkout',require('./routes/checkout'))
app.use('/api/order',require('./routes/order'))

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
  })