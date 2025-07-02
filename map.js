// map.js

// --- SCREEN & PLAYER DATA ---
const MAP_SIZE = 5; // The size of our screen/view
const playerX = 2;  // Player is always at screen column 2
const playerY = 2;  // Player is always at screen row 2

// --- WORLD & GAME STATE ---
let cameraX = 0;
let cameraY = 0;
let playerHealth = 10; // Player starts with 10 health

// Let's create an array of objects in our world.
// This is more flexible than having separate variables for each box.
const worldObjects = [
  { x: 4, y: 2, symbol: 'T', isSolid: true, damage: 0 },   // A solid Tree
  { x: 5, y: 2, symbol: 'T', isSolid: true, damage: 0 },   // Another Tree
  { x: 1, y: 1, symbol: 'L', isSolid: false, damage: 1 },  // A damaging Lava tile
  { x: 1, y: 2, symbol: 'L', isSolid: false, damage: 1 }   // More Lava
];

// --- RENDER FUNCTION ---
function renderMap() {
  console.clear();
  console.log('Use WASD to move. Press "q" to quit.');
  console.log('-----------------');

  for (let y = 0; y < MAP_SIZE; y++) {
    let row = "";
    for (let x = 0; x < MAP_SIZE; x++) {
      const worldX = cameraX + x;
      const worldY = cameraY + y;
      let drawnObject = false;

      if (x === playerX && y === playerY) {
        row += "P ";
      } else {
        // Check if there is an object at this world coordinate
        for (const obj of worldObjects) {
          if (obj.x === worldX && obj.y === worldY) {
            row += obj.symbol + " ";
            drawnObject = true;
            break; // Stop after finding the first object at this location
          }
        }
        if (!drawnObject) {
          row += ". ";
        }
      }
    }
    console.log(row.trim());
  }
  console.log('-----------------');
  // Display health!
  console.log(`Health: ${playerHealth} | World Pos: (${cameraX + playerX}, ${cameraY + playerY})`);
}

// --- MOVEMENT & COLLISION LOGIC ---
function moveCamera(direction) {
  // First, determine where the player WANTS to go.
  const currentWorldX = cameraX + playerX;
  const currentWorldY = cameraY + playerY;

  // 2. Calculate the TARGET position in a single step.
  let targetWorldX, targetWorldY;

  if (direction === 'up') {
    targetWorldX = currentWorldX;
    targetWorldY = currentWorldY - 1;
  } else if (direction === 'down') {
    targetWorldX = currentWorldX;
    targetWorldY = currentWorldY + 1;
  } else if (direction === 'left') {
    targetWorldX = currentWorldX - 1;
    targetWorldY = currentWorldY;
  } else if (direction === 'right') {
    targetWorldX = currentWorldX + 1;
    targetWorldY = currentWorldY;
  } else {
    return; // If the direction is invalid, do nothing.
  }

  // Next, check if anything is at that target location.
  for (const obj of worldObjects) {
    if (obj.x === targetWorldX && obj.y === targetWorldY) {
      // If the object deals damage, apply it.
      if (obj.damage > 0) {
        playerHealth -= obj.damage;
      }
      // If the object is solid, block the move by returning early.
      if (obj.isSolid) {
        return; // EXIT the function, no move happens.
      }
    }
  }

  // If we get here, the path was not blocked. Update the camera's position.
  switch (direction) {
    case 'up':    cameraY--; break;
    case 'down':  cameraY++; break;
    case 'left':  cameraX--; break;
    case 'right': cameraX++; break;
  }
}

// --- EXPORTED "REMOTE CONTROL" ---
module.exports = {
  moveCamera,
  renderMap,
  // We need to export a way for game.js to check the player's health!
  getPlayerHealth: function() {
    return playerHealth;
  }
};