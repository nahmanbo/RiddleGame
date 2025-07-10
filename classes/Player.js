import { readFile } from "node:fs/promises";
import { getNextId } from "../utils/idHelper.js";

export default class Player {
  //====================================
  constructor(name, id = null) {
    this.name = name;
    this.id = id; // יוקצה רק אם יוגדר – אחרת נביא מהקובץ

    this.solvedRiddles = {
      Easy: [],
      Medium: [],
      Hard: []
    };

    this.solvedTimes = {
      Easy: [],
      Medium: [],
      Hard: []
    };
  }

  //--------------------------------------------------------------
  static async createWithAutoId(name, filePath = "./lib/players.txt") {
    const data = await readFile(filePath, "utf8");
    const arr = JSON.parse(data);
    const id = await getNextId("players");
    return new Player(name, id);
  }

  recordTime(difficulty, time) {
    this.solvedTimes[difficulty].push(time);
  }

  recordId(difficulty, id) {
    this.solvedRiddles[difficulty].push(id);
  }

  getTotalTimeByLevel(difficulty) {
    return this.solvedTimes[difficulty].reduce((sum, t) => sum + t, 0);
  }

  getRiddleCountByLevel(difficulty) {
    return this.solvedRiddles[difficulty].length;
  }

  getAvgTime(difficulty) {
    const times = this.solvedTimes[difficulty];
    if (times.length === 0) return 0;
    return (times.reduce((acc, t) => acc + t, 0) / times.length).toFixed(2);
  }

  showCompactStats() {
    console.log(`ID: ${this.id}, Name: ${this.name}`);
    console.log(`Easy Riddles: ${this.solvedRiddles.Easy.join(", ")}`);
    console.log(`Medium Riddles: ${this.solvedRiddles.Medium.join(", ")}`);
    console.log(`Hard Riddles: ${this.solvedRiddles.Hard.join(", ")}`);
    console.log(`Average Times - Easy: ${this.getAvgTime("Easy")}s, Medium: ${this.getAvgTime("Medium")}s, Hard: ${this.getAvgTime("Hard")}s`);
  }
}
