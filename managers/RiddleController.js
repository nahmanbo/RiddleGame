import readline from "readline-sync";
import Riddle from "../models/Riddle.js";

const BASE_URL = "http://localhost:1212";

// Creates a new riddle and sends it to the server
export async function createRiddle() {
  const newRiddle = await Riddle.createFromUserInput();
  await fetch(`${BASE_URL}/riddles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRiddle)
  });
  console.log("Riddle created.");
}

// Fetches and displays all riddles
export async function showRiddles() {
  const res = await fetch(`${BASE_URL}/riddles`);
  const riddles = await res.json();
  riddles.map(r => Object.assign(new Riddle(), r)).forEach(r => r.printRiddle());
}

// Updates an existing riddle by ID
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

// Deletes a riddle by ID
export async function deleteRiddle() {
  const id = readline.questionInt("Enter riddle ID to delete: ");
  await fetch(`${BASE_URL}/riddles/${id}`, { method: "DELETE" });
  console.log("Riddle deleted.");
}

// Displays the player leaderboard
export async function viewLeaderboard() {
  const res = await fetch(`${BASE_URL}/players/sorted-by-total`);
  const players = await res.json();

  console.log("\nLeaderboard:");
  players.forEach(p => {
    console.log(`- ${p.name}: ${p.total_solved} riddles solved`);
  });
}

