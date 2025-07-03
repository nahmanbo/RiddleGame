//import Game from './classes/Game.js';
import { CreateObjDb } from "./CRUD/create.js";

const newRiddle = {
    id: 21,
    subject: "Math",
    difficulty: "Medium",
    taskDescription: "What is 5 x 5?",
    correctAnswer: "25"
};

CreateObjDb(newRiddle, "./DB/riddles.txt");

//const game = new Game();
//game.start();