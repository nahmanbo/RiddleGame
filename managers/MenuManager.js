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

  // Shows the main menu for logged-in users
  static async showLoggedInMenu(player) {
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
      case "1": return await GameStarter.startGame(player);
      case "2": return await viewLeaderboard();
      case "3": return await this.showCrudMenu(player);
      case "0":
        Player.logout();
        console.log("Logged out.");
        return;
      default:
        console.log("Invalid choice.");
        return await this.showLoggedInMenu(player);
    }
  }

  // Shows the CRUD menu for riddles based on player role
  static async showCrudMenu(player) {
    const isAdmin = player.isAdmin();

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
        case "1": return await createRiddle();
        case "2": return await updateRiddle();
        case "3": return await deleteRiddle();
        case "4": return await showRiddles();
        case "0": return;
      }
    } else {
      switch (choice) {
        case "1": return await createRiddle();
        case "2": return await showRiddles();
        case "0": return;
      }
    }

    console.log("Invalid choice.");
    await this.showCrudMenu(player);
  }
}
