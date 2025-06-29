import readline from 'readline-sync';
import allRiddles from '../riddles/allRiddles.js';
import Riddle from './Riddle.js';
import Player from './Player.js';

export default class Game {

  //====================================
  constructor() {
    this.player = this.createPlayer();
    this.riddles = this.loadRiddles();
  }

  //--------------------------------------------------------------
  createPlayer() {
    console.log("Welcome to the Riddle Game!");
    const name = readline.question("What is your name? ");
    console.log(`Hello, ${name}! Let's start.\n`);
    return new Player(name);
  }

  //--------------------------------------------------------------
  loadRiddlesBY(key, value) {
    const riddlesArray = [];

    for (let riddleObj of allRiddles) {
      const riddle = new Riddle(
        riddleObj.id,
        riddleObj.name,
        riddleObj.taskDescription,
        riddleObj.correctAnswer
      );
      riddlesArray.push(riddle);
    }

    return riddlesArray;
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
