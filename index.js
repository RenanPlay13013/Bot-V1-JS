const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Message } = require('discord.js');
const { TOKEN } = require('./config.json');
const { channel } = require('node:diagnostics_channel');
const { error } = require('node:console');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//Loader de Comandos
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] O Comando em: ${filePath} está com "data" ou "execute" definidos incorretamente`);
		}
	}
}

//Loading Events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}




client.once(Events.ClientReady, readyClient => {
	console.log(`✅ Bot Logado: ${readyClient.user.tag}`);
});
client.login(TOKEN)
