const { prefix, ownerId } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
    name: 'gleave',
    description: 'Makes the bot leave server',
    usage: `${prefix}gleave <server-id>`,
    category: 'restricted',
    access: 'restricted',
    aliases: ['gl', 'lg']
},

run: async (client, message, args) => {

    if (message.author.id != ownerId) return message.reply('You don\'t have permission to use this command.')

    let guildId = args[0]

    if (!guildId) return message.reply('Please provide a guild ID!');
    message.delete()
    client.guilds.cache.get(guildId).leave();

}
} 