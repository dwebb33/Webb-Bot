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
bot.blank = require("./blank.json");

try {
	bot.mlb = require("./mlb.json");
} catch (error) {
	fs.writeFile("./mlb.json", JSON.stringify(bot.blank, null, 4), err => {
		if (err) throw err;
		console.log("\nError Forced Clean of JSON\n");
		bot.mlb = require("./mlb.json");
	})
}

//bot.mlb = require("./mlb.json");


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
					let dateT = `${d.getMonth()}/${d.getDay()}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}`;
					bot.channels.get("438421948188590094").send(`Unmuted ${member.user.tag}.  \`${dateT}\``);
				})
			}
		}
	}, 30 * 1000)



	//let teamJSONBuild = new Promise(function(resolve, reject) {});

	let todaysDay = d.getDate();
	let isComplete = false;
	let day;
	let month;
	let nextDay = false;
	let moveOn = false;
	let isStillPlaying = true;

	bot.setInterval(() => {
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

		let newD = new Date();

		if (newD.getDate() < 10) {
			if (newD.getHours() < 6) {
				day = "0" + (newD.getDate() - 1);
			} else {
				day = "0" + newD.getDate();
			}
		} else {
			if (newD.getHours() < 6) {
				if (newD.getDate() == 10) {
					day = "09";
				} else {
					day = (newD.getDate() - 1);
				}
			} else {
				day = newD.getDate();
			}
		}
		if (newD.getMonth() < 10) {
			month = "0" + (newD.getMonth() + 1);
		} else {
			month = (d.getMonth() + 1);
		}
		var api = "http://gd.mlb.com/components/game/mlb/year_" + newD.getFullYear() + "/month_" + month + "/day_" + day + "/master_scoreboard.json";
		//api = "https://raw.githubusercontent.com/dwebb33/mlbjsontest/master/db.json";



		// Promise to complete MLB check up
		let jsonMLB = new Promise(function(resolve, reject) {


			// Call to API
			snekfetch.get(api).then(r => {
				// Sets the game length
				let gameLength = r.body.data.games.game.length;
				// Final string message for #Admin
				let finalMessage = "";
				// Boolean to see if all the Games are Final or Postponed
				let isAllDone = false
				// Promise to store isAllDone into JSON
				var loopValue;
				for (let i in bot.mlb) {
					loopValue = i;
				}
				// Checks to see if there is Data (at least 1 game and 1 "isAllDone")

				// Pre-game, Preview, In Progress, Game Over, Final, Postponed, Warmup
				if (loopValue == null) {
					isComplete = false;
					let loopFillGames = new Promise(function(resolve, reject) {

						let awayEmote;
						let homeEmote;

						for (var i = 0; i < r.body.data.games.game.length; i++) {
							let gameTime = Date.parse(r.body.data.games.game[i].time_date);
							if (r.body.data.games.game[i].ampm == "PM") {
								gameTime += 43200000;
							}

							let teamJSONBuild = new Promise(function(resolve, reject) {
								let teamEmotes = new Promise(function() {
									awayEmote = "";
									homeEmote = "";
									let replacedH = false;
									let replacedA = false;

									for (var j = 0; j < 15; j++) {
										if (teamEMOTE.AL[j].teamID === r.body.data.games.game[i].away_team_id) {
											awayEmote = teamEMOTE.AL[j].emote;
											replacedA = true;
										} else if (teamEMOTE.NL[j].teamID === r.body.data.games.game[i].away_team_id) {
											awayEmote = teamEMOTE.NL[j].emote;
											replacedA = true;
										}
										if (teamEMOTE.AL[j].teamID === r.body.data.games.game[i].home_team_id) {
											homeEmote = teamEMOTE.AL[j].emote;
											replacedH = true;
										} else if (teamEMOTE.NL[j].teamID === r.body.data.games.game[i].home_team_id) {
											homeEmote = teamEMOTE.NL[j].emote;
											replacedH = true;
										}
									}

									if (replacedH && replacedA) {
										resolve("Found Emote");
									} else {
										reject("Couldn't Find Emote. Dab.");
									}
								});
								teamEmotes.then(function(fromResolve) {
									//console.log(fromResolve);
								}).catch(function(fromReject) {
									console.log(fromReject);
								});


								bot.mlb[r.body.data.games.game[i].game_pk];

								let gameStatus = r.body.data.games.game[i].status.status;
								//console.log("gameStatus: " + gameStatus);

								let botmlbJSON = new Promise(function(resolve, reject) {
									if (gameStatus == "Pre-Game" || gameStatus == "Preview" || gameStatus == "Warmup") {
										bot.mlb[r.body.data.games.game[i].game_pk] = {
											status: "Pre-Game",
											game_time: gameTime,
											game_time_END: gameTime + 28800000,
											away_id: r.body.data.games.game[i].away_team_id,
											away_code: r.body.data.games.game[i].away_name_abbrev,
											away_city: r.body.data.games.game[i].away_team_city,
											away_name: r.body.data.games.game[i].away_team_name,
											away_emote: awayEmote,
											away_probable_pitcher: r.body.data.games.game[i].away_probable_pitcher.first + " " + r.body.data.games.game[i].away_probable_pitcher.last,
											away_pitcher_wins: r.body.data.games.game[i].away_probable_pitcher.wins,
											away_pitcher_losses: r.body.data.games.game[i].away_probable_pitcher.losses,
											away_pitcher_era: r.body.data.games.game[i].away_probable_pitcher.era,
											away_loss: r.body.data.games.game[i].away_loss,
											away_win: r.body.data.games.game[i].away_win,
											home_id: r.body.data.games.game[i].home_team_id,
											home_code: r.body.data.games.game[i].home_name_abbrev,
											home_city: r.body.data.games.game[i].home_team_city,
											home_name: r.body.data.games.game[i].home_team_name,
											home_emote: homeEmote,
											home_loss: r.body.data.games.game[i].home_loss,
											home_win: r.body.data.games.game[i].home_win,
											home_probable_pitcher: r.body.data.games.game[i].home_probable_pitcher.first + " " + r.body.data.games.game[i].home_probable_pitcher.last,
											home_pitcher_wins: r.body.data.games.game[i].home_probable_pitcher.wins,
											home_pitcher_losses: r.body.data.games.game[i].home_probable_pitcher.losses,
											home_pitcher_era: r.body.data.games.game[i].home_probable_pitcher.era
										}
									} else {
										bot.mlb[r.body.data.games.game[i].game_pk] = {
											status: r.body.data.games.game[i].status.status,
											game_time: gameTime,
											game_time_END: gameTime + 28800000,
											away_id: r.body.data.games.game[i].away_team_id,
											away_code: r.body.data.games.game[i].away_name_abbrev,
											away_city: r.body.data.games.game[i].away_team_city,
											away_name: r.body.data.games.game[i].away_team_name,
											away_emote: awayEmote,
											away_loss: r.body.data.games.game[i].away_loss,
											away_win: r.body.data.games.game[i].away_win,
											home_id: r.body.data.games.game[i].home_team_id,
											home_code: r.body.data.games.game[i].home_name_abbrev,
											home_city: r.body.data.games.game[i].home_team_city,
											home_name: r.body.data.games.game[i].home_team_name,
											home_emote: homeEmote,
											home_loss: r.body.data.games.game[i].home_loss,
											home_win: r.body.data.games.game[i].home_win
										}
									}

									resolve("set bot.mlb" + r.body.data.games.game[i].game_pk);

									reject("HUUUUUUUUUUUUUUUUH");
								});
								botmlbJSON.then(function(fromResolve) {
									//console.log(fromResolve);
								}).catch(function(fromReject) {
									console.log(fromReject);
								});

								//console.log('Added to bot MLB' + bot.mlb[r.body.data.games.game[i].game_pk].status);





								reject('Could Not Save Team');

							});
							teamJSONBuild.then(function(fromResolve) {
								//console.log(fromResolve);
							}).catch(function(fromReject) {
								console.log(fromReject);
							});

							fs.writeFile("./mlb.json", JSON.stringify(bot.mlb, null, 4), err => {
								if (err) throw err;
								resolve('Set JSON for MLB');
							})

						}
						resolve('Dab on the hoes');

						reject('Error: Probably Mising Something');

					});
					loopFillGames.then(function(fromResolve) {
						//console.log(fromResolve);
					}).catch(function(fromReject) {
						console.log(fromReject);
					});

					console.log("JSON Data Set");


					//bot.channels.get("438421948188590094").send("Updated MLB JSON");
					//console.log("Updated MLB JSON.");
				} else {
					try {
						var isChangeMade = false;
						let awayEmote;
						let homeEmote;

						for (let i in bot.mlb) {
							let channelID = "438108883794264064";
							let gameLOC;
							for (var x = 0; x < r.body.data.games.game.length; x++) {
								if (i == r.body.data.games.game[x].game_pk) {
									gameLOC = x;
									break;
								}
							}
							// If status has changed change it
							var gameStatus = "";
							awayEmote = "";
							homeEmote = "";



							let teamEmotes = new Promise(function() {
								let replacedH = false;
								let replacedA = false;
								for (var j = 0; j < 15; j++) {

									if (teamEMOTE.AL[j].teamID === r.body.data.games.game[gameLOC].away_team_id) {
										awayEmote = teamEMOTE.AL[j].emote;
										replacedA = true;
									} else if (teamEMOTE.NL[j].teamID === r.body.data.games.game[gameLOC].away_team_id) {
										awayEmote = teamEMOTE.NL[j].emote;
										replacedA = true;
									}
									if (teamEMOTE.AL[j].teamID === r.body.data.games.game[gameLOC].home_team_id) {
										homeEmote = teamEMOTE.AL[j].emote;
										replacedH = true;
									} else if (teamEMOTE.NL[j].teamID === r.body.data.games.game[gameLOC].home_team_id) {
										homeEmote = teamEMOTE.NL[j].emote;
										replacedH = true;
									}

								}
								if (replacedH && replacedA) {
									resolve("Found Emote");
								} else {
									reject("Couldn't Find Emote");
								}
							});
							teamEmotes.then(function(fromResolve) {
								//console.log(fromResolve);
							}).catch(function(fromReject) {
								console.log(fromReject);
							});


							let gameTime = Date.parse(r.body.data.games.game[gameLOC].time_date);
							if (r.body.data.games.game[gameLOC].ampm == "PM") {
								gameTime = Date.parse(r.body.data.games.game[gameLOC].time_date) + 43200000;
							}


							if (bot.mlb[i].status !== r.body.data.games.game[gameLOC].status.status) {
								Promise.all([
										gameStatus = String(r.body.data.games.game[gameLOC].status.status)
									])
									.catch(() => console.error('Number of games failed to be added.'));


								let gameTime = Date.parse(r.body.data.games.game[gameLOC].time_date);
								if (r.body.data.games.game[gameLOC].ampm == "PM") {
									gameTime += 43200000;
								}

								// Pre-game, Preview, In Progress, Game Over, Final, Postponed, Warmup
								if (gameStatus == "Pre-Game" || gameStatus == "Preview" || gameStatus == "Warmup") {
									delete bot.mlb[r.body.data.games.game[gameLOC].game_pk];

									bot.mlb[r.body.data.games.game[gameLOC].game_pk];
									bot.mlb[r.body.data.games.game[gameLOC].game_pk] = {
										status: r.body.data.games.game[gameLOC].status.status,
										game_time: gameTime,
										game_time_END: gameTime + 28800000,
										away_id: r.body.data.games.game[gameLOC].away_team_id,
										away_code: r.body.data.games.game[gameLOC].away_name_abbrev,
										away_city: r.body.data.games.game[gameLOC].away_team_city,
										away_name: r.body.data.games.game[gameLOC].away_team_name,
										away_emote: awayEmote,
										away_loss: r.body.data.games.game[gameLOC].away_loss,
										away_win: r.body.data.games.game[gameLOC].away_win,
										away_probable_pitcher: r.body.data.games.game[gameLOC].away_probable_pitcher.first + " " + r.body.data.games.game[gameLOC].away_probable_pitcher.last,
										away_pitcher_wins: r.body.data.games.game[gameLOC].away_probable_pitcher.wins,
										away_pitcher_losses: r.body.data.games.game[gameLOC].away_probable_pitcher.losses,
										away_pitcher_era: r.body.data.games.game[gameLOC].away_probable_pitcher.era,
										home_id: r.body.data.games.game[gameLOC].home_team_id,
										home_code: r.body.data.games.game[gameLOC].home_name_abbrev,
										home_city: r.body.data.games.game[gameLOC].home_team_city,
										home_name: r.body.data.games.game[gameLOC].home_team_name,
										home_emote: homeEmote,
										home_loss: r.body.data.games.game[gameLOC].home_loss,
										home_win: r.body.data.games.game[gameLOC].home_win,
										home_probable_pitcher: r.body.data.games.game[gameLOC].home_probable_pitcher.first + " " + r.body.data.games.game[gameLOC].home_probable_pitcher.last,
										home_pitcher_wins: r.body.data.games.game[gameLOC].home_probable_pitcher.wins,
										home_pitcher_losses: r.body.data.games.game[gameLOC].home_probable_pitcher.losses,
										home_pitcher_era: r.body.data.games.game[gameLOC].home_probable_pitcher.era
									}
									isChangeMade = true;
								} else if (gameStatus == "In Progress") {
									function addZero(i) {
										if (i < 10) {
											i = "0" + i;
										}
										return i;
									}
									let curD = new Date();
									let h = curD.getHours();
									let m = addZero(curD.getMinutes());
									let timeAMPM = "am";

									if (h >= 12) {
										if (h > 12) {
											h = h % 12;
										}
										timeAMPM = "pm";
									}

									let timeStart = `\`${h}:${m}${timeAMPM}\``;


									let dabEmote = "<a:dabbing:439252818570772481>";
									if (bot.mlb[i].away_probable_pitcher !== undefined && bot.mlb[i].home_probable_pitcher !== undefined) {
										bot.channels.get(channelID).send(`${dabEmote} Game Has Started! <a:dabbingR:439505773068943360>\n${bot.mlb[i].away_emote}**${bot.mlb[i].away_name}** *(${bot.mlb[i].away_win}-${bot.mlb[i].away_loss})* @ ${bot.mlb[i].home_emote}**${bot.mlb[i].home_name}** *(${bot.mlb[i].home_win}-${bot.mlb[i].home_loss})*\n${bot.mlb[i].away_probable_pitcher} *(${bot.mlb[i].away_pitcher_wins}-${bot.mlb[i].away_pitcher_losses})* vs ${bot.mlb[i].home_probable_pitcher} *(${bot.mlb[i].home_pitcher_wins}-${bot.mlb[i].home_pitcher_losses})*\n${timeStart}`);
									} else {
										bot.channels.get(channelID).send(`${dabEmote} Game Has Started! <a:dabbingR:439505773068943360>\n${bot.mlb[i].away_emote}**${bot.mlb[i].away_name}** *(${bot.mlb[i].away_win}-${bot.mlb[i].away_loss})* @ ${bot.mlb[i].home_emote}**${bot.mlb[i].home_name}** *(${bot.mlb[i].home_win}-${bot.mlb[i].home_loss})*\n${timeStart}`);
									}

									delete bot.mlb[r.body.data.games.game[gameLOC].game_pk];

									bot.mlb[r.body.data.games.game[gameLOC].game_pk];

									bot.mlb[r.body.data.games.game[gameLOC].game_pk] = {
										status: r.body.data.games.game[gameLOC].status.status,
										inning: r.body.data.games.game[gameLOC].status.inning,
										top_inning: r.body.data.games.game[gameLOC].status.top_inning,
										outs: r.body.data.games.game[gameLOC].status.outs,
										is_no_hitter: r.body.data.games.game[gameLOC].status.is_no_hitter,
										is_perfect_game: r.body.data.games.game[gameLOC].status.is_perfect_game,
										game_time: gameTime,
										game_time_END: gameTime + 28800000,
										away_id: r.body.data.games.game[gameLOC].away_team_id,
										away_code: r.body.data.games.game[gameLOC].away_name_abbrev,
										away_city: r.body.data.games.game[gameLOC].away_team_city,
										away_name: r.body.data.games.game[gameLOC].away_team_name,
										away_emote: awayEmote,
										away_loss: r.body.data.games.game[gameLOC].away_loss,
										away_win: r.body.data.games.game[gameLOC].away_win,
										away_score: r.body.data.games.game[gameLOC].linescore.r.away,
										home_id: r.body.data.games.game[gameLOC].home_team_id,
										home_code: r.body.data.games.game[gameLOC].home_name_abbrev,
										home_city: r.body.data.games.game[gameLOC].home_team_city,
										home_name: r.body.data.games.game[gameLOC].home_team_name,
										home_emote: homeEmote,
										home_loss: r.body.data.games.game[gameLOC].home_loss,
										home_win: r.body.data.games.game[gameLOC].home_win,
										home_score: r.body.data.games.game[gameLOC].linescore.r.home
									}
									isChangeMade = true;
								} else if (gameStatus == "Game Over") {
									let funEmoji = "<a:clapping:439177969228054528>";
									bot.channels.get(channelID).send(`${funEmoji} Game Has Ended! ${funEmoji}\n${bot.mlb[i].away_emote}${bot.mlb[i].away_name} ${r.body.data.games.game[gameLOC].linescore.r.away} @ ${bot.mlb[i].home_emote}${bot.mlb[i].home_name} ${r.body.data.games.game[gameLOC].linescore.r.home}\nFinal/${r.body.data.games.game[gameLOC].status.inning}`);

									//bot.mlb[i].status = gameStatus;
									//isChangeMade = true;

									isChangeMade = true;

								} else if (gameStatus == "Final") {
									//bot.mlb[i].status = gameStatus;
									isChangeMade = true;
								} else if ("Postponed") {

								} else {
									console.log(`New Type ${gameStatus}`)
								}

							}


							gameStatus = bot.mlb[i].status;


							if (gameStatus == "In Progress") {
								// White Sox: <@&440240055290822666>
								// Phillies: <@&440239877498601483>
								// Red Sox: <@&440240222362664960>
								// Twins: <@&440240326985121822>

								let favTeam = false;
								let favTeamHome = false;
								let awayTeamName = bot.mlb[i].away_name;
								let homeTeamName = bot.mlb[i].home_name;

								switch (bot.mlb[i].away_id) {
									case "145": // White Sox
										favTeam = true;
										favTeamHome = false;
										awayTeamName = "<@&440240055290822666>";
										break;
									case "111": // Red Sox
										favTeam = true;
										favTeamHome = false;
										awayTeamName = "<@&440240222362664960>";
										break;
									case "143": // Phillies
										favTeam = true;
										favTeamHome = false;
										awayTeamName = "<@&440240055290822666>";
										break;
									case "142": // Twins
										favTeam = true;
										favTeamHome = false;
										awayTeamName = "<@&440239877498601483>";
										break;
									default:
										favTeam = false;
										favTeamHome = false;
								}
								switch (bot.mlb[i].home_id) {
									case "145": // White Sox
										favTeam = true;
										favTeamHome = true;
										homeTeamName = "<@&440240055290822666>";
										break;
									case "111": // Red Sox
										favTeam = true;
										favTeamHome = true;
										homeTeamName = "<@&440240222362664960>";
										break;
									case "143": // Phillies
										favTeam = true;
										favTeamHome = true;
										homeTeamName = "<@&440240055290822666>";
										break;
									case "142": // Twins
										favTeam = true;
										favTeamHome = true;
										homeTeamName = "<@&440239877498601483>";
										break;
									default:
										favTeam = false;
										favTeamHome = false;
								}

								let channelIDLive = "440239838164287499";

								if (favTeam) {
									if (bot.mlb[i].away_score != r.body.data.games.game[gameLOC].linescore.r.away) {
										bot.channels.get(channelIDLive).send(`${awayEmote}${awayTeamName} Scored!\n${awayEmote}${r.body.data.games.game[gameLOC].linescore.r.away} - ${homeEmote}${r.body.data.games.game[gameLOC].linescore.r.away}\n${r.body.data.games.game[gameLOC].status.inning_state} of the ${r.body.data.games.game[gameLOC].status.inning}\n${r.body.data.games.game[gameLOC].status.o} out(s)`);
									}
									if (bot.mlb[i].home_score != r.body.data.games.game[gameLOC].linescore.r.home) {
										bot.channels.get(channelIDLive).send(`${homeEmote}${homeTeamName} Scored!\n${awayEmote}${r.body.data.games.game[gameLOC].linescore.r.away} - ${homeEmote}${r.body.data.games.game[gameLOC].linescore.r.home}\n${r.body.data.games.game[gameLOC].status.inning_state} of the ${r.body.data.games.game[gameLOC].status.inning}\n${r.body.data.games.game[gameLOC].status.o} out(s)`);
									}
								}



								if (bot.mlb[i].is_no_hitter != r.body.data.games.game[gameLOC].status.is_no_hitter && r.body.data.games.game[gameLOC].status.is_perfect_game == "Y") {
									bot.channels.get(channelID).send(`<a:goalalert:437832364627066911><a:dabbing:439252818570772481><a:arthur:439250748132556810><a:pbjtime:439252401783046154><a:mlg:421830314965598221><a:pbjtime:439252401783046154><a:arthur:439250748132556810><a:dabbingR:439505773068943360><a:goalalert:437832364627066911>\n<a:ditto:437735051078139904> \`--- NO HITTER ALERT ---\` <a:ditto:437735051078139904>\n<a:goalalert:437832364627066911><a:dabbing:439252818570772481><a:arthur:439250748132556810><a:pbjtime:439252401783046154><a:mlg:421830314965598221><a:pbjtime:439252401783046154><a:arthur:439250748132556810><a:dabbingR:439505773068943360><a:goalalert:437832364627066911>`);
									bot.channels.get(channelID).send(`<a:goalalert:437832364627066911> \`Alert For:\` ${awayEmote} @ ${homeEmote} <a:goalalert:437832364627066911>`);
								}
								if (bot.mlb[i].is_perfect_game != r.body.data.games.game[gameLOC].status.is_perfect_game && r.body.data.games.game[gameLOC].status.is_perfect_game == "Y") {
									bot.channels.get(channelID).send(`<a:goalalert:437832364627066911><a:dabbing:439252818570772481><a:arthur:439250748132556810><a:pbjtime:439252401783046154><a:mlg:421830314965598221><a:pbjtime:439252401783046154><a:arthur:439250748132556810><a:dabbingR:439505773068943360><a:goalalert:437832364627066911>\n<a:ditto:437735051078139904> \`- PERFECT GAME ALERT -\` <a:ditto:437735051078139904>\n<a:goalalert:437832364627066911><a:dabbing:439252818570772481><a:arthur:439250748132556810><a:pbjtime:439252401783046154><a:mlg:421830314965598221><a:pbjtime:439252401783046154><a:arthur:439250748132556810><a:dabbingR:439505773068943360><a:goalalert:437832364627066911>`);
									bot.channels.get(channelID).send(`\`Alert For:\` ${awayEmote} @ ${homeEmote}`);
								}





								delete bot.mlb[r.body.data.games.game[gameLOC].game_pk];

								bot.mlb[r.body.data.games.game[gameLOC].game_pk];

								bot.mlb[r.body.data.games.game[gameLOC].game_pk] = {
									status: r.body.data.games.game[gameLOC].status.status,
									inning: r.body.data.games.game[gameLOC].status.inning,
									top_inning: r.body.data.games.game[gameLOC].status.top_inning,
									outs: r.body.data.games.game[gameLOC].status.outs,
									is_no_hitter: r.body.data.games.game[gameLOC].status.is_no_hitter,
									is_perfect_game: r.body.data.games.game[gameLOC].status.is_perfect_game,
									game_time: gameTime,
									game_time_END: gameTime + 28800000,
									away_id: r.body.data.games.game[gameLOC].away_team_id,
									away_code: r.body.data.games.game[gameLOC].away_name_abbrev,
									away_city: r.body.data.games.game[gameLOC].away_team_city,
									away_name: r.body.data.games.game[gameLOC].away_team_name,
									away_emote: awayEmote,
									away_loss: r.body.data.games.game[gameLOC].away_loss,
									away_win: r.body.data.games.game[gameLOC].away_win,
									away_score: r.body.data.games.game[gameLOC].linescore.r.away,
									home_id: r.body.data.games.game[gameLOC].home_team_id,
									home_code: r.body.data.games.game[gameLOC].home_name_abbrev,
									home_city: r.body.data.games.game[gameLOC].home_team_city,
									home_name: r.body.data.games.game[gameLOC].home_team_name,
									home_emote: homeEmote,
									home_loss: r.body.data.games.game[gameLOC].home_loss,
									home_win: r.body.data.games.game[gameLOC].home_win,
									home_score: r.body.data.games.game[gameLOC].linescore.r.home
								}
								isChangeMade = true;
							}
							if (gameStatus == "Final") {
								let finalStatus = new Promise(function(resolve, reject) {
									delete bot.mlb[r.body.data.games.game[gameLOC].game_pk];


									bot.mlb[r.body.data.games.game[gameLOC].game_pk];
									bot.mlb[r.body.data.games.game[gameLOC].game_pk] = {
										status: r.body.data.games.game[gameLOC].status.status
										// 	away_id: r.body.data.games.game[gameLOC].away_team_id,
										// 	away_code: r.body.data.games.game[gameLOC].away_name_abbrev,
										// 	away_city: r.body.data.games.game[gameLOC].away_team_city,
										// 	away_name: r.body.data.games.game[gameLOC].away_team_name,
										// 	away_score: r.body.data.games.game[gameLOC].linescore.r.away,
										// 	home_id: r.body.data.games.game[gameLOC].home_team_id,
										// 	home_code: r.body.data.games.game[gameLOC].home_name_abbrev,
										// 	home_city: r.body.data.games.game[gameLOC].home_team_city,
										// 	home_name: r.body.data.games.game[gameLOC].home_team_name,
										// 	home_score: r.body.data.games.game[gameLOC].linescore.r.home
									}

									resolve('Changed MLB bot');

									reject('Error Saving MLB JSON');
								});
								finalStatus.then(function(fromResolve) {
									//console.log(fromResolve);
									isChangeMade = true;
								}).catch(function(fromReject) {
									console.log(fromReject);
								});


							}

							// If Statement to see if a change was made in the previous Statements

							let JSONChange = new Promise(function(resolve, reject) {
								if (isChangeMade) {
									//console.log("Saving");
									fs.writeFile("./mlb.json", JSON.stringify(bot.mlb, null, 4), err => {
										if (err) throw err;

									})
									resolve('Saved MLB JSON');

									reject('Error Saving MLB JSON');
								}

							});
							JSONChange.then(function(fromResolve) {
								//console.log(fromResolve);
							}).catch(function(fromReject) {
								console.log(fromReject);
							});




						}
					} catch (error) {
						console.error(`One of the functions failed to execute.\nError: ${error}\n\n`);

						for (let i in bot.mlb) {
							delete bot.mlb[i];
						}


						fs.writeFile("./mlb.json", JSON.stringify(bot.blank, null, 4), err => {
							if (err) throw err;
							isComplete = false;
							bot.channels.get("438421948188590094").send(`ERROR: Forced Delete JSON`);
						});
					}



					// If bot.mlb is not empty it will go Here

					//console.log("Not Empty.");

					// go through and see if all games are over
					for (let i in bot.mlb) {
						if (i != "statusAll") {
							if (bot.mlb[i].status == "Pre-Game" || bot.mlb[i].status == "Preview" || bot.mlb[i].status == "In Progress" || bot.mlb[i].status == "Warmup") {
								isComplete = false;
								isStillPlaying = true;
								break;
							} else if (bot.mlb[i].status == "Game Over" || bot.mlb[i].status == "Final" || bot.mlb[i].status == "Postponed") {
								isComplete = true;
								isStillPlaying = false;
							}
						}
					}

					fs.writeFile("./mlb.json", JSON.stringify(bot.mlb, null, 4), err => {
						if (err) throw err;
						//isComplete = false;
						bot.channels.get("438421948188590094").send(`JSON Deleted`);
					});

					if (isComplete) {
						for (let i in bot.mlb) {
							delete bot.mlb[i];
						}


						fs.writeFile("./mlb.json", JSON.stringify(bot.mlb, null, 4), err => {
							if (err) throw err;
							//isComplete = false;
							bot.channels.get("438421948188590094").send(`JSON Deleted`);
						});

						moveOn = true;

					}

				}




			});
			resolve('Found Away and Home Emote');

			reject('Could not find Emote');
		});
		jsonMLB.then(function(fromResolve) {
			//console.log(fromResolve);
		}).catch(function(fromReject) {
			console.log(fromReject);
		});

		let timeNow = new Date();
		let extendedTime = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}:${timeNow.getMilliseconds()}`;
		console.log(`Time: ${extendedTime}`);
	}, 60 * 1000)
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