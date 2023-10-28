import { challengeFactory } from "../functions/fn.ts";

import { Client, GatewayIntentBits, Events, TextChannel, Message } from "discord.js";

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
		this._messageId = await this._send();
		this.client.on(Events.MessageCreate, this._handleUserInput);
	}

	destroy() {
		this.client.off(Events.MessageCreate, this._handleUserInput);
	}
}
