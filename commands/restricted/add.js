const { prefix, ownerId } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./raibot.db', sqlite.OPEN_READWRITE);

module.exports = {
    config: {
    name: 'add',
    description: 'Adds coins to user\'s balance',
    usage: `${prefix}add <user> <amount>`,
    category: 'restricted',
    access: 'restricted',
    aliases: ['ac']
},

run: async (client, message, args) => {

  let pUser = message.mentions.users.first();
  let username = pUser.tag;
  let userid = pUser.id;

  const amount = Number(args[1])

  if (message.author.id != ownerId) return message.reply('You don\'t have permission to use this command.')

    let query = 'SELECT * FROM coins WHERE userid = ?';
    db.get(query, [userid], (err, row) => {
      if (err) {
          console.log(err);
          return;
      }
      if (row === undefined) {
        let insertdata = db.prepare('INSERT INTO coins VALUES(?,?,?)');
        insertdata.run(username, userid, 0)
        return;
      } else {
        let currentCoinAmt = row.coins
          db.run('UPDATE coins SET coins = ? WHERE userid = ?', [currentCoinAmt + amount, userid])
          };

  })

  message.delete()
  message.channel.send(`Added **${amount}** coins to ${pUser}.`)
}
}