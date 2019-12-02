const mongoose = require('mongoose');
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    buyTicker: {
        type: String,
        required: true
    },
    buyAmount: {
        type: Number,
        required: true
    },
    sellTicker: {
        type: String,
        required: true
    },
    sellAmount: {
        type: Number,
        required: true
    },
    secret: {
        type: String,
        required: true
    },
    addressToReceive: {
        type: String,
        required: true
    },
    publicKey: {
        type: String,
        default: ""
    }
        
})

mongoose.model("orders", OrderSchema)