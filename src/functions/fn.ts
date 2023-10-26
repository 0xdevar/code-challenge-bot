import { readdir, readFile } from 'node:fs/promises';

const DATA_DIR = "data";

export async function getRandomFile() {
	const files = await readdir(DATA_DIR);
	const filesCount = files.length;
	const index = Math.floor(Math.random() * filesCount);
	return files[index];
}

export const file_num = (num: number, power10: number) => {
    const power = 10 ** power10;
    const getNumberArr = (n: number) => String(n).split("");
    let _0day: number[] = [];

    getNumberArr(power).map((_) => _0day.push(0));
    _0day = _0day.slice(0, -getNumberArr(num).length);
    _0day.push(num);

    return _0day.join("");
};

	// factory to get the code challenge structure
export const challengeFactory = async () => {
	const file = await getRandomFile();
	const content = await readFile(`${DATA_DIR}/${file}`);
	const contentAsString = content.toString();

	const file_arr = contentAsString.split("@@@");
	const file_obj = {
		question: file_arr[0].split("\n")[0],
		choices: file_arr[1].split("\n").filter((e) => !["", " "].includes(e)),
			answer: Number(
				file_arr[2]
				.split("\n")
				.filter((e) => !["", " "].includes(e))
				.join()
		),
	};

	return file_obj;
};

