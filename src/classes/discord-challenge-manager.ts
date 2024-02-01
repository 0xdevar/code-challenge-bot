import {Client, Embed, Events, Message, MessageType, TextChannel, EmbedBuilder} from "discord.js";

import * as config from "../config.ts";
import {DiscordChallenge} from "./discord-challenge.ts";


const repo = await (async () => {
	if (process.env.NODE_ENV === "dev") {
		return await import("../memory-repository.ts");
	} else {
		return await import("../sqlite-repository.ts");
	}
})();


export class DiscordChallengeManager {
	channelId: string;
	client: Client;
	channel?: TextChannel;

	private _challenge?: DiscordChallenge;
	private _currentMessage?: Message;
	private _repeatInterval?: NodeJS.Timer;

	constructor(client: Client, channelId: string) {
		this.client = client;
		this.channelId = channelId;

		// !! we must bind it to allow the `method` to access `this` when we attach it to an event
		this.handleInput = this.handleInput.bind(this);
	}

	async boot(): Promise<void> {
		this.channel = await this.client.channels.fetch(this.channelId) as TextChannel;

		if (!this.channel) {
			throw Error(`Channel [${this.channelId}] is not found.`);
		}

		await this.setup();
	}

	async handleInput(message: Message): Promise<void> {
		if (message.type !== MessageType.Reply) {
			return;
		}

		const challengeMessage = message.reference;

		if (challengeMessage?.messageId !== this._currentMessage?.id) {
			return;
		}

		if (message.content == "top") {
			// add leaderboard
			const leaderboards = await repo.getUsersOrderedByScores(10);
			const icons = ["🥇", "🥈", "🥉"];

			const embeds = new EmbedBuilder();

			embeds.setTitle("Leaderboard");
			embeds.setAuthor({name: "0x"});

			for (let i = 0; i < leaderboards.length; i++) {
				const user = leaderboards[i];
				const icon = icons.shift() ?? i + 1;
				embeds.addFields({
					name: `${icon}`,
					value: `<@${user.id}> 🪙 **${user.score}**`,
					inline: false
				});
			}

			await message.reply({embeds: [embeds]});
			return;
		}

		const author = message.author;

		const challenge = this._challenge;


		if (!challenge?.canPlay(author.id)) {
			message.react("🤫");
			return;
		}

		challenge?.addTries(author.id);

		if (!challenge?.isValidInput(message.content)) {
			message.react("❌");
			return;
		}

		this.destroy(); // NOTE: we should clear the event first to avoid registering two events

		message.react("🎉");

		const score = challenge.points();
		repo.addUserScore(author.id, score);


		const embeds = this._currentMessage?.embeds as Embed[];

		const userScore = repo.getUserScore(author.id)?.score ?? 0;

		embeds[0].fields.push({name: "⠀", value: "⠀"});
		embeds[0].fields.push({name: "الفائز 🏆", value: `<@${author.id}> 🪙 **${userScore}**`});
		embeds[0].fields.push({name: "⠀", value: "⠀"});

		// add leaderboard
		const leaderboards = repo.getUsersOrderedByScores(3);
		const icons = ["🥇", "🥈", "🥉"];

		for (let i = 0; i < leaderboards.length; i++) {
			const user = leaderboards[i];
			const icon = icons.shift();
			embeds[0].fields.push({
				name: "",
				value: `${icon} <@${user.id}> 🪙 **${user.score}**`,
				inline: false
			});
		}

		await this._currentMessage?.edit({embeds});

		setTimeout(() => {
			this.setup();
		}, config.CHALLENGE_INTERVAL);
	}

	async setup(): Promise<void> {
		if (this._challenge) {
			console.log("Challenge already setup.");
			return;
		}

		this._challenge = new DiscordChallenge(this.client);

		await this._challenge.setup();

		const content = this._challenge.content();

		this._currentMessage = await this.channel?.send(content);

		this._repeatInterval = setInterval(async () => {
			this._challenge?.resetTries();
			await this._currentMessage?.delete();
			this._currentMessage = await this.channel?.send(content);
		}, config.CHALLENGE_INTERVAL);

		this.client.on(Events.MessageCreate, this.handleInput);
	}

	destroy(): void {
		clearInterval(this._repeatInterval);
		this._challenge = undefined;
		this.client.off(Events.MessageCreate, this.handleInput);
	}
}
