
const { SlashCommandBuilder, ChannelType, PermissionsBitField, Guild } = require('discord.js')
const ticket = require('../../Schemas/ticketSchema')
const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('@discordjs/builders')
const {blurple} = require('colors')
module.exports ={ 
    data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Gerencie o sistema de ticket')
    .addSubcommand(command => command.setName('send').setDescription('Envia mensagem do Ticket').addStringOption(option => option.setName('name').setDescription('Nome para o select menu').setRequired(true)).addStringOption(option => option.setName('message').setDescription('Mensagem customizada para a embed').setRequired(false)))
    .addSubcommand(command => command.setName('setup').setDescription('Define a categoria do ticket').addChannelOption(option => option.setName('category').setDescription('Categoria para mandar os tickets')))
    .addSubcommand(command => command.setName('remove').setDescription('Desabilita o sistema de ticket'))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction){ 
        const {options} = interaction
        const sub = options.getSubcommand()
        const data = await ticket.findOne({Guild: interaction.guild.id})

        switch(sub){
            case 'send': 
            if (!data) return await interaction.reply({content: `⚠ Você precisa usar /ticket setup antes de mandar a mensagem do ticket.`, ephemeral: true})

                const name = options.getString('name')
                var message = options.getString('message') || 'Crie um ticket para falar com a staff'

                const select = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                    .setCustomId('ticketCreateSelect')
                    .setPlaceholder(`🌎 ${name}`)
                    .setMinValues(1)
                    .addOptions({ 
                        label: 'Crie seu ticket',
                        description: 'Clique para criar seu ticket',
                        value: 'createTicket'
                    })
                )

                const embed = new EmbedBuilder()
                .setColor(0x0000FF)
                .setTitle(`💡 Criar ticket!`)
                .setDescription(message + ' 🎫')
                .setFooter({text: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}` })

                await interaction.reply({content: `🌎 Mande seu problema abaixo`, ephemeral: true})
                await interaction.followUp({embeds: [embed], components: [select]})

                break 
                case 'remove': 
                if(!data) return await interaction.reply({content: `⚠ Você não tem um ticket aberto`, ephemeral: true})
                    else { 
                await interaction.deleteOne({Guild: interaction.guild.id})
                await interaction.reply({content: `🌎 sua Categoria de ticket foi deletada`, ephemeral: true})
            }

            break 
            case 'setup': 
            if(data) return await interaction.reply({content: `⚠ Você já tem uma categoria de ticket definida: <#${data.Category}`, ephemeral: true})
            else { 
                const category = options.getChannel('category')
                await ticket.create({ 
                    Guild: interaction.guild.id,
                    Category: category.id
                })
                    await interaction.reply({content: `🌏 Você definiu a categoria para **${category}**! use /ticket send para criar o painel`, ephemeral: true})

            }    
        }
    }
}
