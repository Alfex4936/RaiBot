const { prefix } = require('../../botconfig.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
    name: 'reverse',
    description: 'txet sesreveR',
    usage: `${prefix}reverse <text>`,
    category: 'text',
    access: 'everyone'
},

run: async (client, message, args) => {

    message.delete()

    let textToReverse = args.slice(0).join(' ')
    if (!textToReverse) return message.reply('You need to input a text to reverse!')

    let reversedText = (textToReverse.split('').reverse().join(''))
    if (reversedText.length > 2000) return message.reply('Your text is too long!')

message.channel.send(reversedText)

}
}