module.exports.run = async (bot, message, args) => {
	try {
		message.channel.send(`<a:goalalert:437832364627066911>\`\`\`'!userinfo' will display a little information about the user\n'!avatar' will show the users avatar\n'!icon' will show the icon of the server\n'!mute @username' will mute a user as long as the user says what user to mute following the command and has permission to execute the command\n'!unmute @username' reverse effect of the mute command\n'!stocks' \n'!nhl' will display the NHL games set for Today\n'!mlb' this command is in progress\n'!nba' this command is in progress\`\`\`
			`);
	} catch (error) {
		console.error('One of the functions failed to execute.');
		message.channel.send('Failed to send Message');
	}
}

// The name represents the !**** command
module.exports.help = {
	name: "help"
}