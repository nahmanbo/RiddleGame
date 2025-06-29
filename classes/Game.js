import readline from 'readline-sync';
import allRiddles from '../riddles/allRiddles.js';
import Riddle from './Riddle.js';
import Player from './Player.js';

export default class Game {

  //====================================
  constructor() {
    this.player = this.createPlayer();
    this.riddles = this.chooseDifficultyAndLoadRiddles();
  }

  //--------------------------------------------------------------
  createPlayer() {
    console.log("Welcome to the Riddle Game!");
    const name = readline.question("What is your name? ");
    console.log(`Hello, ${name}! Let's start.\n`);
    return new Player(name);
  }

  //--------------------------------------------------------------
  chooseDifficultyAndLoadRiddles() {
    console.log("Choose difficulty level:");
    console.log("1. Easy");
    console.log("2. Medium");
    console.log("3. Hard");
    console.log("4. All");

    let choice = readline.question("Enter your choice (1-4): ");

    while (!["1", "2", "3", "4"].includes(choice)) {
      console.log("Invalid choice. Please select 1, 2, 3, or 4.");
      choice = readline.question("Enter your choice (1-4): ");
    }

    switch (choice) {
      case "1":
        return this.loadRiddlesByKeyAndValue("difficulty", "Easy");
      case "2":
        return this.loadRiddlesByKeyAndValue("difficulty", "Medium");
      case "3":
        return this.loadRiddlesByKeyAndValue("difficulty", "Hard");
      case "4":
        return this.loadAllRiddlesSorted();
    }
  }

  //--------------------------------------------------------------
  loadRiddlesByKeyAndValue(key, value) {
    const riddlesArray = [];

    for (let riddleObj of allRiddles) {
      if (riddleObj[key] === value) {
        const riddle = new Riddle(
          riddleObj.id,
          riddleObj.subject,
          riddleObj.difficulty,
          riddleObj.taskDescription,
          riddleObj.correctAnswer
        );
        riddlesArray.push(riddle);
      }
    }

    return riddlesArray;
  }

//--------------------------------------------------------------
loadAllRiddlesSorted() {
  const easyRiddles = this.loadRiddlesByKeyAndValue("difficulty", "Easy");
  const mediumRiddles = this.loadRiddlesByKeyAndValue("difficulty", "Medium");
  const hardRiddles = this.loadRiddlesByKeyAndValue("difficulty", "Hard");

  return [...easyRiddles, ...mediumRiddles, ...hardRiddles];
}


  //--------------------------------------------------------------
  start() {
    this.playAllRiddles();
    this.showFinalStats();
  }

  //--------------------------------------------------------------
  playAllRiddles() {
    for (let riddle of this.riddles) {
      const startTime = Date.now();
      riddle.ask();
      const endTime = Date.now();

      const timeTaken = Math.round((endTime - startTime) / 1000);
      this.player.recordTime(riddle.id, timeTaken);

      console.log();
    }
  }

  //--------------------------------------------------------------
  showFinalStats() {
    this.player.showStats();
  }
}
