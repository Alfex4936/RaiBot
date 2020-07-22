const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const { stripIndents } = require('common-tags');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./raibot.db', sqlite.OPEN_READWRITE);
const Canvacord = require('canvacord');
const canva = new Canvacord();

module.exports = {
    config: {
    name: 'rank',
    description: 'Displays user\'s profile',
    usage: `${prefix}profile [user]`,
    category: 'utility',
    access: 'everyone',
    aliases: ['profile', 'prf']
},

run: async (client, message, args) => {

  let user = message.mentions.users.first() || message.author
  let userid = user.id;

  let xpQuery = 'SELECT * FROM xp WHERE userid = ?';
  db.get(xpQuery, [userid], async function(err, row) {
    if (err) {
        console.log(err);
    }

    let currentXp = row.xp;
    let currentLvl = row.level | 0;
    let currentRank = row.rank || 0;
    let nxtLvl = row.level * 500;

    const image = await canva.rank({
      username: user.username,
      discrim: user.discriminator,
      status: user.presence.status,
      currentXP: currentXp.toString(),
      neededXP: nxtLvl.toString(),
      level: currentLvl.toString(),
      rank: currentRank.toString(),
      avatarURL: user.displayAvatarURL({ format: "png" }),
      color: colours.white
    });

    let attachment = new MessageAttachment(image, "rank.png");
    return message.channel.send(attachment);

    });

}
}