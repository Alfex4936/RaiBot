const { token, prefix } = require('./config.json');
const { Client, Collection, MessageEmbed } = require('discord.js');
const client = new Client()
const moment = require('moment');
const colours = require('./colours.json');
const { stripIndents } = require('common-tags');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./raibot.db', sqlite.OPEN_READWRITE);

// Login

client.login(token);

// Events & Command Handler

['commands', 'aliases'].forEach(x => client [x] = new Collection());
['console', 'command', 'event'].forEach(x => require(`./handlers/${x}`)(client))

// Message Event

client.on('message', message => {

// Message Counter

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
    }

// XP System

if (!message.author.bot) {

  let xpAdd = Math.floor(Math.random() * 8) + 10;

  let xpQuery = 'SELECT * FROM xp WHERE userid = ?';
  db.get(xpQuery, [userid], (err, row) => {
    if (err) {
        console.log(err);
        return;
    }
    if (row === undefined) {
      let insertdata = db.prepare('INSERT INTO xp VALUES(?,?,?,?)');
      insertdata.run(username, userid, 1, 1)
      return;
    } else {
      let currentXp = row.xp
      let currentLvl = row.level
      let nxtLvl = row.level * 500;
      db.run('UPDATE xp SET xp = ? WHERE userid = ?', [currentXp + xpAdd, userid])

      if (nxtLvl <= currentXp) {
        db.run('UPDATE xp SET level = ? WHERE userid = ?', [currentLvl + 1, userid])
        const lvlEmbed = new MessageEmbed()
        .setTitle(`Congrats, ${message.author.username}! You are now level ${currentLvl + 1}.`)
        .setColor(colours.lime)
        message.channel.send(lvlEmbed)
      }
}
})
}

// Coin System

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
        }
}
})
}
});

// Message Listener

console.log(`[${moment().format('LT')}] ${message.author.tag} | ${message.guild.name} ~ ${message.content}`)

});

// Invite Message

  const imEmbed = new MessageEmbed()
  .setDescription(stripIndents`
  Thanks for inviting me! ❤️

  To get started type \`${prefix}help\`.

  ❯ View commands inside category using \`${prefix}help <category>\`.
  ❯ View information about command using \`${prefix}help <command>\`.
  ❯ Setup all required text channels using \`${prefix}setup\`. *To remove these channels, trigger the command again.*

  ★ [Server](https://discord.gg/KD457qA)
  ★ [Repository](https://github.com/Raiwex/RaiBot)
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
    }
  }
})

defaultChannel.send(imEmbed)
  }
})

// Setup

client.on('message', message => {

  if (message.content === `${prefix}setup`) {
    if (!message.member.hasPermission('MANAGE_CHANNELS', 'ADMINISTRATOR') || !message.guild.owner) return message.channel.send('You do not have permission to use this command.');
    if (!message.guild.me.hasPermission(['MANAGE_CHANNELS', 'ADMINISTRATOR'])) return message.channel.send('I do not have permission to create channels!')

    const mlChannel = message.guild.channels.cache.find(ch => ch.name === 'mod-logs');
    const fgChannel = message.guild.channels.cache.find(ch => ch.name === 'free-games');

    const filter = m => m.author.id === message.author.id;

    message.reply('**Are you sure you want to initiate setup?** Type **\'Yes\'** to confirm.\nYou have 5 seconds to reply.')
    .then(() => {
        message.channel.awaitMessages(filter, {
          max: 1,
          time: 5000,
          errors: ['time'],
      }).then((collected) => {
        if (collected.first().content.toLowerCase() === 'yes') {

    message.channel.send(`Setup initiated by **${message.author}**`)
    message.channel.send(`Setting up...**`).then(m => {

    let ping = m.createdTimestamp - message.createdTimestamp

    if (!mlChannel || !fgChannel) {

            message.guild.channels.create('mod-logs', { type: 'text',
        permissionOverwrites: [
            {
                id: message.channel.guild.roles.everyone,
                deny: ['SEND_MESSAGES', 'ADD_REACTIONS', 'SEND_TTS_MESSAGES', 'ATTACH_FILES'],
            },
        ],
    });
                message.guild.channels.create('free-games', { type: 'text',
        permissionOverwrites: [
            {
                id: message.channel.guild.roles.everyone,
                deny: ['SEND_MESSAGES', 'ADD_REACTIONS', 'SEND_TTS_MESSAGES', 'ATTACH_FILES'],
            },
        ],
    });

m.edit(`Setup completed in **${ping}ms**`)

} else {
    mlChannel.delete();
    fgChannel.delete();

m.edit(`De-setup completed in **${ping}ms**`)
}
})
}
if (collected.first().content.toLowerCase() !== 'yes') {
    message.channel.send('Setup cancelled - Your reply was wrong!')
}
}).catch(() => {
    message.channel.send('Setup cancelled - You were too slow!')
});

})
  }
  })