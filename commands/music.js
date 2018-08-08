const Discord = require('discord.js');

exports.run = async (client, message, args) => {

  if (args.length === 0) {
    message.channel.send("Use: `m!music play <link>`");
  }

  if (args.length > 0) {
    if (args[0] === "play") {

      const ytdl = require('ytdl-core');

      if (!message.member.voiceChannel) return message.channel.send(
        new Discord.RichEmbed().setColor([200, 0, 0])
          .setAuthor("Error")
          .setDescription("<:nope:476692299682807818> You must be in a voice channel in order to do this!")
      );

      if (message.guild.me.voiceChannel) return message.channel.send(
        new Discord.RichEmbed().setColor([200, 0, 0])
          .setAuthor("Error")
          .setDescription("<:nope:476692299682807818> Sorry, I'm already in a voice channel!")
      );

      if (!args[1]) return message.channel.send("Please, input an url following the command.");

      let validate = await ytdl.validateURL(args[1]);
      if (!validate) return message.channel.send("Sorry, that url is not **valid**!");

      let info = await ytdl.getInfo(args[1]);

      let connection = await message.member.voiceChannel.join();

      let dispatcher = await connection.playStream(ytdl(args[1], { filter: 'audioonly' }));

      return message.channel.send(`Now playing: ${info.title}`);

    }
    if (args[0] === "leave") {

      if (!message.member.voiceChannel) return message.channel.send("Please, connect to a voice channel");

      if (!message.guild.me.voiceChannel) return message.channel.send("Sorry, bot isn't connect to any voice channel!");

      if (message.guild.me.voiceChannelID !== message.member.voiceChannelID) return message.channel.send("Sorry, you aren't in this channel!");

      message.guild.me.voiceChannel.leave();

      return message.channel.send("Leaving now...");

    }

    message.channel.send(`Subcommand \`${args[1]}\` for \`music\` not found!`);

  }

}
