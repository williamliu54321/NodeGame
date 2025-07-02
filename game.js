// game.js

// --- SETUP THE INPUT ---
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");

// --- IMPORT THE MAP MODULE ---
// The 'map' constant now holds our "remote control" object:
// { movePlayer: [Function], renderMap: [Function] }
const map = require('./map.js');


// --- INITIAL RENDER ---
// Draw the map once at the very beginning of the game.
map.renderMap();


// --- THE GAME LOOP (INPUT LISTENER) ---
process.stdin.on("data", (key) => {
  // 1. Handle Quit Command
  if (key === "q") {
    console.log("Thanks for playing!");
    process.exit();
  }

  // 2. Use the remote control to ask the map to move the player
  switch (key) {
    case "w":
      map.movePlayer('up');
      break;
    case "a":
      map.movePlayer('left');
      break;
    case "s":
      map.movePlayer('down');
      break;
    case "d":
      map.movePlayer('right');
      break;
  }

  // 3. After every key press, tell the map to redraw itself
  map.renderMap();
});