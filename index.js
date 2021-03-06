const { token, prefix } = require('./config.json');
const { Client, Collection, MessageEmbed } = require('discord.js');
const client = new Client()
const moment = require('moment');
const colours = require('./colours.json');
const { stripIndents } = require('common-tags');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./raibot.db', sqlite.OPEN_READWRITE);

client.login(token);

['commands', 'aliases'].forEach(x => client [x] = new Collection());
['console', 'command', 'event'].forEach(x => require(`./handlers/${x}`)(client))

client.on('guildCreate', guild => {
  console.log(`[${moment().format('LT')}] >>> Joined guild ${guild.name} with ${guild.memberCount} members.`)
});

client.on('guildDelete', guild => {
  console.log(`[${moment().format('LT')}] <<< Left guild ${guild.name} with ${guild.memberCount} members.`)
});

client.on('message', message => {

  console.log(`[${moment().format('LT')}] ${message.author.tag} ~ ${message.content}`)


  let username = message.author.tag;
  let userid = message.author.id;
  
  let msgQuery = 'SELECT * FROM messages WHERE userid = ?';
  db.get(msgQuery, [userid], (err, row) => {
    if (err) {
        console.log(err);
        return;
    }
    if (row === undefined) {
      let insertdata = db.prepare('INSERT INTO messages VALUES(?,?,?)');
      insertdata.run(username, userid, 1)
      return;
    } else {

      let currentMsg = row.global
      db.run('UPDATE messages SET global = ? WHERE userid = ?', [currentMsg + 1, userid])

    };
  });

  if (!message.author.bot) {

    let xpAdd = Math.floor(Math.random() * 8) + 10;
  
    let xpQuery = 'SELECT * FROM xp WHERE userid = ?';
    db.get(xpQuery, [userid], (err, row) => {
      if (err) {
          console.log(err);
          return;
      }
      if (row === undefined) {
        let insertdata = db.prepare('INSERT INTO xp VALUES(?,?,?,?,?)');
        insertdata.run(username, userid, 0, 0, 0)
        return;
      } else {

        let currentXp = row.xp;
        let currentLvl = row.level;
        let currentRank = row.rank;
        let nxtLvl = row.level * 500;

        db.run('UPDATE xp SET xp = ? WHERE userid = ?', [currentXp + xpAdd, userid])

        if (nxtLvl <= currentXp) {
          db.run('UPDATE xp SET level = ? WHERE userid = ?', [currentLvl + 1, userid])
          const lvlEmbed = new MessageEmbed()
          .setTitle(`Congrats, ${message.author.username}! You are now level ${currentLvl + 1}.`)
          .setColor(colours.white)
          message.channel.send(lvlEmbed)

          if ((currentLvl + 1).toString().endsWith('1')) {
            db.run('UPDATE xp SET rank = ? WHERE userid = ?', [currentRank + 1, userid])
            const rankEmbed = new MessageEmbed()
            .setTitle(`Congrats, ${message.author.username}! You are now rank ${currentRank + 1}.`)
            .setColor(colours.white)
            message.channel.send(rankEmbed)

          };
        };
      };
    });
  };

  if (!message.author.bot) {
    
    let coinAmt = Math.floor(Math.random() * 10) + 1;
    let baseAmt = Math.floor(Math.random() * 10) + 1;
  
    let coinsQuery = 'SELECT * FROM coins WHERE userid = ?';
    db.get(coinsQuery, [userid], (err, row) => {
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
        if (coinAmt === baseAmt) {
        db.run('UPDATE coins SET coins = ? WHERE userid = ?', [currentCoinAmt + coinAmt, userid])
        
        };
      };
    });
  };
});

const imEmbed = new MessageEmbed()
.setTitle('Thanks for inviting me! ❤️')
.setDescription(stripIndents`

To get started type \`${prefix}help\`.

❯ View commands inside category using \`${prefix}help <category>\`.
❯ View information about command using \`${prefix}help <command>\`.

❯ [Server](https://discord.gg/KD457qA)
❯ [Repository](https://github.com/Raiwex/RaiBot)

***Note:** This is self-hosted bot - it's not online 24/7.*
`)
.setColor(colours.default)

client.on('guildCreate', guild => {

  const generalChannel = guild.channels.cache.find(ch => ch.name === 'general');

  generalChannel.send(imEmbed)
  
  if (!generalChannel) {
    let defaultChannel = '';
    guild.channels.cache.forEach((channel) => {
      if (channel.type == 'text' && defaultChannel == '') {
        if (channel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
          defaultChannel = channel;
        };
      };
    });
  
  defaultChannel.send(imEmbed)

  };
});