require("dotenv").config()

const express = require("express")

const router = express.Router()

const Bot = require("../../Bot/bot")



const productCode = require("../../Schemas/productCodes")

const serial = require("generate-serial-key")
const {generate} = require("generate-serial-key");
const {EmbedBuilder} = require("discord.js");

router.post("/grantProductKey", async (req, res) => {

    const body = req.body
    const headers = req.headers








    if (headers.token === process.env.SECURITYTOKEN) {



        if (!body.discordId) {
            res.json({
                "Response": 400,
                "Message": "No discordId found!"
            })
            return;
        } else {
            const userId = '377547324660121603'


            // const user = await Bot.users.cache.get('377547324660121603')
            Bot.users.fetch(req.body.discordId).then(async (user) => {

                const productCodeKey = "SS-" + serial.generate(25, "-", 5)


                const codeSchema = await productCode.create({
                    Code: productCodeKey
                })

                const thankYouForBuying = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle(`Thank you for buying ${user.tag}!`)
                    .setDescription("Thank you so much for buying our service! \n \n It means a lot to us to keep our service stable so we can provide you with a smooth ranking experience! To redeem your product key do /redeem and insert the product code in down below \n \n Your code is: " + "```" + productCodeKey + "```")

                user.send({
                    embeds: [thankYouForBuying]
                })
            })


            //await user.send("No")


        }







    } else {
        res.send("No")
    }
})


module.exports = router