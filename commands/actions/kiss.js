const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const client = require('nekos.life');
const neko = new client();

module.exports = {
    config: {
    name: 'kiss',
    description: 'Allows you to kiss someone',
    usage: `${prefix}kiss <user>`,
    category: 'actions',
    access: 'everyone'
},

run: async (client, message, args) => {

if (!message.mentions.users.first()) return message.reply('Please provide an user!');

    const embed = new MessageEmbed()
    .setColor(colours.red)
    .setDescription(`**${message.author.username}** kissed **${message.mentions.users.first().username}! 💋**`)
    .setImage((await neko.sfw.kiss()).url)

message.channel.send(embed)
    
}
}