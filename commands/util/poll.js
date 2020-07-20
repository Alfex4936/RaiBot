const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
    name: 'poll',
    description: 'Allows you to create poll',
    usage: `${prefix}poll`,
    category: 'util',
    access: 'everyone'
},

run: async (client, message, args) => {
    
    if (!args.join(' ')) return message.reply('Please input a question!')

    const embed = new MessageEmbed()
    .setColor(colours.yellow)
    .setAuthor(`${message.author.tag}'s poll`, message.author.displayAvatarURL())
    .setDescription(args.join(' '))
    .setFooter('React to vote')
    .setTimestamp()

    message.delete()

    message.channel.send(embed).then(sentEmbed => {
        sentEmbed.react('✅')
        sentEmbed.react('❌')
    });

}
}
