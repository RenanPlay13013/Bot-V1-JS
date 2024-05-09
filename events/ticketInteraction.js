const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const ticket = require('../Schemas/ticketSchema')
const {createTranscript} = require('discord-html-transcripts')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        if (interaction.customId === 'ticketCreateSelect') {
            const modal = new ModalBuilder()
            .setTitle('Crie seu ticket')
            .setCustomId('ticketModal')

            const why = new TextInputBuilder()
            .setCustomId('whyTicket')
            .setRequired(true)
            .setPlaceholder('Motivo do ticket:')
            .setLabel('Por que está criando esse ticket?')
            .setStyle(TextInputStyle.Paragraph)

            const info = new TextInputBuilder()
            .setCustomId('infoTicket')
            .setRequired(true)
            .setPlaceholder('Motivo do ticket.')
            .setLabel('Sobre oque seria o seu ticket?')
            .setStyle(TextInputStyle.Paragraph)
            
            const one = new ActionRowBuilder().addComponents(why)
            const two = new ActionRowBuilder().addComponents(info)
            
            modal.addComponents(one, two);
            await interaction.showModal(modal)
        } else if (interaction.customId === 'ticketModal') {
            const user = interaction.user
            const data = await ticket.findOne({Guild: interaction.guild.id})
            if(!data) return await interaction.reply({content: `O sistema de ticket não pode ser definido aqui`, ephemeral: true})
                else { 
                    const why = interaction.fields.getTextInputValue('whyTicket')
                    const info = interaction.fields.getTextInputValue('infoTicket')
                    const category = await interaction.guild.channels.cache.get(data.Category)

                    const channel = await interaction.guild.channels.create({ 
                        name: `Ticket de: ${user.displayName}`,
                        type: ChannelType.GuildText,
                        topic: `Ticket aberto por: ${user.displayName} Motivo do Ticket: ${why}`,
                        parent: category,
                        PermissionOverwrites: [
                            { 
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel]
                            },
                            { 
                                id: interaction.guild.id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages,PermissionsBitField.Flags.ReadMessageHistory]
                            }
                        ]
                    })
                    const embed = new EmbedBuilder()
                    .setColor('Blurple')
                    .setTitle(`Ticket de: ${user.displayName}`)
                    .setDescription(`Motivo do ticket: ${why}\n\nInformações extras: ${info}`)
                    .setTimestamp()

                    const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('closeTicket')
                        .setLabel(`🔐 Fechar o ticket`)
                        .setStyle(ButtonStyle.Danger),

                        /*new ButtonBuilder()
                        .setCustomId(ticketTranscript)
                        .setLabel('📜 Transcript')
                        .setStyle(ButtonStyle.Primary)*/
                    )

                    await channel.send({embeds: [embed], components:[button]})
                    await interaction.reply({content: `🌟 Seu ticket foi aberto em: ${channel}`, ephemeral: true})
            }
        } else if (interaction.customId === 'closeTicket') {
                const closeModal = new ModalBuilder()
                .setTitle('Fechando Ticket')
                .setCustomId('closeTicketModal')

                const reason = new TextInputBuilder()
                .setCustomId('closeReasonTicket')
                .setRequired(true)
                .setPlaceholder('Qual rasão está fechando o ticket? Exemplo: **Resolvido**')
                .setLabel('Insira o motivo de estar fechando o ticket')
                .setStyle(TextInputStyle.Paragraph)

                const one = new ActionRowBuilder().addComponents(reason)
                
                closeModal.addComponents(one)
                await interaction.showModal(closeModal)
        } else if (interaction.customId === 'closeTicketModal') {

            var channel = interaction.channel
            var name = channel.name
            name = name.replace('ticket de: ', '')
            const member = await interaction.guild.members.cache.get(name)

            const reason = interaction.fields.getTextInputValue('closeReasonTicket')
            await interaction.reply({content: '🔓 Fechando esse ticket...'})

            setTimeout(async () => { 
                await channel.delete()
                await member.send(`📢 Você está recebendo essa notificação porque seu ticket em ${interaction.guild.name} foi fechado, Motivo: \`${reason}\``).catch(() => {})
            }, 5000)
        } else if (interaction.customId === 'ticketTranscript'){
            const file = await createTranscript(interaction.channel, { 
                limit: -1,
                returnBuffer: false,
                filename: `${interaction.channel.name}.html`
            })

            var msg = await interaction.channel.send({content: `🌎 Seu Transcript:`, files:[file]})
            var message = `📜 **Aqui Está seu [ticket transcript](https://mahto.id/chat-exporter?url=${msg.attachments.first()?.url}) de: ${interaction.guild.name}!**`
            await msg.delete()
            await interaction.reply({content: message, ephemeral: true})
        }   
    }
}