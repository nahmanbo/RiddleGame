import readline from "readline-sync";
import Riddle from "./Riddle.js";
import Player from "./Player.js";

const BASE_URL = global.BASE_URL || "http://localhost:1212";

//====================================
// SECTION: PLAYER HELPERS
//====================================

//------------------------------------
// Fetch all players
//------------------------------------
async function fetchPlayers() {
  const res = await fetch(`${BASE_URL}/players`);
  return res.json();
}

//------------------------------------
// Create new player
//------------------------------------
async function createNewPlayer(name) {
  const res = await fetch(`${BASE_URL}/players`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

//------------------------------------
// Get existing or create new player
//------------------------------------
async function getOrCreatePlayer(name) {
  const players = await fetchPlayers();
  let data = players.find(p => p.name === name);

  if (!data) {
    console.log("New player registered.");
    data = await createNewPlayer(name);
  }

  return Player.fromSupabaseRecord(data);
}

//====================================
// SECTION: RIDDLE HELPERS
//====================================

//------------------------------------
// Fetch riddles by difficulty
//------------------------------------
async function fetchRiddlesByDifficulty(difficulty) {
  const res = await fetch(`${BASE_URL}/riddles/difficulty/${difficulty}`);
  const data = await res.json();
  return data.map(r => Object.assign(new Riddle(), r));
}

//------------------------------------
// Ask riddle and handle solving
//------------------------------------
async function askAndHandleRiddle(riddle, player) {
  const result = riddle.ask();
  if (result === "exit") return true;

  const seconds = Math.floor(Math.random() * 30) + 5;

  try {
    await player.solveRiddle(riddle.id, riddle.difficulty, seconds);
    console.log(`✅ Solved in ${seconds} seconds`);
  } catch (err) {
    console.log("❌ Failed to save solution:", err.message);
  }

  return false;
}

//====================================
// SECTION: GAME FLOW
//====================================
export async function playGame() {
  const name = readline.question("\nEnter your name: ");
  const player = await getOrCreatePlayer(name);
  const difficulties = ["Easy", "Medium", "Hard"];

  for (const difficulty of difficulties) {
    const riddles = await fetchRiddlesByDifficulty(difficulty);
    if (riddles.length === 0) {
      console.log(`\nNo ${difficulty} riddles.`);
      continue;
    }

    console.log(`\nStarting ${difficulty} riddles:`);

    for (const riddleData of riddles) {
      const riddle = Object.assign(new Riddle(), riddleData);
      const exit = await askAndHandleRiddle(riddle, player);
      if (exit) return;
    }
  }

  console.log("\nGame over! (Stats available via leaderboard)");
}

//====================================
// SECTION: ADMIN TOOLS
//====================================
export async function createRiddle() {
  const newRiddle = await Riddle.createFromUserInput();
  await fetch(`${BASE_URL}/riddles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRiddle)
  });
  console.log("Riddle created.");
}

export async function showRiddles() {
  const res = await fetch(`${BASE_URL}/riddles`);
  const riddles = await res.json();
  riddles.map(r => Object.assign(new Riddle(), r)).forEach(r => r.printRiddle());
}

export async function updateRiddle() {
  const id = readline.questionInt("Enter riddle ID to update: ");
  const riddle = await Riddle.createFromUserInput();
  riddle.id = id;

  await fetch(`${BASE_URL}/riddles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(riddle)
  });

  console.log("Riddle updated.");
}

export async function deleteRiddle() {
  const id = readline.questionInt("Enter riddle ID to delete: ");
  await fetch(`${BASE_URL}/riddles/${id}`, { method: "DELETE" });
  console.log("Riddle deleted.");
}

export async function viewLeaderboard() {
  const res = await fetch(`${BASE_URL}/players/sorted-by-total`);
  const players = await res.json();

  console.log("\nLeaderboard:");
  players.forEach(p => {
    console.log(`- ${p.name}: ${p.total_solved} riddles solved`);
  });
}
