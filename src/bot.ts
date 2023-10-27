import { challengeFactory } from "./functions/fn.ts";


import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
import dotenv from "dotenv";
dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN;

client.on("ready", () => {
	console.log(`Logged in as ${client.user!.tag}!`);
});

client.on("messageCreate", async (message) => {

	switch(message.content) {
		case "ping":
			message.reply("Pong!");
		break;
		case "lala":
			message.reply("fityou");
		break;
	}
});

client.login(TOKEN);

