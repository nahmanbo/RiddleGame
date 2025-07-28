// Loads and starts the game for a given player
import path from "node:path";

export default class GameStarter {

  // Starts the Game instance for the provided player
  static async startGame(player) {
    const { default: Game } = await import(path.resolve("core/GameEngine.js"));
    const game = new Game(player);
    await game.play();
  }
}
