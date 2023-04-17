interface Point {
  x: number;
  y: number;
}

interface Tetromino {
  shape: number[][];
  position: Point;
}
const COLORS = [
  null,
  "cyan",
  "blue",
  "orange",
  "yellow",
  "green",
  "purple",
  "red",
];

const SHAPES = [
  [
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [[1, 1, 1, 1]],
  [
    [1, 1, 1],
    [1, 0, 0],
  ],
  [
    [1, 1, 1],
    [0, 0, 1],
  ],
];

class Game {
  public grid: number[][];
  public currentTetromino: Tetromino;
  private rows: number;
  private cols: number;

  constructor(rows: number = 20, cols: number = 10) {
    this.rows = rows;
    this.cols = cols;
    this.grid = this.createEmptyGrid();
    this.currentTetromino = this.createRandomTetromino();
  }

  canMove(newPosition: Point): boolean {
    for (let row = 0; row < this.currentTetromino.shape.length; row++) {
      for (let col = 0; col < this.currentTetromino.shape[row].length; col++) {
        const cell = this.currentTetromino.shape[row][col];
        if (cell) {
          const x = newPosition.x + col;
          const y = newPosition.y + row;
          if (x < 0 || x >= this.cols || y >= this.rows || this.grid[y]?.[x]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  move(dx: number, dy: number): void {
    const newPosition: Point = {
      x: this.currentTetromino.position.x + dx,
      y: this.currentTetromino.position.y + dy,
    };
    if (this.canMove(newPosition)) {
      this.currentTetromino.position = newPosition;
    } else if (dy > 0) {
      this.lockTetromino();
      const clearedLines = this.clearLines();
      this.updateScore(clearedLines);
      this.currentTetromino = this.createRandomTetromino();
      if (this.isGameOver()) {
        // Handle the game over condition, e.g., reset the game or display a message
      }
    }
  }

  private lockTetromino(): void {
    for (let row = 0; row < this.currentTetromino.shape.length; row++) {
      for (let col = 0; col < this.currentTetromino.shape[row].length; col++) {
        const cell = this.currentTetromino.shape[row][col];
        if (cell) {
          const x = this.currentTetromino.position.x + col;
          const y = this.currentTetromino.position.y + row;
          this.grid[y][x] = 1; // Set the grid cell to 1, indicating it's occupied
        }
      }
    }
  }
  rotate(): void {
    const rotatedShape = this.rotateMatrix(this.currentTetromino.shape);
    const rotatedTetromino: Tetromino = {
      shape: rotatedShape,
      position: this.currentTetromino.position,
    };
    if (this.canMove(rotatedTetromino.position)) {
      this.currentTetromino.shape = rotatedShape;
    }
  }

  private createEmptyGrid(): number[][] {
    const grid = [];
    for (let row = 0; row < this.rows; row++) {
      grid.push(new Array(this.cols).fill(0));
    }
    return grid;
  }

  private createRandomTetromino(): Tetromino {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const position: Point = { x: Math.floor(this.cols / 2) - 1, y: 0 };
    return { shape, position };
  }

  private rotateMatrix(matrix: number[][]): number[][] {
    const result = [];
    for (let col = 0; col < matrix[0].length; col++) {
      const newRow = [];
      for (let row = matrix.length - 1; row >= 0; row--) {
        newRow.push(matrix[row][col]);
      }
      result.push(newRow);
    }
    return result;
  }
  private clearLines(): number {
    let clearedLines = 0;
    for (let row = this.grid.length - 1; row >= 0; row--) {
      if (this.isLineFull(row)) {
        this.removeLine(row);
        clearedLines++;
        row++; // Check the same row again, as rows have shifted down
      }
    }
    return clearedLines;
  }

  private isLineFull(row: number): boolean {
    return this.grid[row].every((cell) => cell === 1);
  }

  private removeLine(line: number): void {
    this.grid.splice(line, 1);
    this.grid.unshift(new Array(this.cols).fill(0));
  }

  // Call this method after locking the tetromino in the move method
  private updateScore(clearedLines: number): void {
    // Implement your scoring logic based on the number of cleared lines
  }
  private isGameOver(): boolean {
    return !this.canMove(this.currentTetromino.position);
  }
}

class Renderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private game: Game;
  private scale: number;

  constructor(canvas: HTMLCanvasElement, game: Game, scale: number = 20) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.game = game;
    this.scale = scale;
  }

  draw(): void {
    // Clear the canvas
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the grid
    for (let row = 0; row < this.game.grid.length; row++) {
      for (let col = 0; col < this.game.grid[row].length; col++) {
        const cell = this.game.grid[row][col];
        if (cell) {
          this.drawCell(col, row, cell);
        }
      }
    }

    // Draw the current tetromino
    const tetromino = this.game.currentTetromino;
    const shape = tetromino.shape;

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        const cell = shape[row][col];
        if (cell) {
          const x = tetromino.position.x + col;
          const y = tetromino.position.y + row;
          this.drawCell(x, y, cell);
        }
      }
    }
  }

  private drawCell(x: number, y: number, colorIndex: number): void {
    this.context.fillStyle = COLORS[colorIndex];
    this.context.fillStyle = color;
    this.context.fillRect(
      x * this.scale,
      y * this.scale,
      this.scale,
      this.scale
    );
    this.context.strokeStyle = "white";
    this.context.strokeRect(
      x * this.scale,
      y * this.scale,
      this.scale,
      this.scale
    );
  }
}

const game = new Game();
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const renderer = new Renderer(canvas, game);

document.addEventListener("keydown", (e: KeyboardEvent) => {
  // Handle input events and call appropriate game methods
  const newPosition = {
    x: game.currentTetromino.position.x,
    y: game.currentTetromino.position.y,
  };
  if (e.code === "ArrowLeft") newPosition.x--;
  if (e.code === "ArrowRight") newPosition.x++;
  if (e.code === "ArrowDown") newPosition.y++;

  if (game.canMove(newPosition)) {
    game.currentTetromino.position = newPosition;
  }

  if (e.code === "ArrowUp") {
    game.rotate();
  }
});

function gameLoop() {
  // Update game state
  renderer.draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
