// Creates the date variable used to get the current date
var d = new Date();


// API for finding the games on the current date
var teamEMOTE = {
	"AL": [{
			"teamID": "110",
			"emote": "<:orioles:438091230958714891>"
		},
		{
			"teamID": "111",
			"emote": "<:redsox:438091230883348483>"
		},
		{
			"teamID": "147",
			"emote": "<:yankees:438091231050989581>"
		},
		{
			"teamID": "139",
			"emote": "<:rays:438091231373819904>"
		},
		{
			"teamID": "141",
			"emote": "<:bluejays:438091230665244673>"
		},

		{
			"teamID": "145",
			"emote": "<:whitesox:438089297942413317>"
		},
		{
			"teamID": "114",
			"emote": "<:indians:438091230727897109>"
		},
		{
			"teamID": "116",
			"emote": "<:tigers:438091230996332554>"
		},
		{
			"teamID": "118",
			"emote": "<:royals:438091231050989570>"
		},
		{
			"teamID": "142",
			"emote": "<:twins:438091230824497164>"
		},


		{
			"teamID": "117",
			"emote": "<:astros:438091231034212358>"
		},
		{
			"teamID": "108",
			"emote": "<:angels:438091230715314178>"
		},
		{
			"teamID": "133",
			"emote": "<:athletics:438091230887411723>"
		},
		{
			"teamID": "136",
			"emote": "<:mariners:438091230996332574>"
		},
		{
			"teamID": "140",
			"emote": "<:rangers:438091230929354784>"
		}

	],
	"NL": [{
			"teamID": "144",
			"emote": "<:braves:438094111657033749>"
		},
		{
			"teamID": "146",
			"emote": "<:marlins:438094111908560896>"
		},
		{
			"teamID": "121",
			"emote": "<:mets:438094111904628746>"
		},
		{
			"teamID": "143",
			"emote": "<:phillies:438094111921274890>"
		},
		{
			"teamID": "120",
			"emote": "<:nationals:438094111895977994>"
		},


		{
			"teamID": "112",
			"emote": "<:cubs:438094111484936204>"
		},
		{
			"teamID": "113",
			"emote": "<:reds:438094111631998977>"
		},
		{
			"teamID": "158",
			"emote": "<:brewers:438094111921274881>"
		},
		{
			"teamID": "134",
			"emote": "<:pirates:438094111635931138>"
		},
		{
			"teamID": "138",
			"emote": "<:cardinals:438094111967543296>"
		},

		{
			"teamID": "109",
			"emote": "<:dbacks:438094111979995146>"
		},
		{
			"teamID": "115",
			"emote": "<:rockies:438094111871074326>"
		},
		{
			"teamID": "119",
			"emote": "<:dodgers:438094111690588171>"
		},
		{
			"teamID": "135",
			"emote": "<:padres:438094111711690753>"
		},
		{
			"teamID": "137",
			"emote": "<:giants:438094112030326794>"
		}

	]
}

var day = [
	"01",
	"02",
	"03",
	"04",
	"05",
	"06",
	"07",
	"08",
	"09",
	"10",
	"11",
	"12",
	"13",
	"14",
	"15",
	"16",
	"17",
	"18",
	"19",
	"20",
	"21",
	"22",
	"23",
	"24",
	"25",
	"26",
	"27",
	"28",
	"29",
	"30",
	"31"
];

const api = "http://gd.mlb.com/components/game/mlb/year_" + d.getFullYear() + "/month_" + day[d.getMonth()] + "/day_" + day[d.getDate() - 1] + "/master_scoreboard.json"
// Each Team has their own api which is where this one is calling
const apiTEAM = "";
// There is an API for each individual game
// Add the game ID in between apiGAME[0] and apiGAME[1]
const apiGAME = []
// snekfetch is used to get the JSON data from the API
const snekfetch = require("snekfetch");
// discord is used to do the obvious which is interact with discord
const Discord = module.require('discord.js');

const fs = require("fs");



// This is what runs when the !**** command is used
module.exports.run = async (bot, message, args) => {
	await snekfetch.get(api).then(r => {
		let gameTime = Date.parse(r.body.data.games.game[0].time_date);
		if (r.body.data.games.game[0].ampm == "PM") {
			gameTime += 12
		}
		bot.mlb[r.body.data.games.game[0].game_pk] = {
			status: r.body.data.games.game[0].status.status,
			away_id: r.body.data.games.game[0].away_team_id,
			away_code: r.body.data.games.game[0].away_name_abbrev,
			away_city: r.body.data.games.game[0].away_team_city,
			away_name: r.body.data.games.game[0].away_team_name,
			away_loss: r.body.data.games.game[0].away_loss,
			away_win: r.body.data.games.game[0].away_win,
			home_id: r.body.data.games.game[0].home_team_id,
			home_code: r.body.data.games.game[0].home_name_abbrev,
			home_city: r.body.data.games.game[0].home_team_city,
			home_name: r.body.data.games.game[0].home_team_name,
			home_loss: r.body.data.games.game[0].home_loss,
			home_win: r.body.data.games.game[0].home_win
		}
		fs.writeFile("./mlb.json", JSON.stringify(bot.mlb, null, 4), err => {
			if (err) throw err;
			let dateT = `${d.getMonth()}/${d.getDay()}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}`;
			message.channel.send(`I have added *${r.body.data.games.game[0].game_pk}* to JSON.`);
			bot.channels.get("438421948188590094").send(`Added *${r.body.data.games.game[0].game_pk}* to JSON.  \`${dateT}\``);
		})
	});


	// Need to work out the plan here for how I want the command to work
	// Probably will need a JSON folder to store all the data collected here
	console.log(api);
	console.log(d.getFullYear() + "-" + day[d.getMonth()] + "-" + day[d.getDate() - 1]);

	//const emoji = bot.guild.id.emojis.first();

	console.log(args[0]);
	await snekfetch.get(api).then(r => {
		//bot.channels.get("370023644740583435").send(emoji);

		var numGames = r.body.data.games.game.length;

		console.log(numGames);

		// Just regular !mlb to show how many games are on Today
		if (args[0] == null) {
			let embed = new Discord.RichEmbed()
				.setAuthor(`MLB Regular Season`)
				.setDescription(`${numGames} games Today`)
				.setTitle(`${day[d.getMonth()]}/${day[d.getDate() - 1]}/${d.getFullYear()}`)
				.setColor("#9fa2a4")
				.setThumbnail("https://i.imgur.com/OoIZMf3.png");
			message.channel.send({
				embed: embed
			});
		}

		console.log(args[0]);
		var awayEmote;
		var homeEmote;
		var messageMLB = "";
		var tempTMID;

		// !mlb all this will show every game active or not
		if (args[0].toLowerCase() === "all") {
			console.log("pass");

			for (var i = 0; i < numGames; i++) {
				var temp = "";
				console.log("Dab");
				//console.log(teamEMOTE.AL[1].teamID);
				//console.log(r.body.data.games.game[0].away_team_id);

				let searchForTeam = new Promise(function(resolve, reject) {
					var foundAway = false;
					var foundHome = false;
					console.log(`Away: ${r.body.data.games.game[i].away_team_id} Home: ${r.body.data.games.game[i].home_team_id}`);

					for (var j = 0; j < 15; j++) {
						// Looking for team emojis
						if (teamEMOTE.AL[j].teamID === r.body.data.games.game[i].away_team_id) {
							awayEmote = teamEMOTE.AL[j].emote;
							foundAway = true;
							console.log(`${teamEMOTE.AL[j].teamID} = ${r.body.data.games.game[i].away_team_id}`);
						} else if (teamEMOTE.NL[j].teamID === r.body.data.games.game[i].away_team_id) {
							awayEmote = teamEMOTE.NL[j].emote;
							foundAway = true;
							console.log(`${teamEMOTE.AL[j].teamID} = ${r.body.data.games.game[i].away_team_id}`);
						}
						if (teamEMOTE.AL[j].teamID === r.body.data.games.game[i].home_team_id) {
							homeEmote = teamEMOTE.AL[j].emote;
							foundHome = true;
							console.log(`${teamEMOTE.AL[j].teamID} = ${r.body.data.games.game[i].home_team_id}`);
						} else if (teamEMOTE.NL[j].teamID === r.body.data.games.game[i].home_team_id) {
							homeEmote = teamEMOTE.NL[j].emote;
							foundHome = true;
							console.log(`${teamEMOTE.AL[j].teamID} = ${r.body.data.games.game[i].home_team_id}`);
						}
						// if (foundAway && foundHome) {
						// 	break;
						// }
					}

					if (foundAway && foundHome) {
						resolve('Found Away and Home Emote');
					} else {
						reject('Could not find Emote');
					}
				});

				searchForTeam.then(function(fromResolve) {
					console.log(fromResolve);
				}).catch(function(fromReject) {
					console.log(fromReject);
				});

				console.log(`${awayEmote} ${homeEmote}`);
				console.log("2");


				if (r.body.data.games.game[i].status.status == "Pre-Game" || r.body.data.games.game[i].status.status == "Preview") {
					temp = `${awayEmote} **${r.body.data.games.game[i].away_team_name}** *(${r.body.data.games.game[i].away_win}-${r.body.data.games.game[i].away_loss})*  @ ${homeEmote} **${r.body.data.games.game[i].home_team_name}** *(${r.body.data.games.game[i].home_win}-${r.body.data.games.game[i].home_loss})*\n`;
					temp = temp.concat(`${r.body.data.games.game[i].away_probable_pitcher.first} ${r.body.data.games.game[i].away_probable_pitcher.last} *(${r.body.data.games.game[i].away_probable_pitcher.wins}-${r.body.data.games.game[i].away_probable_pitcher.losses})* vs. ${r.body.data.games.game[i].home_probable_pitcher.first} ${r.body.data.games.game[i].home_probable_pitcher.last} *(${r.body.data.games.game[i].home_probable_pitcher.wins}-${r.body.data.games.game[i].home_probable_pitcher.losses})*\n`);
					temp = temp.concat(`${r.body.data.games.game[i].time_hm_lg}${(r.body.data.games.game[i].hm_lg_ampm).toLowerCase()} EST\n`);
				} else if (r.body.data.games.game[i].status.status == "In Progress") {
					temp = `${awayEmote} **${r.body.data.games.game[i].away_team_name}** ${r.body.data.games.game[i].linescore.r.away} @ ${homeEmote} **${r.body.data.games.game[i].home_team_name}** ${r.body.data.games.game[i].linescore.r.home}\n`;
					temp = temp.concat(`${r.body.data.games.game[i].status.inning_state} of the `);
					if (r.body.data.games.game[i].status.inning == "1" || r.body.data.games.game[i].status.inning == "21") {
						temp = temp.concat(`${r.body.data.games.game[i].status.inning}st\n`);
					} else if (r.body.data.games.game[i].status.inning == "2" || r.body.data.games.game[i].status.inning == "22") {
						temp = temp.concat(`${r.body.data.games.game[i].status.inning}nd\n`);
					} else if (r.body.data.games.game[i].status.inning == "3" || r.body.data.games.game[i].status.inning == "23") {
						temp = temp.concat(`${r.body.data.games.game[i].status.inning}rd\n`);
					} else {
						temp = temp.concat(`${r.body.data.games.game[i].status.inning}th\n`);
					}
				} else if (r.body.data.games.game[i].status.status == "Game Over" || r.body.data.games.game[i].status.status == "Final") {
					temp = `${awayEmote} **${r.body.data.games.game[i].away_team_name}** ${r.body.data.games.game[i].linescore.r.away} @ ${homeEmote} **${r.body.data.games.game[i].home_team_name}** ${r.body.data.games.game[i].linescore.r.home}\n`;
					temp = temp.concat(`**Final**/${r.body.data.games.game[i].status.inning}\n`);
					temp = temp.concat(`W: ${r.body.data.games.game[i].winning_pitcher.first} ${r.body.data.games.game[i].winning_pitcher.last}\nL: ${r.body.data.games.game[i].losing_pitcher.first} ${r.body.data.games.game[i].losing_pitcher.last}`)
					if (r.body.data.games.game[i].save_pitcher.first !== "") {
						temp = temp.concat(`\nSV: ${r.body.data.games.game[i].save_pitcher.first} ${r.body.data.games.game[i].save_pitcher.last}`);
					}
				}
				temp = temp.concat(`\n`);
				messageMLB = messageMLB.concat(temp);

				if (((i + 1) % 10 == 0) && (i !== 0)) {
					message.channel.send(messageMLB);
					console.log("Message Type 1");
					Promise.all([
							messageMLB = ""
						])
						.catch(() => console.error('Number of games failed to be added.'));
				}
				Promise.all([
						homeEmote = "",
						awayEmote = ""
					])
					.catch(() => console.error('Number of games failed to be added.'));

			}
			//message.channel.send(messageMLB);
			message.channel.send(messageMLB);
			console.log("Message Type 2");
			Promise.all([
					messageMLB = ""
				])
				.catch(() => console.error('Number of games failed to be added.'));
			temp = "";

			// !mlb live shows all of the games being played right now
		} else if (args[0].toLowerCase() === "live") {
			numGames;
			for (var i = 0; i < numGames; i++) {
				if (r.body.data.games.game[i].status.status == "In Progress") {
					var temp = "";
					for (var j = 0; j < 5; j++) {
						for (var k = 0; k < 5; k++) {
							if (teamEMOTE.AL[j].teamID == r.body.data.games.game[i].away_team_id) {
								awayEmote = teamEMOTE.AL[j].emote;
								console.log(`FOUND AWAY!!! ${j}j`);
							} else if (teamEMOTE.AL[j].D[k].teamID == r.body.data.games.game[i].away_team_id) {
								awayEmote = teamEMOTE.AL[j].emote;
								console.log(`FOUND AWAY!!! ${j}j`);
							}
							if (teamEMOTE.AL[j].D[k].teamID == r.body.data.games.game[i].home_team_id) {
								homeEmote = teamEMOTE.AL[j].D[k].emote;
								console.log(`FOUND HOME!!! ${j}j`);
							} else if (teamEMOTE.NL[j].D[k].teamID == r.body.data.games.game[i].home_team_id) {
								homeEmote = teamEMOTE.NL[j].D[k].emote;
								console.log(`FOUND HOME!!! ${j}j`);
							}
						}
					}
				}
				console.log(`${awayEmote} ${homeEmote}`);
				if (r.body.data.games.game[i].status.status == "In Progress") {
					temp = `${awayEmote} **${r.body.data.games.game[i].away_team_name}** ${r.body.data.games.game[i].linescore.r.away} @ ${homeEmote} **${r.body.data.games.game[i].home_team_name}** ${r.body.data.games.game[i].linescore.r.home}\n`;
					temp = temp.concat(`${r.body.data.games.game[i].status.inning_state} of the `);
					if (r.body.data.games.game[i].status.inning == "1" || r.body.data.games.game[i].status.inning == "21") {
						temp = temp.concat(`${r.body.data.games.game[i].status.inning}st\n\n`);
					} else if (r.body.data.games.game[i].status.inning == "2" || r.body.data.games.game[i].status.inning == "22") {
						temp = temp.concat(`${r.body.data.games.game[i].status.inning}nd\n\n`);
					} else if (r.body.data.games.game[i].status.inning == "3" || r.body.data.games.game[i].status.inning == "23") {
						temp = temp.concat(`${r.body.data.games.game[i].status.inning}rd\n\n`);
					} else {
						temp = temp.concat(`${r.body.data.games.game[i].status.inning}th\n\n`);
					}
				}
				// temp = temp.concat(`\n\n`);
				messageMLB = messageMLB.concat(temp);

			}
			if (messageMLB == "") {
				message.channel.send("<a:dabbing:438368813445283840> No games are currently being played right now <a:dabbing:438368813445283840>");
			} else {
				message.channel.send(messageMLB);
			}
			temp = "";
		} else if (args[0].toLowerCase() === "team") {
			if (args[1] == null) {
				message.channel.send("Please a valid 3 Letter Abbreviation for a Team");
			} else {
				let isPlaying = false;
				let playMSG = "";
				let teamName;
				let playEmote;
				let gameNumber;
				let isHome = false;

				for (var i = 0; i < numGames; i++) {
					if (r.body.data.games.game[i].away_name_abbrev === args[1].toUpperCase()) {
						teamName = r.body.data.games.game[i].away_team_name;
						isPlaying = true;
						isHome = false;
						gameNumber = i;
						break;
					} else if (r.body.data.games.game[i].home_name_abbrev === args[1].toUpperCase()) {
						teamName = r.body.data.games.game[i].home_team_name;
						isPlaying = true;
						isHome = true;
						gameNumber = i;
						break;
					}
				}
				let searchForTeam = new Promise(function(resolve, reject) {
					var foundEmote = false;

					for (var j = 0; j < 15; j++) {
						if (isHome) {
							if (teamEMOTE.AL[j].teamID === r.body.data.games.game[gameNumber].home_team_id) {
								playEmote = teamEMOTE.AL[j].emote;
								foundEmote = true;
							} else if (teamEMOTE.NL[j].teamID === r.body.data.games.game[gameNumber].home_team_id) {
								playEmote = teamEMOTE.NL[j].emote;
								foundEmote = true;
							}
						} else {
							if (teamEMOTE.AL[j].teamID === r.body.data.games.game[gameNumber].away_team_id) {
								playEmote = teamEMOTE.AL[j].emote;
								foundEmote = true;
							} else if (teamEMOTE.NL[j].teamID === r.body.data.games.game[gameNumber].away_team_id) {
								playEmote = teamEMOTE.NL[j].emote;
								foundEmote = true;
							}
						}

						if (foundEmote) {
							break;
						}
					}

					if (foundEmote) {
						resolve('Found Team Emote');
					} else {
						reject('Could not find Emote');
					}
				});

				searchForTeam.then(function(fromResolve) {
					console.log(fromResolve);
				}).catch(function(fromReject) {
					console.log(fromReject);
				});

				if (isPlaying) {
					playMSG = `${playEmote}The ${teamName} are playing today!${playEmote}`
				} else {
					playMSG = `They are not playing today.`
				}
				message.channel.send(playMSG);
			}
		} else {
			message.channel.send("Invalid MLB Command!");
		}

	});

}

// The name represents the !**** command
module.exports.help = {
	name: "mlb"
}