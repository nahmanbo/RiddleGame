//import Game from './classes/Game.js';
import { CreateObjDb } from "./CRUD/create.js";
import Riddle from './classes/Riddle.js';

const newRiddle = Riddle.createFromUserInput();
CreateObjDb(newRiddle, "./DB/riddles.txt");

//const game = new Game();
//game.start();