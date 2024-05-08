const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Exibe informações do usuário.'),
	async execute(interaction) {
		await interaction.reply(`Este comando foi executado por: ${interaction.user.displayName}, que entrou em: ${interaction.member.joinedAt}.`);
	},
};