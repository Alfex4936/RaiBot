const Discord = require('discord.js');
const colours = require('../../colours.json');
const { prefix, ownerId } = require('../../config.json');
const { stripIndents } = require('common-tags');

module.exports = {
    config: {
    name: 'info',
    description: 'Displays information about bot',
    usage: `${prefix}info`,
    category: 'util',
    access: 'everyone'
},

run: async (client, message, args) => {

    const owner = client.users.cache.get(ownerId)

    const embed = new Discord.MessageEmbed()
    .setAuthor(`${client.user.username} Info`, client.user.displayAvatarURL())
    .setColor(colours.default)
    .setDescription(stripIndents`
    ❯ **Owner:** ${owner.tag}
    ❯ [Invite](https://discord.com/oauth2/authorize?client_id=668244314718994465&scope=bot&permissions=8)
    ❯ [Server](https://discord.gg/KD457qA)
    ❯ [Repository](https://github.com/Raiwex/RaiBot)
    `)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()

    message.channel.send(embed);

}
}