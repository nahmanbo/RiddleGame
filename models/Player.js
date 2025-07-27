const BASE_URL = "http://localhost:1212";

export default class Player {
  constructor(name, id = null, role = "guest") {
    this.name = name;
    this.id = id;
    this.role = role;
  }

  //--- יצירת שחקן חדש בשרת ושמירה מקומית
  static async createWithName(name, role = "guest") {
    const res = await fetch(`${BASE_URL}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role })
    });

    if (res.status === 409) {
      // שחקן כבר קיים – שלוף אותו
      const players = await (await fetch(`${BASE_URL}/players`)).json();
      const existing = players.find(p => p.name === name);
      return new Player(existing.name, existing.id, existing.role);
    }

    const data = await res.json();
    console.log("aaaaaaaaaa")
    return new Player(data.name, data.id, data.role);
  }

  //--- שליחת פתרון לשרת
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

  //--- בדיקת role
  isGuest() {
    return this.role === "guest";
  }

  isAdmin() {
    return this.role === "admin";
  }
}
