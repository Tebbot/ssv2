const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField} = require("discord.js")

const productCodeSchema = require("../../Schemas/productCodes")
const userSchema = require("../../Schemas/Users")
const serial = require("generate-serial-key")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("redeem")
        .setDescription("Redeem our ranking product!")
        .addStringOption(option => (
            option.setName("code")
                .setDescription("Enter the product code the bot gave you!")
                .setRequired(true)
        )),
    async execute(interaction, client) {


        const Code = interaction.options.getString("code")
        const accountKeya = serial.generate(15, "", 5)

        try {
            const codeObject = await productCodeSchema.findOne({Code: Code})



            if (!codeObject) {
                console.log("E")
                const thankYouForBuying = new EmbedBuilder()
                     .setColor("Red")
                    .setTitle(`Invalid code!`)
                    .setDescription("Sorry Your rank code is invalid, You can always try again! But you might need to order one.")
                await interaction.reply({
                    ephemeral: true,
                    embeds: [thankYouForBuying]
                })
                return
            }

            const channel = await interaction.guild.channels.create({
                name: interaction.user.id,
                type: ChannelType.GuildText,
                parent: '1031261662453440553',
                permissionOverwrites: [
                    {
                        allow: ['ViewChannel', 'SendMessages'],
                        id: interaction.user.id,
                    },
                    {
                        allow: ['ViewChannel', 'SendMessages'],
                        id: client.user.id,
                    },
                    {
                        deny: ['ViewChannel', 'SendMessages'],
                        id: interaction.guild.id,
                    },
                ]
            })









            const ChannelMessage = new EmbedBuilder()
                .setColor("Green")
                .setTitle(`Hello! This is your ordering channel!`)
                .setDescription("You can use this channel for setting up your bots! \n \nYou can do this by running the ```/createbot``` command \n\n**Your account key is:** \n \n" + accountKeya)

            await channel.send({
                embeds: [ChannelMessage]
            })





            const userObject = new userSchema({
                accountKey: accountKeya,
                discordId: interaction.user.id,
                orderChannelId: channel.id,
                Bots: {}
            }).save()

            const role = await interaction.guild.roles.cache.find(r => r.id === "1030589067949248603")

            const member = interaction.guild.members.cache.get(interaction.user.id)

            member.roles.add(role)

            const thankYouForBuying = new EmbedBuilder()
                .setColor("Green")
                .setTitle(`Redeemed!!`)
                .setDescription(`You have redeemed your product! \n \n Please head over to <#${channel.id}> to setup your bot(s)`)

            interaction.reply({
                embeds: [thankYouForBuying]
            })

            await productCodeSchema.findOneAndDelete({Code: Code})

        } catch (e) {
            console.log(e)
        }



       /*  */










    }
}

/*

if (CodeObject) {
            const User = new userSchema({
                discordId: interaction.user.id,
                Bots: {}
            }).save().then(async () => {
                const channel = await interaction.guild.channels.create({
                    name: interaction.user.tag,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel]
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                        }
                    ]
                })
                await channel.setParent("1030588903641600010")


                const thankYouForBuying = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle(`Redeemed!`)
                    .setDescription("You have redeemed your ranking code! \n \n Thank you for choosing SimpleService! Continue to CHANNEL to setup your bot(s)")
                await interaction.reply({
                    ephemeral: true,
                    embeds: [thankYouForBuying]
                })

                await productCodeSchema.findOneAndDelete({Code: Code})
            })



        }
 */