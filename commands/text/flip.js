const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const flip = require('flip-text');

module.exports = {
    config: {
    name: 'flip',
    description: 'Flips text',
    usage: `${prefix}flip <text>`,
    category: 'text',
    access: 'everyone'
},

run: async (client, message, args) => {

    message.delete()

    let textToFlip = args.slice(0).join(' ')
    if (!textToFlip) return message.reply('Please input a text to flip!')

    let flippedText = flip(textToFlip)
    if (flippedText.length > 2000) return message.reply('Your text is too long!')

    message.channel.send(flippedText)

}
}