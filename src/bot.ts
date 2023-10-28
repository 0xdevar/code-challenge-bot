import { challengeFactory } from "./functions/fn.ts";
import * as config from "./config.ts";
import { Client, GatewayIntentBits, Events, TextChannel, Message } from "discord.js";

import dotenv from "dotenv";
dotenv.config();

let g_isActivated = false;

class DiscordChallenge
{
	channel: TextChannel;
	client: Client;
	_messageId?: Message;
	_challenge?: any; // todo: add strict type
	constructor(client: Client, channel: TextChannel) {
		this.channel = channel;
		this.client = client;
	}

	async _send(): Promise<Message> {
		this._challenge = await challengeFactory();
		return this.channel?.send(this._challenge.question);
	}

	async _handleUserInput(message: Message) {
			const author = message.author;
			const content = message.content;

	}

	async create() {
		this._messageId = await this._send()
		this.client.on(Events.MessageCreate, this._handleUserInput);
	}

	destroy() {
		this.client.off(Events.MessageCreate, this._handleUserInput);
	}
}

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

async function sendChallenge(channel: TextChannel): Promise<Message> {
	const challenge = await challengeFactory();
	return channel?.send(challenge.question);
}

async function boot() {
	const targetChannel = await client.channels.fetch(config.CHANNEL_ID);
	if (!targetChannel) {
		throw new Error(`Could not find the channel ${config.CHANNEL_ID}`);
	}
	const interval = 1000 * (config.CHALLENGE_INTERVAL ?? 30);
	setInterval(() => sendChallenge(targetChannel as TextChannel), interval);
}

client.on(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user!.tag}!`);
});

client.on(Events.MessageCreate, async (message: Message) => {
	if (g_isActivated) {
		return;
	}

	boot();
	g_isActivated = true;
});

client.login(TOKEN);
