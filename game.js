// game.js

// --- SETUP THE INPUT ---
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");

// --- IMPORT THE MAP MODULE ---
// This should now hold { moveCamera, renderMap, updateWorld, getPlayerHealth, resetFlashStates }
const map = require('./map.js');

// --- GAME STATE & CONFIGURATION ---
let lastPlayerInput = null;
const PLAYER_TICK_RATE_MS = 250; // Slowed down a bit for better visibility of flashes
let tickCounter = 0;
const ENEMY_TURN_TICK_INTERVAL = 2; // Enemies move every 2 ticks (every 0.5 seconds)

// --- INPUT LISTENER (Same as before) ---
process.stdin.on("data", (key) => {
  if (key === "q") {
    console.log("Thanks for playing!");
    process.exit();
  }
  if (['w', 'a', 's', 'd'].includes(key)) {
    lastPlayerInput = key;
  }
});

// --- THE REAL-TIME GAME LOOP ---
function gameLoop() {
  tickCounter++;

  // --- NEW STEP 1: RESET FRAME STATE ---
  // This is the crucial new line. It turns off the flash from the previous frame.
  map.resetFlashStates();

  // --- 2. Player's Turn ---
  if (lastPlayerInput) {
    switch (lastPlayerInput) {
      case "w": map.moveCamera('up');    break;
      case "a": map.moveCamera('left');  break;
      case "s": map.moveCamera('down');  break;
      case "d": map.moveCamera('right'); break;
    }
    lastPlayerInput = null;
  }

  // --- 3. Enemy's Turn ---
  if (tickCounter % ENEMY_TURN_TICK_INTERVAL === 0) {
    // When an enemy attacks inside updateWorld, it will set the flash states to true.
    map.updateWorld();
  }

  // --- 4. Render the World ---
  // renderMap will now see the new flash states and draw the colors.
  map.renderMap();

  // --- 5. Check Game State ---
  if (map.getPlayerHealth() <= 0) {
    console.log("You have been defeated! GAME OVER.");
    clearInterval(gameInterval);
    process.exit();
  }
}

// --- START THE GAME ---
console.log("Game starting...");
map.renderMap();

// Start the fast game loop.
const gameInterval = setInterval(gameLoop, PLAYER_TICK_RATE_MS);