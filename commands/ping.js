const Discord = require('discord.js');
exports.run = async (client, message, args, ops) => {
  const m = await message.channel.send("Calculating...");

  let ping = m.createdTimestamp - message.createdTimestamp;

  if (ping <= 250) {
    let embed = new Discord.RichEmbed()
      .setColor([0, 180, 0])
      .setAuthor("Pong!", client.user.avatarURL)
      .setDescription(`Latency is **${ping}**ms.\nAPI Latency **${Math.round(client.ping)}**ms.`);
    m.edit(embed);
  } else if (ping > 250 && ping <= 750) {
    let embed = new Discord.RichEmbed()
      .setColor([200, 180, 0])
      .setAuthor("Pong!", client.user.avatarURL)
      .setDescription(`Latency is **${ping}**ms.\nAPI Latency **${Math.round(client.ping)}**ms.`);
    m.edit(embed);
  } else if (ping > 750) {
    let embed = new Discord.RichEmbed()
      .setColor([150, 9, 0])
      .setAuthor("Pong!", client.user.avatarURL)
      .setDescription(`Latency is **${ping}**ms.\nAPI Latency **${Math.round(client.ping)}**ms.`);
    m.edit(embed);
  } else {
    let embed = new Discord.RichEmbed()
      .setColor([0, 70, 200])
      .setAuthor("Pong!", client.user.avatarURL)
      .setDescription(`Latency is **${ping}**ms.\nAPI Latency **${Math.round(client.ping)}**ms.`);
    m.edit(embed);
  }

}
