const Game = (function() {

  let board = [
    [null, null, null],
    [null, null, null], 
    [null, null, null] 
  ];
  let currentPlayer = 'x';

  function makeMove(row, col) {
    
    if(board[row][col]) {
      return false; 
    }

    board[row][col] = currentPlayer;
    // togglePlayer();
    return true;

  }

  function getWinner() {

    for (let i = 0; i < 3; i++) {
      if (board[i][0] == board[i][1] && board[i][1] == board[i][2]) {
        return board[i][0]; 
      }
    }
  
    for (let i = 0; i < 3; i++) {
      if (board[0][i] == board[1][i] && board[1][i] == board[2][i]) {
        return board[0][i];
      }
    }
  
    if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
      return board[0][0];
    }
    if (board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
      return board[0][2];
    }  
  
    return null;
  
  }

  function isDraw() {
    return board.every(row => row.every(cell => cell !== null));
  }


  function togglePlayer() {
    currentPlayer = currentPlayer === "x" ? "o" : "x";
  }

  function printBoard() {
    for (let i = 0; i < 3; i++) {

      let row = '';
  
      for (let j = 0; j < 3; j++) {
         row += `[${board[i][j] || ' '}]`; 
      }
  
      console.log(row);
  
    }
  }


  function startGame() {

    while(true) {

      printBoard(); // показать поле

      const row = prompt("Введите номер строки"); 
      const col = prompt("Введите номер столбца");

      if(!makeMove(row, col)) {
        console.log("Ячейка занята!"); 
        continue;
      }

      const winner = getWinner();

      if (winner) {
        console.log(`Выиграл ${winner}!`);
        break; 
      } 
      
      if (isDraw()) {
        console.log("Ничья!");
        break;
      }

      togglePlayer();

    }

  }

  return {
    makeMove,
    getWinner,
    startGame
  }

})();

// Game.startGame();