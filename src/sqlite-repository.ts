import {Database} from "bun:sqlite";
import {User} from "./types/user.ts";

const db = new Database("./data.db");

db.run(`CREATE TABLE IF NOT EXISTS users (
	id VARCHAR(32) PRIMARY KEY,
	score INT NOT NULL DEFAULT 0
);`);

export function addUserScore(id: string, score: number): void {
	const query = db.query(`
	INSERT INTO users (id, score) VALUES (?, ?)
		ON CONFLICT (id)
			DO UPDATE SET score = users.score + ? WHERE id = ?;
`);
	query.run(id, score, score, id);
}

export function getUsersOrderedByScores(limit: number = 10): User[] {
	const query = db.query(`SELECT id, score FROM users ORDER BY score DESC LIMIT ?;`);
	return query.all(limit) as User[];
}

export function getUserScore(id: string): User | undefined {
	const query = db.query(`SELECT id, score FROM users WHERE id = ?;`);
	return query.get(id) as User;
}
