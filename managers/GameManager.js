// managers/GameManager.js
import readline from "readline";

// GameManager – Handles login/signup/guest menu
export default class GameManager {
  //--- constructor ---
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  //--- ask a question ---
  ask(question) {
    return new Promise((resolve) => this.rl.question(question, resolve));
  }

  //--- start the game manager ---
  async start() {
    await this.showMainMenu();
  }

  //--- show main menu ---
  async showMainMenu() {
    console.clear();
    console.log(`
===============================
🔐 Welcome to the Riddle Game!
===============================

1. Login (existing user)
2. Sign Up (new user)
3. Play as Guest
4. Exit
`);

    const choice = await this.ask("Enter your choice (1-4): ");
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
        this.rl.close();
        process.exit(0);
      default:
        console.log("Invalid choice.");
        await this.showMainMenu();
    }
  }

  //--- handle guest mode ---
  async handleGuest() {
    const guestName = "guest_" + Math.floor(Math.random() * 10000);
    console.log(`\n🎭 Playing as ${guestName} (guest mode)`);

    const { default: Game } = await import("../game/Game.js");
    const game = new Game(guestName); // assumes Game accepts username
    await game.play();

    await this.showMainMenu();
  }
}
