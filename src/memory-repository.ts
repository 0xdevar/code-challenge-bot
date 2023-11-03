import {User} from "./types/user.ts";

const memory: Record<string, number> = {};

export function addUserScore(id: string, score: number): void {
	memory[id] = score + (memory[id] ?? 0);
}

export function getUsersByScores(limit: number = 10): User[] {
	const output: User[] = [];
	for (const [id, score] of Object.entries(memory)) {
		if (limit && output.length >= limit) {
			break;
		}
		output.push({id, score});
	}
	return output;
}
