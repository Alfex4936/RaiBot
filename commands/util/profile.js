const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const { stripIndents } = require('common-tags');

module.exports = {
    config: {
    name: 'profile',
    description: 'Displays user\'s profile',
    usage: `${prefix}profile [user]`,
    category: 'utility',
    access: 'everyone',
    aliases: ['prf']
},

run: async (client, message, args) => {

    let user = message.mentions.users.first()

    if (!message.mentions.users.size) {

        let myLevel = await db.fetch(`level_${message.author.id}`)
        if (myLevel === null) myLevel = 0;
    
        let myXp = await db.fetch(`xp_${message.author.id}`)
        if (myXp === null) myXp = 0;
    
        let myCoins = await db.fetch(`coins_${message.author.id}`)
        if (myCoins === null) myCoins = 0;
    
        let myNxtLvlXp = myLevel * 500;
        let myDifference = myNxtLvlXp - myXp;
    
        let myMessagesSentGlobal = await db.fetch(`globalMessages_${message.author.id}`)
        if (myMessagesSentGlobal === null) myMessagesSentGlobal = 0;
        let myMessagesSentGuild = await db.fetch(`guildMessages_${message.guild.id}_${message.author.id}`)
        if (myMessagesSentGuild === null) myMessagesSentGuild = 0;
        
        const embed = new MessageEmbed()
        .setColor(colours.default)
        .setAuthor('Your profile', message.author.displayAvatarURL())
        .setDescription(stripIndents`
        **❯ Level:** ${myLevel}
        **❯ Next Level:** ${myDifference} XP needed
        **❯ XP:** ${myXp}
        **❯ Coins:** ${myCoins}
        **❯ Messages Sent (GLOBAL):** ${myMessagesSentGlobal}
        **❯ Messages Sent (GUILD):** ${myMessagesSentGuild}
        `)
        .setThumbnail(message.author.displayAvatarURL())
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
        .setTimestamp()
    
    message.channel.send(embed)
        } else {

    let level = await db.fetch(`level_${user.id}`)
    if (level === null) level = 0;

    let xp = await db.fetch(`xp_${user.id}`)
    if (xp === null) xp = 0;

    let coins = await db.fetch(`coins_${user.id}`)
    if (coins === null) coins = 0;

    let nxtLvlXp = level * 500;
    let difference = nxtLvlXp - xp;

    let messagesSentGlobal = await db.fetch(`globalMessages_${user.id}`)
    if (messagesSentGlobal === null) messagesSentGlobal = 0;
    let messagesSentGuild = await db.fetch(`guildMessages_${message.guild.id}_${user.id}`)
    if (messagesSentGuild === null) messagesSentGuild = 0;

    const embed = new MessageEmbed()
    .setColor(colours.default)
    .setAuthor(`${user.username}'s Profile`, user.displayAvatarURL())
    .setDescription(stripIndents`
    **❯ Level:** ${level}
    **❯ Next Level:** ${difference} XP needed
    **❯ XP:** ${xp}
    **❯ Coins:** ${coins}
    **❯ Messages Sent (GLOBAL):** ${messagesSentGlobal}
    **❯ Messages Sent (GUILD):** ${messagesSentGuild}
    `)
    .setThumbnail(user.displayAvatarURL())
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    .setTimestamp()

message.channel.send(embed)
        }

}
}