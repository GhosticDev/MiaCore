const Discord = require('discord.js');
const config = require("./config.json");

const client = new Discord.Client();
client.prefix = config.prefix;

client.on("ready", () => {
	console.log("Bot on with " + client.users.size + " users and " + client.guilds.size + " servers!");
	client.user.setActivity(`${client.users.size} users!`, {type: 'Watching'});
});

client.on("message", async message => {
  let msg = message.content.toLowerCase();
	if (message.author.bot) return undefined;
  let user = message.author;

	if (message.content.indexOf(config.prefix) !== 0) return;
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
  try {
    
    let ops = {
      active: active
    }
    
    let commands = require(`./commands/${command}.js`);
    await commands.run(client, message, args, ops);
  } catch (e) {
    utils.error(client, e, message.author.username);
  } finally {
  }

});

client.on('guildMemberAdd', async member => {
  if (member.guild.id === '476498757706579968') {
    client.channels.get('476506316794494988').send("New member: **" + member.user.username + "**");
    member.addRole('476705670528237589');
  }
});

client.on('guildMemberRemove', async member => {
  if (member.guild.id === '476498757706579968') {
    client.channels.get('476506366643535913').send("Bye member: **" + member.user.username + "**");
  }z
});

client.login(process.env.TOKEN);
