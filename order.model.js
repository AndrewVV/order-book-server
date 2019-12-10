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
    hashedSecret: {
        type: String,
        required: true
    },
    addressToReceive: {
        type: String,
        required: true
    },
    addressSellerToReceive: {
        type: String,
        default: ""
    },
    publicKey: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        required: true
    },
    txHashEth: {
        type: String,
        default: ""
    }
        
})

mongoose.model("orders", OrderSchema)