const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const db = require('quick.db');

exports.run = async (client, message, args, ops) => {
  
  let prefix = await db.fetch(`guild_${message.guild.id}_prefix`);
  if (prefix === null) prefix = "md!";
  
  console.log(1);
  if (!message.member.voiceChannel) return message.channel.send(
    new Discord.RichEmbed().setColor([200, 0, 0])
      .setAuthor("Error")
      .setDescription("<:nope:476692299682807818> You must be in a voice channel in order to do this!")
  );
  
  console.log(2);
  if (message.guild.id === message.guild.me.id) {
    if (message.guild.me.voiceChannel !== message.member.voiceChannel) return message.channel.send(
      new Discord.RichEmbed().setColor([200, 0, 0])
        .setAuthor("Error")
        .setDescription("<:nope:476692299682807818> Sorry, I'm already in a voice channel!")
    );
  }
  
  console.log(3);
  let emb = new Discord.RichEmbed()
    .setColor([54, 57, 63])
    .setAuthor("Wrong use!", "https://i.imgur.com/VQMWyz6.png")
    .setDescription(`Do \`${prefix}play <link or name>\` to play music!`)
    .setTimestamp();
  if (args.length === 0) return message.channel.send(emb);
  
  console.log(4);
  let validate = await ytdl.validateURL(args[0]);
  console.log(5);
  if (!validate) {
    let commandFile = require(`./search.js`);
    return commandFile.run(client, message, args, ops);
  }
  
  console.log(6);
  let info = await ytdl.getInfo(args[0]);
  
  /*
  let connection = await message.member.voiceChannel.join();
  
  let dispatcher = await connection.playStream(ytdl(args[0], { filter: 'audioonly' }));
  
  let embed = new Discord.RichEmbed()
    .setColor([54, 57, 63])
    .setAuthor("NEW MUSIC PLAYING", client.user.avatarURL)
    .setDescription("Name: **" + info.title + "**\nAuthor: **" + info.author.name + "**\nURL: " + args[0])
    .setTimestamp();
  return message.channel.send(embed);
  */
  
  console.log(7);
  let data = ops.active.get(message.guild.id) || {};
  
  console.log(8);
  if (!data.connection) data.connection = await message.member.voiceChannel.join();
  console.log(9);
  if (!data.queue) data.queue = [];
  
  console.log(10);
  data.guildID = message.guild.id;
  
  console.log(11);
  data.queue.push({
    songTitle: info.title,
    requester: message.author.tag,
    url: args[0],
    announceChannel: message.channel.id
  });
  
  console.log(12);
  if (!data.dispatcher) play(client, ops, data);
  else {
    console.log(13);
    let embed = new Discord.RichEmbed()
      .setColor([200, 0, 0])
      .setAuthor("ADDED TO QUEUE")
      .setDescription(`Name: **${info.title}**\nUrl: ${args[0]}`)
      .setFooter(`Requested by: ${message.author.username}`)
      .setTimestamp();
    message.channel.send(embed);
  }
  
  console.log(14);
  ops.active.set(message.guild.id, data);
  
}

async function play(client, ops, data) {
  
  console.log(15);
  let embed = new Discord.RichEmbed()
    .setColor([200, 0, 0])
    .setAuthor("NOW PLAYING")
    .setDescription(`Name: **${data.queue[0].songTitle}**\nUrl: ${data.queue[0].url}`)
      .setFooter(`Requested by: ${data.queue[0].requester}`)
    .setTimestamp();
  client.channels.get(data.queue[0].announceChannel).send(embed);
  
  console.log(16);
  data.dispatcher = await data.connection.playStream(ytdl(data.queue[0].url, { filter: 'audioonly' }));
  console.log(17);
  data.dispatcher.guildID = data.guildID;
  
  console.log(18);
  data.dispatcher.once('end', function() {
    finish(client, ops, this, data.queue[0].announceChannel);
  });
  
}

function finish(client, ops, dispatcher, channel) {
  
  console.log(19);
  let fetched = ops.active.get(dispatcher.guildID);
  
  console.log(20);
  fetched.queue.shift();
  
  console.log(21);
  if (fetched.queue.length > 0) {
    
    console.log(22);
    ops.active.set(dispatcher.guildID, fetched);
    
    console.log(23);
    play(client, ops, fetched);
    
  } else {
    
    console.log(24);
    ops.active.delete(dispatcher.guildID);;
    
    console.log(25);
    let vc = client.guilds.get(dispatcher.guildID).me.voiceChannel;
    console.log(26);
    if (vc) vc.leave();
    console.log(27);
    client.channels.get(channel).send(`Queue is empty! Disconnecting!`);
    console.log(28);
    
  }
  
}
