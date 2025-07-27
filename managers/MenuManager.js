import readline from "readline-sync";
import Player from "../models/Player.js";
import GameStarter from "./GameStarter.js";

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
      case "2": return await this.showLeaderboard();
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

  // Shows the leaderboard sorted by total riddles solved
  static async showLeaderboard() {
    try {
      const res = await fetch("http://localhost:1212/players/sorted-by-total", {
        headers: {
          Authorization: "Bearer " + Player.loadToken()
        }
      });

      const players = await res.json();
      console.clear();
      console.log("====== Leaderboard ======");
      players.forEach((p, i) =>
        console.log(`${i + 1}. ${p.name} – ${p.total_solved || 0} riddles`)
      );
    } catch (err) {
      console.log("Failed to load leaderboard:", err.message);
    }

    readline.question("\nPress Enter to return...");
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
        case "1": return console.log("TODO: Add riddle");
        case "2": return console.log("TODO: Update riddle");
        case "3": return console.log("TODO: Delete riddle");
        case "4": return console.log("TODO: List riddles");
        case "0": return;
      }
    } else {
      switch (choice) {
        case "1": return console.log("TODO: Add riddle");
        case "2": return console.log("TODO: List riddles");
        case "0": return;
      }
    }

    console.log("Invalid choice.");
    await this.showCrudMenu(player);
  }
}
