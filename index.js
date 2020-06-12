const { token, prefix } = require('./config.json');
const { Client, Collection, MessageEmbed, MessageCollector } = require('discord.js');
const client = new Client()
const moment = require('moment');
const colours = require('./colours.json');
const { writeFile } = require('fs');
const { stripIndents } = require('common-tags');
const db = require('quick.db');

// Login

client.login(token);

// Events & Command Handler

['commands', 'aliases'].forEach(x => client [x] = new Collection());
['console', 'command', 'event'].forEach(x => require(`./handlers/${x}`)(client))

// Message Event

client.on('message', message => {

// Message Counter

db.add(`globalMessages_${message.author.id}`, 1)
db.add(`guildMessages_${message.guild.id}_${message.author.id}`, 1)

// Message Listener

console.log(`[${moment().format('LT')}] ${message.author.tag} | ${message.guild.name} ~ ${message.content}`)

// XP System

if (!message.author.bot) {

  let xpAdd = Math.floor(Math.random() * 8) + 10;
  
  db.add(`xp_${message.author.id}`, xpAdd)
  let curXp =  db.fetch(`xp_${message.author.id}`)
  let curLvl = db.fetch(`level_${message.author.id}`)
  let nxtLvl = db.fetch(`level_${message.author.id}`) * 500;
  
  if (nxtLvl <= db.fetch(`xp_${message.author.id}`)) {
    db.add(`level_${message.author.id}`, 1)
    const lvlEmbed = new MessageEmbed()
    .setTitle(`Congrats, ${message.author.username}! You are now level ${curLvl + 1}.`)
    .setColor(colours.lime)
    message.channel.send(lvlEmbed)
  }
}

// Coin System

if (!message.author.bot) {

  let coinAmt = Math.floor(Math.random() * 100) + 1;
  let baseAmt = Math.floor(Math.random() * 100) + 1;

  if (coinAmt === baseAmt) {
    db.add(`coins_${message.author.id}`, coinAmt / 2)
    message.channel.send(`Congrats, ${message.author}! **${coinAmt}** coins were added to your balance.`)
    };
  }
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