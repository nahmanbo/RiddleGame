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
        console.log("TODO: Guest Mode");
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
}
