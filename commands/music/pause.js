const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const { Utils } = require('erela.js');

module.exports = {
    config: {
    name: 'pause',
    description: 'Pauses / resumes the music',
    usage: `${prefix}pause`,
    category: 'music',
    access: 'everyone',
    aliases: ['resume']
},

run: async (client, message, args) => {

    const { channel } = message.member.voice;
    const player = client.music.players.get(message.guild.id);

    if (channel && channel.id !== player.voiceChannel.id) return message.reply('You need to be in a voice channel!');
    if (!player) return message.channel.send('No song/s currently playing in this server.');

    let emojis = {
        true: '▶️',
        false: '⏸️'
    }

    player.pause(player.playing);
    return message.channel.send(`${emojis[player.playing]} Successfully **${player.playing ? 'resumed' : 'paused'}** the music.`)

}
}