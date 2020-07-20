const { prefix, nodes } = require('../../config.json');
const moment = require('moment');
const { ErelaClient } = require('erela.js');
const sqlite = require('sqlite3').verbose();

module.exports = client => {
    console.log(`[${moment().format('M/D/YYYY h:mm a')}] ${client.user.username} is online`);

    client.user.setActivity(`${prefix}help`, { type: 'PLAYING'})
    let db = new sqlite.Database('./raibot.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
    db.run('CREATE TABLE IF NOT EXISTS xp(username TEXT, userid INTEGER, xp INTEGER, level INTEGER)')
    db.run('CREATE TABLE IF NOT EXISTS coins(username TEXT, userid INTEGER, coins INTEGER)')
    db.run('CREATE TABLE IF NOT EXISTS messages(username TEXT, userid INTEGER, global INTEGER)')

    client.music = new ErelaClient(client, nodes)
    .on('nodeError', console.log)
    .on('nodeConnect', () => console.log(`[${moment().format('M/D/YYYY h:mm a')}] Succesfully created a new Node.`))
    .on('queueEnd', player => {
        player.textChannel.send('Queue has ended.')
        return client.music.players.destroy(player.guild.id)
    })
    .on('trackStart', ({textChannel}, {title}) => textChannel.send(`🎧 Now playing **${title}**`))

    client.levels = new Map()
    .set('none', 0.0)
    .set('low', 0.10)
    .set('medium', 0.15)
    .set('high', 0.25);
}