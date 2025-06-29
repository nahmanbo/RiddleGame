import readline from 'readline-sync';

export default class Riddle {
    
//====================================
constructor(id, subject, difficulty, taskDescription, correctAnswer) {
    this.id = id;
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
  
}
