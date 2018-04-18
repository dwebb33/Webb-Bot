const Discord = module.require('discord.js');

module.exports.run = async (bot, message, args) => {
	let embed = new Discord.RichEmbed()
		.setAuthor(message.author.username)
		.setDescription("This is the user's info!")
		.setColor("#FF0000")
		.addField("Full Username", `${message.author.username}#${message.author.discriminator}`)
		.addField("ID", message.author.id)
		.addField("Created at ", message.author.createdAt);

	message.channel.send({
		embed: embed
	});
}

module.exports.help = {
	name: "userinfo"
}