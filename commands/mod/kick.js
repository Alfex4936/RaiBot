const { prefix, ownerId } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const ms = require('ms');
const { stripIndents } = require('common-tags');

module.exports = {
    config: {
    name: 'kick',
    description: 'Kicks an user',
    usage: `${prefix}kick <user> [reason]`,
    category: 'mod',
    access: 'staff',
    aliases: ['k']
},

run: async (client, message, args) => {

    if (!message.member.hasPermission('KICK_MEMBERS')) return message.reply('You don\'t have permission to use this command.');
    if (!message.guild.me.hasPermission('KICK_MEMBERS')) return message.reply('I don\'t have permission to kick members!');

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.reply('Please provide an user!')
    if (member.id === message.author.id) return message.reply('You can\'t kick yourself!')
    if (member.id === ownerId) return message.reply('I can\'t do that, sorry!')

    const reason = args[1] || "No reason provided"

    member.kick().then(() => {
        message.delete()
        member.send(`You have been kicked from \`${message.guild.name}\`, reason: \`${reason}\`.`)

        const embed = new MessageEmbed()
        .setColor(colours.red)
        .setAuthor(`Kick`)
        .setTitle(member.author.tag)
        .setDescription(stripIndents`
        **❯ User:** ${member.user}
        **❯ Reason:** ${reason}
        **❯ Moderator:** ${message.author}
        `)
        .setFooter(`${message.guild.name} Mod-Logs`, message.guild.iconURL())
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()

let sChannel = message.guild.channels.cache.find(ch => ch.name === 'mod-logs');
sChannel.send(embed)
});
}
}