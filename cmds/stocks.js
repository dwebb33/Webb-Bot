const Discord = module.require('discord.js');
const snekfetch = require("snekfetch");
const API = [
	"https://api.iextrading.com/1.0/stock/",
	"/quote"
]
const graph = [
	"http://bigcharts.marketwatch.com/kaavio.Webhost/charts/big.chart?nosettings=1&symb=",
	"&uf=0&type=2&size=2&sid=3047&style=320&freq=1&entitlementtoken=0c33378313484ba9b46b8e24ded87dd6&time=8&rand=466112938&compidx=&ma=0&maval=9&lf=1&lf2=0&lf3=0&height=335&width=579&mocktick=1/"
]

module.exports.run = async (bot, message, args) => {
	var apiSTOCK = API[0] + args[0] + API[1];
	try {
		var url = graph[0] + args[0] + graph[1];
		await snekfetch.get(apiSTOCK).then(r => {
			var userID = message.author.id;
			//<@${userID}>
			var marketCap = r.body.marketCap
			message.channel.send(`\`\`\`
${r.body.companyName} (${r.body.symbol})
${r.body.primaryExchange}
${r.body.sector} Sector

Open: ${r.body.open}				Close: ${r.body.close}
Latest Price: ${r.body.latestPrice}		Latest Volume: ${r.body.latestVolume}
Change: ${r.body.change} (${r.body.changePercent}%)   Market Cap: ${marketCap.toLocaleString('en')}
PE Ratio: ${r.body.peRatio}
Week 52 High: ${r.body.week52High}		 Week 52 Low: ${r.body.week52Low}
\`\`\``);

		});
	} catch (error) {
		console.error('One of the functions failed to execute.');
		message.channel.send(`$${args[0].toUpperCase()} Not Found`);
	}
}

module.exports.help = {
	name: "stock"
}