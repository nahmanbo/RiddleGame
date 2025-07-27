import readline from "readline-sync";
import Player from "../models/Player.js";

// GameManager – Handles login/signup/guest menu
export default class GameManager {
  //--- start the game manager ---
  async start() {
    await this.showMainMenu();
  }

  //--- show main menu ---
  async showMainMenu() {
    console.clear();
    console.log(`
===============================
Welcome to the Riddle Game!
===============================

1. Login (existing user)
2. Sign Up (new user)
3. Play as Guest
4. Exit
`);

    const choice = readline.question("Enter your choice (1-4): ");

    switch (choice.trim()) {
      case "1":
        console.log("TODO: Handle Login");
        break;
      case "2":
        console.log("TODO: Handle Sign Up");
        break;
      case "3":
        await this.handleGuest();
        break;
      case "4":
        console.log("Goodbye!");
        process.exit(0);
      default:
        console.log("Invalid choice.");
        await this.showMainMenu();
    }
  }

  //--- handle guest mode ---
  async handleGuest() {
    const guestName = "guest_" + Math.floor(Math.random() * 10000);
    console.log(`\nPlaying as ${guestName} (guest mode)`);

    const { default: Game } = await import("../models/Game.js");

    const guest = await Player.createWithName(guestName, "guest");
    const game = new Game(guest); 
    await game.play();

    await this.showMainMenu();
  }
}
