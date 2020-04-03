const mongoose = require('mongoose');
const Schema = mongoose.Schema

const ConfirmSchema = new Schema({
    BTC: {
        type: Number,
        default: 1
    },
    ETH: {
        type: Number,
        default: 1
    }
})

mongoose.model("confirmations", ConfirmSchema)