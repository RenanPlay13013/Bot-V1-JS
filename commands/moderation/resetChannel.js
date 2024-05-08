const { SlashCommandBuilder, Options } = require("discord.js");
const { execute } = require("./clear");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetchannel')
        .setDescription('[CUIDADO] Este Comando Limpa todas as mensagens do canal')
        .addBooleanOption(option => 
            option
            .setName('confirme')
            .setDescription('Confirme sua decisão')
            .setRequired(true)
        ),

        async execute(interaction){ 
            let messagesToDelete = channel.content()
            await interaction.channel.bulkDelete([]).catch(err => {
                console.error('Erro ao deletar mensagens:', err);
                return interaction.reply({ content: 'Ocorreu um erro ao deletar mensagens.', ephemeral: true });
            });
    
            const embed = {
                color: 0x0099ff,
                description: `:white_check_mark: as mensagens foram deletadas.`
            };
    
            await interaction.reply({ embeds: [embed], ephemeral: true }).catch(err => {
                console.error('Erro ao enviar resposta:', err);
                return;
            });
        }
}