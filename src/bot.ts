import {Client, Events, GatewayIntentBits, Message} from "discord.js";
import {DiscordChallengeManager} from "./classes/discord-challenge-manager.ts";

import * as config from "./config.ts";

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

client.on(Events.MessageCreate, (_: Message) => {
	if (g_isActivated) {
		return;
	}

	boot();
	g_isActivated = true;
});

client.login(TOKEN);
