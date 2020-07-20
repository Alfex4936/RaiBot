const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./raibot.db', sqlite.OPEN_READWRITE);

module.exports = {
    config: {
    name: 'profile',
    description: 'Displays user\'s profile',
    usage: `${prefix}profile [user]`,
    category: 'utility',
    access: 'everyone',
    aliases: ['prf']
},

run: async (client, message, args) => {

  if (!message.mentions.users.size) {

    let myUserId = message.author.id;
    
    let myCoinsQuery = 'SELECT * FROM coins WHERE userid = ?';
    db.get(myCoinsQuery, [myUserId], (err, row) => {
      if (err) {
          console.log(err);
      }

      let myCoins = row.coins

      let myXpQuery = 'SELECT * FROM xp WHERE userid = ?';
      db.get(myXpQuery, [myUserId], (err, row) => {
        if (err) {
            console.log(err);
        }

        let myCurrentXp = row.xp
        let myCurrentLvl = row.level
        let myNxtLvlXp = myCurrentLvl * 500;
        let myDifference = myNxtLvlXp - myCurrentXp;

        let myMsgQuery = 'SELECT * FROM messages WHERE userid = ?';
        db.get(myMsgQuery, [myUserId], (err, row) => {
          if (err) {
              console.log(err);
          }

          let myMessagesSentGlobal = row.global

          const embed = new MessageEmbed()
          .setColor(colours.default)
          .setAuthor('Your profile', message.author.displayAvatarURL())
          .setDescription(stripIndents`
          **❯ Level:** ${myCurrentLvl}
          **❯ Next Level:** ${myDifference} XP needed
          **❯ XP:** ${myCurrentXp}
          **❯ Coins:** ${myCoins}
          **❯ Messages Sent Globally:** ${myMessagesSentGlobal}
          `)
          .setThumbnail(message.author.displayAvatarURL())
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
          .setTimestamp()
      
          message.channel.send(embed);

        });
      });
    });

  } else {

    let user = message.mentions.users.first();
    let userid = message.author.id;
    
    let coinsQuery = 'SELECT * FROM coins WHERE userid = ?';
    db.get(coinsQuery, [userid], (err, row) => {
      if (err) {
          console.log(err);
      }

      let coins = row.coins

      let xpQuery = 'SELECT * FROM xp WHERE userid = ?';
      db.get(xpQuery, [userid], (err, row) => {
        if (err) {
            console.log(err);
        }

        let currentXp = row.xp
        let currentLvl = row.level
        let nxtLvlXp = currentLvl * 500;
        let difference = nxtLvlXp - currentXp;

        let msgQuery = 'SELECT * FROM messages WHERE userid = ?';
        db.get(msgQuery, [userid], (err, row) => {
          if (err) {
              console.log(err);
          }

          let messagesSentGlobal = row.global

          const embed = new MessageEmbed()
          .setColor(colours.default)
          .setAuthor(`${user.username}'s Profile`, message.author.displayAvatarURL())
          .setDescription(stripIndents`
          **❯ Level:** ${currentLvl}
          **❯ Next Level:** ${difference} XP needed
          **❯ XP:** ${currentXp}
          **❯ Coins:** ${coins}
          **❯ Messages Sent Globally:** ${messagesSentGlobal}
          `)
          .setThumbnail(message.author.displayAvatarURL())
          .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
          .setTimestamp()
  
          message.channel.send(embed);
    
        });
      });
    });
  };

}
}