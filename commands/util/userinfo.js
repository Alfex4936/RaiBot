const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { stripIndents } = require('common-tags');
const { checkDays, capitaliseFirst } = require('../../functions.js');

module.exports = {
    config: {
    name: 'userinfo',
    description: 'Displays information about user',
    usage: `${prefix}userinfo [user]`,
    category: 'util',
    access: 'everyone',
    aliases: ['ui']
},

run: async (client, message, args) => {

    let member = message.mentions.members.first() || message.member;

    let botYesNo = {
        'false': 'No',
        'true': 'Yes'
    }

    let roles = member.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).slice(0, -1);
    
    const embed = new MessageEmbed()
    .setAuthor(`User Info`)
    .setTitle(member.user.tag)
    .setColor(colours.default)
    .addField('User', stripIndents`
    **❯ Username:** ${member.user.username}
    **❯ Discriminator:** ${member.user.discriminator}
    **❯ ID:** ${member.user.id}
    **❯ Joined Discord:** ${moment.utc(message.guild.members.cache.get(member.user.id).user.createdAt).format('dddd, MMMM Do, YYYY')} (${checkDays(message.guild.members.cache.get(member.user.id).user.createdAt)})
    **❯ Status:** ${capitaliseFirst(member.user.presence.status)}
    **❯ Game:** ${member.user.presence.game ? user.presence.game.name : 'Not playing a game'}
    **❯ Bot:** ${botYesNo[member.user.bot]}
    `)

    .addField('Member', stripIndents`
    **❯ Joined Server:** ${moment.utc(message.guild.members.cache.get(member.user.id).joinedAt).format('dddd, MMMM Do, YYYY')} (${checkDays(message.guild.members.cache.get(member.user.id).joinedAt)})
    **❯ Highest Role:** ${member.roles.highest.id === message.guild.id ? 'None' : member.roles.highest.name}
    **❯ Hoist Role:** ${member.roles.hoist ? member.roles.hoist.name : 'None'}
    **❯ Roles [${roles.length}] :** ${roles.join(', ')}
    `)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp()

message.channel.send(embed);
    
}
}