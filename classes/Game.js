import readline from "readline";
import fetch from "node-fetch";

const BASE_URL = "http://localhost:1212";

export default class Game {
  //--- constructor ---
  constructor(player) {
    this.player = player;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  //--- ask user for input ---
  ask(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => resolve(answer.trim()));
    });
  }

  //--- main game loop ---
  async play() {
    console.log(`\nStarting the game for ${this.player.name} (${this.player.role})...\n`);

    const difficulty = await this.ask("Choose difficulty (easy, medium, hard): ");
    const riddles = await this.fetchRiddles(difficulty);

    if (!riddles.length) {
      console.log("No riddles found.");
      return this.rl.close();
    }

    for (const riddle of riddles) {
      await this.playRiddle(riddle, difficulty);
    }

    console.log("\nGame over!");
    this.rl.close();
  }

  //--- fetch riddles by difficulty ---
  async fetchRiddles(difficulty) {
    try {
      const res = await fetch(`${BASE_URL}/riddles/difficulty/${difficulty}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("Failed to load riddles:", err.message);
      return [];
    }
  }

  //--- handle a single riddle ---
  async playRiddle(riddle, difficulty) {
    console.log(`\n🔍 ${riddle.question}`);
    const start = Date.now();

    const answer = await this.ask("Your answer: ");
    const end = Date.now();
    const time = Math.floor((end - start) / 1000);

    const correct = answer.toLowerCase() === riddle.answer.toLowerCase();

    if (correct) {
      console.log(`Correct! (${time}s)`);
    } else {
      console.log(`Wrong. The correct answer was: ${riddle.answer}`);
    }

    if (!this.player.isGuest()) {
      await this.reportResult(riddle.id, difficulty, time);
    }
  }

  //--- send solved result to server ---
  async reportResult(riddleId, difficulty, time) {
    try {
      await this.player.solveRiddle(riddleId, difficulty, time);
    } catch (err) {
      console.error("Failed to report result:", err.message);
    }
  }
}
