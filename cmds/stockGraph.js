const Discord = module.require('discord.js');
const snekfetch = require("snekfetch");
const API = [
	"https://api.iextrading.com/1.0/stock/",
	"/quote"
]
const graph = [
	"http://bigcharts.marketwatch.com/kaavio.Webhost/charts/big.chart?nosettings=1&symb=",
	"&uf=0&type=2&size=2&sid=3047&style=320&freq=1&entitlementtoken=0c33378313484ba9b46b8e24ded87dd6&time=",
	"&rand=466112938&compidx=&ma=0&maval=9&lf=1&lf2=0&lf3=0&height=335&width=579&mocktick=1/"
]

module.exports.run = async (bot, message, args) => {
	var apiSTOCK = API[0] + args[0] + API[1];

	try {
		if (args[0] == null && args[1] == null) {
			message.channel.send(`Chart time modifiers:\n \`'1d', '2d', '5d', '10d', '1m', '2m', '3m', '6m', 'YTD', '1y', '2y', '3y', '4y', '5y', '1dec'\``);
		} else {
			var url = graph[0] + args[0] + graph[1];
			await snekfetch.get(apiSTOCK).then(r => {
				var lengthG;
				var argNUM = 1;
				if (args[argNUM] == "1d") {
					lengthG = "1";
				} else if (args[argNUM] == "2d") {
					lengthG = "2";
				} else if (args[argNUM] == "5d") {
					lengthG = "3";
				} else if (args[argNUM] == "10d") {
					lengthG = "18";
				} else if (args[argNUM] == "1m") {
					lengthG = "4";
				} else if (args[argNUM] == "2m") {
					lengthG = "5";
				} else if (args[argNUM] == "3m") {
					lengthG = "6";
				} else if (args[argNUM] == "6m") {
					lengthG = "7";
				} else if (args[argNUM] == "YTD") {
					lengthG = "19";
				} else if (args[argNUM] == "1y") {
					lengthG = "8";
				} else if (args[argNUM] == "2y") {
					lengthG = "9";
				} else if (args[argNUM] == "3y") {
					lengthG = "10";
				} else if (args[argNUM] == "4y") {
					lengthG = "11";
				} else if (args[argNUM] == "5y") {
					lengthG = "12";
				} else if (args[argNUM] == "1dec") {
					lengthG = "13";
				}

				if (r.body.changePercent > 0) {
					var color = '35794B';
				} else {
					var color = '793535';
				}

				const embed = new Discord.RichEmbed()
					.setColor(color)
					.setImage(graph[0] + args[0] + graph[1] + lengthG + graph[2]);
				message.channel.send({
					embed
				});
			});
		}
	} catch (error) {
		console.error('One of the functions failed to execute.');
		//message.channel.send(`$${args[0].toUpperCase()} Not Found`);
	}
}

module.exports.help = {
	name: "c"
}