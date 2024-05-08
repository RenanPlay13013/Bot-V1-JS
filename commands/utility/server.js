const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Exibe informações do Servidor.'),
	async execute(interaction) {
		await interaction.reply(`Este é o servidor: **${interaction.guild.name}** e tem **${interaction.guild.memberCount}** Membros.`);
	},
};