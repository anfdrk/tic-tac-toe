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
  const playerSign = document.getElementById('sign');
  const cells = document.querySelectorAll('.cell');
  const restartBtn = document.querySelector('.restart-btn');
  const crossImg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <line x1="10" y1="10" x2="90" y2="90" stroke-width="20" />
    <line x1="90" y1="10" x2="10" y2="90" stroke-width="20" />
  </svg>`;
  const circleImg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="40" stroke-width="20" fill="none" />
  </svg>`;

  cells.forEach((cell) => {
    cell.addEventListener('click', () => {
      const cellContent = (GameBoard.getCell(parseInt(cell.dataset.index)));
      if (GameController.isOver || cellContent !== '') return;
      GameController.makeMove(parseInt(cell.dataset.index));
      updateGameboard();
    });
  });

  restartBtn.addEventListener('click', () => {
    GameBoard.reset();
    GameController.reset();
    updateGameboard();
    removeHilight();
    playerSign.classList.remove('hidden');
    updateStatus('X', 'turn');
  });

  function updateGameboard() {
    for (let i = 0; i < cells.length; i++) {
      const cellContent = GameBoard.getCell(i);
      if (cellContent === 'X') {
        cells[i].innerHTML = crossImg;
      } else if (cellContent === 'O') {
        cells[i].innerHTML = circleImg;
      } else {
        cells[i].textContent = '';
      }
    }
  }
  
  function updateStatus(sign, message) {
    if (sign === 'X') {
      playerSign.innerHTML = crossImg;
    } else {
      playerSign.innerHTML = circleImg;
    }
    if (message === 'turn') {
      status.textContent = 'Turn';
    }
    if (message === 'win') {
      status.textContent = 'WIN!';
    }
    if (message === 'draw') {
      playerSign.classList.add('hidden');
      status.textContent = 'DRAW';
    }
  }
  
  function highlightCombo(combo) {
    for (const index of combo) {
      cells[index].classList.add('win-combo');
    }
  }
  
  function removeHilight() {
    cells.forEach(cell => cell.classList.remove('win-combo'));
  }

  return { updateStatus, highlightCombo };
})();

const GameController = (() => {
  const playerX = Player('X');
  const playerO = Player('O');
  let currentPlayer = playerX;
  let isOver = false;
  ScreenController.updateStatus(currentPlayer.sign, 'turn');

  function makeMove(index) {
    GameBoard.setCell(index, currentPlayer.sign);
    const winCombo = checkWin();
    if (winCombo) {
      ScreenController.highlightCombo(winCombo);
      ScreenController.updateStatus(currentPlayer.sign, 'win');
      this.isOver = true;
      return;
    }
    if (checkDraw()) {
      ScreenController.updateStatus(currentPlayer.sign, 'draw');
      this.isOver = true;
      return;
    }
    switchPlayer();
    ScreenController.updateStatus(currentPlayer.sign, 'turn');
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
        return combo;
      }
    }
    return null;
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