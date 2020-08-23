/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({ length: WIDTH }));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.getElementById("board");
  // create a top row to handle clicks
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  // create a group of cells equal to the width
  // and add them to the top row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    headCell.setAttribute("class", `top-row`);
    headCell.classList.add("p1");
    headCell.classList.add("p2");
    top.append(headCell);
  }
  htmlBoard.append(top);

  // create rows (q = height) and add
  // a group of cells (q = width)
  // Also, give each cell an id for its coordinates
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // iterate through the column 'x'
  // starting from the bottom, check if the 'board'
  // already is filled
  for (let y = HEIGHT - 1; y >= 0; y--) {
    // if the 'board' has nothing at these coordinates...
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // create a 'piece' div
  const gamePiece = document.createElement("div");
  gamePiece.classList.add("piece");
  if (currPlayer === 1) {
    gamePiece.classList.add("p1-circle");
  } else {
    gamePiece.classList.add("p2-circle");
  }
  // get the square with coordinates meant for the
  // new game piece, and add the game piece div
  const chosenSquare = document.getElementById(`${y}-${x}`);
  chosenSquare.append(gamePiece);
}


/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} wins!`);
  }

  // check for tie
  if (board.every((row) => row.every((cell) => cell))) {
    return endGame("TIE!");
  }
  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;

  // toggle hover color
  const topRowItems = Array.from(document.getElementsByClassName("top-row"));
  topRowItems.forEach(function (val, idx, arr) {
    val.classList.toggle("p2");
  });
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

// reset game

const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", function () {
  document.location.href = "";
});

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        // the moves are legal && the currPlayer
        // has claimed each piece
        board[y][x] === currPlayer
    );
  }

  // start by iterating over the game board
  // at each x,y combo, set relative 'winning' arrays

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      // if any of these winning arrays contain exclusively 'currPlayer'
      // i.e. all x,y combos were picked by the current player
      // return true to end the game (within handleClick)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
