import readline from "readline-sync";
import Player from "../models/Player.js";
import GameStarter from "./GameStarter.js";
import {
  createRiddle,
  updateRiddle,
  deleteRiddle,
  showRiddles,
  viewLeaderboard
} from "./RiddleController.js";

// Handles menus for logged-in users (user/admin)
export default class MenuManager {

  // Shows the main menu for logged-in users (looped)
  static async showLoggedInMenu(player) {
    while (true) {
      console.clear();
      console.log(`
===============================
Welcome ${player.name} (${player.role})
===============================

1. Play Game
2. View Leaderboard
3. Riddle Menu
0. Logout
`);

      const choice = readline.question("Enter your choice: ").trim();

      switch (choice) {
        case "1":
          await GameStarter.startGame(player);
          break;
        case "2":
          await viewLeaderboard();
          break;
        case "3":
          await this.showCrudMenu(player);
          break;
        case "0":
          Player.logout();
          console.log("Logged out.");
          return;
        default:
          console.log("Invalid choice.");
      }

      readline.question("\nPress Enter to return to menu...");
    }
  }

  // Shows the CRUD menu for riddles based on player role (looped)
  static async showCrudMenu(player) {
    const isAdmin = player.isAdmin();

    while (true) {
      console.clear();
      console.log(`
======== RIDDLE MENU (${player.role}) ========

${isAdmin ? "1. Add Riddle\n2. Update Riddle\n3. Delete Riddle\n4. List All Riddles" :
               "1. Add Riddle\n2. List All Riddles"}
0. Back
`);

      const choice = readline.question("Choose: ").trim();

      if (isAdmin) {
        switch (choice) {
          case "1": await createRiddle(); break;
          case "2": await updateRiddle(); break;
          case "3": await deleteRiddle(); break;
          case "4": await showRiddles(); break;
          case "0": return;
          default: console.log("Invalid choice."); break;
        }
      } else {
        switch (choice) {
          case "1": await createRiddle(); break;
          case "2": await showRiddles(); break;
          case "0": return;
          default: console.log("Invalid choice."); break;
        }
      }

      readline.question("\nPress Enter to return to menu...");
    }
  }
}
