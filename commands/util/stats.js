const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const Discord = require('discord.js');
const moment = require('moment');
const { version } = require('../../package.json');
const { readdirSync } = require('fs');
const { stripIndents } = require('common-tags');
const { duration } = require('../../functions.js');

module.exports = {
    config: {
    name: 'stats',
    description: 'Displays bot\'s stats',
    usage: `${prefix}stats`,
    category: 'util',
    access: 'everyone'
},

run: async (client, message, args) => {

    const categories = readdirSync('./commands/')

    const embed = new Discord.MessageEmbed()
    .setAuthor(`Stats`, client.user.displayAvatarURL())
    .setColor(colours.default)
    .addField('General', stripIndents`
    **❯ Uptime:** ${duration(client.uptime)}
    **❯ Memory Usage:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB
    `)

    .addField('Versions', stripIndents`
    **❯ Bot:** ${version}
    **❯ Discord.js:** ${Discord.version}
    **❯ Node:** ${process.version}
    `)

    .addField('Stats', stripIndents`
    **❯ Server Count:** ${client.guilds.cache.size}
    **❯ User Count:** ${client.users.cache.size}
    **❯ Channel Count:** ${client.channels.cache.size}
    **❯ Category Count:** ${categories.length}
    **❯ Command Count:** ${client.commands.size}
    `)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()

message.channel.send(embed);
    
}
}