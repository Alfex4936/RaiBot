const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    config: {
    name: 'advice',
    description: 'Tells you an advice when you need it',
    usage: `${prefix}advice`,
    category: 'fun',
    access: 'everyone'
},

run: async (client, message, args) => {

    fetch('https://api.adviceslip.com/advice')
    .then(res => res.json())
    .then(body => {

        const embed = new MessageEmbed()
        .setColor(colours.blue)
        .setTitle(`Random advice`)
        .setDescription(body.slip.advice)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()

        message.channel.send(embed).then(sentEmbed => {
            sentEmbed.react('⬆️')
            sentEmbed.react('⬇️')
        });
    });

}
}