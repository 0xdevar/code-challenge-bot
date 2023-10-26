import { readdir, readFile } from 'node:fs/promises';

const DATA_DIR = "data";

export async function getRandomFile() {
	const files = await readdir(DATA_DIR);
	const filesCount = files.length;
	const index = Math.floor(Math.random() * filesCount);
	return files[index];
}

// factory to get the code challenge structure
export const challengeFactory = async () => {
	const file = await getRandomFile();
	const content = await readFile(`${DATA_DIR}/${file}`);
	const contentAsString = content.toString();

	const splitedContent = contentAsString.split("@@@");
	const challengeObject = {
		question: splitedContent[0].split("\n")[0],
		choices: splitedContent[1].split("\n").filter((e: string) => !["", " "].includes(e)),
			answer: Number(
				splitedContent[2]
				.split("\n")
				.filter((e: string) => !["", " "].includes(e))
				.join()
		),
	};

	return challengeObject;
};

