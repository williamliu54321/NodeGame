// map.js

// --- PRIVATE DATA ---
// These variables are the internal state of our map.
// They are NOT directly accessible from other files.
const MAP_SIZE = 5;
let playerX = 2;
let playerY = 2;

// --- PRIVATE FUNCTION ---
// This function can also only be used inside this file.
function renderMap() {
  console.clear(); // Clear the console for a clean redraw
  console.log('Use WASD to move. Press "q" to quit.');
  console.log('-----------------');
  for (let y = 0; y < MAP_SIZE; y++) {
    let row = "";
    for (let x = 0; x < MAP_SIZE; x++) {
      if (x === playerX && y === playerY) {
        row += "P ";
      } else {
        row += ". ";
      }
    }
    console.log(row.trim());
  }
  console.log('-----------------');
}

// --- PUBLIC FUNCTION ---
// We will export this function so game.js can call it.
function movePlayer(direction) {
  // Update the private coordinates based on the direction
  switch (direction) {
    case 'up':
      if (playerY > 0) playerY--; // Boundary check
      break;
    case 'down':
      if (playerY < MAP_SIZE - 1) playerY++; // Boundary check
      break;
    case 'left':
      if (playerX > 0) playerX--; // Boundary check
      break;
    case 'right':
      if (playerX < MAP_SIZE - 1) playerX++; // Boundary check
      break;
  }
}

// --- THE EXPORTED "REMOTE CONTROL" ---
// We create an object that holds the functions we want to make public.
// This is the ONLY thing that game.js will get access to.
module.exports = {
  // We are sharing the ability to call movePlayer
  movePlayer: movePlayer,
  // We are sharing the ability to call renderMap
  renderMap: renderMap
};