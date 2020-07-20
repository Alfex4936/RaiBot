const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const { Utils } = require('erela.js');

module.exports = {
    config: {
    name: 'shuffle',
    description: 'Shuffles the queue',
    usage: `${prefix}shuffle`,
    category: 'music',
    access: 'everyone'
},

run: async (client, message, args) => {

  const { channel } = message.member.voice;
  const player = client.music.players.get(message.guild.id);

  if (channel && channel.id !== player.voiceChannel.id) return message.reply('You need to be in a voice channel!');
  if (!player) return message.channel.send('No song/s currently playing in this server.');

  player.queue.shuffle();
  return message.channel.send('🔀 Queue is now shuffled.')
 
}
}