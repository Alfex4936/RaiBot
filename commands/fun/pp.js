const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
    name: 'pp',
    description: 'Reveals the truth',
    usage: `${prefix}pp`,
    category: 'fun',
    access: 'everyone'
},

run: async (client, message, args) => {

    return message.reply('Your pp is ' + Math.floor(Math.random() * 48 + 1) +'cm long.')
    
}
}