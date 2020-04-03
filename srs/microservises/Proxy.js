require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
let app = express();
app.use(bodyParser());
app.use(cors())
app.listen(process.env.ORDER_PROXY_PORT, () => console.log("Server is up on port " + process.env.ORDER_PROXY_PORT))

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/order-book', { useNewUrlParser: true, useUnifiedTopology: true })
	.then(()=> console.log("Connected successfully to MongoDB"))
	.catch(e => console.log(e))

// require('../models/order.model')
require('../models/confirm.model')
// require('../models/refund.model')

const Order = require('../endpointServers/Order')
const Confirmation = require('../endpointServers/Confirmations')
const RefundTime = require('../endpointServers/Refund')
let order = new Order(app, mongoose);
let confirmations = new Confirmation(app, mongoose)
let refundTime = new RefundTime(app, mongoose)