const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const ow = require('overwatch-stat');
const { stripIndents } = require('common-tags');

module.exports = {
    config: {
    name: 'overwatch',
    description: 'Displays Overwatch stats',
    usage: `${prefix}overwatch <username> <region>`,
    category: 'stats',
    access: 'everyone',
    aliases: ['ow']
},

run: async (client, message, args) => {

    let region = args[1]

    if (!args[0]) return message.reply('Please provide an username!');

    args[1] && [ 'asia', 'us', 'eu' ].includes(args[1].toLowerCase()) ? args[1] : region = 'eu';

    const stats = await ow.getStat(args[0], region.toLowerCase(), 'pc')
    if (!stats.name) return message.reply('Please provide a valid username!');

    const embed = new MessageEmbed()
    .setColor(colours.orange)
    .setAuthor('Overwatch', 'https://i.imgur.com/LNbk1k0.png')
    .setTitle(stats.name)
    .setDescription(`Stats for the **${region.toUpperCase()}** region on **PC**`)
    .addField('General', stripIndents`
    **❯ Level:** ${stats.level}
    **❯ Prestige:** ${stats.prestige}
    **❯ SR:** ${stats.ratings ? stats.ratings[0].level : '0'}
    **❯ Endorsement Level:** ${stats.endorsement}
    `)

    .addField('Competitive Stats', stripIndents`
    **❯ Played:** ${stats.competitiveStats.games.played}
    **❯ Wins:** ${stats.competitiveStats.games.won}
    **❯ Medals Earned:** ${stats.competitiveStats.awards.medals}
    `, true)
    
    .addField('Quick Play Stats', stripIndents`
    **❯ Played:** ${stats.quickPlayStats.games.played}
    **❯ Wins:** ${stats.quickPlayStats.games.won}
    **❯ Medals Earned:** ${stats.quickPlayStats.awards.medals}
    `, true)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()

    message.channel.send(embed)

}
}