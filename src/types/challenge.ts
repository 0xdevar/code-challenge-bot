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

		const question = chunks[0].split("\n").filter(l => l !== "").join();
		const choices = chunks[1].split("\n").filter(l => l !== "");
		const answer = parseInt(chunks[2].split("\n").find(l => l !== "")!);

		if (!answer) {
			throw new Error("Could not parse");
		}

		return new Challenge(question, choices, answer);
	}
}