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
  
  //--------------------------------------------------------------
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

  //--------------------------------------------------------------
  static createFromUserInput() {
    const subject = readline.question("Enter riddle subject: ");
    const difficulty = readline.question("Enter riddle difficulty: ");
    const taskDescription = readline.question("Enter riddle task description: ");
    const correctAnswer = readline.question("Enter correct answer: ");
    
    return new Riddle(subject, difficulty, taskDescription, correctAnswer);
  }
}
