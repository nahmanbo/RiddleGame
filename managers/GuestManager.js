import Player from "../models/Player.js";
import GameStarter from "./GameStarter.js";
import { TokenManager } from "../utils/TokenManager.js";

// Handles guest player creation and game start
export default class GuestManager {

  // Creates a guest player and starts the game
  static async handleGuest() {
    const name = "guest_" + Math.floor(Math.random() * 10000);
    const player = await Player.createGuest(name);

    TokenManager.save(player.token);
    console.log(`Playing as ${player.name} (guest mode)`);
    console.log(`Your token: ${player.token}`);
    await GameStarter.startGame(player);
  }
}
