// Creates the date variable used to get the current date
var d = new Date();
// API for finding the games on the current date
const api = "";
// Each Team has their own api which is where this one is calling
const apiTEAM = "";
// There is an API for each individual game
// Add the game ID in between apiGAME[0] and apiGAME[1]
const apiGAME = []
// snekfetch is used to get the JSON data from the API
const snekfetch = require("snekfetch");
// discord is used to do the obvious which is interact with discord
const Discord = module.require('discord.js');



// This is what runs when the !**** command is used
module.exports.run = async (bot, message, args) => {
	// Need to work out the plan here for how I want the command to work
	// Probably will need a JSON folder to store all the data collected here
	message.channel.send("This command is not ready.");
}

// The name represents the !**** command
module.exports.help = {
	name: "nba"
}