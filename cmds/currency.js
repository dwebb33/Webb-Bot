const Discord = module.require('discord.js');
const fs = require("fs");
const snekfetch = require("snekfetch");

const TARGET_MINUTE = 0; // Minute of the hour when the chest will refresh, 30 means 1:30, 2:30, etc.
const OFFSET = 10; // Notification will be sent this many minutes before the target time, must be an integer
const NOTIFY_MINUTE = (TARGET_MINUTE < OFFSET ? 60 : 0) + TARGET_MINUTE - OFFSET;


module.exports.run = async (bot, message, args) => {
	console.log("Ran");
	try {

	} catch (error) {
		console.error('One of the functions failed to execute.');
		message.channel.send('One of the functions failed to execute.');
	}
}

module.exports.help = {
	name: "curr"
}