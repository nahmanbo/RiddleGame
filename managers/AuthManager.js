import readline from "readline-sync";
import Player from "../models/Player.js";
import MenuManager from "./MenuManager.js";

// Handles user login and signup logic
export default class AuthManager {

  // Logs in an existing player
  static async handleLogin() {
    const { name, password } = this.readCredentials();
    const player = await Player.login(name, password);

    if (!player) {
      console.log("Login failed.");
      return;
    }

    Player.saveToken(player.token);
    console.log(`Welcome back, ${player.name}!`);
    console.log(`Your token: ${player.token}`);
    await MenuManager.showLoggedInMenu(player);
  }

  // Signs up a new player
  static async handleSignUp() {
    const { name, password } = this.readCredentials();
    const player = await Player.signup(name, password);

    if (!player) {
      console.log("Sign up failed.");
      return;
    }

    Player.saveToken(player.token);
    console.log(`Welcome, ${player.name}! Your account has been created.`);
    console.log(`Your token: ${player.token}`);
    await MenuManager.showLoggedInMenu(player);
  }

  // Reads username and password input from user
  static readCredentials() {
    const name = readline.question("Enter username: ");
    const password = readline.question("Enter password: ");
    return { name, password };
  }
}
