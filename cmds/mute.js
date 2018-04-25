const fs = require("fs");

module.exports.run = async (bot, message, args) => {
	var d = new Date();
	if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.sendMessage("You do not have permission to use this command.");

	let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
	if (!toMute) return message.channel.sendMessage("You did not specify a user mention!");

	if (toMute.id === message.author.id) return message.channel.sendMessage("You can not mute yourself!");
	if (toMute.highestRole.position >= message.member.highestRole.position) return message.channel.sendMessage("You cannot mute a member who is higher or has the same role as you.");

	let role = message.guild.roles.find(r => r.name === "Webb Bot Muted");
	if (!role) {
		try {
			role = await message.guild.createRole({
				name: "Webb Bot Muted",
				color: "#000000",
				permissions: []
			});

			message.guild.channels.forEach(async (channel, id) => {
				await channel.overwritePermissions(role, {
					SEND_MESSAGES: false,
					ADD_REACTIONS: false
				});
			});
		} catch (e) {
			console.log(e.stack);
		}
	}

	if (toMute.roles.has(role.id)) return message.channel.sendMessage("This user is already muted.");

	bot.mutes[toMute.id] = {
		guild: message.guild.id,
		time: Date.now() + parseInt(args[1]) * 1000
	}

	await toMute.addRole(role);
	fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 4), err => {
		if (err) throw err;
		let dateT = `${d.getMonth()}/${d.getDay()}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}`;
		message.channel.send(`I have muted <@${toMute.id}> for ${args[1]} second(s).`);
		bot.channels.get("438421948188590094").send(`Muted <@${toMute.id}> for ${args[1]} second(s).  \`${dateT}\``);
	})


}

module.exports.help = {
	name: "mute"
}