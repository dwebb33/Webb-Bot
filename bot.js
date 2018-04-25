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
var timeParsed = Date.parse("2018/04/25 16:05");
var timeNow = Date.now()
console.log("Time: " + timeParsed);
console.log("Time Now: " + timeNow);

if (timeParsed > timeNow) {
	console.log("Time is still to come.");
}

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
	// bot.setInterval(() => {
	// 	let day;
	// 	let isStillPlaying = false;
	// 	for (let i in bot.mlb) {
	// 		if (bot.mlb[i].status == "In Progress")
	// 	}
	// 	if ((d.getDate() - 1) < 10) {
	// 		day = "0" + d.getDate();
	// 	}
	// 	api = "http://gd.mlb.com/components/game/mlb/year_" + d.getFullYear() + "/month_"
	// 	snekfetch.get(api).then(r => {
	// 		let iterationNUM = 0;
	// 		for (let i in bot.mlb) {
	// 			if (bot.mlb[i].status != r.body.data.games.game[iterationNUM].status.status) {
	// 				if (r.body.data.games.game[iterationNUM].status.status == "Pre-Game") {
	// 					bot.mlb[i].status = "Postponed";
	// 				} else if (r.body.data.games.game[iterationNUM].status.status == "Preview") {
	// 					bot.mlb[i].status = "In Progress";
	// 				} else if (r.body.data.games.game[iterationNUM].status.status == "Postponed") {
	// 					bot.mlb[i].status = "Final";
	// 				} else if (r.body.data.games.game[iterationNUM].status.status == "In Progress") {
	// 					bot.mlb[i].status = "Pre-Game";
	// 				} else if (r.body.data.games.game[iterationNUM].status.status == "Game Over") {
	// 					bot.mlb[i].status = "Preview";
	// 				} else if (r.body.data.games.game[iterationNUM].status.status == "Final") {
	// 					bot.mlb[i].status = "Game Over";
	// 				}
	// 			}
	//
	// 			fs.writeFile("./mlb.json", JSON.stringify(bot.mlb, null, 4), err => {
	// 				if (err) throw err;
	// 				console.log(`I have updated the MLB JSON file.`);
	//
	// 				bot.channels.get("438421948188590094").send(`MLB JSON updated.  \`${dateT}\``);
	// 			})
	//
	// 			iterationNUM++;
	// 		}
	// 	});
	// }, 60 * 1000)
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