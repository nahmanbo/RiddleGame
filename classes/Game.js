import readline from "readline-sync";
import Riddle from "./Riddle.js";
import Player from "./Player.js";

//====================================
export async function playGame() {
  const name = readline.question("\nEnter your name: ");
  const res = await fetch(`${BASE_URL}/players`);
  const players = await res.json();

  let playerData = players.find(p => p.name === name);
  let player;

  if (!playerData) {
    console.log("New player registered.");
    player = new Player(name);
    const saved = await fetch(`${BASE_URL}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(player)
    });
    playerData = await saved.json();
  }

  player = Object.assign(new Player(playerData.name), playerData); // rehydrate class

  const riddlesRes = await fetch(`${BASE_URL}/riddles`);
  const riddlesData = await riddlesRes.json();
  const riddles = riddlesData.map(r => Object.assign(new Riddle(), r));

  const difficulties = ["Easy", "Medium", "Hard"];

  for (const diff of difficulties) {
    const toSolve = riddles.filter(r =>
      r.difficulty === diff &&
      !player.solvedRiddles[diff].includes(r.id)
    );

    if (toSolve.length === 0) {
      console.log(`\nNo new ${diff} riddles.`);
      continue;
    }

    console.log(`\nStarting ${diff} riddles:`);

    for (const r of toSolve) {
      const result = r.ask();
      if (result === "exit") {
        await updatePlayer(player);
        return;
      }

      const seconds = Math.floor(Math.random() * 30) + 5;
      player.recordId(diff, r.id);
      player.recordTime(diff, seconds);
    }
  }

  console.log("\nYour Stats:");
  player.showCompactStats();
  await updatePlayer(player);
}

//====================================
async function updatePlayer(player) {
  await fetch(`${BASE_URL}/players/${player.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(player)
  });
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
  const res = await fetch(`${BASE_URL}/players`);
  const players = await res.json();

  console.log("\nLeaderboard:");
  players.forEach(p => {
    const total = Object.values(p.solvedTimes || {})
      .flat()
      .reduce((a, b) => a + b, 0);
    console.log(`- ${p.name}: ${total} seconds total`);
  });
}
