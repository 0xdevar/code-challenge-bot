export const file_num = (num: number, power10: number) => {
    const power = 10 ** power10;
    const getNumberArr = (n: number) => String(n).split("");
    let _0day: number[] = [];

    getNumberArr(power).map((_) => _0day.push(0));
    _0day = _0day.slice(0, -getNumberArr(num).length);
    _0day.push(num);

    return _0day.join("");
};

export const getQuestion = async (folderName: string, fileNumber: number) => {
    const power10 = 6;
    const file_select = await Bun.file(
        `src/${folderName}/q_${file_num(fileNumber, power10)}.txt`
    ).text();
    const file_arr = file_select.split("@@@");

    console.log(file_select);

    const file_obj = {
        question: file_arr[0].split("\n")[0],
        choices: file_arr[1].split("\n").filter((e) => !["", " "].includes(e)),
        anser: Number(
            file_arr[2]
                .split("\n")
                .filter((e) => !["", " "].includes(e))
                .join()
        ),
    };

    return file_obj;
};
