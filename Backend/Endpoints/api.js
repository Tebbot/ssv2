const express = require("express")
const userSchema = require("../../Schemas/Users")


const router = express.Router()
const noblox = require("noblox.js")

function findBot(AccountKey, ApiKey) {

}

router.get("/", (req, res) => {
    res.send("Welcome to SimpleService API V2")
})

router.post("/setrank", async (req, res) => {
    const body = req.body
    const headers = req.headers

    const user = await userSchema.findOne({accountKey: headers.account})

    if (!user) {
        res.json({
            Status: "401",
            Message: "User not found!"
        })

        res.status(401)
    }

    if (!body.UserId || !body.RankId) {
        res.json({
            Status: "502",
            Message: "Missing UserId or RankId"
        })

        res.status(502)
    }

    const bot = user.bots.find(bot => bot.ApiKey === headers.apikey)

    if (!bot) {
        res.json({
            Status: "401",
            Message: "Bot not found!"
        })

        res.status(401)
    }

    try {
        await noblox.setCookie(bot.Cookie)

        await noblox.setRank(bot.groupId, body.UserId, body.RankId)

        res.json({
            Status: "200",
            Message: `Ranked ${body.UserId}`
        })
    } catch (e) {
        res.json({
            Status: "500",
            Message: "Sorry! We cant rank the user right now. An error on our side has happened."
        })

        res.status(500)
    }


})

router.post("/promote", async (req, res) => {
    const body = req.body
    const headers = req.headers

    const user = await userSchema.findOne({accountKey: headers.account})

    if (!user) {
        res.json({
            Status: "401",
            Message: "User not found!"
        })

        res.status(401)
    }

    if (!body.UserId ) {
        res.json({
            Status: "502",
            Message: "Missing UserId"
        })

        res.status(502)
    }

    const bot = user.bots.find(bot => bot.ApiKey === headers.apikey)

    if (!bot) {
        res.json({
            Status: "401",
            Message: "Bot not found!"
        })

        res.status(401)
    }

    try {
        await noblox.setCookie(bot.Cookie)

        await noblox.promote(bot.groupId, body.UserId)

        res.json({
            Status: "200",
            Message: `Promoted ${body.UserId}`
        })
    } catch (e) {
        res.json({
            Status: "500",
            Message: "Sorry! We cant rank the user right now. An error on our side has happened."
        })

        res.status(500)
    }


})

router.post("/shout", async (req, res) => {
    const body = req.body
    const headers = req.headers

    const user = await userSchema.findOne({accountKey: headers.account})

    if (!user) {
        res.json({
            Status: "401",
            Message: "User not found!"
        })

        res.status(401)
    }

    if (!body.Message ) {
        res.json({
            Status: "502",
            Message: "Missing Message"
        })

        res.status(502)
    }

    const bot = user.bots.find(bot => bot.ApiKey === headers.apikey)

    if (!bot) {
        res.json({
            Status: "401",
            Message: "Bot not found!"
        })

        res.status(401)
    }

    try {
        await noblox.setCookie(bot.Cookie)

        await noblox.shout(bot.groupId, body.Message)

        res.json({
            Status: "200",
            Message: `Shouted!`
        })
    } catch (e) {
        res.json({
            Status: "500",
            Message: "Sorry! We cant rank the user right now. An error on our side has happened."
        })

        res.status(500)
    }


})

router.post("/handlejoinrequest", async (req, res) => {
    const body = req.body
    const headers = req.headers

    const user = await userSchema.findOne({accountKey: headers.account})

    if (!user) {
        res.json({
            Status: "401",
            Message: "User not found!"
        })

        res.status(401)
    }

    if (!body.UserId || !body.Result) {
        res.json({
            Status: "502",
            Message: "Missing UserId or Result"
        })

        res.status(502)
    }

    const bot = user.bots.find(bot => bot.ApiKey === headers.apikey)

    if (!bot) {
        res.json({
            Status: "401",
            Message: "Bot not found!"
        })

        res.status(401)
    }

    try {
        await noblox.setCookie(bot.Cookie)

        await noblox.handleJoinRequest(bot.groupId, body.UserId, body.Result)

        res.json({
            Status: "200",
            Message: `Ranked ${body.UserId}`
        })
    } catch (e) {
        res.json({
            Status: "500",
            Message: "Sorry! We cant rank the user right now. An error on our side has happened."
        })

        res.status(500)
    }


})






module.exports = router