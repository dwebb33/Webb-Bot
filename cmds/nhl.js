const fs = require("fs");
// Creates the date variable used to get the current date
var d = new Date();
// API for finding the games on the current date
const api = "https://statsapi.web.nhl.com/api/v1/schedule?startDate=" + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + "&endDate=" + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
// Each Team has their own api which is where this one is calling
const apiTEAM = "https://statsapi.web.nhl.com/api/v1/teams/";
// There is an API for each individual game
// Add the game ID in between apiGAME[0] and apiGAME[1]
const apiGAME = [
	"http://statsapi.web.nhl.com/api/v1/game/",
	"/feed/live"
]
// snekfetch is used to get the JSON data from the API
const snekfetch = require("snekfetch");
// discord is used to do the obvious which is interact with discord
const Discord = module.require('discord.js');




// This is what runs when the !**** command is used
module.exports.run = async (bot, message, args) => {
	var channelID = bot.channels.get("370023644740583435");
	message.channel.channelID.send("test");

	// Need to work out the plan here for how I want the command to work
	// Probably will need a JSON folder to store all the data collected here
	try {


		var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
		// Variables
		var numGames; // Number of games
		var gameID = []; // ID of each game
		var gameStartTime = [];
		var gameAPI = [];

		console.log(date);

		// First API function to get number of games and gameID
		await snekfetch.get(api).then(r => {

			// Get the number of games for Today
			Promise.all([
					// Stores number of games within the variable
					numGames = r.body.dates[0].totalGames,
				])
				.catch(() => console.error('Number of games failed to be added.'));

			//sets the arrays to the size of how many games
			gameID = new Array(numGames);
			gameAPI = new Array(numGames);
		});
		console.log("Num Games: " + numGames);




		await snekfetch.get(api).then(r => {
			// Loops to add the game ID to the array
			for (var i = 0; i < numGames; i++) {
				Promise.all([
						gameID[i] = r.body.dates[0].games[i].gamePk,
						console.log("5")
					])
					.catch(() => console.error('An ID of a game failed to be added.'));
				console.log(gameID[i]);
			}
			for (var i = 0; i < numGames; i++) {
				Promise.all([
						gameAPI[i] = "http://statsapi.web.nhl.com/api/v1/game/" + gameID[i] + "/feed/live"
					])
					.catch(() => console.error('An ID of a game failed to be added.'));
				console.log(gameAPI[i]);
			}
		});





		var teams = Array.from({
			length: numGames
		}, () => new Array(2));
		console.log("7");

		bot.nhl[date] = {
			[gameID[i]]: {}
		}

		var obj = {
			game: []
		}
		for (var i = 0; i < numGames; i++) {

			await snekfetch.get(gameAPI[i]).then(r => {
				var jsonCon;



				console.log("8");
				console.log(gameAPI[i]);

				console.log("9");
				teams[i][0] = r.body.liveData.linescore.teams.home.team.name;
				console.log(teams[i][0]);
				teams[i][1] = r.body.liveData.linescore.teams.away.team.name;
				console.log(teams[i][1]);

				console.log("10");
				console.log(date);
				console.log(gameID[i]);



				fs.readFile('./nhl.json', function(err, data) {
					// json = JSON.parse(data)
					obj.game.push({
						[date]: [{
							[gameID[i]]: {
								"status": r.body.gameData.status.statusCode,
								"gameType": r.body.gameData.status.detailedState,
								"teams": {
									"away": {
										"teamID": r.body.gameData.teams.away.id,
										"teamFullName": r.body.liveData.linescore.teams.away.team.name,
										"teamABBR": r.body.liveData.linescore.teams.away.team.abbreviation,
										"teamName": r.body.gameData.teams.away.teamName,
										"teamLocation": r.body.gameData.teams.away.locationName,
										"score": r.body.liveData.linescore.teams.away.goals,
									},
									"home": {
										"teamID": r.body.gameData.teams.home.id,
										"teamFullName": r.body.liveData.linescore.teams.home.team.name,
										"teamABBR": r.body.liveData.linescore.teams.home.team.abbreviation,
										"teamName": r.body.gameData.teams.home.teamName,
										"teamLocation": r.body.gameData.teams.home.locationName,
										"score": r.body.liveData.linescore.teams.home.goals,
									}
								}
							}
						}]
					})
					fs.writeFile("./nhl.json", JSON.stringify(obj), 'utf8');
				})

				// bot.nhl[date] = {
				// 	[gameID[i]]: {
				// 		"status": r.body.gameData.status.statusCode,
				// 		"gameType": r.body.gameData.status.detailedState,
				// 		"teams": {
				// 			"away": {
				// 				"teamID": r.body.gameData.teams.away.id,
				// 				"teamFullName": r.body.liveData.linescore.teams.away.team.name,
				// 				"teamABBR": r.body.liveData.linescore.teams.away.team.abbreviation,
				// 				"teamName": r.body.gameData.teams.away.teamName,
				// 				"teamLocation": r.body.gameData.teams.away.locationName,
				// 				"score": r.body.liveData.linescore.teams.away.goals,
				// 			},
				// 			"home": {
				// 				"teamID": r.body.gameData.teams.home.id,
				// 				"teamFullName": r.body.liveData.linescore.teams.home.team.name,
				// 				"teamABBR": r.body.liveData.linescore.teams.home.team.abbreviation,
				// 				"teamName": r.body.gameData.teams.home.teamName,
				// 				"teamLocation": r.body.gameData.teams.home.locationName,
				// 				"score": r.body.liveData.linescore.teams.home.goals,
				// 			}
				// 		}
				// 	}
				// }
				console.log("11");





				// fs.writeFile("./nhl.json", JSON.stringify(bot.nhl[date], null, 4), err => {
				// 	if (err) throw err;
				// 	console.log("Done.");
				// })

			});
		}




		let embed = await new Discord.RichEmbed()
			.setAuthor(`Stanley Cup Playoffs`)
			.setDescription(`${numGames} games Today`)
			.setTitle("Round 1")
			.setColor("#9fa2a4")
			.setThumbnail("https://image.ibb.co/fh6Q1n/Stanley_Cup_Playoffs_small.png");
		message.channel.send({
			embed: embed
		});

		for (var i = 0; i < numGames; i++) {
			await message.channel.send(`**${teams[i][1]}** *at* **${teams[i][0]}**`);
		}



	} catch (error) {
		console.error('One of the functions failed to execute.');
		message.channel.send('One of the functions failed to execute.');
	}
}

// The name represents the !**** command
module.exports.help = {
	name: "nhl"
}