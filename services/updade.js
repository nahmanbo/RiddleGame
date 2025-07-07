import { readFile, writeFile } from "node:fs/promises";

export async function updateData(updatedObj, filePath) {
    try {
        const fileData = await readFile(filePath, "utf8");
        const arr = JSON.parse(fileData);

        const index = arr.findIndex(obj => obj.id === updatedObj.id);
        if (index === -1) {
            console.log("Object not found for update.");
            return;
        }

        arr[index] = updatedObj;
        await writeFile(filePath, JSON.stringify(arr, null, 2));
    } catch (err) {
        console.error("Error:", err.message);
    }
}
