const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./raibot.db', sqlite.OPEN_READWRITE);

module.exports = {
    config: {
    name: 'logs',
    description: 'Sets modlogs channel',
    usage: `${prefix}logs`,
    category: 'config',
    access: 'everyone',
    aliases: ['log', 'modlogs']
},

run: async (client, message, args) => {

    if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('You don\'t have permission to use this command.');
    if (!message.guild.me.hasPermission('ADMINISTRATOR')) return message.reply('I don\'t have permission to execute this command!');

    let guildName = message.guild.name;
    let guildId = message.guild.id;
    let channelName = message.channel.name;
    let channelId = message.channel.id;
    let query = 'SELECT * FROM config WHERE guildid = ?';
    db.get(query, [guildId], (err, row) => {
      if (err) {
          console.log(err);
          return;
      }
      if (row === undefined) {
        let insertdata = db.prepare('INSERT INTO config VALUES(?,?,?,?,?)');
        insertdata.run(guildName, guildId, channelName, channelId, 'mod-logs')
        message.channel.send(`Successfully set **#${message.channel.name}** as mod-logs channel.`);
        return;
      } else {
    db.run('UPDATE config SET guildname = ?, channelname = ?, channelid = ?, type = ? WHERE guildid = ?', [guildName, channelName, channelId, 'mod-logs', guildId])

message.channel.send(`Successfully set **#${message.channel.name}** as mod-logs channel.`);
      }
});

}
}