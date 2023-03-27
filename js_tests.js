// Tests
// Test 1: check if the pieces array contains 7 pieces
console.assert(pieces.length === 7, 'Error: pieces array should contain 7 pieces');

// Test 2: check if the createBoard function creates a 20x10 board array with all values set to 0
createBoard();
console.assert(board.length === 20 && board[0].length === 10, 'Error: board array should be 20x10');
console.assert(board.every(row => row.every(cell => cell === 0)), 'Error: board should contain only 0 values');

// Test 3: check if the newPiece function sets the current piece to a random piece from the pieces array
newPiece();
console.assert(pieces.some(piece => piece.name === currentPiece.name && piece.color === currentPiece.color && JSON.stringify(piece.shape) === JSON.stringify(currentPiece.shape)), 'Error: newPiece function should set the current piece to a random piece from the pieces array');

// Test 4: check if the moveDown function moves the current piece down by one row
const initialY = currentY;
moveDown();
console.assert(currentY === initialY + 1, 'Error




openai@pcmyers.com
continue
// Test 4 (continued)
// Check if the moveDown function stops the piece if it reaches the bottom of the board
while (!checkCollisions()) {
moveDown();
}
moveDown();
console.assert(currentY === initialY + 1, 'Error: moveDown function should stop the piece if it reaches the bottom of the board');

// Test 5: check if the moveLeft function moves the current piece one column to the left
const initialX = currentX;
moveLeft();
console.assert(currentX === initialX - 1, 'Error: moveLeft function should move the piece one column to the left');

// Test 6: check if the moveRight function moves the current piece one column to the right
moveRight();
console.assert(currentX === initialX, 'Error: moveRight function should move the piece one column to the right');

// Test 7: check if the rotatePiece function rotates the current piece 90 degrees clockwise
const initialShape = JSON.stringify(currentPiece.shape);
rotatePiece();
console.assert(JSON.stringify(currentPiece.shape) !== initialShape, 'Error: rotatePiece function should rotate the piece 90 degrees clockwise');

// Test 8: check if the lockPiece function locks the current piece in place and adds its color to the board array
lockPiece();
console.assert(board.some(row => row.some(cell => cell === currentPiece.color)), 'Error: lockPiece function should add the current piece color to the board array');

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
['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red']
];
clearRows();
console.assert(board.every(row => row.every(cell => cell === 0)), 'Error: clearRows function should remove completed rows');
console.assert(score === 10, 'Error: clearRows function should increase the score by 10 points for each completed row');

// Test 10: check if the drawBoard function draws the board correctly
board = [
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],




openai@pcmyers.com
continue
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
['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red']
];
drawBoard();
const rows = document.querySelectorAll('.row');
let i = 0;
rows.forEach(row => {
const cells = row.querySelectorAll('.cell');
cells.forEach(cell => {
if (board[i][cell.dataset.col] === 0) {
console.assert(cell.style.backgroundColor === '', 'Error: drawBoard function should not color empty cells');
} else {
console.assert(cell.style.backgroundColor === board[i][cell.dataset.col], 'Error: drawBoard function should color cells according to the board array');
}
});
i++;
});

// Test 11: check if the startGame function sets the game variables to their initial values and starts the game loop
startGame();
console.assert(score === 0, 'Error: startGame function should set the score to 0');
console.assert(currentPiece !== null, 'Error: startGame function should set the currentPiece to a new random piece');
console.assert(nextPiece !== null, 'Error: startGame function should set the nextPiece to a new random piece');
console.assert(intervalId !== null, 'Error: startGame function should start the game loop');

console.log('All tests passed successfully.');
