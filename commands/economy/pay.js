const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./raibot.db', sqlite.OPEN_READWRITE);

module.exports = {
    config: {
    name: 'pay',
    description: 'Allows you to make a payment',
    usage: `${prefix}pay <user> <amount>`,
    category: 'economy',
    access: 'everyone',
    aliases: ['give']
},

run: async (client, message, args) => {

    let amount = Number(args[1]);

    if (!message.mentions.users.first()) return message.reply('Please provide an user!')
    if (!amount) return message.reply('Please provide an amount of coins!')

    let myUserId = message.author.id;
    let myUsername = message.author.tag;
    let pUser = message.mentions.users.first()
    let pUserId = pUser.id
    let pUsername = pUser.tag

    let query = 'SELECT * FROM coins WHERE userid = ?';
    db.get(query, [myUserId], (err, row) => {
      if (err) {
          console.log(err);
      }

      let myCoins = row.coins

      db.get(query, [pUserId], (err, row) => {
        if (err) {
            console.log(err);
        }

        let pCoins = row.coins

        if (!myCoins) return message.reply('You don\'t have any coins!')
        if (myCoins < args[0]) return message.reply('Not enough coins there!')
    
        db.run('UPDATE coins SET coins = ? WHERE userid = ?', [myCoins - amount, myUserId])
        db.run('UPDATE coins SET coins = ? WHERE userid = ?', [pCoins + amount, pUserId])
    
        message.channel.send(`${message.author} has given ${pUser} **${amount}** coins.`);
        
      });
    });

}
}