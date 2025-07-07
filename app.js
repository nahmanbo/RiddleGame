import Game from './classes/Game.js';
// import { createData } from "./services/create.js";
// import Riddle from './classes/Riddle.js';
// import { readData } from "./services/read.js";


// //const newRiddle = Riddle.createFromUserInput();
// //createData(newRiddle, "./lib/riddles.txt");
// // מחזיר את כל המידע
// const allData = await readData("./lib/riddles.txt");
// console.log(allData);

// // מסנן לפי קושי
// const filtered1 = await readData("./lib/riddles.txt", { difficulty: "Hard" });
// console.log(filtered1);
const game = new Game();
game.start();