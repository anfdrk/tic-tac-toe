const Player = (sign) => {
  let score = 0;
  const getScore = () => score;
  const incrementScore = () => score++;
  return { sign, getScore, incrementScore }
};

const GameBoard = (() => {
  let board = ['', '', '', '', '', '', '', '', ''];

  function getCell(index) {
    return board[index];
  }

  function setCell(index, value) {
    board[index] = value;
  }

  function reset() {
    board = ['', '', '', '', '', '', '', '', ''];
  }

  function isFull() {
    return board.every(cell => cell !== '');
  }

  return { getCell, setCell, reset, isFull };
})();

const ScreenController = (() => {
  const status = document.getElementById('status');
  const cells = document.querySelectorAll('.cell');
  const restartBtn = document.querySelector('.restart-btn');

  cells.forEach((cell) => {
    cell.addEventListener('click', (e) => {
      if (GameController.isOver || e.target.textContent !== '') return;
      GameController.makeMove(parseInt(e.target.dataset.index));
      updateGameboard();
    });
  });

  restartBtn.addEventListener('click', () => {
    GameBoard.reset();
    GameController.reset();
    updateGameboard();
    updateStatus('╳ Turn');
  });

  function updateGameboard() {
    for (let i = 0; i < cells.length; i++) {
      cells[i].textContent = GameBoard.getCell(i);
    }
  }

  function updateStatus(message) {
    status.textContent = message;
  }

  return { updateStatus };
})();

const GameController = (() => {
  const playerX = Player('╳');
  const playerO = Player('◯');
  let currentPlayer = playerX;
  let isOver = false;
  ScreenController.updateStatus('╳ Turn');

  function makeMove(index) {
    GameBoard.setCell(index, currentPlayer.sign);
    if (checkWin()) {
      ScreenController.updateStatus(`${currentPlayer.sign} WIN!`);
      this.isOver = true;
      return;
    }
    if (checkDraw()) {
      ScreenController.updateStatus('DRAW');
      this.isOver = true;
      return;
    }
    switchPlayer();
    ScreenController.updateStatus(`${currentPlayer.sign} Turn`);
  }

  function checkWin() {
    const winCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const combo of winCombinations) {
      if (combo.every(index => GameBoard.getCell(index) === currentPlayer.sign)) {
        return true;
      }
    }
    return false;
  }

  function checkDraw() {
    return GameBoard.isFull();
  }

  function switchPlayer() {
    currentPlayer = currentPlayer === playerX ? playerO : playerX;
  }

  function reset() {
    currentPlayer = playerX;
    this.isOver = false;
  }

  return { makeMove, reset, isOver };
})();