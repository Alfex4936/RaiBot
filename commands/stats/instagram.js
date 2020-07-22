const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { stripIndents } = require('common-tags');

module.exports = {
    config: {
    name: 'instagram',
    description: 'Displays information about Instagram account',
    usage: `${prefix}instagram <username>`,
    category: 'stats',
    access: 'everyone',
    aliases: ['ig', 'insta', 'gram']
},

run: async (client, message, args) => {

    if (!args[0]) return message.reply('Please provide an username!')

    let url = `https://instagram.com/${args[0]}/?__a=1`
        
    let res; 

    try {
        res = await fetch(url).then(url => url.json())
    } catch (e) {
        return message.reply('I couldn\'t find that account!')
    }

    let account = res.graphql.user

    const embed = new MessageEmbed()
    .setColor(colours.default)
    .setAuthor('Instagram', 'https://i.imgur.com/M6yBwxS.png')
    .setTitle(account.username)
    .setDescription(stripIndents`
    **❯ Name:** ${account.full_name ? account.full_name : "None"}
    **❯ Bio:** ${account.biography.length == 0 ? "None" : account.biography}
    **❯ Posts:** ${account.edge_owner_to_timeline_media.count}
    **❯ Followers:** ${account.edge_followed_by.count}
    **❯ Following:** ${account.edge_follow.count}
    **❯ Private:** ${account.is_private ? 'Yes 🔒' : 'No 🔓'}
    `)
    .setURL(account.external_url_linkshimmed)
    .setThumbnail(account.profile_pic_url_hd)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()

    message.channel.send(embed)

}
}