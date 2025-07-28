import jwt from "jsonwebtoken";
import { TokenManager } from "../utils/TokenManager.js";

const BASE_URL = "http://localhost:1212";

export default class Player {
  constructor(name, id = null, role = "guest", token = null) {
    this.name = name;
    this.id = id;
    this.role = role;
    this.token = token;
  }

  // Creates a guest player using /players/guest endpoint
  static async createGuest(name) {
    const res = await fetch(`${BASE_URL}/players/guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    const { token, player } = await res.json();
    return new Player(player.name, player.id, player.role, token);
  }

  // Authenticates user for login or signup
  static async authenticate(type, name, password) {
    const path = type === "login" ? "login" : "";

    try {
      const res = await fetch(`${BASE_URL}/players/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Authentication failed");
      }

      const playerData = data.player || data;
      const token = data.token || null;

      return new Player(playerData.name, playerData.id, playerData.role, token);
    } catch (err) {
      console.error(`${type} error:`, err.message);
      throw new Error(`${type} error: ${err.message}`);
    }
  }

  // Signs up a new player
  static async signup(name, password) {
    return await Player.authenticate("signup", name, password);
  }

  // Logs in an existing player
  static async login(name, password) {
    return await Player.authenticate("login", name, password);
  }

  // Sends the riddle result to the server for this player
  async solveRiddle(riddleId, difficulty, time) {
    const response = await fetch(`${BASE_URL}/players/solve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` })
      },
      body: JSON.stringify({
        player_id: this.id,
        riddle_id: riddleId,
        difficulty,
        solved_time: time
      })
    });

    if (!response.ok) {
      throw new Error("Failed to report solved riddle");
    }

    return await response.json();
  }

  // Checks if the player has a specific role
  hasRole(role) {
    return this.role === role;
  }

  // Returns the player's token
  getToken() {
    return this.token;
  }

  // Converts the player to a plain object
  toJSON() {
    return {
      name: this.name,
      id: this.id,
      role: this.role
    };
  }

  // Creates a Player instance from a saved token
  static fromSavedToken() {
    try {
      const token = TokenManager.load();
      const decoded = jwt.decode(token);

      if (!decoded?.name || !decoded?.id || !decoded?.role) {
        console.warn("Invalid token format");
        return null;
      }

      return new Player(decoded.name, decoded.id, decoded.role, token);
    } catch (err) {
      console.warn("No saved token or error decoding:", err.message);
      return null;
    }
  }

  // Logs out the player by deleting the .token file
  static logout() {
    TokenManager.delete();
  }
}
