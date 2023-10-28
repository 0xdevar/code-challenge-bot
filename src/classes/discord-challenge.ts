import { challengeFactory } from "../functions/fn.ts";

export class DiscordChallenge {
	_challenge?: any; // todo: add strict type

	async setup() {
		this._challenge = await challengeFactory();
	}

	play(input: string | number) {
		return this._challenge.answer == input;
	}

	content() {
		const choices = this._challenge.choices.join("\n");
		const question = this._challenge.question;
		return `
${question}
		---
${choices}
		`;
	}
}
