import {Client, TextChannel, Message, Events, EmbedBuilder, Embed} from "discord.js";
import {DiscordChallenge} from "./discord-challenge.ts";


const repo = await (async () => {
	if (process.env.NODE_ENV === "dev") {
		console.log("using in memory repository");
		return await import("../memory-repository.ts");
	} else {
		console.log("using in sqlite repository");
		return await import("../sqlite-repository.ts");
	}
})();

import * as config from "../config.ts";

export class DiscordChallengeManager {
	channelId: string;
	client: Client;
	channel?: TextChannel;

	private _challenge?: DiscordChallenge;
	private _currentMessage?: Message;

	constructor(client: Client, channelId: string) {
		this.client = client;
		this.channelId = channelId;

		// !! we must bind it to allow the `method` to access `this` when we attach it to an event
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

	async handleInput(message: Message) {
		const author = message.author;

		const challenge = this._challenge;

		if (!challenge?.play(message.content)) {
			return;
		}

		this.destroy(); // NOTE: we should clear the event first to avoid registering two events

		repo.addUserScore(author.id, 1); // todo: add the score it to config


		const embeds = this._currentMessage?.embeds as Embed[];

		embeds[0].fields.push({name: "⠀", value: "⠀"});
		embeds[0].fields.push({name: "الفائز", value: `<@${author.id}>`});
		embeds[0].fields.push({name: "⠀", value: "⠀"});

		// add leaderboard
		const leaderboards = repo.getUsersByScores(5);

		for (let i = 0; i < leaderboards.length; i++) {
			const user = leaderboards[i];
			embeds[0].fields.push({name: (i + 1).toString(), value: `<@${user.id}> | ${user.score}`, inline: false});
		}

		await this._currentMessage?.edit({embeds});

		setTimeout(() => {
			this.setup();
		}, config.CHALLENGE_INTERVAL);
	}

	async setup() {
		if (this._challenge) {
			console.log("Challenge already setup.");
			return;
		}

		this._challenge = new DiscordChallenge(this.client);

		await this._challenge.setup();

		const content = this._challenge.content();

		this._currentMessage = await this.channel?.send({embeds: [content]});

		this.client.on(Events.MessageCreate, this.handleInput);
	}

	destroy() {
		this._challenge = undefined;
		this.client.off(Events.MessageCreate, this.handleInput);
	}
}
