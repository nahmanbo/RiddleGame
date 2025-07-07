import { readFile, writeFile } from "node:fs/promises";

export async function deleteData(id, filePath) {
    try {
        const fileData = await readFile(filePath, "utf8");
        const arr = JSON.parse(fileData);

        const newArr = arr.filter(obj => obj.id !== id);

        await writeFile(filePath, JSON.stringify(newArr, null, 2));
    } catch (err) {
        console.error("Error:", err.message);
    }
}
