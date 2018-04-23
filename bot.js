const botSettings = require("./botsettings.json");
const Discord = require('discord.js');
const prefix = botSettings.prefix;
const fs = require("fs");

const bot = new Discord.Client({
	disableEveryone: true
});
bot.commands = new Discord.Collection();
bot.nhl = require("./nhl.json");
bot.currency = require("./currency.json");

fs.readdir("./cmds/", (err, files) => {
	if (err) console.error(err);

	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if (jsfiles.length <= 0) {
		console.log("No commands to load!");
		return;
	}

	console.log(`Loading ${jsfiles.length} commands!`);

	jsfiles.forEach((f, i) => {
		let props = require(`./cmds/${f}`);
		console.log(`${i + 1}: ${f} loaded!`);
		bot.commands.set(props.help.name, props);
	});
});


bot.on("ready", async () => {

	console.log(`Bot is ready! ${bot.user.username}`);


	// try {
	//     let link = await bot.generateInvite(["ADMINISTRATOR"]);
	//     console.log(link);
	// } catch(e) {
	//     console.log(e.stack);
	// }

	bot.user.setStatus('Online') // Status goes here, It can be 'Online', 'idle', 'invisible', & 'dnd'
	bot.user.setPresence({
		game: {
			name: 'For Help Type "!Help"',
			type: 1,
			url: 'https://www.twitch.tv/mrgobstopper',

		}
	});
});

bot.on("message", async message => {
	if (message.author.bot) return;
	if (message.channel.type === "dm") return;

	let messageArray = message.content.split(" ");
	let command = messageArray[0];
	let args = messageArray.slice(1);

	if (!command.startsWith(prefix)) return;

	let cmd = bot.commands.get(command.slice(prefix.length));
	if (cmd) cmd.run(bot, message, args);

});


function tick() {
	var mins = new Date().getMinutes();
	if (mins == "44") {
		// console.log("Hello");
	} else {
		return;
		console.log("Not the time");
	}
	console.log('Tick ' + mins);
}

setInterval(tick, 60 * 1000);


bot.login(botSettings.token);