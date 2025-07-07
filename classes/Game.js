import readline from 'readline-sync';
import Riddle from './Riddle.js';
import Player from './Player.js';
import { readData } from '../services/read.js';
import { createData } from '../services/create.js';
import { updateData } from '../services/update.js';
import { deleteData } from '../services/delete.js';

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
      this.printMainMenu();
      const choice = readline.question("Choose an option (1-3): ");

      if (choice === "1") {
        await this.playGame();
      } else if (choice === "2") {
        await this.manageRiddles();
      } else if (choice === "3") {
        console.log("Goodbye!");
        break;
      } else {
        console.log("Invalid choice, try again.\n");
      }
    }
  }

  //--------------------------------------------------------------
  printMainMenu() {
    console.log("\nMain Menu:");
    console.log("1. Play Game");
    console.log("2. Manage Riddles (CRUD)");
    console.log("3. Exit");
  }

  //--------------------------------------------------------------
  async playGame() {
    const name = readline.question("\nEnter your name: ");
    await this.loadPlayers();

    let player = this.players.find(p => p.name === name);

    if (!player) {
      console.log("New player registered.");
      player = new Player(name);
      await createData(player, "./lib/players.txt");
      this.players.push(player);
    }

    this.currentPlayer = player;

    await this.loadAllRiddles();

    if (await this.playRiddlesByDifficulty("Easy")) return;
    if (await this.playRiddlesByDifficulty("Medium")) return;
    if (await this.playRiddlesByDifficulty("Hard")) return;

    console.log("\nYour Stats:");
    this.currentPlayer.showCompactStats();

    await updateData(this.currentPlayer, "./lib/players.txt");
  }

  //--------------------------------------------------------------
  async manageRiddles() {
    console.log("\nCRUD Menu:");
    console.log("1. Create Riddle");
    console.log("2. Read Riddles");
    console.log("3. Delete Riddle");
    console.log("4. Back");

    const choice = readline.question("Choose an option (1-4): ");

    if (choice === "1") {
      await this.createRiddle();
    } else if (choice === "2") {
      await this.showAllRiddles();
    } else if (choice === "3") {
      await this.deleteRiddle();
    } else if (choice === "4") {
      return;
    } else {
      console.log("Invalid choice.\n");
    }
  }

  //--------------------------------------------------------------
  async createRiddle() {
    const newRiddle = Riddle.createFromUserInput();
    await createData(newRiddle, "./lib/riddles.txt");
    console.log("Riddle added successfully.\n");
  }

  //--------------------------------------------------------------
  async showAllRiddles() {
    const riddles = await readData("./lib/riddles.txt");
    riddles.forEach(r => {
      const riddle = new Riddle(r.subject, r.difficulty, r.taskDescription, r.correctAnswer, r.id);
      riddle.printRiddle();
    });
  }

  //--------------------------------------------------------------
  async deleteRiddle() {
    const id = parseInt(readline.question("Enter riddle ID to delete: "));
    await deleteData(id, "./lib/riddles.txt");
    console.log("Riddle deleted if found.\n");
  }

  //--------------------------------------------------------------
  async loadAllRiddles() {
    const difficulties = ["Easy", "Medium", "Hard"];
    this.riddles = [];

    for (let difficulty of difficulties) {
      const riddles = await readData("./lib/riddles.txt", { difficulty });
      riddles.forEach(r => {
        const riddle = new Riddle(r.subject, r.difficulty, r.taskDescription, r.correctAnswer, r.id);
        this.riddles.push(riddle);
      });
    }
  }

  //--------------------------------------------------------------
  async playRiddlesByDifficulty(difficulty) {
    const riddlesToPlay = this.riddles.filter(r =>
      r.difficulty === difficulty &&
      !this.currentPlayer.solvedRiddles[difficulty].includes(r.id)
    );

    if (riddlesToPlay.length === 0) {
      console.log(`\nNo new ${difficulty} riddles available.`);
      return false;
    }

    console.log(`\nStarting ${difficulty} riddles...`);

    for (let riddle of riddlesToPlay) {
      const startTime = Date.now();
      const result = riddle.ask();

      if (result === "exit") {
        console.log("Exiting to main menu...\n");
        await updateData(this.currentPlayer, "./lib/players.txt");
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
}
