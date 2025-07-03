//import Game from './classes/Game.js';
import { createData } from "./services/create.js";
import Riddle from './classes/Riddle.js';

const newRiddle = Riddle.createFromUserInput();
createData(newRiddle, "./lib/riddles.txt");

//const game = new Game();
//game.start();