const board = document.getElementById('board');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const modeRadios = document.querySelectorAll('input[name="mode"]');

let cells = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = true;
let mode = 'pvp'; // default

modeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    mode = radio.value;
    resetGame();
  });
});

function renderBoard() {
  board.innerHTML = '';
  cells.forEach((cell, index) => {
    const cellDiv = document.createElement('div');
    cellDiv.classList.add('cell');
    cellDiv.textContent = cell;
    cellDiv.addEventListener('click', () => handleClick(index));
    board.appendChild(cellDiv);
  });
}

function handleClick(index) {
  if (!gameActive || cells[index] !== '') return;

  if (mode === 'pvp' || (mode === 'ai' && currentPlayer === 'X')) {
    cells[index] = currentPlayer;
    renderBoard();
    if (checkEnd(currentPlayer)) return;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }

  if (mode === 'ai' && currentPlayer === 'O' && gameActive) {
    statusText.textContent = `AI is thinking...`;
    setTimeout(() => {
      const aiIndex = getBestMove();
      if (aiIndex !== -1) {
        cells[aiIndex] = 'O';
        renderBoard();
        if (checkEnd('O')) return;
        currentPlayer = 'X';
        statusText.textContent = `Player ${currentPlayer}'s turn`;
      }
    }, 500);
  }
}

function getBestMove() {
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] === '') return i;
  }
  return -1;
}

function checkEnd(player) {
  if (checkWin(player)) {
    statusText.textContent = player === 'O' && mode === 'ai' ? 'AI wins! 🤖' : `Player ${player} wins! 🎉`;
    gameActive = false;
    return true;
  }
  if (cells.every(cell => cell !== '')) {
    statusText.textContent = `It's a draw!`;
    gameActive = false;
    return true;
  }
  return false;
}

function checkWin(player) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diagonals
  ];
  return winPatterns.some(pattern =>
    pattern.every(index => cells[index] === player)
  );
}

function resetGame() {
  cells = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  renderBoard();
}

resetButton.addEventListener('click', resetGame);

renderBoard();
statusText.textContent = `Player ${currentPlayer}'s turn`;
