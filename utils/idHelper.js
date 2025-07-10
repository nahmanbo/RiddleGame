import { readFile, writeFile } from "node:fs/promises";

const COUNTERS = {
  players: "./lib/playerId.txt",
  riddles: "./lib/riddleId.txt"
};

//====================================
// מחזיר מזהה חדש לפי סוג ('players' או 'riddles')
//====================================
export async function getNextId(type) {
  const filePath = COUNTERS[type];
  if (!filePath) throw new Error("Unknown ID type");

  try {
    let lastId = 0;

    try {
      const content = await readFile(filePath, "utf8");
      lastId = parseInt(content);
    } catch {
      // אם הקובץ לא קיים, מתחילים מ־0
    }

    const newId = lastId + 1;
    await writeFile(filePath, newId.toString());
    return newId;

  } catch (err) {
    console.error(`Failed to get next ${type} ID:`, err.message);
    return Date.now(); // fallback
  }
}
