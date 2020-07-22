const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    config: {
    name: 'meme',
    description: 'Shows you an epic meme',
    usage: `${prefix}meme`,
    category: 'fun',
    access: 'everyone',
    aliases: ['m']
},

run: async (client, message, args) => {

    const subReddits = [
        'memes', 'me_irl'
    ]

    const randomSub = subReddits[Math.floor(Math.random() * subReddits.length)];

    let msg = await message.channel.send('Fetching image...')

    const res = await fetch(
      `https://www.reddit.com/r/${randomSub}.json?sort=top&t=week`
    );
    const { data } = await res.json();

    const safe = message.channel.nsfw ? data.children : data.children.filter((post) => !post.data.over_18);
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