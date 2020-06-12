const { prefix, ownerId } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const ms = require('ms');
const { stripIndents } = require('common-tags');

module.exports = {
    config: {
    name: 'mute',
    description: 'Mutes an user',
    usage: `${prefix}mute <user> <time> [reason]`,
    category: 'mod',
    access: 'staff',
    aliases: ['m']
},

run: async (client, message, args) => {

    if (!message.member.hasPermission('MANAGE_ROLES')) return message.reply('You don\'t have permission to use this command.');
    if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.reply('I don\'t have permission to manage roles!');

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.reply('Please provide an user!')
    if (member.id === message.author.id) return message.reply('You can\'t mute yourself!')
    if (member.id === ownerId) return message.reply('I can\'t do that, sorry!')

    if (!args[1]) return message.reply('Please provide a time! \n\`10s\` = 10 seconds, \n\`10m\` = 10 minutes, \n\`10h\` = 10 hours, \n\`10d\` = 10 days');

    const time = ms(args[1])
    if (!time) return message.reply('Please provide a valid time! \n\`10s\` = 10 seconds, \n\`10m\` = 10 minutes, \n\`10h\` = 10 hours, \n\`10d\` = 10 days');

    const reason = args[2] || "No reason provided"

            let muteRole = message.guild.roles.cache.find(r => r.name === "Muted")
            if (!muteRole) {
            try {
                muteRole = await message.guild.roles.create({
                    data:  {
                    name: "Muted",
                    color: "#514f48",
                    permissions: []
                }
            });
            }   catch(e) {
                    console.log(e.stack);
            }
        }
    
        await message.guild.channels.cache.forEach(async (channel, id) => {
          await channel.updateOverwrite(muteRole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
            SEND_TTS_MESSAGES: false,
            ATTACH_FILES: false,
            SPEAK: false
        })
        });

    await member.roles.add(muteRole.id).then(() => {
        message.delete()
        member.send(`You have been muted in \`${message.guild.name}\` for \`${args[1]}\`, reason: \`${reason}\`.`)

        setTimeout(() => {
        member.roles.remove(muteRole.id);
        const eEmbed = new MessageEmbed()
        .setColor(colours.green)
        .setAuthor(`Mute End`)
        .setTitle(member.user.tag)
        .setDescription(stripIndents`
        **❯ User:** ${member.user}
        **❯ Time:** ${args[1]}
        **❯ Reason:** ${reason}
        **❯ Moderator:** ${client.user}
        `)
        .setFooter(`${message.guild.name} Mod-Logs`, message.guild.iconURL())
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()

let sChannel = message.guild.channels.cache.find(ch => ch.name === 'mod-logs');
sChannel.send(eEmbed)
    }, time)

const embed = new MessageEmbed()
.setColor(colours.orange)
.setAuthor(`Mute`)
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
});
}
}