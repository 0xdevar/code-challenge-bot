import {Client, GatewayIntentBits, Events, Message} from "discord.js";
import dotenv from "dotenv";

import * as config from "./config.ts";
import {DiscordChallengeManager} from "./classes/discord-challenge-manager.ts";

dotenv.config();

let g_isActivated = false;

function env(name: string) {
	// @ts-ignore: check if this running using deno
	if (globalThis.Deno) {
		// @ts-ignore: indeed was running in deno
		return Deno.env.get(name);
	}
	// @ts-ignore: indeed running for node api
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

function boot() {
	const challengeManager = new DiscordChallengeManager(client, config.CHANNEL_ID);
	challengeManager.boot();
}

client.on(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user!.tag}!`);
});

client.on(Events.MessageCreate, (message: Message) => {
	if (message.content == 'Ping') {
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
