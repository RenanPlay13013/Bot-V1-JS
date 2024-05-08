const { Events, Client, GatewayIntentBits } = require('discord.js');
const client = new Client({intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
]})
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;
		client.on(Events.InteractionCreate, interaction => { 
			console.log(interaction)
		})
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`Nenhum Comando Corresponde ${interaction.commandName} Foi Encontrado.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'Ocorreu um erro ao executar esse comando!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'Ocorreu um erro enquanto executava esse comando!', ephemeral: true });
			}
		}
	},
};
