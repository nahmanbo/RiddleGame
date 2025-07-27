import fs from "fs";
import jwt from "jsonwebtoken";

const BASE_URL = "http://localhost:1212";

export default class Player {
  constructor(name, id = null, role = "guest", token = null) {
    this.name = name;
    this.id = id;
    this.role = role;
    this.token = token;
  }

  // Create guest player using /players/guest
  static async createGuest(name) {
    const res = await fetch(`${BASE_URL}/players/guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
  
    const { token, player } = await res.json();
    return new Player(player.name, player.id, player.role, token);
  }

  // General auth request: login or signup
  static async authenticate(type, name, password) {
    const path = type === "login" ? "login" : "";

    try {
      const res = await fetch(`${BASE_URL}/players/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();
      if (!res.ok) return null;

      const playerData = data.player || data;
      const token = data.token || null;

      return new Player(playerData.name, playerData.id, playerData.role, token);
    } catch (err) {
      console.error(`${type} error:`, err.message);
      throw new Error(`${type} error: ${err.message}`);
    }
  }

  // Sign up new player
  static async signup(name, password) {
    return await Player.authenticate("signup", name, password);
  }

  // Login existing player
  static async login(name, password) {
    return await Player.authenticate("login", name, password);
  }

  // Solve a riddle – sends POST to /players/solve
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

  // Check if player is guest
  isGuest() {
    return this.role === "guest";
  }

  // Check if player is admin
  isAdmin() {
    return this.role === "admin";
  }

  // Optional: get auth token
  getToken() {
    return this.token;
  }

  static saveToken(token) {
    fs.writeFileSync(".token", token);
  }

  static loadToken() {
    try {
      return fs.readFileSync(".token", "utf8").trim();
    } catch {
      return null;
    }
  }

  // Create Player from saved token (if exists and valid)
static fromSavedToken() {
  try {
    const token = fs.readFileSync(".token", "utf8").trim();
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.name || !decoded.id || !decoded.role) return null;

    const player = new Player(decoded.name, decoded.id, decoded.role, token);
    return player;
  } catch {
    return null;
  }
}
// Logs out the user by deleting the saved token
static logout() {
  try {
    fs.unlinkSync(".token");
    console.log("Logged out successfully.");
  } catch {
    console.warn("No token to delete. Already logged out?");
  }
}
}
