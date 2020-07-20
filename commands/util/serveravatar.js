const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
    name: 'serveravatar',
    description: 'Displays server\'s avatar',
    usage: `${prefix}serverinfo`,
    category: 'util',
    access: 'everyone',
    aliases: ['sav']
},

run: async (client, message, args) => {

    const embed = new MessageEmbed()
    .setColor(colours.default)
    .setTitle(`${message.guild.name}'s avatar`)
    .setImage(message.guild.iconURL())
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()

    message.channel.send(embed);

}
}