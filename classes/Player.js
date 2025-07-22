const BASE_URL = "http://localhost:1212";

export default class Player {

  //====================================
  constructor(name, id = null) {
    this.name = name;
    this.id = id;
  }

  //--------------------------------------------------------------
  static fromSupabaseRecord(record) {
    return new Player(record.name, record.id);
  }

  //--------------------------------------------------------------
  static async createWithName(name) {
    return new Player(name);
  }

  //--------------------------------------------------------------
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
      throw new Error("❌ Failed to report solved riddle");
    }

    return await response.json();
  }

  //--------------------------------------------------------------
  showCompactStats() {
    console.log(`🧍‍♂️ Player: ${this.name} (ID: ${this.id ?? "N/A"})`);
    console.log(`סטטיסטיקות זמינות מהשרת בלבד ✅`);
  }

  //--------------------------------------------------------------
  toSupabaseObject() {
    return { name: this.name };
  }
}
