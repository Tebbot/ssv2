const { Client, GatewayIntentBits, Collection, EmbedBuilder} = require('discord.js')

const { Routes } = require("discord-api-types/v10")

const fs = require("fs")

const { REST } = require("@discordjs/rest")
const mongoose = require("mongoose");
const childProcess = require("child_process");

mongoose.connect(process.env.CONNECTIONSTRING).then(() => {
    console.log("Connected for bot")

})




const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,

    ]
})

module.exports = client;


const commandFiles = fs.readdirSync("./Bot/commands").filter(file => file.endsWith(".js"))

const commands = []

client.commands = new Collection()

for (const File of commandFiles) {
    const command = require(`./commands/${File}`)

    commands.push(command.data.toJSON())

    client.commands.set(command.data.name, command)
}




client.once('ready', () => {
    console.log("Bot logged on!")


    const client_id = client.user.id;
    console.log(client_id)

    const rest = new REST({
        version: "9"
    }).setToken(process.env.TOKEN);

    (async () => {
        try {
            await rest.put(Routes.applicationGuildCommands(client_id, process.env.GUILDID), {
                body: commands
            })
            console.log("Registered commands!")
        } catch (e) {
            console.log(e)
            console.log("Oh nooo")
        }
    })();
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName)

    if (!command) return;

    try {
        await command.execute(interaction, client)
    } catch (e) {
        const errorEmbed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Uh oh")
            .setDescription("An error has occurred! Sorry for the inconvenience")

        interaction.reply({
            embeds: [errorEmbed],
            ephemeral: true
        })
    }
})



client.login(process.env.TOKEN)

