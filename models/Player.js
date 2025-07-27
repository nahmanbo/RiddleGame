const BASE_URL = "http://localhost:1212";

export default class Player {
  constructor(name, id = null, role = "guest") {
    this.name = name;
    this.id = id;
    this.role = role;
  }

  // Create a guest player or fetch if already exists
  static async createWithName(name, role = "guest") {
    const res = await fetch(`${BASE_URL}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role })
    });

    if (res.status === 409) {
      const players = await (await fetch(`${BASE_URL}/players`)).json();
      const existing = players.find(p => p.name === name);
      return new Player(existing.name, existing.id, existing.role);
    }

    const data = await res.json();
    return new Player(data.name, data.id, data.role);
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
      return new Player(playerData.name, playerData.id, "registered");
    } catch (err) {
      console.error(`${type} error:`, err.message);
      return null;
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

  // Send solved riddle to server
  async solveRiddle(riddleId, difficulty, time) {
    const response = await fetch(`${BASE_URL}/players/solve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
}
