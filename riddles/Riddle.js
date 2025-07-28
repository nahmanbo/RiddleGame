import readline from "readline-sync";
import { getNextRiddleId } from "../utils/idHelper.js";

export default class Riddle {
  constructor(subject, difficulty, taskDescription, correctAnswer, id = null) {
    this.id = id;
    this.subject = subject;
    this.difficulty = difficulty;
    this.taskDescription = taskDescription;
    this.correctAnswer = correctAnswer;
  }

  //--------------------------------------------------------------
  static async createFromUserInput() {
    const subject = readline.question("Enter riddle subject: ");
    const difficulty = readline.question("Enter riddle difficulty: ");
    const taskDescription = readline.question("Enter riddle task description: ");
    const correctAnswer = readline.question("Enter correct answer: ");

    const id = await getNextRiddleId();
    return new Riddle(subject, difficulty, taskDescription, correctAnswer, id);
  }
  
  //--------------------------------------------------------------
  printRiddle() {
    console.log(`--- Riddle ${this.id} ---`);
    console.log(`Subject: ${this.subject}`);
    console.log(`Difficulty: ${this.difficulty}`);
    console.log(`Task: ${this.taskDescription}`);
    console.log(`Correct Answer: ${this.correctAnswer}`);
    console.log('----------------------\n');
  }

  //--------------------------------------------------------------
  ask() {
    let answer;
    const start = Date.now();
  
    do {
      console.log(`Riddle ${this.id}: ${this.difficulty} ${this.subject}`);
      console.log(this.taskDescription);
      answer = readline.question("Your answer (or type 'exit' to stop): ");
  
      if (answer.toLowerCase() === "exit") return { status: "exit", time: 0 };
      if (answer !== this.correctAnswer) console.log("Incorrect answer, try again.\n");
    } while (answer !== this.correctAnswer);
  
    const end = Date.now();
    const time = Math.floor((end - start) / 1000);
  
    console.log(`Correct! (${time} seconds)\n`);
    return { status: "correct", time };
  }  
}
