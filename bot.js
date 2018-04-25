const botSettings = require("./botsettings.json");
const Discord = require('discord.js');
const prefix = botSettings.prefix;
const fs = require("fs");
const snekfetch = require("snekfetch");

var d = new Date();

const bot = new Discord.Client({
	disableEveryone: true,
	sync: true
});
bot.commands = new Discord.Collection();
bot.nhl = require("./nhl.json");
bot.currency = require("./currency.json");
bot.cmdtime = require("./cmdTime.json");
bot.mutes = require("./mutes.json");
bot.mlb = require("./mlb.json");

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

	bot.setInterval(() => {
		for (let i in bot.mutes) {
			let time = bot.mutes[i].time;
			let guildId = bot.mutes[i].guild;
			let guild = bot.guilds.get(guildId);
			let member = guild.members.get(i);
			let mutedRole = guild.roles.find(r => r.name === "Webb Bot Muted");
			if (!mutedRole) continue;
			d = new Date();
			let dateT = `${d.getMonth()}/${d.getDay()}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}`;
			if (Date.now() > time) {
				console.log(`${i} is now able to be unmuted!`)

				member.removeRole(mutedRole);
				delete bot.mutes[i];

				fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 4), err => {
					if (err) throw err;
					console.log(`I have unmuted ${member.user.tag}.`);

					bot.channels.get("438421948188590094").send(`Unmuted ${member.user.tag}.  \`${dateT}\``);
				})
			}
		}
	}, 30 * 1000)
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

bot.on("guildMemberAdd", (member) => {
	let dateT = `${d.getMonth()}/${d.getDay()}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}`;
	bot.channels.get("438421948188590094").send(`<@${member.id}> joined.  \`${dateT}\``);
});
bot.on("guildMemberRemove", (member) => {
	let dateT = `${d.getMonth()}/${d.getDay()}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}`;
	bot.channels.get("438421948188590094").send(`<@${member.id}> left.  \`${dateT}\``);
});

function tick() {
	//const ayy = bot.emojis.get("377235237110808576");

	var mins = new Date().getMinutes();
	if (mins == "44") {
		// console.log("Hello");
	} else {
		return;
		console.log("Not the time");
	}
	console.log('Tick ' + mins);
}

setInterval(tick, 60 * 1000); // seconds * 1000ms


bot.login(botSettings.token);