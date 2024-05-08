const { Client, GatewayIntentBits } = require('discord.js');
const {GUILD_ID,CLIENT_ID, TOKEN } = require('./config.json')

const client = new Client({intents: GatewayIntentBits.Guilds});

client.once('ready', async () => {
    console.log('Bot is ready.');

    try {
        const applicationCommands = await client.guilds.cache.get(GUILD_ID).commands.fetch(); // Substitua 'YOUR_GUILD_ID' pelo ID do seu servidor

        applicationCommands.forEach(command => {
            console.log(`Command Name: ${command.name}, ID: ${command.id}`);
        });
    } catch (error) {
        console.error('Error fetching application commands:', error);
    }
});

client.login(TOKEN);