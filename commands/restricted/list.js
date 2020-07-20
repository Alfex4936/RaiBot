const { prefix, ownerId } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
    name: 'list',
    description: 'Displays all servers bot is in',
    usage: `${prefix}list`,
    category: 'restricted',
    access: 'restricted'
},

run: async (client, message, args) => {

    if (message.author.id != ownerId) return message.reply('You don\'t have permission to use this command.')
    
    let list = client.guilds.cache.map(guild => `${guild.name} (${guild.id}) (${guild.memberCount} members)`).join('\n')
    
    let embed = new MessageEmbed()
    .setAuthor(`${client.user.username} Server List`, client.user.displayAvatarURL())
    .setColor(colours.default)
    .setDescription(list)
    .setFooter(`Total Servers: ${client.guilds.cache.size}`)

    message.channel.send(embed)

}
}