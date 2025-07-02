// game.js

// --- SETUP THE INPUT ---
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");

// --- IMPORT THE MAP MODULE ---
// This now holds { moveCamera, renderMap, getPlayerHealth }
const map = require('./map.js');

// --- INITIAL RENDER ---
map.renderMap();

// --- THE GAME LOOP (INPUT LISTENER) ---
process.stdin.on("data", (key) => {
  // Handle the quit command
  if (key === "q") {
    console.log("Thanks for playing!");
    process.exit();
  }

  // Command the map module to attempt a move
  switch (key) {
    case "w":
      map.moveCamera('up');
      break;
    case "a":
      map.moveCamera('left');
      break;
    case "s":
      map.moveCamera('down');
      break;
    case "d":
      map.moveCamera('right');
      break;
  }

  // After every attempted move, render the result.
  map.renderMap();

  // CHECK THE GAME STATE: After rendering, check if the game is over.
  if (map.getPlayerHealth() <= 0) {
    console.log("You ran out of health. GAME OVER.");
    process.exit(); // End the game
  }
});