const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const userSchema = require("../../Schemas/Users");
const noblox = require("noblox.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("editcookie")
        .setDescription("Bots cookie expired? You can edit it by using this command")
        .addStringOption(bot =>
        bot.setName("botid")
            .setDescription("The BotId")
            .setRequired(true)),
    async execute(interaction, client) {
        const BotId = interaction.options.getString("botid")

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

        const Bot = user.bots.find(o => o.botId === BotId)

        if (!Bot) {
            const thankYouForBuying = new EmbedBuilder()
                .setColor("Red")
                .setTitle(`Bot does not exist!`)
                .setDescription("The bot with this id does not exist!")
            await interaction.reply({
                ephemeral: true,
                embeds: [thankYouForBuying]
            })
            return
        }

        if (interaction.channel.id === user.orderChannelId) {




            const botIndex = user.bots.findIndex(o => o.botId === BotId)
            console.log(botIndex)

            const groupEmbed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("What do you want to update your bots cookie to?")
                .setDescription("Please enter you new bots cookie")

            await interaction.reply({
                embeds: [groupEmbed]
            })

            const filter = m => m.author.id === interaction.user.id
            const collector = interaction.channel.createMessageCollector({filter: filter, time: 1.8e+6})

//user.Bots[botIndex].Cookie = m.content
            let SetupPage = "GetCookie"

            collector.on('collect', async (m) => {
               switch (SetupPage) {


                   case "GetCookie":


                       try {
                           user.bots[botIndex].Cookie = m.content

                           const User = await noblox.setCookie(user.bots[botIndex].Cookie, true)


                           await m.delete()
                           const userEmbed = new EmbedBuilder()
                               .setColor("Blue")
                               .setTitle("Is this your bot?")
                               .setDescription("Is this your bot? If it is reply with **yes**")
                               .setThumbnail(User.ThumbnailUrl)
                               .addFields({name: "Bot Name", value: User.UserName, inline: true})
                           await interaction.channel.send({
                               embeds: [userEmbed]
                           })
                           SetupPage = "CookieConfirm"
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
                           await userSchema.findOneAndUpdate({discordId: interaction.user.id}, { bots: user.bots })



                           const groupEmbed = new EmbedBuilder()
                               .setColor("Green")
                               .setTitle("Updated the bot the bot!")
                               .setDescription(`Updated the bot! \n Hopefully it works now`)
                           await interaction.channel.send({
                               embeds: [groupEmbed]
                           })

                           collector.stop();

                       }else if (m.content.toLowerCase() === "no") {


                           SetupPage = "Cookie"




                           const groupEmbed = new EmbedBuilder()
                               .setColor("Blue")
                               .setTitle("What is your bots cookie?")
                               .setDescription("Please enter you bots cookie")

                           await interaction.channel.send({
                               embeds: [groupEmbed]
                           })
                       }
               }
            })





        } else {
            const thankYouForBuying = new EmbedBuilder()
                .setColor("Red")
                .setTitle(`Run this command in your order channel!`)
                .setDescription(`You can only run this command in <#${user.orderChannelId}>`)
            await interaction.reply({
                ephemeral: true,
                embeds: [thankYouForBuying]
            })
            return
        }
    }
}