const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./raibot.db', sqlite.OPEN_READWRITE);

module.exports = {
    config: {
    name: 'balance',
    description: 'Displays user\'s balance',
    usage: `${prefix}balance [user]`,
    category: 'economy',
    access: 'everyone',
    aliases: ['bal']
},

run: async (client, message, args) => {

    if (!message.mentions.users.size) {
      let myUserId = message.author.id;
      let myUsername = message.author.tag;
      let query = 'SELECT * FROM coins WHERE userid = ?';
      db.get(query, [myUserId], (err, row) => {
        if (err) {
            console.log(err);
            return;
        }
        if (row === undefined) {
          let insertdata = db.prepare('INSERT INTO coins VALUES(?,?,?)');
          insertdata.run(myUsername, MyUserId, 0)
          return;
        } else {
        let myCoins = row.coins
    
    if (myCoins === null) myCoins = 0;

message.reply(`You have **${myCoins}** coins.`)
        }
        });
    } else {
      let user = message.mentions.users.first()
      let userid = user.id
      let username = user.tag

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
        let coins = row.coins
    
    if (coins === null) coins = 0;

message.channel.send(`${user} has **${coins}** coins.`)
        }
      });
    }
}
}