const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const { Utils } = require('erela.js');

module.exports = {
    config: {
    name: 'skip',
    description: 'Skips the song currently playing',
    usage: `${prefix}skip`,
    category: 'music',
    access: 'everyone',
    aliases: ['next']
},

run: async (client, message, args) => {

    const { channel } = message.member.voice;
    const player = client.music.players.get(message.guild.id);

    if (channel && channel.id !== player.voiceChannel.id) return message.reply('You need to be in a voice channel to make me leave!');
    if (!player) return message.channel.send('No song/s currently playing in this server.');

    player.stop()
    return message.channel.send('⏭ Successfully skipped the current song.')

}
}