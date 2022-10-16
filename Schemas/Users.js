const mongoose = require("mongoose")
const {Schema} = require("mongoose");

const UserSchema = new mongoose.Schema({
    accountKey: String,
    discordId: Intl,
    orderChannelId: Intl,
    bots: Array
})

const User = mongoose.model("Users", UserSchema)

module.exports = User