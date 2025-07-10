import readline from "readline-sync";
import {
  playGame,
  createRiddle,
  showRiddles,
  updateRiddle,
  deleteRiddle,
  viewLeaderboard
} from "./classes/Game.js";

const BASE_URL = "http://localhost:1234";
global.BASE_URL = BASE_URL;

async function mainMenu() {
  console.log(`\nWhat do you want to do?\n`);
  console.log("1. Play the game");
  console.log("2. Create a new riddle");
  console.log("3. Read all riddles");
  console.log("4. Update a riddle");
  console.log("5. Delete a riddle");
  console.log("6. View leaderboard");
  console.log("7. Exit");

  const choice = readline.question("Choose (1-7): ");

  switch (choice) {
    case "1": await playGame(); break;
    case "2": await createRiddle(); break;
    case "3": await showRiddles(); break;
    case "4": await updateRiddle(); break;
    case "5": await deleteRiddle(); break;
    case "6": await viewLeaderboard(); break;
    case "7": console.log("Bye!"); return;
    default: console.log("Invalid choice.");
  }

  await mainMenu();
}

mainMenu();
