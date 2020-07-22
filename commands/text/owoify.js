const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const client = require('nekos.life');
const neko = new client();

module.exports = {
    config: {
    name: 'owoify',
    description: 'Owoifies text',
    usage: `${prefix}owoify <text>`,
    category: 'text',
    access: 'everyone',
    aliases: ['owo', 'uwu']
},

run: async (client, message, args) => {

    message.delete()

    let textToOwO = args.slice(0).join(' ')
    if (!textToOwO) return message.reply('Please input a text to OwOify!')

    let owo = await neko.sfw.OwOify({text: textToOwO});
    if (owo.length > 2000) return message.reply('Your text is too long!')

    message.channel.send(owo.owo)
        
}
}