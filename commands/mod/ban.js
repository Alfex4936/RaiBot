const { prefix, ownerId } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./raibot.db', sqlite.OPEN_READWRITE);

module.exports = {
    config: {
    name: 'ban',
    description: 'Bans an user',
    usage: `${prefix}ban <user> [reason]`,
    category: 'mod',
    access: 'staff',
    aliases: ['b']
},

run: async (client, message, args) => {

    if (!message.member.hasPermission('BAN_MEMBERS')) return message.reply('You don\'t have permission to use this command.');
    if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.reply('I don\'t have permission to ban members!');

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return message.reply('Please provide an user!')
    if (member.id === message.author.id) return message.reply('You can\'t ban yourself!')
    if (member.id === ownerId) return message.reply('I can\'t do that, sorry!')

    const reason = args[1] || "No reason provided"

    let guildId = message.guild.id;
    let query = 'SELECT * FROM config WHERE guildid = ?';
    db.get(query, [guildId], (err, row) => {
      if (err) {
          console.log(err);
          return;
      } else {
          let channelName = row.channelname

    member.ban().then(() => {
        message.delete()
        member.send(`You have been banned in \`${message.guild.name}\`, reason: \`${reason}\`.`)

        const embed = new MessageEmbed()
        .setColor(colours.red)
        .setAuthor(`Ban`)
        .setTitle(member.user.tag)
        .setDescription(stripIndents`
        **❯ User:** ${member.user}
        **❯ Reason:** ${reason}
        **❯ Moderator:** ${message.author}
        `)
        .setFooter(`${message.guild.name} Mod-Logs`, message.guild.iconURL())
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()

let sChannel = message.guild.channels.cache.find(ch => ch.name === channelName);
sChannel.send(embed)
});
}
});
}
}