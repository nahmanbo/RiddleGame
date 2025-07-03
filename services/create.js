import { readFile, writeFile } from "node:fs/promises";

export async function createData(obj, filePath) {
    try {
        const fileData = await readFile(filePath, "utf8");
        const arr = JSON.parse(fileData);
        arr.push(obj);
        await writeFile(filePath, JSON.stringify(arr, null, 2));
    } catch (err) {
        console.error("Error:", err.message);
    }
}
