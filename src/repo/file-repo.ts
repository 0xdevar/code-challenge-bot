import {readdir, readFile} from "node:fs/promises";
import {Challenge} from "../types/challenge.ts";

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
	const finalContent = contentAsString.replace(/(^```|```$)/g, "");
	return Challenge.parse(finalContent);
}
