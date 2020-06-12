const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { stripIndents } = require('common-tags');
const moment = require('moment');

module.exports = {
    config: {
    name: 'github',
    description: 'Displays information about Github account',
    usage: `${prefix}github <username>`,
    category: 'stats',
    access: 'everyone',
    aliases: ['git', 'gh']
},

run: async (client, message, args) => {

    if (!args[0]) return message.reply('Please provide an username!')

    let url = `https://api.github.com/users/${args[0]}`

    let res; 

    try {
        res = await fetch(url).then(url => url.json())
    } catch (e) {
        return message.reply('I couldn\'t find that account!')
    }

    const embed = new MessageEmbed()
    .setColor(colours.white)
    .setAuthor('Github', 'https://i.imgur.com/e4HunUm.png')
    .setTitle(res.login)
    .setDescription(stripIndents`
    **Name** ~ ${res.name}
    **Bio** ~ ${res.bio}
    **Location** ~ ${res.location}
    **ID** ~ ${res.id}
    **Followers** ~ ${res.followers}
    **Following** ~ ${res.following}
    **Repositories** ~ ${res.public_repos}
    **Created** ~ ${moment.utc(res.created_at).format('dddd, MMMM Do, YYYY')}
    `)
    .setURL(res.html_url)
    .setThumbnail(res.avatar_url)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()

message.channel.send(embed)

}
}