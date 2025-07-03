import readline from 'readline-sync';

export default class Riddle {

  static lastId = 21;

  //====================================
  constructor(subject, difficulty, taskDescription, correctAnswer) {
    this.id = ++Riddle.lastId;
    this.subject = subject;
    this.difficulty = difficulty;
    this.taskDescription = taskDescription;
    this.correctAnswer = correctAnswer;
  }

  //====================================
  static createFromUserInput() {
    const subject = readline.question("Enter riddle subject: ");
    const difficulty = readline.question("Enter riddle difficulty: ");
    const taskDescription = readline.question("Enter riddle task description: ");
    const correctAnswer = readline.question("Enter correct answer: ");
    
    return new Riddle(subject, difficulty, taskDescription, correctAnswer);
  }

  //====================================
  printRiddle() {
    console.log(`--- Riddle ${this.id} ---`);
    console.log(`Subject: ${this.subject}`);
    console.log(`Difficulty: ${this.difficulty}`);
    console.log(`Task: ${this.taskDescription}`);
    console.log(`Correct Answer: ${this.correctAnswer}`);
    console.log('----------------------\n');
  }

  //====================================
  ask() {
    let answer;
    
    do {
      console.log(`Riddle ${this.id}: ${this.difficulty} ${this.subject}`);
      console.log(this.taskDescription);
      answer = readline.question("Your answer: ");
      if (answer !== this.correctAnswer) {
        console.log("Incorrect answer, try again.\n");
      }
    } 
    while (answer !== this.correctAnswer);
    
    console.log("Correct!\n");
  }
}
