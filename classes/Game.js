import readline from "readline-sync";
import Riddle from "./Riddle.js";
import Player from "./Player.js";

const BASE_URL = global.BASE_URL || "http://localhost:1212";

//====================================
export async function playGame() {
  const name = readline.question("\nEnter your name: ");

  const res = await fetch(`${BASE_URL}/players`);
  const players = await res.json();

  let playerData = players.find(p => p.name === name);
  let player;

  if (!playerData) {
    console.log("New player registered.");
    const createRes = await fetch(`${BASE_URL}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    playerData = await createRes.json();
  }

  player = Player.fromSupabaseRecord(playerData);

  const riddlesRes = await fetch(`${BASE_URL}/riddles`);
  const riddlesData = await riddlesRes.json();
  const riddles = riddlesData.map(r => Object.assign(new Riddle(), r));

  const difficulties = ["Easy", "Medium", "Hard"];

  for (const diff of difficulties) {
    const toSolve = riddles.filter(r => r.difficulty === diff);

    if (toSolve.length === 0) {
      console.log(`\nNo ${diff} riddles.`);
      continue;
    }

    console.log(`\nStarting ${diff} riddles:`);

    for (const r of toSolve) {
      const result = r.ask();
      if (result === "exit") return;

      const seconds = Math.floor(Math.random() * 30) + 5;

      try {
        await player.solveRiddle(r.id, diff, seconds);
        console.log(`✅ Solved in ${seconds} seconds`);
      } catch (err) {
        console.log("❌ Failed to save solution:", err.message);
      }
    }
  }

  console.log("\nGame over! (Stats available via leaderboard)");
}

//====================================
export async function createRiddle() {
  const newRiddle = await Riddle.createFromUserInput(); 
  console.log("log: ", newRiddle);

  await fetch(`${BASE_URL}/riddles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRiddle)
  });

  console.log("Riddle created.");
}

//====================================
export async function showRiddles() {
  const res = await fetch(`${BASE_URL}/riddles`);
  const riddles = await res.json();
  riddles.map(r => Object.assign(new Riddle(), r)).forEach(r => r.printRiddle());
}

//====================================
export async function updateRiddle() {
  const id = readline.questionInt("Enter riddle ID to update: ");
  const riddle = Riddle.createFromUserInput();
  riddle.id = id;

  await fetch(`${BASE_URL}/riddles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(riddle)
  });

  console.log("Riddle updated.");
}

//====================================
export async function deleteRiddle() {
  const id = readline.questionInt("Enter riddle ID to delete: ");
  await fetch(`${BASE_URL}/riddles/${id}`, { method: "DELETE" });
  console.log("Riddle deleted.");
}

//====================================
export async function viewLeaderboard() {
  const res = await fetch(`${BASE_URL}/players/sorted-by-total`);
  const players = await res.json();

  console.log("\nLeaderboard:");
  players.forEach(p => {
    console.log(`- ${p.name}: ${p.total_solved} riddles solved`);
  });
}
