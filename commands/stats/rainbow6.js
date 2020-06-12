const { prefix, email, password } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const r6 = require('r6api.js');
const { getId, getLevel, getRank, getStats } = new r6(email, password);
const { stripIndents } = require('common-tags');

module.exports = {
    config: {
    name: 'rainbow6',
    description: 'Displays Rainbow Six Siege stats',
    usage: `${prefix}rainbow6 <username> <platform> <region>`,
    category: 'stats',
    access: 'everyone',
    aliases: ['r6']
},

run: async (client, message, args) => {

    const platforms = { 
        pc: 'UPLAY', 
        xbox: 'XBL', 
        ps4: 'PSN' 
    };

    const regions = { 
        eu: 'emea', 
        na: 'ncsa', 
        as: 'apac' 
    };

    let player, platform, region;

    if (!args[0]) return message.reply('Please provide an username!');
    else player = args[0];

    args[1] && [ 'pc', 'xbox', 'ps4' ].includes(args[1].toLowerCase()) ? platform = platforms[args[1].toLowerCase()] : platform = platforms['pc'];
    args[2] && [ 'eu', 'na', 'as' ].includes(args[1].toLowerCase()) ? region = regions[args[2].toLowerCase()] : region = regions['eu'];

    if (platform === 'XBL') player = player.replace('_', ' ');

    player = await getId(platform, player);
    if (!player.length) return message.reply('I couldn\'t find that account!')
    player = player[0]

    const playerRank = await getRank(platform, player.id)
    const playerStats = await getStats(platform, player.id)
    const playerGame = await getLevel(platform, player.id)

    if (!playerRank.length || !playerStats.length || !playerGame.length) return message.reply('I was unable to fetch some of the data.')

    const { current, max, lastMatch } = playerRank[0].seasons[Object.keys(playerRank[0].seasons)[0]].regions[ region ];
    const { pvp, pve } = playerStats[0];
    const { level, xp, lootboxProbability } = playerGame[0];

    platform = Object.keys(platforms).find(key => platforms[key] === platform).toUpperCase()
    region = Object.keys(regions).find(key => regions[key] === region).toUpperCase()

    const embed = new MessageEmbed()
    .setColor(colours.blue)
    .setAuthor('Rainbow Six Siege', 'https://i.imgur.com/3bKqioi.png')
    .setTitle(player.username)
    .setDescription(`Stats for the **${region}** region on **${platform}**`)
    .addField('General', stripIndents`
    **❯ Level:** ${level} (${xp} xp)
    **❯ Rank:** ${current.name} (Max ~ ${max.name})
    **❯ MMR:** ${current.mmr}
    **❯ Lootbox Probability:** ${lootboxProbability.percent}
    `)
    
    .addField('PvP Stats', stripIndents`
    **❯ Wins:** ${pvp.general.wins}
    **❯ Losses:** ${pvp.general.losses}
    **❯ W/L:** ${(pvp.general.wins / pvp.general.matches * 100).toFixed(2)}%
    **❯ Kills:** ${pvp.general.kills}
    **❯ Deaths:** ${pvp.general.deaths}
    **❯ K/D:** ${(pvp.general.kills / pvp.general.deaths).toFixed(2)}%
    **❯ Playtime:** ${Math.round(pvp.general.playtime / 3600)} hours
    `, true)

    .addField('PvE Stats', stripIndents`
    **❯ Wins:** ${pve.general.wins}
    **❯ Losses:** ${pve.general.losses}
    **❯ W/L:** ${(pve.general.wins / pve.general.matches * 100).toFixed(2)}%
    **❯ Kills:** ${pve.general.kills}
    **❯ Deaths:** ${pve.general.deaths}
    **❯ K/D:** ${(pve.general.kills / pve.general.deaths).toFixed(2)}%
    **❯ Playtime:** ${Math.round(pve.general.playtime / 3600)} hours
    `, true)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()

message.channel.send(embed).catch(e => message.reply(`Error: ${e.message}`))

}
}