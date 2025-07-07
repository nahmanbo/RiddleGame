import readline from 'readline-sync';
import Riddle from './Riddle.js';
import Player from './Player.js';
import { readData } from '../services/read.js';
import { createData } from '../services/create.js';
import { writeFile } from 'node:fs/promises';

export default class Game {

  constructor() {
    this.riddles = [];
    this.players = [];
    this.currentPlayer = null;
  }

  //--------------------------------------------------------------
  async start() {
    console.log("\n--- Welcome to the Riddle Game ---");

    while (true) {
      this.showMainMenu();
      const choice = readline.question("Choose an option (1-3): ");

      if (choice === "1") {
        await this.handlePlayGame();
      } else if (choice === "2") {
        await this.handleCrudMenu();
      } else if (choice === "3") {
        console.log("Goodbye!");
        break;
      } else {
        console.log("Invalid choice, try again.\n");
      }
    }
  }

  //--------------------------------------------------------------
  showMainMenu() {
    console.log("\nMain Menu:");
    console.log("1. Play Game");
    console.log("2. Manage Riddles (CRUD)");
    console.log("3. Exit");
  }

  //--------------------------------------------------------------
  async handlePlayGame() {
    const name = readline.question("\nEnter your name: ");
    await this.loadPlayers();

    this.currentPlayer = this.findOrCreatePlayer(name);

    await this.loadAllRiddles();

    if (await this.playRiddleLevel("Easy")) return;
    if (await this.playRiddleLevel("Medium")) return;
    if (await this.playRiddleLevel("Hard")) return;

    console.log("\nYour Stats:");
    this.currentPlayer.showCompactStats();

    await this.savePlayers();
  }

  //--------------------------------------------------------------
  findOrCreatePlayer(name) {
    let player = this.players.find(p => p.name === name);

    if (!player) {
      console.log("New player registered.");
      player = new Player(name);
      this.players.push(player);
    }

    return player;
  }

  //--------------------------------------------------------------
  async handleCrudMenu() {
    this.showCrudMenu();
    const choice = readline.question("Choose an option (1-4): ");

    if (choice === "1") {
      await this.createNewRiddle();
    } else if (choice === "2") {
      await this.displayAllRiddles();
    } else {
      console.log("Option not implemented yet.\n");
    }
  }

  //--------------------------------------------------------------
  showCrudMenu() {
    console.log("\nCRUD Menu:");
    console.log("1. Create Riddle");
    console.log("2. Read Riddles");
    console.log("3. Update Riddle (Not implemented)");
    console.log("4. Delete Riddle (Not implemented)");
  }

  //--------------------------------------------------------------
  async createNewRiddle() {
    const newRiddle = Riddle.createFromUserInput();
    await createData(newRiddle, "./lib/riddles.txt");
    console.log("Riddle added successfully.\n");
  }

  //--------------------------------------------------------------
  async displayAllRiddles() {
    const riddles = await readData("./lib/riddles.txt");

    riddles.forEach(r => {
      const riddle = new Riddle(r.subject, r.difficulty, r.taskDescription, r.correctAnswer, r.id);
      riddle.printRiddle();
    });
  }

  //--------------------------------------------------------------
  async loadAllRiddles() {
    this.riddles = [];

    const difficulties = ["Easy", "Medium", "Hard"];

    for (let difficulty of difficulties) {
      const riddles = await readData("./lib/riddles.txt", { difficulty });
      riddles.forEach(r => {
        const riddle = new Riddle(r.subject, r.difficulty, r.taskDescription, r.correctAnswer, r.id);
        this.riddles.push(riddle);
      });
    }
  }

  //--------------------------------------------------------------
  async playRiddleLevel(difficulty) {
    const availableRiddles = this.riddles.filter(r =>
      r.difficulty === difficulty &&
      !this.currentPlayer.solvedRiddles[difficulty].includes(r.id)
    );

    if (availableRiddles.length === 0) {
      console.log(`\nNo new ${difficulty} riddles available.`);
      return false;
    }

    console.log(`\nStarting ${difficulty} riddles...`);

    for (let riddle of availableRiddles) {
      const startTime = Date.now();
      const result = riddle.ask();

      if (result === "exit") {
        console.log("Exiting to main menu...\n");
        await this.savePlayers();
        return true;
      }

      const endTime = Date.now();
      const timeTaken = Math.round((endTime - startTime) / 1000);

      this.currentPlayer.recordTime(difficulty, timeTaken);
      this.currentPlayer.recordId(difficulty, riddle.id);
    }

    return false;
  }

  //--------------------------------------------------------------
  async loadPlayers() {
    try {
      const playersData = await readData("./lib/players.txt");

      this.players = playersData.map(p => {
        const player = new Player(p.name);
        player.id = p.id;
        player.solvedRiddles = p.solvedRiddles;
        player.solvedTimes = p.solvedTimes;
        return player;
      });
    } catch {
      this.players = [];
    }
  }

  //--------------------------------------------------------------
  async savePlayers() {
    try {
      await writeFile("./lib/players.txt", JSON.stringify(this.players, null, 2));
    } catch (err) {
      console.error("Error saving players:", err.message);
    }
  }
}
