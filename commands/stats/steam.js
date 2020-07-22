const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');
const { steamToken } = require('../../config.json');
const { stripIndents } = require('common-tags');

module.exports = {
    config: {
    name: 'steam',
    description: 'Displays information about Steam account',
    usage: `${prefix}steam <custom id>`,
    category: 'stats',
    access: 'everyone',
    aliases: ['st']
},

run: async (client, message, args) => {

    if (!args[0]) return message.reply('Please provide an username!');
    let url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${steamToken}&vanityurl=${args}`

    fetch(url).then(res => res.json()).then(body => {

        if (body.response.success === 42) return message.reply('I couldn\'t find that account!')

        const id = body.response.steamid;
        const summaries = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamToken}&steamids=${id}`
        const bans = `http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${steamToken}&steamids=${id}`
        const state = ['Offline', 'Online', 'Busy', 'Away', 'Snooze', 'Looking to trade', 'Looking to play']

        fetch(summaries).then(res => res.json()).then(body => {

            if (!body.response) return message.reply('I couldn\'t find that account!')
            const { personaname, avatarfull, realname, personastate, loccountrycode, profileurl, timecreated } = body.response.players[0]

            fetch(bans).then(res => res.json()).then(body => {
        
                if (!body.players) return message.reply('I couldn\'t find that account!')
                const { NumberOfVACBans, NumberOfGameBans } = body.players[0]

        const embed = new MessageEmbed()
        .setColor(colours.blue)
        .setAuthor('Steam', 'https://i.imgur.com/UqlUsxD.png')
        .setTitle(personaname)
        .setThumbnail(avatarfull)
        .setDescription(stripIndents`
        **❯ Status:** ${state[personastate]}
        **❯ Country:** ${loccountrycode.toUpperCase()}
        **❯ Created:** ${moment.utc(timecreated * 1000).format('dddd, MMMM Do, YYYY')}
        **❯ VAC Bans:** ${NumberOfVACBans}
        **❯ Game Bans:** ${NumberOfGameBans}
        `)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()

        message.channel.send(embed)

            });
        });
    });
    
}
}