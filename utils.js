function error(client, message, author) {
  const Discord = require('discord.js');
  let embed = new Discord.RichEmbed()
    .setColor([54, 57, 64])
    .setAuthor("Error")
    .setDescription("Sent by **" + author + "**!\n" + `${message}`)
    .setTimestamp();
  client.channels.get('476499871743082522').send(embed);
}

module.exports = {
  error: error
}
