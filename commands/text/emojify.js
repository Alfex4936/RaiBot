const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const { emojify } = require('../../functions.js');

module.exports = {
    config: {
    name: 'emojify',
    description: 'Emojifies text',
    usage: `${prefix}emojify <text>`,
    category: 'text',
    access: 'everyone'
},

run: async (client, message, args) => {

    message.delete()

    let textToEmojify = args.slice(0).join(' ')
    if (!textToEmojify) return message.reply('Please input a text to emojify!')

    let emojifiedText = emojify(textToEmojify)
    if (emojifiedText.length > 2000) return message.reply('Your text is too long!')

    message.channel.send(emojifiedText)

}
}