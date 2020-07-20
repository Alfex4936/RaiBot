const { prefix, ownerId } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./raibot.db', sqlite.OPEN_READWRITE);

module.exports = {
    config: {
    name: 'unban',
    description: 'Unbans an user',
    usage: `${prefix}unban <user-id> [reason]`,
    category: 'mod',
    access: 'staff',
    aliases: ['ub']
},

run: async (client, message, args) => {

    if (!message.member.hasPermission('BAN_MEMBERS')) return message.reply('You don\'t have permission to use this command.');
    if (!message.guild.me.hasPermission('BAN_MEMBERS')) return message.reply('I don\'t have permission to ban members!');

    const bannedMember = await client.users.fetch(args[0])
    if (!bannedMember) return message.reply('Please provide an user!')

    const reason = args[1] || "No reason provided"

    let guildId = message.guild.id;
    let query = 'SELECT * FROM config WHERE guildid = ?';
    db.get(query, [guildId], (err, row) => {
      if (err) {
          console.log(err);
          return;
      } else {
          let channelName = row.channelname

    message.guild.members.unban(bannedMember, {reason: reason}).then(() => {
        message.delete()
        bannedMember.send(`You have been unbanned in \`${message.guild.name}\`, reason: \`${reason}\`.`)

        const embed = new MessageEmbed()
        .setColor(colours.red)
        .setAuthor(`Unban`)
        .setTitle(bannedMember.tag)
        .setDescription(stripIndents`
        **❯ User:** ${bannedMember}
        **❯ Reason:** ${reason}
        **❯ Moderator:** ${message.author}
        `)
        .setFooter(`${message.guild.name} Mod-Logs`, message.guild.iconURL())
        .setThumbnail(bannedMember.displayAvatarURL())
        .setTimestamp()

let sChannel = message.guild.channels.cache.find(ch => ch.name === channelName);
sChannel.send(embed)
});
}
});
}
}