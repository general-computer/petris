const gameBoard = document.querySelector('#game-board');

// Create the game pieces
const pieces = [
    {
        name: 'I',
        color: 'red',
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    },
    {
        name: 'J',
        color: 'blue',
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ]
    },
    {
        name: 'L',
        color: 'orange',
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ]
    },
    {
        name: 'O',
        color: 'yellow',
        shape: [
            [1, 1],
            [1, 1]
        ]
    },
    {
        name: 'S',
        color: 'green',
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ]
    },
    {
        name: 'T',
        color: 'purple',
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ]
    },
    {
        name:
        'Z',
        color: 'pink',
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ]
    }
];

// Define the current piece
let currentPiece = {
    name: '',
    color: '',
    shape: []
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
                const block = document.createElement('div');
                block.className = 'block';
                block.style.backgroundColor = currentPiece.color;
                block.style.top = (currentY + y) * 30 + 'px';
                block.style.left = (currentX + x) * 30 + 'px';
                gameBoard.appendChild(block);
            }
        }
    }
}

// Remove the current piece from the board
function removePiece() {
    const blocks = document.querySelectorAll('.block');
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
            rotatedPiece[y][x] = currentPiece.shape[currentPiece.shape.length - 1 - x][y];
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
            if (		currentPiece.shape[y][x]) {
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
                const block = document.createElement('div');
                block.className = 'block';
                block.style.backgroundColor = board[y][x];
                block.style.top = y * 30 + 'px';
                block.style.left = x * 30 + 'px';
                gameBoard.appendChild(block);
            }
        }
    }
}

// Handle key presses
document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowDown') {
        moveDown();
    }
    if (event.code === 'ArrowLeft') {
        moveLeft();
    }
    if (event.code === 'ArrowRight') {
        moveRight();
    }
    if (event.code === 'ArrowUp') {
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
const scoreDisplay = document.getElementById('score');
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
