const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
    config: {
    name: 'purge',
    description: 'Bulk deletes messages',
    usage: `${prefix}purge <amount>`,
    category: 'mod',
    access: 'staff',
    aliases: ['clear']
},

run: async (client, message, args) => {

    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('You don\'t have permission to use this command.');
    if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) return message.reply('I don\'t have permission to delete messages!')

    if (isNaN(args[0])) return message.reply('Please input a valid number.')
    if (args[0] > 100) return message.reply('You can only purge maximum of 100 messages at a time.')

    message.channel.bulkDelete(args[0]).then(messages => message.channel.send(`**Successfully deleted ${messages.size} of ${args[0]} messages**`).then(message => {
        (message.delete({ timeout: 2000}))

      })).catch(error => {
        message.reply(error.message.replace('bulk delete', 'purge'))
    });

}
}