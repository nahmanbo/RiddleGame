//import Game from './classes/Game.js';
import { CreateObjDb } from "./services/create.js";
import Riddle from './classes/Riddle.js';

const newRiddle = Riddle.createFromUserInput();
CreateObjDb(newRiddle, "./lib/riddles.txt");

//const game = new Game();
//game.start();