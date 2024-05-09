const { Events, ActivityType } = require('discord.js');
const mongoose = require('mongoose')
const { mongoURL } = require('../config.json')
module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		client.user.setActivity({ 
			name: '🤖 Eu ainda estou sendo desenvolvido',
			type: ActivityType.Listening
		})
		if (!mongoURL) return
		
		await mongoose.connect(mongoURL || '', { 
			useNewUrlParser: true,
			useUnifiedTopology: true
		})

		if (mongoose.connect) { 
			console.log(`💾 Conectado com sucesso ao banco de dados`)
		} else { 
			console.log(`💾 Não foi possivel se conectar ao banco de dados`)
		}
	},
};
