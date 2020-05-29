const { prefix } = require('../../botconfig.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const { Utils } = require('erela.js');

module.exports = {
    config: {
    name: 'queue',
    description: 'Displays current queue',
    usage: `${prefix}queue`,
    category: 'music',
    access: 'everyone',
    aliases: ['q']
},

run: async (client, message, args) => {
    const player = client.music.players.get(message.guild.id);
    if (!player) {
      return message.channel.send({
        embed: {
          description: 'No song/s currently playing in this server.',

        },
      }).catch((err) => message.channel.send(err.message));
    }
    const { title, requester, uri } = player.queue[0];

    const { queue } = player;

    if (player.queue.length < 1) return message.channel.send('No song/s currently playing in this server.');

    if (!player.queue[1]) {
      return message.channel.send('', {
        embed: {
          description: `🎧 Now Playing:\n[${title}](${uri}) [<@${requester.id}>]`,
          author: {
            name: `${message.guild.name}'s Queue`,
            icon_url: message.guild.iconURL,
          },
          color: 3447003,
        },
      });
    }

    let x;
    if (args > 1) {
      x = Math.floor(args) * 10 + 1;
    } else {
      x = Math.floor(11);
    }
    let i;
    if (args > 1) {
      i = x - 11;
    } else {
      i = 0;
    }
    let queuelist = player.queue.slice(x - 10, x).map(() => `**${++i}.** [${queue[i].title}](${queue[i].uri}) [<@${queue[i].requester.id}>]`).join('\n');
    if (!queuelist) return message.channel.send('Page doesn\'t exist!');
    const embed = new MessageEmbed();
    embed.setDescription(`🎧 Now Playing:\n [${title}](${uri}) [<@${requester.id}>]\n__Up Next__:\n${queuelist}`);
    embed.setThumbnail('https://upload.wikimedia.org/wikipedia/commons/7/73/YouTube_Music.png');
    embed.setAuthor(`${message.guild.name}'s Queue (${Math.floor(x / 10)} / ${Math.floor((player.queue.slice(1).length + 10) / 10)})`);
    embed.setFooter(`Total items in queue: ${player.queue.length}`);
    message.channel.send(embed).then(async (msg) => {
      if (Math.floor((player.queue.slice(1).length + 10) / 10) > 1) {
        await msg.react('⏪');
        await msg.react('◀');
        await msg.react('🟣');
        await msg.react('▶');
        await msg.react('⏩');
        const pages = Math.floor((player.queue.slice(1).length + 10) / 10);
        let page = Math.floor(x / 10);
        const back = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id, { time: 60000 });
        const doubleback = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id, { time: 60000 });
        const doubleforwad = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '⏩' && user.id === message.author.id, { time: 60000 });
        const forwad = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id, { time: 60000 });
        const middle = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '🟣' && user.id === message.author.id, { time: 60000 });
        msg.delete({ timeout: 60000 });
        back.on('collect', async (r) => {
          if (page === 1) return r.users.remove(message.author);
          await r.users.remove(message.author);
          await page--;
          x = Math.floor(page) * 10 + 1;
          i = x - 11;
          queuelist = player.queue.slice(x - 10, x).map(() => `**${++i}.** [${queue[i].title}](${queue[i].uri}) [<@${queue[i].requester.id}>]`).join('\n');
          embed.setDescription(`🎧 Now Playing:\n [${title}](${uri}) [<@${requester.id}>]\n__Up Next__:\n${queuelist}`);
          embed.setAuthor(`${message.guild.name}'s Queue (${page} / ${pages})`);
          msg.edit(embed);
        });
        forwad.on('collect', async (r) => {
          if (page === pages) return r.users.remove(message.author);
          await r.users.remove(message.author);
          await page++;
          x = Math.floor(page) * 10 + 1;
          i = x - 11;
          queuelist = player.queue.slice(x - 10, x).map(() => `**${++i}.** [${queue[i].title}](${queue[i].uri}) [<@${queue[i].requester.id}>]`).join('\n');
          embed.setDescription(`🎧 Now Playing:\n [${title}](${uri}) [<@${requester.id}>]\n__Up Next__:\n${queuelist}`);
          embed.setAuthor(`${message.guild.name}'s Queue (${page} / ${pages})`);
          msg.edit(embed);
        });
        doubleback.on('collect', async (r) => {
          if (page === 1) return r.users.remove(message.author);
          await r.users.remove(message.author);
          page = 1;
          x = Math.floor(page) * 10 + 1;
          i = x - 11;
          queuelist = player.queue.slice(x - 10, x).map(() => `**${++i}.** [${queue[i].title}](${queue[i].uri}) [<@${queue[i].requester.id}>]`).join('\n');
          embed.setDescription(`🎧 Now Playing:\n [${title}](${uri}) [<@${requester.id}>]\n__Up Next__:\n${queuelist}`);
          embed.setAuthor(`${message.guild.name}'s Queue (${page} / ${pages})`);
          msg.edit(embed);
        });
        doubleforwad.on('collect', async (r) => {
          if (page === pages) return r.users.remove(message.author);
          await r.users.remove(message.author);
          page = pages;
          x = Math.floor(page) * 10 + 1;
          i = x - 11;
          queuelist = player.queue.slice(x - 10, x).map(() => `**${++i}.** [${queue[i].title}](${queue[i].uri}) [<@${queue[i].requester.id}>]`).join('\n');
          embed.setDescription(`🎧 Now Playing:\n [${title}](${uri}) [<@${requester.id}>]\n__Up Next__:\n${queuelist}`);
          embed.setAuthor(`${message.guild.name}'s Queue (${page} / ${pages})`);
          msg.edit(embed);
        });
        middle.on('collect', async (r) => r.users.remove(message.author));
      }
    });
  },
};
