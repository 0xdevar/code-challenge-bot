import {getRandomChallenge} from "../repo/discord-repo.ts";
import {Challenge} from "../types/challenge.ts";
import {Client, EmbedBuilder} from "discord.js";

export class DiscordChallenge {
	private _challenge?: Challenge;
	static icons = ["1️⃣", "2️⃣", "3️⃣"];

	constructor(private client: Client) {
	}

	async setup() {
		this._challenge = await getRandomChallenge(this.client);
	}

	play(input: string | number) {
		const validIndex = this._challenge?.answer;

		if (!validIndex && validIndex !== 0) {
			return false;
		}

		const targetIcon = DiscordChallenge.icons[validIndex];

		return targetIcon && targetIcon === input;
	}

	content() {
		// here we return the final object to send
		if (!this._challenge) {
			throw new Error("Challenge is not generated");
		}

		const challenge = new EmbedBuilder()
				.setColor(0x680001)
				.setTitle("التحدي")
				.setAuthor({
					name: "0x",
					iconURL: "https://cdn.discordapp.com/icons/942802258528198666/64ee7cadddcb9eac46a09cec3c1867e2.webp?size=160"
				})
				.setThumbnail("https://cdn.discordapp.com/icons/942802258528198666/64ee7cadddcb9eac46a09cec3c1867e2.webp?size=160")
				.addFields({name: "⠀", value: "⠀"})
				.addFields({name: "السـؤال", value: this._challenge.challenge, inline: false})
				.addFields({name: "⠀", value: "⠀"})
				.setTimestamp();


		for (let i = 0; i < this._challenge.choices.length; i++) {
			const choice = this._challenge.choices[i];
			const icon = DiscordChallenge.icons[i];
			challenge.addFields({name: icon!, value: choice, inline: true});
			challenge.addFields({name: "⠀", value: "⠀"});
		}

		return challenge;
	}
}
