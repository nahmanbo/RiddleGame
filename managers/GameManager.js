import readline from "readline-sync";
import Player from "../models/Player.js";

export default class GameManager {
  // Start the main menu
  async start() {
    await this.showMainMenu();
  }

  // Display the main menu
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

    const choice = readline.question("Enter your choice (1-4): ").trim();

    if (choice === "1") return await this.handleLogin();
    if (choice === "2") return await this.handleSignUp();
    if (choice === "3") return await this.handleGuest();
    if (choice === "4") return console.log("Goodbye!"), process.exit(0);

    console.log("Invalid choice.");
    await this.showMainMenu();
  }

  // Handle user login
  async handleLogin() {
    const { name, password } = this.readCredentials();
    const player = await Player.login(name, password);

    if (!player) {
      console.log("Login failed.");
      return await this.showMainMenu();
    }

    console.log(`Welcome back, ${player.name}!`);
    await this.startGame(player);
  }

  // Handle user sign up
  async handleSignUp() {
    const { name, password } = this.readCredentials();
    const player = await Player.signup(name, password);

    if (!player) {
      console.log("Sign up failed.");
      return await this.showMainMenu();
    }

    console.log(`Welcome, ${player.name}! Your account has been created.`);
    await this.startGame(player);
  }

  // Handle guest mode
  async handleGuest() {
    const guestName = "guest_" + Math.floor(Math.random() * 10000);
    console.log(`Playing as ${guestName} (guest mode)`);

    const guest = await Player.createWithName(guestName, "guest");
    await this.startGame(guest);
  }

  // Read username and password from input
  readCredentials() {
    const name = readline.question("Enter username: ");
    const password = readline.question("Enter password: ");
    return { name, password };
  }

  // Start game for the given player
  async startGame(player) {
    const { default: Game } = await import("../models/Game.js");
    const game = new Game(player);
    await game.play();
    await this.showMainMenu();
  }
}
