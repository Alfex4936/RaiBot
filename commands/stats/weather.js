const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const weather = require('weather-js');
const { stripIndents } = require('common-tags');

module.exports = {
    config: {
    name: 'weather',
    description: 'Displays current weather',
    usage: `${prefix}weather <location> <degree type>`,
    category: 'stats',
    access: 'everyone'
},

run: async (client, message, args) => {

    if (!args[0]) return message.reply('Please provide a valid location!')

    if (args[1] === 'C' || args[1] === 'F') {

        weather.find({search: args.slice(0).join(' '), degreeType: args[1]}, function(err, result) {
            if (!args[0]) return message.reply('Please provide a valid location!')
            if (result === undefined || result.length === 0) return message.reply('Please provide a valid location!')
    
            let current = result[0].current;
            let location = result[0].location;
    
        let colour = {
            'Partly Sunny': colours.yellow,
            'Sunny': colours.yellow,
            'Cloudy': colours.blue,
            'Mostly Sunny': colours.yellow,
            'Mostly Cloudy': colours.blue,
            'Clear': colours.white,
        };
    
        const embed = new MessageEmbed()
        .setColor(colour[current.skytext])
        .setAuthor(`Weather`)
        .setTitle(current.observationpoint)
        .setDescription(current.skytext)
        .setThumbnail(current.imageUrl)
        .setDescription(stripIndents`
        **❯ Temperature:** ${current.temperature}°${args[1]}
        **❯ Feels Like:** ${current.feelslike}°${args[1]}
        **❯ Timezone:** UTC${location.timezone}
        **❯ Humidity:** ${current.humidity}%
        **❯ Winds:** ${current.winddisplay}
        `)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()

        message.channel.send(embed).catch(e => message.reply(`Error: ${e.message}`))

    });
    } else {
        return message.reply('Please provide a valid degree type: `C` | `F`')
    }

}
}