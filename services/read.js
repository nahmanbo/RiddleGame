import { readFile } from "node:fs/promises";

export async function readData(filePath) {
    try {
        const fileData = await readFile(filePath, "utf8");
        const arr = JSON.parse(fileData);
        return arr;
    } catch (err) {
        console.error("Error:", err.message);
        return [];
    }
}

//--------------------------------------------------------------
export async function readFilterData(filePath, filterObj) {
    const arr = await readData(filePath);

    const key = Object.keys(filterObj)[0];
    const value = filterObj[key];

    return arr.filter(obj => obj[key] === value);
}

