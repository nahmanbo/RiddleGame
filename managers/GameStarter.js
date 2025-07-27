// Loads and starts the game for a given player
export default class GameStarter {

    // Starts the Game instance for the provided player
    static async startGame(player) {
      const { default: Game } = await import("../models/Game.js");
      const game = new Game(player);
      await game.play();
    }
  }
  