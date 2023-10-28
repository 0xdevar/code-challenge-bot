import {Client, TextChannel, Message, Events} from "discord.js"
import {DiscordChallenge} from "./discord-challenge.ts";

export class DiscordChallengeManager
{
	channelId: string;
	client: Client;
	channel?: TextChannel;
	_challenge?: any;

	constructor(client: Client, channelId: string) {
		this.client = client;
		this.channelId = channelId;

		// we must bind it to allow the `method` to access `this` when we attach it to an event
		this.handleInput = this.handleInput.bind(this);
	}

	async boot() {
		this.channel = await this.client.channels.fetch(this.channelId) as TextChannel;

		// check channel id 
		if (!this.channel) {
			throw Error(`Channel [${this.channelId}] is not found.`);
		}

		await this.setup();
	}

	handleInput(message: Message) {
		const author = message.author;

		const challenge = this._challenge;
		if (!challenge.play(message.content)) {
			console.log("failed", message.content);
			return;
		}

		console.log("success", message.content);

		// todo: add points to author id

		this.destroy();
		this.setup(); // recreate a game, todo: execute after X time
	}

	async setup() {
		this._challenge = new DiscordChallenge();
		await this._challenge.setup();

		const content = this._challenge.content();
		const message = await this.channel?.send(content);

		this.client.on(Events.MessageCreate, this.handleInput);
	}

	async destroy() {
		this.client.off(Events.MessageCreate, this.handleInput);
	}
}
