const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const { Utils } = require('erela.js');

module.exports = {
    config: {
    name: 'loop',
    description: 'Makes the song play in loop',
    usage: `${prefix}loop`,
    category: 'music',
    access: 'everyone',
    aliases: ['repeat']
},

run: async (client, message, args) => {

    const { channel } = message.member.voice;
    const player = client.music.players.get(message.guild.id);
    let previousState = player.trackRepeat;

    if (channel && channel.id !== player.voiceChannel.id) return message.reply('You need to be in a voice channel!');
    if (!player) return message.channel.send('No song/s currently playing in this server.');

    player.setTrackRepeat(!previousState);
    if(!previousState) {
    message.channel.send('🔁 Loop Mode **ON**.')
    } else {
    message.channel.send('🔁 Loop Mode **OFF**.')
    }

}
}