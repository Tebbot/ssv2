const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField, User} = require("discord.js")

const productCodeSchema = require("../../Schemas/productCodes")
const serial = require("generate-serial-key")
const userSchema = require("../../Schemas/Users")
const noblox = require("noblox.js");

let onSetup = false

module.exports = {
    data: new SlashCommandBuilder()
        .setName("createbot")
        .setDescription("Create a SimpleService ranking bot! (You can only have 5 max DM tebbot for more)"),
    async execute(interaction, client) {

        const user = await userSchema.findOne({discordId: interaction.user.id})

        if (!user) {
            const thankYouForBuying = new EmbedBuilder()
                .setColor("Red")
                .setTitle(`You dont own a license!`)
                .setDescription("You need to own a simpleservice license to do this!")
            await interaction.reply({
                ephemeral: true,
                embeds: [thankYouForBuying]
            })
            return
        }

        const a = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(`SimpleService | Bot Wizzard`)
            .setDescription(`Hello <@${interaction.user.id}>! \n\n Welcome to SimpleService bot Setup! Please enter your group id!`)
        await interaction.reply({
            embeds: [a]
        })

        if (interaction.channel.id === user.orderChannelId) {

            let groupid = null
            let cookie = null


            let setupWizzard = "GroupId"
            onSetup = true

            async function createBot(GroupId, Cookie, Schema) {
                const botId = serial.generate(5, "-", 5)
                const ApiKey = serial.generate(32, "-", 6)
                const newData = {
                    botId: botId,
                    groupId: GroupId,
                    Cookie: Cookie,
                    ApiKey: ApiKey
                }


                await userSchema.findOneAndUpdate({discordId: interaction.user.id}, { $push: { bots: newData} })

                return botId
            }

            if (onSetup) {
                const filter = m => m.author.id === interaction.user.id
                const collector = interaction.channel.createMessageCollector({filter: filter, time: 1.8e+6})

                collector.on('collect', async (m) => {
                    if (m.author.id === interaction.user.id) {
                        switch (setupWizzard) {
                            case "GroupId":
                                groupid = parseInt(m.content)
                                const groupInfo = await noblox.getGroup(groupid)
                                const icon = await noblox.getLogo(groupid)

                                const groupEmbed = new EmbedBuilder()
                                    .setColor("Blue")
                                    .setTitle("Is this your group?")
                                    .setDescription("Is this your group? If it is reply with **yes**")
                                    .setThumbnail(icon)
                                    .addFields({name: "Group name", value: groupInfo.name, inline: true}, {name: "Group Owner", value: groupInfo.owner.username, inline: true})
                                await interaction.channel.send({
                                    embeds: [groupEmbed]
                                })
                                setupWizzard = "GroupConfirm"

                                break
                            case "GroupConfirm":
                                if (m.content.toLowerCase() === "yes") {
                                    const groupEmbed = new EmbedBuilder()
                                        .setColor("Blue")
                                        .setTitle("What is your bots cookie?")
                                        .setDescription("Please enter you bots cookie")

                                    await interaction.channel.send({
                                        embeds: [groupEmbed]
                                    })

                                    setupWizzard = "BotCookie"
                                } else if (m.content.toLowerCase() === "no") {
                                    setupWizzard = "GroupId"
                                    const a = new EmbedBuilder()
                                        .setColor("Blue")
                                        .setTitle(`SimpleService | Bot Wizzard`)
                                        .setDescription(`What is your group id?`)
                                    await interaction.channel.send({
                                        embeds: [a]
                                    })
                                }
                                break
                            case "BotCookie":
                                cookie = m.content




                                try {
                                    const User = await noblox.setCookie(cookie, true)

                                    const userEmbed = new EmbedBuilder()
                                        .setColor("Blue")
                                        .setTitle("Is this your bot?")
                                        .setDescription("Is this your bot? If it is reply with **yes**")
                                        .setThumbnail(User.ThumbnailUrl)
                                        .addFields({name: "Bot Name", value: User.UserName, inline: true})
                                    await interaction.channel.send({
                                        embeds: [userEmbed]
                                    })
                                    setupWizzard = "CookieConfirm"
                                    await m.delete()

                                } catch (e) {
                                    const thankYouForBuying = new EmbedBuilder()
                                        .setColor("Red")
                                        .setTitle(`Invalid cookie!`)
                                        .setDescription("You have entered a invalid cookie! Try again.")
                                    await interaction.channel.send({
                                        ephemeral: true,
                                        embeds: [thankYouForBuying]
                                    })
                                    console.log(e)
                                }
                                break
                            case "CookieConfirm":
                                if (m.content.toLowerCase() === "yes") {
                                    const Bot = await createBot(groupid, cookie)

                                    const groupEmbed = new EmbedBuilder()
                                        .setColor("Green")
                                        .setTitle("Created the bot!")
                                        .setDescription(`Created the bot! \n \n Thank you so much for using our service, The next steps are make your epic project with out api or download our pre-made projects! \n \n **Bot Id: ** \n \n ${Bot}`)
                                    await interaction.channel.send({
                                        embeds: [groupEmbed]
                                    })

                                    collector.stop();

                                }else if (m.content.toLowerCase() === "no") {
                                    setupWizzard = "BotCookie"
                                    const groupEmbed = new EmbedBuilder()
                                        .setColor("Blue")
                                        .setTitle("What is your bots cookie?")
                                        .setDescription("Please enter you bots cookie")

                                    await interaction.channel.send({
                                        embeds: [groupEmbed]
                                    })
                                }


                        }
                    }
                })
            }









        } else {

        }



    }
}