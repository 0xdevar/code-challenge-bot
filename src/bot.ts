import { Client, GatewayIntentBits, Events, TextChannel, Message } from "discord.js";
import dotenv from "dotenv";

import { challengeFactory } from "./functions/fn.ts";
import * as config from "./config.ts";
import { DiscordChallengeManager } from "./classes/discord-challenge-manager.ts";

dotenv.config();

let g_isActivated = false;

function env(name: string) {
	// @ts-ignore
	if (globalThis.Deno) {
		// @ts-ignore
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
	const challengeManager = new DiscordChallengeManager(client, config.CHANNEL_ID);
	challengeManager.boot();
}

client.on(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user!.tag}!`);
});

client.on(Events.MessageCreate, async (message: Message) => {

	if (message.content == 'ping') {
		message.reply("Pong!");
		return;
	}

	if (g_isActivated) {
		return;
	}

	boot();
	g_isActivated = true;
});

client.login(TOKEN);
