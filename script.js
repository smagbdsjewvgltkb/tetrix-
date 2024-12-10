const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
const rows = 20;
const columns = 10;
const blockSize = 30;
canvas.width = columns * blockSize;
canvas.height = rows * blockSize;

const tetrominos = [
    [[1, 1, 1], [0, 1, 0]],  // T
    [[1, 1, 0], [0, 1, 1]],  // S
    [[0, 1, 1], [1, 1, 0]],  // Z
    [[1, 1], [1, 1]],        // O
    [[1, 1, 1, 1]],          // I
    [[1, 0, 0], [1, 1, 1]],  // L
    [[0, 0, 1], [1, 1, 1]]   // J
];

const colors = ['#00ff00', '#00ff00', '#00ff00', '#00ff00', '#00ff00', '#00ff00', '#00ff00'];
let board = Array.from({ length: rows }, () => Array(columns).fill(null));

function drawBoard() {
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (board[row][col]) {
                context.fillStyle = board[row][col];
                context.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
            }
        }
    }
}

function drawTetromino(tetromino, row, col) {
    for (let r = 0; r < tetromino.length; r++) {
        for (let c = 0; c < tetromino[r].length; c++) {
            if (tetromino[r][c]) {
                context.fillStyle = '#00ff00';
                context.fillRect((col + c) * blockSize, (row + r) * blockSize, blockSize, blockSize);
            }
        }
    }
}

function rotateTetromino(tetromino) {
    return tetromino[0].map((_, i) => tetromino.map(row => row[i])).reverse();
}

function isValidMove(tetromino, row, col) {
    for (let r = 0; r < tetromino.length; r++) {
        for (let c = 0; c < tetromino[r].length; c++) {
            if (tetromino[r][c]) {
                if (row + r >= rows || col + c < 0 || col + c >= columns || board[row + r][col + c]) {
                    return false;
                }
            }
        }
    }
    return true;
}

let currentTetromino = randomTetromino();
let currentRow = 0;
let currentCol = Math.floor(columns / 2) - 1;

function randomTetromino() {
    return tetrominos[Math.floor(Math.random() * tetrominos.length)];
}

function dropTetromino() {
    if (isValidMove(currentTetromino, currentRow + 1, currentCol)) {
        currentRow++;
    } else {
        for (let r = 0; r < currentTetromino.length; r++) {
            for (let c = 0; c < currentTetromino[r].length; c++) {
                if (currentTetromino[r][c]) {
                    board[currentRow + r][currentCol + c] = colors[tetrominos.indexOf(currentTetromino)];
                }
            }
        }

        currentTetromino = randomTetromino();
        currentRow = 0;
        currentCol = Math.floor(columns / 2) - 1;

        if (!isValidMove(currentTetromino, currentRow, currentCol)) {
            alert("Game Over!");
            board = Array.from({ length: rows }, () => Array(columns).fill(null));
        }
    }
}

function moveTetromino(direction) {
    const newCol = currentCol + direction;
    if (isValidMove(currentTetromino, currentRow, newCol)) {
        currentCol = newCol;
    }
}

function update() {
    dropTetromino();
    drawBoard();
    drawTetromino(currentTetromino, currentRow, currentCol);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        moveTetromino(-1);
    } else if (event.key === "ArrowRight") {
        moveTetromino(1);
    } else if (event.key === "ArrowDown") {
        dropTetromino();
    } else if (event.key === "ArrowUp") {
        const rotated = rotateTetromino(currentTetromino);
        if (isValidMove(rotated, currentRow, currentCol)) {
            currentTetromino = rotated;
        }
    }
});

setInterval(update, 500);
