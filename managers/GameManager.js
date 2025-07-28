import readline from "readline-sync";
import AuthManager from "../managers/AuthManager.js";
import GuestManager from "../managers/GuestManager.js";
import MenuManager from "../managers/MenuManager.js";
import GameStarter from "../managers/GameStarter.js";
import Player from "../core/Player.js";

// Starts the main game flow
export default class GameManager {

  // Starts the GameManager
  async start() {
    await this.showMainMenu();
  }

  // Displays the initial menu (auto-login or manual options)
  async showMainMenu() {
    const player = Player.fromSavedToken();

    if (player) {
      console.log(`Welcome back, ${player.name}!`);

      // Guest users go straight to the game
      if (player.hasRole("guest")) {
        return await GameStarter.startGame(player);
      }

      // Registered users see logged-in menu
      return await MenuManager.showLoggedInMenu(player);
    }

    // Show welcome screen with main options
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

    const choice = readline.question("Enter your choice (1-4): ").trim();

    // Handle menu selection
    switch (choice) {
      case "1": return await AuthManager.handleLogin();
      case "2": return await AuthManager.handleSignUp();
      case "3": return await GuestManager.handleGuest();
      case "4": return console.log("Goodbye!"), process.exit(0);
      default:
        console.log("Invalid choice.");
        return await this.showMainMenu();
    }
  }
}
