const { prefix, ownerId } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const ms = require('ms');
const { stripIndents } = require('common-tags');

module.exports = {
    config: {
    name: 'unmute',
    description: 'Unmutes an user',
    usage: `${prefix}unmute <user> [reason]`,
    category: 'mod',
    access: 'staff',
    aliases: ['um']
},

run: async (client, message, args) => {

    if (!message.member.hasPermission('MANAGE_ROLES')) return message.reply('You don\'t have permission to use this command.');
    if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.reply('I don\'t have permission to manage roles!');

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.reply('Please provide an user!')

    const reason = args[2] || "No reason provided"

    let muteRole = message.guild.roles.cache.find(r => r.name === "Muted")

    await member.roles.remove(muteRole.id).then(() => {
        message.delete()
        member.send(`You have been unmuted in \`${message.guild.name}\`, reason: \`${reason}\`.`)

        setTimeout(() => {
        member.roles.remove(muteRole.id);
        const embed = new MessageEmbed()
        .setColor(colours.green)
        .setAuthor(`Mute End`)
        .setTitle(member.user.tag)
        .setDescription(stripIndents`
        **❯ User:** ${member.user}
        **❯ Time:** ${args[1]}
        **❯ Reason:** ${reason}
        **❯ Moderator:** ${message.author}
        `)
        .setFooter(`${message.guild.name} Mod-Logs`, message.guild.iconURL())
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()

let sChannel = message.guild.channels.cache.find(ch => ch.name === 'mod-logs');
sChannel.send(embed)
})
})
}
}