import readline from 'readline-sync';

export default class Riddle {

  constructor(id, name, taskDescription, correctAnswer) {
    this.id = id;
    this.name = name;
    this.taskDescription = taskDescription;
    this.correctAnswer = correctAnswer;
  }

  ask() {
    let answer;

    do {
      console.log(`Riddle ${this.id}: ${this.name}`);
      console.log(this.taskDescription);
      answer = readline.question("Your answer: ");
    } 
    while (answer !== this.correctAnswer);
    
    console.log("Correct!");
  }
}
