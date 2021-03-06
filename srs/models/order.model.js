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
    priceForOne: {
        type: Number,
        required: true
    },
    hashedSecret: {
        type: String,
        default: ""
    },
    scriptAddress: {
        type: String,
        default: ""
    },
    buyersAddressForSending: {
        type: String,
        required: true
    },
    addressBuyerToReceive: {
        type: String,
        required: true
    },
    sellersAddressForSending: {
        type: String,
        default: ""
    },
    addressSellerToReceive: {
        type: String,
        default: ""
    },
    publicKeyBuyer: {
        type: String,
        default: ""
    },
    publicKeySeller: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        required: true
    },
    statusInternal: {
        type: String,
        default: ""
    },
    txHashEth: {
        type: String,
        default: ""
    },
    txHashBtc: {
        type: String,
        default: ""
    },
    refundTime: {
        type: Number,
        default: 0
    },
    internalSecret: {
        type: String,
        default: ""
    }
})

mongoose.model("orders", OrderSchema)