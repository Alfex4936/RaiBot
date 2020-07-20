const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
    name: 'avatar',
    description: 'Displays user\'s avatar',
    usage: `${prefix}avatar [user]`,
    category: 'util',
    access: 'everyone',
    aliases: ['av']
},

run: async (client, message, args) => {

    const myEmbed = new MessageEmbed()
    .setColor(colours.default)
    .setTitle('Your avatar')
    .setImage(message.author.avatarURL())	
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()

    if (!message.mentions.users.size) {
        return message.channel.send(myEmbed);
    }

    let user = message.mentions.users.first();

    const embed = new MessageEmbed()
    .setColor(colours.default)
    .setTitle(`${user.username}'s avatar`)
    .setImage(user.displayAvatarURL())
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()

    message.channel.send(embed);

}
}