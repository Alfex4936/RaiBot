const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    config: {
    name: 'boobs',
    description: 'Shows some boobs',
    usage: `${prefix}boobs`,
    category: 'nsfw',
    access: 'everyone',
    aliases: ['tits'],
    nsfw: true
},

run: async (client, message, args) => {

    if (!message.channel.nsfw) return message.reply('This isn\'t NSFW channel!')

    const subReddits = [
        'boobies', 'boobs', 'tits', 'cleavage', 'TinyTits'
    ]

    const randomSub = subReddits[Math.floor(Math.random() * subReddits.length)];

    let msg = await message.channel.send('Fetching image...')

    const res = await fetch(
      `https://www.reddit.com/r/${randomSub}.json?sort=top&t=week`
    );
    const { data } = await res.json();

    const safe = message.channel.nsfw ? data.children : data.children.filter((post) => post.data.is_video = false);
    if (!safe.length) return message.channel.send('I couldn\'t fetch the image!')

    const post = safe[Math.floor(Math.random() * safe.length)];

    const embed = new MessageEmbed()
    .setColor(colours.blue)
    .setTitle(`${post.data.title}`)
    .setDescription(`👍 ${post.data.ups} | 💬 ${post.data.num_comments}`)
    .setImage(post.data.url)
    .setURL(`https://www.reddit.com${post.data.permalink}`)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()
    
    message.channel.send(embed).then(sentEmbed => {
        sentEmbed.react('⬆️')
        sentEmbed.react('⬇️')
    })
    msg.delete()

}
}