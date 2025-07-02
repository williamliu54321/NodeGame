// map.js

// --- 1. DEFINE COLORS & STATE ---
const COLORS = {
  red: '\x1b[91m',    // For player taking damage
  yellow: '\x1b[93m', // For enemy attacking  // <-- EDITED LINE
  reset: '\x1b[0m'
};

let playerIsFlashing = false;
let lastAttackingEnemy = null;

const SCREEN_SIZE = 5;
const PLAYER_SCREEN_X = Math.floor(SCREEN_SIZE / 2);
const PLAYER_SCREEN_Y = Math.floor(SCREEN_SIZE / 2);

let cameraX = 0;
let cameraY = 0;
let playerHealth = 10;

const worldObjects = [
  { x: 4, y: 2, type: 'terrain', symbol: 'T', isSolid: true, damage: 0 },
  { x: 0, y: 0, type: 'enemy', symbol: 'E', damage: 2, isSolid: true },
  { x: 2, y: 4, type: 'enemy', symbol: 'E', damage: 2, isSolid: true },
];

// --- HELPER FUNCTION ---
function getObjectAt(worldX, worldY) {
  for (const obj of worldObjects) {
    if (obj.x === worldX && obj.y === worldY) return obj;
  }
  return null;
}

// --- RENDER FUNCTION (Handles drawing with colors) ---
function renderMap() {
  console.clear();
  console.log('Use WASD to move. Press "q" to quit.');
  console.log('-----------------');

  for (let y = 0; y < SCREEN_SIZE; y++) {
    let row = "";
    for (let x = 0; x < SCREEN_SIZE; x++) {
      const worldX = cameraX + x;
      const worldY = cameraY + y;
      
      if (x === PLAYER_SCREEN_X && y === PLAYER_SCREEN_Y) {
        if (playerIsFlashing) {
          row += `${COLORS.red}P${COLORS.reset} `;
        } else {
          row += "P ";
        }
      } else {
        const object = getObjectAt(worldX, worldY);
        if (object) {
          // If this specific object is the one that just attacked, draw it in YELLOW.
          if (object === lastAttackingEnemy) {
            row += `${COLORS.yellow}${object.symbol}${COLORS.reset} `; // <-- EDITED LINE
          } else {
            row += object.symbol + " ";
          }
        } else {
          row += ". ";
        }
      }
    }
    console.log(row.trim());
  }
  
  const playerWorldX = cameraX + PLAYER_SCREEN_X;
  const playerWorldY = cameraY + PLAYER_SCREEN_Y;
  console.log('-----------------');
  console.log(`Health: ${playerHealth} | World Pos: (${playerWorldX}, ${playerWorldY})`);
}

// --- ENEMY AI & WORLD UPDATE FUNCTION ---
function updateWorld() {
  const playerWorldPos = { x: cameraX + PLAYER_SCREEN_X, y: cameraY + PLAYER_SCREEN_Y };

  for (const enemy of worldObjects) {
    if (enemy.type !== 'enemy') continue;

    const dx = Math.abs(enemy.x - playerWorldPos.x);
    const dy = Math.abs(enemy.y - playerWorldPos.y);

    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      playerHealth -= enemy.damage;
      playerIsFlashing = true;
      lastAttackingEnemy = enemy; // Set which enemy is attacking
      continue;
    }

    const directions = ['up', 'down', 'left', 'right'];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    
    let targetX = enemy.x;
    let targetY = enemy.y;

    switch (randomDirection) {
      case 'up':    targetY--; break;
      case 'down':  targetY++; break;
      case 'left':  targetX--; break;
      case 'right': targetX++; break;
    }

    if (targetX === playerWorldPos.x && targetY === playerWorldPos.y) continue;
    
    const objectAtTarget = getObjectAt(targetX, targetY);
    if (objectAtTarget && objectAtTarget.isSolid) continue;

    enemy.x = targetX;
    enemy.y = targetY;
  }
}

// --- PLAYER MOVEMENT FUNCTION ---
function moveCamera(direction) {
  const currentWorldX = cameraX + PLAYER_SCREEN_X;
  const currentWorldY = cameraY + PLAYER_SCREEN_Y;

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
    return; // Invalid direction
  }

  const objectAtTarget = getObjectAt(targetWorldX, targetWorldY);

  if (objectAtTarget) {
    if (objectAtTarget.damage > 0) {
      playerHealth -= objectAtTarget.damage;
    }
    if (objectAtTarget.isSolid) {
      return; // Path is blocked
    }
  }

  // If path is clear, commit the move by updating the camera.
  switch (direction) {
    case 'up':    cameraY--; break;
    case 'down':  cameraY++; break;
    case 'left':  cameraX--; break;
    case 'right': cameraX++; break;
  }
}

// --- STATE GETTER FUNCTIONS ---
function getPlayerHealth() {
  return playerHealth;
}

function resetFlashStates() {
  playerIsFlashing = false;
  lastAttackingEnemy = null;
}

// --- EXPORTS (The Public API for this module) ---
module.exports = {
  moveCamera,
  renderMap,
  updateWorld,
  getPlayerHealth,
  resetFlashStates
};