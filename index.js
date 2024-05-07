const { Client, GatewayIntentBits, Events } = require('discord.js'); // Importa o objeto Events
const { TOKEN } = require('./config.json'); // Importa apenas TOKEN de config.json
const { CHECK } = require('./src//ShorCuts/emojis.json')
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

bot.once(Events.ClientReady, readyClient => { 
    console.log(`${CHECK} Bot Iniciado: ${readyClient.user.tag}`);
});

bot.login(TOKEN);
