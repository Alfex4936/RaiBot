const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    config: {
    name: 'fact',
    description: 'Tells you a fact',
    usage: `${prefix}fact`,
    category: 'fun',
    access: 'everyone'
},

run: async (client, message, args) => {

    const facts = [
        'https://some-random-api.ml/facts/dog', 'https://some-random-api.ml/facts/dog', 'https://some-random-api.ml/facts/panda', 'https://some-random-api.ml/facts/fox',
        'https://some-random-api.ml/facts/bird', 'https://some-random-api.ml/facts/koala'
    ]

    const randomFact = facts[Math.floor(Math.random() * facts.length)];

    fetch(randomFact)
    .then(res => res.json())
    .then(body => {

        const embed = new MessageEmbed()
        .setColor(colours.blue)
        .setTitle(`Random ${randomFact.slice(33 - 0)} fact`)
        .setDescription(body.fact)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()

        message.channel.send(embed).then(sentEmbed => {
            sentEmbed.react('⬆️')
            sentEmbed.react('⬇️')
        });
    });

}
}