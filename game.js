// Tetris main logic
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scale = 20;
const scoreDisplay = document.getElementById("score");

// Initialize score
let score = 0;
// Update score function
function updateScore(linesCleared) {
  const pointsPerLine = 100;
  score += linesCleared * pointsPerLine;
  scoreDisplay.textContent = "Score: " + score;
}

// Tetromino shapes
const shapes = [
    { shape: [
      [1, 1, 1],
      [0, 1, 0],
    ], color: "purple" }, // T
    { shape: [
      [0, 1, 1],
      [1, 1, 0],
    ], color: "red" }, // Z
    { shape: [
      [1, 1, 0],
      [0, 1, 1],
    ], color: "green" }, // S
    { shape: [
      [1, 1],
      [1, 1],
    ], color: "yellow" }, // O
    { shape: [[1, 1, 1, 1]], color: "cyan" }, // I
    { shape: [
      [1, 1, 1],
      [1, 0, 0],
    ], color: "orange" }, // L
    { shape: [
      [1, 1, 1],
      [0, 0, 1],
    ], color: "blue" }, // J
  ];

// Initialize game state
let grid = Array.from({ length: 20 }, () => Array(10).fill(0));
let tetromino, position;

// Spawn a new tetromino
function spawn() {
  tetromino = shapes[Math.floor(Math.random() * shapes.length)];
  position = { x: Math.floor(grid[0].length / 2) - 1, y: 0 };
}

// Check if tetromino can be moved to a new position
function canMove(newPosition, newTetromino = tetromino.shape) {
  for (let y = 0; y < newTetromino.length; y++) {
    for (let x = 0; x < newTetromino[y].length; x++) {
      if (
        newTetromino[y][x] &&
        (newPosition.y + y >= grid.length ||
          newPosition.x + x < 0 ||
          newPosition.x + x >= grid[0].length ||
          grid[newPosition.y + y][newPosition.x + x])
      ) {
        return false;
      }
    }
  }
  return true;
}

 // Rotate tetromino
 function rotate() {
    const newTetromino = tetromino.shape[0]
      .map((_, i) => tetromino.shape.map((row) => row[i]))
      .reverse();
    if (canMove(position, newTetromino)) tetromino.shape = newTetromino;
  }

// Merge tetromino with grid and check for full lines
function merge() {
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        grid[position.y + y][position.x + x] = 1;
      }
    }
  }
  let linesCleared = 0;
  for (let y = grid.length - 1; y >= 0; ) {
    if (grid[y].every((cell) => cell)) {
      grid.splice(y, 1);
      grid.unshift(Array(10).fill(0));
      linesCleared++;
    } else {
      y--;
    }
  }
  if (linesCleared) {
    // Update score based on lines cleared
    updateScore(linesCleared);
  }
}

function resetScore() {
    score = 0;
    scoreDisplay.textContent = "Score: " + score;
}

// Game over condition
function isGameOver() {
  if (!canMove(position)) {
    resetScore(); // Reset the score when the game is over
    return true;
  }
  return false;
}

// Draw the game state
function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  function drawCells(cells, offset = { x: 0, y: 0 }, color = "white") {
    for (let y = 0; y < cells.length; y++) {
      for (let x = 0; x < cells[y].length; x++) {
        if (cells[y][x]) {
          ctx.fillStyle = color;
          ctx.fillRect(
            (x + offset.x) * scale,
            (y + offset.y) * scale,
            scale,
            scale
          );
          ctx.strokeStyle = "#000";
          ctx.strokeRect(
            (x + offset.x) * scale,
            (y + offset.y) * scale,
            scale,
            scale
          );
        }
      }
    }
  }

  drawCells(grid);
  drawCells(tetromino.shape, position, tetromino.color);
}

// Game loop
function update() {
  if (canMove({ x: position.x, y: position.y + 1 })) {
    position.y++;
  } else {
    merge();
    spawn();
    if (isGameOver()) {
      grid = Array.from({ length: 20 }, () => Array(10).fill(0));
    }
  }

  draw();
  setTimeout(update, 1000 / 2);
}

// Keyboard controls
document.addEventListener("keydown", (e) => {
  const newPosition = { x: position.x, y: position.y };
  if (e.code === "ArrowLeft") newPosition.x--;
  if (e.code === "ArrowRight") newPosition.x++;
  if (e.code === "ArrowDown") newPosition.y++;
  if (canMove(newPosition)) {
    position = newPosition;
  }
  if (e.code === "ArrowUp") {
    rotate();
  }
});
// Start the game
spawn();
update();
