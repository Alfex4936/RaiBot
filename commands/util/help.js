const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const { stripIndents } = require('common-tags');
const { contains, pad } = require('../../functions.js');

module.exports = {
    config: {
    name: 'help',
    description: 'Displays command list',
    usage: `${prefix}help [category | command]`,
    category: 'util',
    access: 'everyone',
    aliases: ['commands']
},

run: async (client, message, args) => {

    const ads = [
        `Do you have a suggestion? Found a bug? Feel free to join [my server](https://discord.gg/KD457qA)`, `Do you like my commands? [Add me to your server](https://discord.com/oauth2/authorize?client_id=668244314718994465&scope=bot&permissions=8)`,
        `I also have repository on [GitHub](https://discord.gg/KD457qA)`,
    ]

    const randomAd = ads[Math.floor(Math.random() * ads.length)];

    const embed = new MessageEmbed()
    .setAuthor(`${client.user.username} Help ✨`, client.user.displayAvatarURL())
    .setColor(colours.default)
    .setDescription(randomAd)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()

    if (!args[0]) {
        embed.addField('Command Categories', stripIndents`
        \`actions           :\` IRL stuff
        \`economy           :\` Simple economy system
        \`fun               :\` Mostly entertainment
        \`mod               :\` Moderate your server
        \`music             :\` plug.dj for Discord
        \`nsfw              :\` 18+ zone
        \`restricted        :\` Bot owner only
        \`stats             :\` Game and Social sites stats
        \`text              :\` Text manipulation
        \`util              :\` Useful utilities

        To view the commands inside a category use \`r!help <category>\`
        `)

return message.channel.send(embed)

    } else {
        const eEmbed = new MessageEmbed()
        const categories = ['actions', 'economy', 'fun', 'mod', 'music', 'nsfw', 'restricted', 'stats', 'text', 'util']

if (contains(args[0].toLowerCase(), categories)) {

            const dir = client.commands.filter(c => c.config.category === args[0].toLowerCase())
            const embed = new MessageEmbed()
            .setAuthor(`Commands in ${args[0].toLowerCase()}`, client.user.displayAvatarURL())
            .setColor(colours.default)
            .setDescription(dir.map(c => `\n\`${prefix}${pad(c.config.name, 18)}:\` ${c.config.description}`, true).join(' '))
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp()

return message.channel.send(embed)
}
}

let command = client.commands.get(args[0].toLowerCase())

if (command) {

command = command.config

const embed = new MessageEmbed()
.setAuthor(`Command Info`, client.user.displayAvatarURL())
.setTitle(`${prefix}${command.name}`)
.setColor(colours.default)
.addField(`General`, stripIndents`
**❯ Aliases:** ${command.aliases ? command.aliases.join(', ') : 'None'}
**❯ Category:** ${command.category}
**❯ Description:** ${command.description || 'No description provided'}
**❯ Usage:** ${command.usage || 'No usage'}
`)

.addField(`Accessibility`, stripIndents`
**❯ Access:** ${command.access}
**❯ NSFW:** ${command.nsfw ? 'Yes' : 'No'}
`)


.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
.setTimestamp()

return message.channel.send(embed)
}

}
}
