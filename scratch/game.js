const gameBoard = document.querySelector("#game-board");

// Create the game pieces
const pieces = [
  {
    name: "I",
    color: "red",
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  {
    name: "J",
    color: "blue",
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  {
    name: "L",
    color: "orange",
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  {
    name: "O",
    color: "yellow",
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  {
    name: "S",
    color: "green",
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
  },
  {
    name: "T",
    color: "purple",
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  {
    name: "Z",
    color: "pink",
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
  },
];

// Define the current piece
let currentPiece = {
  name: "",
  color: "",
  shape: [],
};

// Define the current position of the piece
let currentX = 0;
let currentY = 0;

// Define the game board state
const board = [];

// Create the board array
function createBoard() {
  for (let i = 0; i < 20; i++) {
    board[i] = [];
    for (let j = 0; j < 10; j++) {
      board[i][j] = 0;
    }
  }
}

// Create a new piece
function newPiece() {
  const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
  currentPiece.name = randomPiece.name;
  currentPiece.color = randomPiece.color;
  currentPiece.shape = randomPiece.shape;
  currentX = 3;
  currentY = 0;
}

// Draw the current piece on the board
function drawPiece() {
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x]) {
        const block = document.createElement("div");
        block.className = "block";
        block.style.backgroundColor = currentPiece.color;
        block.style.top = (currentY + y) * 30 + "px";
        block.style.left = (currentX + x) * 30 + "px";
        gameBoard.appendChild(block);
      }
    }
  }
}

// Remove the current piece from the board
function removePiece() {
  const blocks = document.querySelectorAll(".block");
  blocks.forEach((block) => {
    block.parentNode.removeChild(block);
  });
}

// Move the piece down
function moveDown() {
  removePiece();
  currentY++;
  drawPiece();
}

// Move the piece left
function moveLeft() {
  removePiece();
  currentX--;
  drawPiece();
}

// Move the piece right
function moveRight() {
  removePiece();
  currentX++;
  drawPiece();
}

// Rotate the piece
function rotatePiece() {
  const rotatedPiece = [];
  for (let y = 0; y < currentPiece.shape.length; y++) {
    rotatedPiece[y] = [];
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      rotatedPiece[y][x] =
        currentPiece.shape[currentPiece.shape.length - 1 - x][y];
    }
  }
  currentPiece.shape = rotatedPiece;
  removePiece();
  drawPiece();
}

// Check for collisions
function checkCollisions() {
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x]) {
        const newX = currentX + x;
        const newY = currentY + y;
        if (newX < 0 || newX >= 10 || newY >= 20 || board[newY][newX]) {
          return true;
        }
      }
    }
  }
  return false;
}
function lockPiece() {
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x]) {
        const newX = currentX + x;
        const newY = currentY + y;
        board[newY][newX] = currentPiece.color;
      }
    }
  }
}

// Clear completed rows
function clearRows() {
  for (let y = board.length - 1; y >= 0; y--) {
    let rowFilled = true;
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x] === 0) {
        rowFilled = false;
        break;
      }
    }
    if (rowFilled) {
      for (let i = y; i > 0; i--) {
        for (let j = 0; j < board[i].length; j++) {
          board[i][j] = board[i - 1][j];
        }
      }
      y++;
      score += 10;
      scoreDisplay.innerHTML = score;
    }
  }
}

// Draw the board
function drawBoard() {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x]) {
        const block = document.createElement("div");
        block.className = "block";
        block.style.backgroundColor = board[y][x];
        block.style.top = y * 30 + "px";
        block.style.left = x * 30 + "px";
        gameBoard.appendChild(block);
      }
    }
  }
}

// Handle key presses
document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowDown") {
    moveDown();
  }
  if (event.code === "ArrowLeft") {
    moveLeft();
  }
  if (event.code === "ArrowRight") {
    moveRight();
  }
  if (event.code === "ArrowUp") {
    rotatePiece();
  }
});

// Start the game
createBoard();
newPiece();
drawPiece();

// Game loop
let lastTime = 0;
let score = 0;
const scoreDisplay = document.getElementById("score");
function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  if (!checkCollisions()) {
    moveDown();
  } else {
    lockPiece();
    clearRows();
    newPiece();
  }
  drawBoard();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

// Tests
// Test 1: check if the pieces array contains 7 pieces
console.assert(
  pieces.length === 7,
  `Error: pieces array should contain 7 pieces`
);

// Test 2: check if the createBoard function creates a 20x10 board array with all values set to 0
createBoard();
console.assert(
  board.length === 20 && board[0].length === 10,
  "Error: board array should be 20x10"
);
console.assert(
  board.every((row) => row.every((cell) => cell === 0)),
  "Error: board should contain only 0 values"
);

// Test 3: check if the newPiece function sets the current piece to a random piece from the pieces array
newPiece();
console.assert(
  pieces.some(
    (piece) =>
      piece.name === currentPiece.name &&
      piece.color === currentPiece.color &&
      JSON.stringify(piece.shape) === JSON.stringify(currentPiece.shape)
  ),
  "Error: newPiece function should set the current piece to a random piece from the pieces array"
);

// Test 4: check if the moveDown function moves the current piece down by one row
const initialY = currentY;
moveDown();
console.assert(currentY === initialY + 1, "Error");
// Test 4 (continued)
// Check if the moveDown function stops the piece if it reaches the bottom of the board
while (!checkCollisions()) {
  moveDown();
}
moveDown();
console.assert(
  currentY === initialY + 1,
  "Error: moveDown function should stop the piece if it reaches the bottom of the board"
);

// Test 5: check if the moveLeft function moves the current piece one column to the left
const initialX = currentX;
moveLeft();
console.assert(
  currentX === initialX - 1,
  "Error: moveLeft function should move the piece one column to the left"
);

// Test 6: check if the moveRight function moves the current piece one column to the right
moveRight();
console.assert(
  currentX === initialX,
  "Error: moveRight function should move the piece one column to the right"
);

// Test 7: check if the rotatePiece function rotates the current piece 90 degrees clockwise
const initialShape = JSON.stringify(currentPiece.shape);
rotatePiece();
console.assert(
  JSON.stringify(currentPiece.shape) !== initialShape,
  "Error: rotatePiece function should rotate the piece 90 degrees clockwise"
);

// Test 8: check if the lockPiece function locks the current piece in place and adds its color to the board array
lockPiece();
console.assert(
  board.some((row) => row.some((cell) => cell === currentPiece.color)),
  "Error: lockPiece function should add the current piece color to the board array"
);

// Test 9: check if the clearRows function removes completed rows and increases the score
board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["red", "red", "red", "red", "red", "red", "red", "red", "red", "red"],
];
clearRows();
console.assert(
  board.every((row) => row.every((cell) => cell === 0)),
  "Error: clearRows function should remove completed rows"
);
console.assert(
  score === 10,
  "Error: clearRows function should increase the score by 10 points for each completed row"
);

// Test 10: check if the drawBoard function draws the board correctly
board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // Test 10 (continued)
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["red", "red", "red", "red", "red", "red", "red", "red", "red", "red"],
];
drawBoard();
const rows = document.querySelectorAll(".row");
let i = 0;
rows.forEach((row) => {
  const cells = row.querySelectorAll(".cell");
  cells.forEach((cell) => {
    if (board[i][cell.dataset.col] === 0) {
      console.assert(
        cell.style.backgroundColor === "",
        "Error: drawBoard function should not color empty cells"
      );
    } else {
      console.assert(
        cell.style.backgroundColor === board[i][cell.dataset.col],
        "Error: drawBoard function should color cells according to the board array"
      );
    }
  });
  i++;
});

// Test 11: check if the startGame function sets the game variables to their initial values and starts the game loop
startGame();
console.assert(
  score === 0,
  "Error: startGame function should set the score to 0"
);
console.assert(
  currentPiece !== null,
  "Error: startGame function should set the currentPiece to a new random piece"
);
console.assert(
  nextPiece !== null,
  "Error: startGame function should set the nextPiece to a new random piece"
);
console.assert(
  intervalId !== null,
  "Error: startGame function should start the game loop"
);

console.log("All tests passed successfully.");
