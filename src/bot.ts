import { challengeFactory } from "./functions/fn.ts";
import * as config from "./config.ts";
import { Client, GatewayIntentBits, Events } from "discord.js";

import dotenv from "dotenv";
dotenv.config();

function env(name: string) {
	if (globalThis.Deno) {
		return Deno.env.get(name);
	}
	return process.env[name];
}

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	] 
});

const TOKEN = env("DISCORD_TOKEN");

async function boot() {
	const channels = await client.channels.fetch(config.CHANNEL_ID);
}

client.on(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user!.tag}!`);
	boot();
});


client.on(Events.MessageCreate, async (message) => {
	if (message.author.bot) {
		return;
	}

	const challenge = await challengeFactory();

	message.reply(challenge.question);
});

client.login(TOKEN);

