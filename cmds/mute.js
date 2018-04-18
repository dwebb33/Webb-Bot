module.exports.run = async (bot, message, args) => {
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

	await toMute.addRole(role);
	message.channel.sendMessage("I have muted them.");
}

module.exports.help = {
	name: "mute"
}