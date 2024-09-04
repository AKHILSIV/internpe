const ROWS = 6;
const COLS = 7;

let currentPlayer = 1;
let board = [];
let gameEnded = true;
let player1Points = 0;
let player2Points = 0;

const boardElement = document.getElementById('board');
const messageElement = document.getElementById('message');
const player1PointsElement = document.getElementById('player1Points');
const player2PointsElement = document.getElementById('player2Points');
const startGameBtn = document.getElementById('startGameBtn');
const restartBtn = document.getElementById('restartBtn');
const goBackBtn = document.getElementById('goBackBtn');
const startGameContainer = document.getElementById('startGameContainer');
const gameContainer = document.getElementById('gameContainer');

function initBoard() {
    board = [];
    for (let row = 0; row < ROWS; row++) {
        board[row] = [];
        for (let col = 0; col < COLS; col++) {
            board[row][col] = 0;
        }
    }
}

function renderBoard() {
    boardElement.innerHTML = '';
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (board[row][col] === 1) {
                cell.classList.add('player1');
            } else if (board[row][col] === 2) {
                cell.classList.add('player2');
            }
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', () => handleMove(col));
            boardElement.appendChild(cell);
        }
    }
}

function startGame() {
    gameEnded = false;
    currentPlayer = 1;
    initBoard();
    renderBoard();
    updateMessage(`Player ${currentPlayer}'s turn`);
    startGameContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    restartBtn.classList.add('hidden');
}

function handleMove(col) {
    if (gameEnded) return;
    let row = ROWS - 1;
    while (row >= 0 && board[row][col] !== 0) {
        row--;
    }
    if (row >= 0) {
        board[row][col] = currentPlayer;
        renderBoard();
        if (checkWin(row, col)) {
            gameEnded = true;
            if (currentPlayer === 1) {
                player1Points++;
                updatePoints(1, player1Points);
                updateMessage(`Player ${currentPlayer} wins!`);
            } else {
                player2Points++;
                updatePoints(2, player2Points);
                updateMessage(`Player ${currentPlayer} wins!`);
            }
            restartBtn.classList.remove('hidden');
        } else if (checkDraw()) {
            gameEnded = true;
            updateMessage(`It's a draw!`);
            restartBtn.classList.remove('hidden');
        } else {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateMessage(`Player ${currentPlayer}'s turn`);
        }
    }
}

function updateMessage(msg) {
    messageElement.textContent = msg;
}

function checkWin(row, col) {
    if (checkLine(row, col, 1, 0)) return true;
    if (checkLine(row, col, 0, 1)) return true;
    if (checkLine(row, col, 1, 1)) return true;
    if (checkLine(row, col, 1, -1)) return true;
    return false;
}

function checkDraw() {
    for (let col = 0; col < COLS; col++) {
        if (board[0][col] === 0) {
            return false;
        }
    }
    return true;
}

function checkLine(row, col, rowDelta, colDelta) {
    const player = board[row][col];
    let count = 1;
    let r = row + rowDelta;
    let c = col + colDelta;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        count++;
        r += rowDelta;
        c += colDelta;
    }
    r = row - rowDelta;
    c = col - colDelta;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        count++;
        r -= rowDelta;
        c -= colDelta;
    }
    return count >= 4;
}

function resetGame() {
    gameEnded = true;
    initBoard();
    renderBoard();
    updateMessage(`Click "Start Game" to begin`);
    restartBtn.classList.add('hidden');
}

function goBackToStart() {
    resetGame();
    startGameContainer.style.display = 'block';
    gameContainer.style.display = 'none';
}

window.onload = function() {
    resetGame();
};

function updatePoints(player, points) {
    const pointsElement = player === 1 ? player1PointsElement : player2PointsElement;
    pointsElement.textContent = points;
    pointsElement.classList.add('points-animation');
    setTimeout(() => {
        pointsElement.classList.remove('points-animation');
    }, 500);
}

startGameBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
goBackBtn.addEventListener('click', goBackToStart);
 