import {Challenge} from "../types/challenge.ts";
import {readdir, readFile} from "node:fs/promises";

const DATA_DIR = "data";

export async function getRandomFile(): Promise<string> {
	const files = await readdir(DATA_DIR);
	const filesCount = files.length;
	const index = Math.floor(Math.random() * filesCount);
	return files[index];
}

export async function getRandomChallenge(): Promise<Challenge> {
	const file = await getRandomFile();
	const content = await readFile(`${DATA_DIR}/${file}`);
	const contentAsString = content.toString();
	return Challenge.parse(contentAsString);
}
