import {Client, Events, GatewayIntentBits, Message} from "discord.js";
import {DiscordChallengeManager} from "./classes/discord-challenge-manager.ts";

import * as config from "./config.ts";

let g_isActivated = false;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	]
});

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

client.login(config.TOKEN);
