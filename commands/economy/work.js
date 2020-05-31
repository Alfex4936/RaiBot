const { prefix } = require('../../botconfig.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const ms = require('ms');

module.exports = {
    config: {
    name: 'work',
    description: 'Allows you to work for coins',
    usage: `${prefix}work`,
    category: 'economy',
    access: 'everyone'
},

run: async (client, message, args) => {

    const jobs = [
        'constructor', 'prostitute', 'programmer', 'streamer', 'youtuber', 'witcher'
    ]

    const randomJob = jobs[Math.floor(Math.random() * jobs.length)];

    let timeout = 7200000
    let amount = Math.floor(Math.random() * 1000) + 1;

    let work = await db.fetch(`work_${message.author.id}`);

    if (work !== null && timeout - (Date.now() - work) > 0) {
        let time = ms(timeout - (Date.now() - work));

        message.reply(`You worked too hard! You need to relax, come back in **${time}**.`)
    } else {

        db.add(`coins_${message.author.id}`, amount)
        db.set(`work_${message.author.id}`, Date.now())

    const embed = new MessageEmbed()
    .setAuthor(`Work Reward`, message.author.displayAvatarURL())
    .setColor(colours.green)
    .setDescription(`${message.author.username} worked as **${randomJob.charAt(0).toUpperCase() + randomJob.slice(1)}** and earned **${amount}** coins.`)

message.channel.send(embed)
    }

}
}