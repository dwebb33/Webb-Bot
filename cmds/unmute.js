const fs = require("fs");
var d = new Date();

module.exports.run = async (bot, message, args) => {
	var d = new Date();
	if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.sendMessage("You do not have permission to use this command.");

	let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
	if (!toMute) return message.channel.sendMessage("You did not specify a user mention!");

	if (toMute.id === message.author.id) return message.channel.sendMessage("You can not unmute/mute yourself!");
	if (toMute.highestRole.position >= message.member.highestRole.position) return message.channel.sendMessage("You cannot mute/unmute a member who is higher or has the same role as you.");

	let role = message.guild.roles.find(r => r.name === "Webb Bot Muted");

	if (!role || !toMute.roles.has(role.id)) return message.channel.sendMessage("This user is not muted.");

	await toMute.removeRole(role);
	message.channel.send(`I have unmuted them.`);
	let dateT = `${d.getMonth()}/${d.getDay()}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}`;
	bot.channels.get("438421948188590094").send(`Unmuted <@${toMute.id}>.  \`${dateT}\``);
}

module.exports.help = {
	name: "unmute"
}