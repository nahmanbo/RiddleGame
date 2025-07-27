const BASE_URL = "http://localhost:1212";

export default class Player {
  //--- constructor ---
  constructor(name, id = null, role = "guest") {
    this.name = name;
    this.id = id;
    this.role = role; // 'guest', 'user', or 'admin'
  }

  //--- create player from Supabase record ---
  static fromSupabaseRecord(record) {
    return new Player(record.name, record.id, record.role || "user");
  }

  //--- create player with just a name ---
  static async createWithName(name) {
    return new Player(name);
  }

  //--- send solved riddle to server ---
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

  //--- convert to Supabase insert object ---
  toSupabaseObject() {
    return { name: this.name, role: this.role };
  }

  //--- is guest ---
  isGuest() {
    return this.role === "guest";
  }

  //--- is admin ---
  isAdmin() {
    return this.role === "admin";
  }
}
