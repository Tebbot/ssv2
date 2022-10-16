const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("name")
        .setDescription("Description"),
    async execute(interaction, client) {
        interaction.reply("Hello")
    }
}