const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js')
module.exports = { 
    data: new SlashCommandBuilder()
    .setName('pokemon')
    .setDescription('menu para selecionar pokemons'),

    async execute(interaction) { 
        const PokeSelect = new StringSelectMenuBuilder()
        .setCustomId('starter')
        .setPlaceholder('Make a selection!')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Bulbasaur')
                .setDescription('The dual-type Grass/Poison Seed Pokémon.')
                .setValue('bulbasaur'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Charmander')
                .setDescription('The Fire-type Lizard Pokémon.')
                .setValue('charmander'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Squirtle')
                .setDescription('The Water-type Tiny Turtle Pokémon.')
                .setValue('squirtle'),
        )

        const row = new ActionRowBuilder()
            .addComponents(PokeSelect)

            await interaction.reply({
                content: 'Escolha seu pokemon',
                components: [row],
            })
    }
}