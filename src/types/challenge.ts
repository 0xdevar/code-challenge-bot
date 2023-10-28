export class Challenge {
	private constructor(public challenge: string,
						public choices: string[],
						public answer: number) {

	}

	static parse(input: string): Challenge {
		const chunks = input.split("@@@");

		if (chunks.length < 3) {
			throw new Error("Invalid input format to parse.");
		}

		const question = chunks[0];
		const choices = chunks[1].split("\n").filter(l => l !== "");
		const answer = parseInt(chunks[2].split("\n").find(l => l !== "")!);

		if (!answer && answer !== 0) {
			throw new Error(`Could not parse ${answer}`);
		}

		return new Challenge(question, choices, answer);
	}
}