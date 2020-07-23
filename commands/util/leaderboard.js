const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./raibot.db', sqlite.OPEN_READWRITE);

module.exports = {
    config: {
    name: 'leaderboard',
    description: 'Displays top 10 users with the most coins / xp',
    usage: `${prefix}leaderboard <coins | xp>`,
    category: 'util',
    access: 'everyone',
    aliases: ['lb', 'top', 'top10', 'board']
},

run: async (client, message, args) => {

  if (!args[0]) return message.reply('Please provide a valid option! \`coins\` | \`xp\`')

    if (args[0].toLowerCase() === 'coins') {

      let query = 'SELECT * FROM coins ORDER BY coins DESC LIMIT 10';
      db.all(query, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }

        let i = 0;
        let content = '';

        for (let ci = 0; i < rows.length; i++) {
          let username = rows[i].username;
          let coins = rows[i].coins;

          content += `**${i+1}.** ${username} - **${coins} coins**\n`
        }

        const embed = new MessageEmbed()
        .setColor(colours.default)
        .setAuthor(`${client.user.username} Leaderboard`)
        .setTitle('💰 Coins')
        .setDescription(content)

        message.channel.send(embed)

      });

    }

    if (args[0].toLowerCase() === 'xp') {

      let query = 'SELECT * FROM xp ORDER BY xp DESC LIMIT 10';
      db.all(query, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }

        let i = 0;
        let content = '';

        for (let ci = 0; i < rows.length; i++) {
          let username = rows[i].username;
          let xp = rows[i].xp;
          let level = rows[i].level;
          let rank = rows[i].rank;

          content += `**${i+1}.** ${username} - **${xp} xp** | level ${level} | rank ${rank}\n`
        }

        const embed = new MessageEmbed()
        .setColor(colours.default)
        .setAuthor(`${client.user.username} Leaderboard`)
        .setTitle('✨ XP')
        .setDescription(content)

        message.channel.send(embed)

      });

    }

}
}