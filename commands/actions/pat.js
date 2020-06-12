const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const client = require('nekos.life');
const neko = new client();

module.exports = {
    config: {
    name: 'pat',
    description: 'Allows you to pat someone',
    usage: `${prefix}pat <user>`,
    category: 'actions',
    access: 'everyone',
    aliases: ['headpat']
},

run: async (client, message, args) => {

if (!message.mentions.users.first()) return message.reply('Please provide an user!');

    const embed = new MessageEmbed()
    .setColor(colours.red)
    .setDescription(`**${message.author.username}** patted **${message.mentions.users.first().username}! ❤️**`)
    .setImage((await neko.sfw.pat()).url)

message.channel.send(embed)
    
}
}