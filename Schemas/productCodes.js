const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    Code: String
})

const productCodes = mongoose.model("codes", productSchema)

module.exports = productCodes