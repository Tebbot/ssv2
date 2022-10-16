const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const userSchema = require("../../Schemas/Users");
const Bot = require("../bot");
const serial = require("generate-serial-key");
const productCode = require("../../Schemas/productCodes");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("botkey")
        .setDescription("Get your bots API key (Make sure the bot can message you are on)")
        .addStringOption(id =>
        id.setName("botid")
            .setDescription("The botID the discord bot gave you!")
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



        client.users.fetch(interaction.user.id).then(async (user) => {



            const thankYouForBuying = new EmbedBuilder()
                .setColor("Green")
                .setTitle(`${BotId} ranking api key`)
                .setDescription("```" + Bot.ApiKey + "``` \n\nThis is considered private information and if it gets leak contact Tebbot right away so he can generate you a new one!")

            await user.send({
                embeds: [thankYouForBuying]
            })
        })


        const CheckDM = new EmbedBuilder()
            .setColor("Green")
            .setTitle(`Check you dm's!`)


        await interaction.reply({
            embeds: [CheckDM]
        })
    }
}