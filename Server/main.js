const config = require("./config.json")
// Discord Stuff
const { Client, Collection, Intents } = require('discord.js');

const client = new Client({ allowedMentions: { parse: ['users', 'roles'], repliedUser: true} ,intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS] });

let console_message = null;
let msgs = "";
let connected_socket = null;

const WebSocket = require('ws');
const server = new WebSocket.Server({
    port: config.port
});
server.on('connection', function(socket) {
    console.log('connected!')
    connected_socket = socket;
    socket.on('message', function(msg) {
      if(msg && console_message) {
          msgs = msgs + "\n" + msg
          console_message.channel.messages.edit(console_message.id, {content: "```" + msgs+ "```"})
      }
    });

    socket.on('close', function() {
        console_message = null;
    });
  });



client.on('messageCreate', async msg => {
    let message = msg.content
    let prefix = config.prefix;
    if (msg.author.bot) return;
    if (!(msg.author.id == config.userid)) return;

    if (message == prefix+"start") {
        return console_message = await msg.channel.send({content: "```\n[+] Created by russiandog @ v3rm!```"})
    }

    if (message.startsWith(prefix + "execute")) {
        if(console_message == null) return msg.reply("Not connected! do ``" + prefix + "start``.");
        connected_socket.send(message.slice((prefix+"execute").length).trim())
    }
})

client.on('ready', () => {
    client.user.setStatus('dnd');
    console.log('Created by russiandog')
})

client.login("");