const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Deleta mensagens de um usuário específico ou de todos no canal.')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('Quantidade de mensagens a serem deletadas.')
                .setRequired(true)
        )
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Usuário cujas mensagens serão deletadas.')
                .setRequired(false)
        ),

    async execute(interaction) {
        const amountOption = interaction.options.getInteger('amount');
        const userOption = interaction.options.getUser('user');

        if (!amountOption) {
            return await interaction.reply({ content: 'Especifique a quantidade de mensagens a serem deletadas.', ephemeral: true });
        }

        const amount = amountOption;
        const user = userOption || null;
        console.log('Tipo do amount:', typeof amount);
        console.log('Usuário alvo:', user);

        const channel = interaction.channel;

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply({ content: 'Você não tem permissão para executar esse comando.', ephemeral: true });
        if (amount < 1 || amount > 100) return await interaction.reply({ content: 'Especifique um número entre 1 e 100 para deletar.', ephemeral: true });

        // Coleta das mensagens a serem deletadas
        let messagesToDelete = await interaction.channel.messages.fetch({ limit: amount });

        // Filtragem das mensagens se um usuário foi especificado
        if (user) {
            messagesToDelete = messagesToDelete.filter(msg => msg.author.id === user.id);
        }

        // Exclusão das mensagens
        await interaction.channel.bulkDelete(messagesToDelete).catch(err => {
            console.error('Erro ao deletar mensagens:', err);
            return interaction.reply({ content: 'Ocorreu um erro ao deletar mensagens.', ephemeral: true });
        });

        const embed = {
            color: 0x0099ff,
            description: `:white_check_mark: ${messagesToDelete.size} mensagens foram deletadas${user ? ` do usuário ${user}` : ''}.`
        };

        await interaction.reply({ embeds: [embed], ephemeral: true }).catch(err => {
            console.error('Erro ao enviar resposta:', err);
            return;
        });
    }
};
