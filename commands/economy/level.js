const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./raibot.db', sqlite.OPEN_READWRITE);

module.exports = {
    config: {
    name: 'level',
    description: 'Displays user\'s level',
    usage: `${prefix}level [user]`,
    category: 'economy',
    access: 'everyone',
    aliases: ['lvl', 'xp']
},

run: async (client, message, args) => {

    if (!message.mentions.users.size) {
        let myUserId = message.author.id;
        let myUsername = message.author.tag;

        let query = 'SELECT * FROM xp WHERE userid = ?';
        db.get(query, [myUserId], (err, row) => {
          if (err) {
              console.log(err);
              return;
          }
          if (row === undefined) {
            let insertdata = db.prepare('INSERT INTO xp VALUES(?,?,?,?)');
            insertdata.run(myUsername, MyUserId, 0, 0)
            return;
          } else {
          let myCurrentXp = row.xp
          let myCurrentLvl = row.level
          let myNxtLvlXp = myCurrentLvl * 500;
          let myDifference = myNxtLvlXp - myCurrentXp;   

    message.reply(`You are level **${myCurrentLvl}** *(${myCurrentXp} XP)* and you need **${myDifference} XP** til next level up.`)
          }
        });
    } else {
        let user = message.mentions.users.first()
        let userid = user.id
        let username = user.tag

        let query = 'SELECT * FROM xp WHERE userid = ?';
        db.get(query, [userid], (err, row) => {
          if (err) {
              console.log(err);
              return;
          }
          if (row === undefined) {
            let insertdata = db.prepare('INSERT INTO xp VALUES(?,?,?,?)');
            insertdata.run(username, userid, 0, 0)
            return;
          } else {
          let currentXp = row.xp
          let currentLvl = row.level
          let nxtLvlXp = currentLvl * 500;
          let difference = nxtLvlXp - currentXp;   

    message.channel.send(`${user} is level **${currentLvl}** *(${currentXp} XP)* and needs **${difference} XP** til next level up.`)
          }
        });   
    }
}
}