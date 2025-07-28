import readline from "readline-sync";
import Player from "../core/Player.js";
import MenuManager from "./MenuManager.js";
import GameManager from "./GameManager.js";
import { TokenManager } from "../utils/TokenManager.js";

// Handles user login and signup logic
export default class AuthManager {

  // Logs in an existing player with username and password
  static async handleLogin() {
    const { name, password } = this.readCredentials();
    try {
      const player = await Player.login(name, password);

      if (!player) {
        console.log("\nLogin failed: Invalid credentials or user not found.");
        await new Promise(resolve => setTimeout(resolve, 2000));
        return await new GameManager().showMainMenu();
      }

      TokenManager.save(player.token);
      console.log(`\nWelcome back, ${player.name}!`);
      console.log(`Your token: ${player.token}`);
      await MenuManager.showLoggedInMenu(player);
    } catch (err) {
      console.log(`\nLogin error: ${err.message}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return await new GameManager().showMainMenu();
    }
  }

  // Registers a new player with username and password
  static async handleSignUp() {
    const { name, password } = this.readCredentials();
    try {
      const player = await Player.signup(name, password);

      if (!player) {
        console.log("\nSign up failed: Username might already exist.");
        await new Promise(resolve => setTimeout(resolve, 2000));
        return await new GameManager().showMainMenu();
      }

      TokenManager.save(player.token);
      console.log(`\nWelcome, ${player.name}! Your account has been created.`);
      console.log(`Your token: ${player.token}`);
      await MenuManager.showLoggedInMenu(player);
    } catch (err) {
      console.log(`\nSign up error: ${err.message}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return await new GameManager().showMainMenu();
    }
  }

  // Prompts the user to enter login credentials
  static readCredentials() {
    const name = readline.question("Enter username: ");
    const password = readline.question("Enter password: ", { hideEchoBack: true });
    return { name, password };
  }
}
