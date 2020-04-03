const mongoose = require('mongoose');
const Schema = mongoose.Schema

const RefundSchema = new Schema({
    BTC: {
        type: Number,
        default: 3600
    },
    ETH: {
        type: Number,
        default: 3600
    }
})

mongoose.model("refundTime", RefundSchema)