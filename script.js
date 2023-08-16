const Player = (sign = '', type = 'human') => {
  const getSign = () => sign;
  const getType = () => type;
  return { getSign, getType };
};

const BotPlayer = (sign = '', type = 'bot') => {
  const getSign = () => sign;
  const getType = () => type;
  const makeMove = () => {
    const emptyCells = GameBoard.getEmptyCells();
    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      GameBoard.setCell(emptyCells[randomIndex], sign);
    }
  };
  
  return { getSign, getType, makeMove };
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

  function getEmptyCells() {
    const emptyCells = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        emptyCells.push(i);
      }
    }
    return emptyCells;
  }

  return { getCell, setCell, reset, isFull, getEmptyCells };
})();

const ScreenController = (() => {
  const status = document.getElementById('status');
  const gameModeSelect = document.getElementById('game-mode');
  const sideChoser = document.querySelector('.side-chooser');
  const playerSign = document.getElementById('sign');
  const cells = document.querySelectorAll('.cell');
  const restartBtn = document.querySelector('.restart-btn');
  const winline = document.querySelector('.winline');
  const radioX = document.getElementById('sideX');
  const radioO = document.getElementById('sideO');
  const scoreX = document.getElementById('x-score');
  const scoreO = document.getElementById('o-score');
  const crossImg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <line x1="10" y1="10" x2="90" y2="90" stroke-width="20" />
    <line x1="90" y1="10" x2="10" y2="90" stroke-width="20" />
  </svg>`;
  const circleImg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="40" stroke-width="20" fill="none" />
  </svg>`;
  
  function handleCellClick(cell) {
    const cellContent = (GameBoard.getCell(parseInt(cell.target.dataset.index)));
    if (GameController.getIsOver() || cellContent !== '') return;
    GameController.makeMove(parseInt(cell.target.dataset.index));
    updateGameboard();
  }

  function handleModeSelect(e) {
    const mode = e.target.value;
    GameController.setMode(mode);
    toggleShowSideChoser(mode);
    winline.innerHTML = '';
    updateGameboard();
    playerSign.classList.remove('hidden');
    updateStatus(GameController.getCurrentPlayer(), 'turn');
    resetScore();
  }

  function toggleShowSideChoser(mode) {
    if (mode === 'vs-bot') {
      sideChoser.style.display = 'flex';
      radioX.checked = true;
    } else {
      sideChoser.style.display = 'none';
    }
  }

  function handleSideChose(e) {
    if (e.target.name === 'side') {
      GameController.setPlayerSide(e.target.value);
      winline.innerHTML = '';
      updateGameboard();
      playerSign.classList.remove('hidden');
      updateStatus(GameController.getCurrentPlayer(), 'turn');
      resetScore();
    }
  }

  function handleRestart() {
    GameBoard.reset();
    GameController.reset();
    winline.innerHTML = '';
    updateGameboard();
    playerSign.classList.remove('hidden');
    updateStatus(GameController.getCurrentPlayer(), 'turn');
  }

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

  function updateScore(winner) {
    if (winner === 'X') {
      scoreX.textContent++;
    } else scoreO.textContent++;
  }

  function resetScore() {
    scoreX.textContent = 0;
    scoreO.textContent = 0;
  }

  function drawWinLine(combo, sign) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    winline.appendChild(svg);
    svg.appendChild(line);
    svg.setAttribute('viewBox', '0 0 100 100');
    line.setAttribute('stroke-width', '5');
    line.classList.add('winline-animation');
    
    const coordinates = getCoordinates(combo);
    line.setAttribute('x1', coordinates[0]);
    line.setAttribute('y1', coordinates[1]);
    line.setAttribute('x2', coordinates[2]);
    line.setAttribute('y2', coordinates[3]);
    
    if (sign === 'X') {
      line.setAttribute('stroke', '#d87a63');
    } else {
      line.setAttribute('stroke', '#63c1d8');
    }
  }

  function getCoordinates(combo) {
    const winLineCoordinates = {
      '0,1,2': [2, 19, 98, 19],
      '3,4,5': [2, 50, 98, 50],
      '6,7,8': [2, 82, 98, 82],
      '0,3,6': [19, 2, 19, 98],
      '1,4,7': [50, 2, 50, 98],
      '2,5,8': [81, 2, 81, 98],
      '0,4,8': [5, 5, 95, 95],
      '2,4,6': [95, 5, 5, 95],
    };
    return winLineCoordinates[combo.join(',')];
  }

  cells.forEach((cell) => {
    cell.addEventListener('click', handleCellClick);
  });
  restartBtn.addEventListener('click', handleRestart);
  gameModeSelect.addEventListener('change', handleModeSelect);
  sideChoser.addEventListener('change', handleSideChose);
  
  return { updateStatus, drawWinLine, updateScore };
})();

const GameController = (() => {
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
  let playerX = Player('X');
  let playerO = BotPlayer('O');
  let currentPlayer = playerX;
  let startingPlayer = playerX;
  let isOver = false;
  ScreenController.updateStatus(currentPlayer.getSign(), 'turn');

  function setMode(mode) {
    if (mode === 'vs-bot') {
      playerX = Player('X');
      playerO = BotPlayer('O');
    } else {
      playerX = Player('X');
      playerO = Player('O');
    }
    currentPlayer = playerX;
    startingPlayer = playerX;
    isOver = false;
    GameBoard.reset();
  }

  function setPlayerSide(selectedSide) {
    if (selectedSide === 'x') {
      playerX = Player('X');
      playerO = BotPlayer('O');
    } else {
      playerX = BotPlayer('X');
      playerO = Player('O');
    }
    currentPlayer = playerX;
    startingPlayer = playerX;
    GameBoard.reset();
    if (selectedSide === 'o') {
      currentPlayer.makeMove();
      checkStatus();
    }
  }

  function makeMove(index) {
    GameBoard.setCell(index, currentPlayer.getSign());
    checkStatus();
    if (currentPlayer.getType() === 'bot') {
      currentPlayer.makeMove();
      checkStatus();
    }
  }

  function checkStatus() {
    const winCombo = checkWin();
    if (winCombo) {
      ScreenController.drawWinLine(winCombo, currentPlayer.getSign());
      ScreenController.updateStatus(currentPlayer.getSign(), 'win');
      ScreenController.updateScore(currentPlayer.getSign());
      isOver = true;
      return;
    }
    if (checkDraw()) {
      ScreenController.updateStatus(currentPlayer.getSign(), 'draw');
      isOver = true;
      return;
    }
    switchPlayer();
    ScreenController.updateStatus(currentPlayer.getSign(), 'turn');
  }

  function checkWin() {
    for (const combo of winCombinations) {
      if (combo.every(index => GameBoard.getCell(index) === currentPlayer.getSign())) {
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
    if (playerX.getType() === 'bot' || playerO.getType() === 'bot') {
      currentPlayer = playerX;
      isOver = false;
    } else if (isOver) {
      startingPlayer = startingPlayer === playerX ? playerO : playerX;
      currentPlayer = startingPlayer;
      isOver = false;
    } else {
      currentPlayer = startingPlayer;
    }
    if (currentPlayer.getType() === 'bot') {
      currentPlayer.makeMove();
      checkStatus();
    }
  }

  const getIsOver = () => isOver;
  const getCurrentPlayer = () => currentPlayer.getSign();

  return { makeMove, reset, getIsOver, setMode, setPlayerSide, getCurrentPlayer };
})();