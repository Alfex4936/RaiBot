const { prefix } = require('../../config.json');
const colours = require('../../colours.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
    name: '8ball',
    description: 'It\'s 8ball... I guess?',
    usage: `${prefix}8ball <question>`,
    category: 'fun',
    access: 'everyone',
    aliases: ['8b']
},

run: async (client, message, args) => {

    let question = args.slice(0).join(' ')
    if (!question) return message.reply('Please input a question!')

    let replies = [
        'It is certain.', 'Without a doubt.', 'Yes - definitely.', 'As I see it, yes.', 'Most likely.', 'Yes.', 'Signs point to yes.', 'Ask again later.', 'Hell no.', 'No.', 'My reply is no.',
        'My sources say no.', 'Concentrate and ask again.', 'don\'t count on it.', 'Maybe.', 'That is sure as hell.', 'Indeed.', 'Answer is uncertain.', 'Maybe no.', 'Maybe yes.', 'Better ask yourself.',
        'Sorry, but this is really stupid question.', 'Very bad idea.', 'Never.', 'What do you think?' , 'Yep.', 'NO with caps lock.', 'YES with caps lock.', 'Stupid question, try again.'
    ]

    const random = Math.floor(Math.random() * replies.length)

    message.reply(replies[random])
    
}
}