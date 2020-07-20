const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
    config: {
    name: 'role',
    description: 'Manages user\'s roles',
    usage: `${prefix}role <option> <user> <role>`,
    category: 'mod',
    access: 'staff',
},

run: async (client, message, args) => {

    if (!message.member.hasPermission('MANAGE_ROLES')) return message.reply('You don\'t have permission to use this command.');
    if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.reply('I don\'t have permission to manage roles!');

    if (!args[0]) return message.reply('Please provide a valid option: `add` | `remove`')

    let roler = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
    if (!roler ) return message.reply('Please provide an user!')

    let role = message.guild.roles.cache.find(r => r.name === args.slice(2).join(' ')) || 'all'
    if (!role) return message.reply('Please provide a valid role!')

    if (args[0].toLowerCase() == 'add' || args[0].toLowerCase() == 'remove') {

        if (args[0].toLowerCase() === 'add') {

            roler.roles.add(role.id).then(() => {
                message.delete()
                message.channel.send(`Added role **${role.name}** to **${roler.user.tag}**.`)
            });
        };
        
            if (args[0].toLowerCase() === 'remove') {
        
                if (args[2].toLowerCase() == 'all') {
                    message.delete()
                    roler.roles.remove(roler.roles.cache).then(() => {
                        message.channel.send(`Removed all roles from **${roler.user.tag}**.`)
                    });
                    } else {
            
            roler.roles.remove(role.id).then(() => {
                message.delete()
                message.channel.send(`Removed role **${role.name}** from **${roler.user.tag}**.`)
            });
            };
        };

    } else {
        return message.reply('Please provide a valid option: `add` | `remove`')
    };

}
}