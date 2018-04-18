//
const fs = require("fs");
var d = new Date();
const api = "https://statsapi.web.nhl.com/api/v1/schedule?startDate=" + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + "&endDate=" + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
const apiTEAM = "https://statsapi.web.nhl.com/api/v1/teams/";
const apiGameA = "http://statsapi.web.nhl.com/api/v1/game/"
const apiGameB = "/feed/live"
// const api = "https://nhl-score-api.herokuapp.com/api/scores/latest";
const snekfetch = require("snekfetch");
const Discord = module.require('discord.js');
// 							1       2   3   4   5   6   7   8   9   10  11  12  13  14  15                       16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31
const groupIDs = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "<&435919147101323265>", "", "", "", "", "", "", "", "", "", "", "", "", "<&435919191221207060>", "", "", "435919255909826612"];


module.exports.run = async (bot, message, args) => {
	try {
		// Array for each seperate name of each seperate team
		var teams = Array.from({
			length: 31
		}, () => new Array(5));

		// use snekfetch to gather all 5 team names (ID, name, abbreviation, teamName, locationName)
		await snekfetch.get(apiTEAM).then(t => {
			// Loop to put all the different names of each team within the 2D array
			for (var i = 0; i <= 30; i++) {
				Promise.all([
						teams[i][0] = t.body.teams[i].id,
						teams[i][1] = t.body.teams[i].name,
						teams[i][2] = t.body.teams[i].abbreviation,
						teams[i][3] = t.body.teams[i].teamName,
						teams[i][4] = t.body.teams[i].locationName
					])
					.catch(() => console.error('One of the names failed to be added.'));
			}
		});

		var gameID = "";
		await snekfetch.get(api).then(g => {
			gameID = g.body.dates[0].games[0].gamePk;
		});

		const response = await snekfetch.get(`${apiGameA}${gameID}${apiGameB}`);

		await snekfetch.get(api).then(r => {
			//Number of games for Today
			bot.nhl[gameID] = {
				away: {
					score: r.body.dates[0].games[0].teams.away.score,
					name: r.body.dates[0].games[0].teams.away.team.name
				},
				home: {
					score: r.body.dates[0].games[0].teams.home.score,
					name: r.body.dates[0].games[0].teams.home.team.name
				},
				period: {
					Period: response.body.liveData.linescore.currentPeriodOrdinal,
					timeRemaining: response.body.liveData.linescore.currentPeriodTimeRemaining
				}
			}
			fs.writeFile("./nhl.json", JSON.stringify(bot.nhl, null, 4), err => {
				if (err) throw err;
				console.log("Done.");
			})

			message.channel.send(`${bot.nhl[gameID].away.name} ${bot.nhl[gameID].away.score} - ${bot.nhl[gameID].home.name} ${bot.nhl[gameID].home.score}`);
			message.channel.send(`${bot.nhl[gameID].period.timeRemaining} of ${bot.nhl[gameID].period.Period}`);


			var numGames = "";
			Promise.all([
					numGames = r.body.dates[0].totalGames,
				])
				.catch(() => console.error('Number of games failed to be added.'));
			console.log(numGames);

			// for (var i = 0; i <= 30; i++) {
			// 	Promise.all([
			// 			console.log(teams[i][0] + "," + teams[i][1] + "," + teams[i][2] + "," + teams[i][3] + "," + teams[i][4]),
			// 		])
			// 		.catch(() => console.error('Number of games failed to be added.'));
			// }

			var awayScore = "";
			var awayName = "";

			var homeScore = "";
			var homeName = "";

			var homeRecord = "";
			var awayRecord = "";

			var homeABBR = "";
			var awayABBR = "";


			var wantedTeam = args[0];
			if (wantedTeam == null) {
				let embed = new Discord.RichEmbed()
					.setAuthor(`Stanley Cup Playoffs`)
					.setDescription(`${numGames} games Today`)
					.setTitle("Round 1")
					.setColor("#9fa2a4")
					.setThumbnail("https://image.ibb.co/fh6Q1n/Stanley_Cup_Playoffs_small.png");
				message.channel.send({
					embed: embed
				});

				for (var i = 0; i < numGames; i++) {
					Promise.all([
							awayScore = r.body.dates[0].games[i].teams.away.score,
							awayName = r.body.dates[0].games[i].teams.away.team.name,
							awayRecord = r.body.dates[0].games[i].teams.away.leagueRecord.wins,

							homeScore = r.body.dates[0].games[i].teams.home.score,
							homeName = r.body.dates[0].games[i].teams.home.team.name,
							homeRecord = r.body.dates[0].games[i].teams.home.leagueRecord.wins,
						])
						.catch(() => console.error('One of the score, name or records failed to be added.'));
					// (ID, name, abbreviation, teamName, locationName)
					var awayBOOL = false;
					var homeBOOL = false;
					for (var x = 0; x <= 30; x++) {
						//for (var j = 0; j <= 5; j++) {
						if (awayName === teams[x][1]) {
							awayABBR = teams[x][2];
							awayBOOL = true;
						}
						if (homeName === teams[x][1]) {
							homeABBR = teams[x][2];
							homeBOOL = true;
						}
						if (homeBOOL === true && awayBOOL === true) {
							break;
						}
						//}
					}

					message.channel.send(`**${awayName}** ${awayScore} - **${homeName}** ${homeScore} \n${awayABBR} ${awayRecord} *to* ${homeABBR} ${homeRecord}`);
				}
			} else if (wantedTeam !== null) {
				// for (var x = 0; x <= 30; x++) {
				// 	for (var j = 0; j <= 5; j++) {
				// 		if (args[1] == null) {
				//
				// 		}
				// 	}
				// }
			}
		});


	} catch (error) {
		console.error('One of the functions failed to execute.');
	}
	console.log("!NHL is over");
}

module.exports.help = {
	name: "nhl"
}