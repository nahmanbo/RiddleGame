import fetch from "node-fetch";
import readline from "readline-sync";
import Riddle from "../models/Riddle.js";

const BASE_URL = "http://localhost:1212";

// Game – Main game logic using Riddle.ask()
export default class Game {
  // Initializes the Game with the given player
  constructor(player) {
    this.player = player;
  }

  // Starts the game flow: select difficulty, fetch riddles, play, report results
  async play() {
    console.log(`\nStarting the game for ${this.player.name} (${this.player.role})...\n`);

    const difficulty = readline.question("Choose difficulty (easy, medium, hard): ");
    const riddlesData = await this.fetchRiddles(difficulty);

    if (!riddlesData.length) {
      console.log("No riddles found.");
      return;
    }

    const riddles = riddlesData.map(r =>
      new Riddle(r.subject, r.difficulty, r.taskDescription, r.correctAnswer, r.id)
    );

    for (const riddle of riddles) {
      const result = riddle.ask();

      if (result.status === "exit") {
        console.log("You exited the game.\n");
        break;
      }

      await this.reportResult(riddle.id, riddle.difficulty, result.time);
    }

    console.log("\nGame over!");
  }

  // Fetches riddles of the selected difficulty from the server
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

  // Reports solved riddle data to the server
  async reportResult(riddleId, difficulty, time) {
    try {
      await this.player.solveRiddle(riddleId, difficulty, time);
    } catch (err) {
      console.error("Failed to report result:", err.message);
    }
  }
}
