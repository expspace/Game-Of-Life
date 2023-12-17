/** config data **/

//size settings
const smallGridSettings = {
  rows: 50,
  cols: 50,
  width: 24,
  height: 24,
};

const mediumGridSettings = {
  rows: 100,
  cols: 100,
  width: 12,
  height: 12,
};

const largeGridSettings = {
  rows: 200,
  cols: 200,
  width: 6,
  height: 6,
};

//relative pattern coordinates
const RPentominoCoords = [
  [0, 0],
  [1, 0],
  [-1, 0],
  [-1, 1],
  [0, -1],
];
const Diehard = [
  [0, 1],
  [0, 2],
  [0, 3],
  [-2, 2],
  [0, -3],
  [-1, -3],
  [-1, -4],
];
const Acorn = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, -2],
  [0, -3],
  [-2, -2],
  [-1, 0],
];
const GlidersByTheDozen = [
  [-1, -2],
  [-1, -1],
  [-1, 2],
  [0, -2],
  [0, 2],
  [1, -2],
  [1, 1],
  [1, 2],
];
const Butterfly = [
  [0, -1],
  [0, 1],
  [-1, -1],
  [-1, 1],
  [-2, -1],
  [-2, 1],
  [-2, 0],
];
const GosperGliderGun = [
  [0, -17],
  [0, -16],
  [0, -7],
  [0, -1],
  [0, 3],
  [0, 4],
  [-2, 18],
  [-2, 17],
  [-3, 5],
  [-3, 7],
  [-4, 7],
  [-2, 3],
  [1, -17],
  [1, -16],
  [1, -7],
  [1, -3],
  [1, -1],
  [1, 0],
  [1, 5],
  [1, 7],
  [2, 7],
  [2, -1],
  [2, -7],
  [3, -2],
  [-1, -2],
  [3, -6],
  [4, -5],
  [4, -4],
  [-2, 4],
  [-1, -6],
  [-2, -5],
  [-2, -4],
  [-1, 3],
  [-1, 4],
  [-1, 17],
  [-1, 18],
];

let context;

let deadTileImage24 = new Image();
let aliveTileImage24 = new Image();
deadTileImage24.src = "images/Box_Orange_Small_24x24.png";
aliveTileImage24.src = "images/Box_Green_Small_24x24.png";

let deadTileImage12 = new Image();
let aliveTileImage12 = new Image();
deadTileImage12.src = "images/Box_Orange_Medium_12x12.png";
aliveTileImage12.src = "images/Box_Green_Medium_12x12.png";

let deadTileImage6 = new Image();
let aliveTileImage6 = new Image();
deadTileImage6.src = "images/Box_Orange_Large_6x6.png";
aliveTileImage6.src = "images/Box_Green_Large_6x6.png";

let deadTileImage = deadTileImage24;
let aliveTileImage = aliveTileImage24;

/** game state **/

let generation;
let population;
let simulation; //simulation interval function
let running = false;
let gameBoard;
let updatedGameBoard;
let gridSettings = smallGridSettings;
let gameSpeed = 150;

window.onload = function () {
  const canvas = document.getElementById("gCanvas");
  context = canvas.getContext("2d");
  initializeGameBoard();
  displayBoard();
};

/** game logic **/

function startSimulation() {
  if (!running) {
    running = true;
    simulation = setInterval(function () {
      getNextGen();
      let temp = gameBoard;
      gameBoard = updatedGameBoard;
      updatedGameBoard = temp;
      updateBoard();
      document.getElementById("generation").innerHTML =
        `Generation: ${generation}`;
      document.getElementById("population").innerHTML =
        `Population: ${population}`;
    }, gameSpeed);
  }
}

function initializeGameBoard() {
  population = 0;
  generation = 0;
  gameBoard = new Array(gridSettings.rows);
  updatedGameBoard = new Array(gridSettings.rows);

  for (let i = 0; i < gridSettings.rows; i++) {
    gameBoard[i] = new Array(gridSettings.cols);
    updatedGameBoard[i] = new Array(gridSettings.cols);
    for (let x = 0; x < gridSettings.cols; x++) {
      gameBoard[i][x] = "dead";
      updatedGameBoard[i][x] = "dead";
    }
  }
}

function getNextGen() {
  population = 0;
  generation++;

  for (let rowIndex = 0; rowIndex < gridSettings.rows; rowIndex++) {
    for (let columnIndex = 0; columnIndex < gridSettings.cols; columnIndex++) {
      let numAliveNeighbors = getNumAliveNeighbors(rowIndex, columnIndex);
      if (gameBoard[rowIndex][columnIndex] === "dead") {
        if (numAliveNeighbors !== 3) {
          updatedGameBoard[rowIndex][columnIndex] = "dead";
        } else {
          updatedGameBoard[rowIndex][columnIndex] = "alive";
          population++;
        }
      } else if (gameBoard[rowIndex][columnIndex] === "alive") {
        if (numAliveNeighbors !== 2 && numAliveNeighbors !== 3) {
          updatedGameBoard[rowIndex][columnIndex] = "dead";
        } else {
          updatedGameBoard[rowIndex][columnIndex] = "alive";
          population++;
        }
      }
    }
  }
}

function getNumAliveNeighbors(row, col) {
  let numAliveNeighbors = 0;

  if (row !== 0) {
    if (col !== 0 && gameBoard[row - 1][col - 1] === "alive") {
      numAliveNeighbors++;
    }
    if (gameBoard[row - 1][col] === "alive") {
      numAliveNeighbors++;
    }
    if (
      col !== gridSettings.cols - 1 &&
      gameBoard[row - 1][col + 1] === "alive"
    ) {
      numAliveNeighbors++;
    }
  }

  if (col !== 0 && gameBoard[row][col - 1] === "alive") {
    numAliveNeighbors++;
  }

  if (col !== gridSettings.cols - 1 && gameBoard[row][col + 1] === "alive") {
    numAliveNeighbors++;
  }

  if (row !== gridSettings.rows - 1) {
    if (col !== 0 && gameBoard[row + 1][col - 1] === "alive") {
      numAliveNeighbors++;
    }
    if (gameBoard[row + 1][col] === "alive") {
      numAliveNeighbors++;
    }
    if (
      col !== gridSettings.cols - 1 &&
      gameBoard[row + 1][col + 1] === "alive"
    ) {
      numAliveNeighbors++;
    }
  }
  return numAliveNeighbors;
}

/** view logic **/

function displayBoard() {
  context.clearRect(0, 0, 1200, 1200);
  let xPos = 0;
  let yPos = 0;

  console.log(aliveTileImage);
  console.log(deadTileImage);

  for (let rowIndex = 0; rowIndex < gridSettings.rows; rowIndex++) {
    xPos = 0;
    for (let columnIndex = 0; columnIndex < gridSettings.cols; columnIndex++) {
      if (gameBoard[rowIndex][columnIndex] === "dead") {
        context.drawImage(deadTileImage, xPos, yPos);
      } else {
        context.drawImage(aliveTileImage, xPos, yPos);
      }
      xPos += gridSettings.height;
    }
    yPos += gridSettings.width;
  }
}

function updateBoard() {
  let xPos = 0;
  let yPos = 0;

  for (let rowIndex = 0; rowIndex < gridSettings.rows; rowIndex++) {
    xPos = 0;
    for (let columnIndex = 0; columnIndex < gridSettings.cols; columnIndex++) {
      if (
        gameBoard[rowIndex][columnIndex] !==
        updatedGameBoard[rowIndex][columnIndex]
      ) {
        context.clearRect(xPos, yPos, gridSettings.width, gridSettings.height);
        if (gameBoard[rowIndex][columnIndex] === "dead") {
          context.drawImage(deadTileImage, xPos, yPos);
        } else {
          context.drawImage(aliveTileImage, xPos, yPos);
        }
      }
      xPos += gridSettings.height;
    }
    yPos += gridSettings.width;
  }
}

//game settings
function setGridSize(size) {
  if (size === "small") {
    gridSettings = smallGridSettings;
    deadTileImage = deadTileImage24;
    aliveTileImage = aliveTileImage24;
  } else if (size === "medium") {
    gridSettings = mediumGridSettings;
    deadTileImage = deadTileImage12;
    aliveTileImage = aliveTileImage12;
  } else if (size === "large") {
    gridSettings = largeGridSettings;
    deadTileImage = deadTileImage6;
    aliveTileImage = aliveTileImage6;
  }
  resetSimulation();
}

function setGameSpeed(speed) {
  if (!running) {
    const newSpeed = gameSpeed + speed;
    if (newSpeed > 0 && newSpeed < 550) gameSpeed = newSpeed;
    document.getElementById("game speed").innerHTML =
      `Game Speed: ${gameSpeed} ms/gen`;
  }
}

function setTiles(event) {
  let x = event.offsetX;
  let y = event.offsetY;
  let rowIndex = Math.floor(y / gridSettings.height);
  let colIndex = Math.floor(x / gridSettings.width);

  if (gameBoard[rowIndex][colIndex] === "dead") {
    gameBoard[rowIndex][colIndex] = "alive";
    population++;
  } else {
    gameBoard[rowIndex][colIndex] = "dead";
    population--;
  }
  document.getElementById("population").innerHTML = `Population: ${population}`;
  displayBoard();
}

function setPattern() {
  const centerRowIndex = gridSettings.rows / 2;
  const centerColIndex = gridSettings.cols / 2;
  let patternSelected = document.getElementById("patternSelect").value;

  resetSimulation();
  if (patternSelected === "R-pentomino") {
    patternSelected = RPentominoCoords;
  } else if (patternSelected === "Diehard") {
    patternSelected = Diehard;
  } else if (patternSelected === "Acorn") {
    patternSelected = Acorn;
  } else if (patternSelected === "Gliders by the dozen") {
    patternSelected = GlidersByTheDozen;
  } else if (patternSelected === "Butterfly") {
    patternSelected = Butterfly;
  } else if (patternSelected === "Gosper glider gun") {
    patternSelected = GosperGliderGun;
  }

  population = patternSelected.length;

  for (let index = 0; index < patternSelected.length; index++) {
    gameBoard[centerRowIndex + patternSelected[index][0]][
      centerColIndex + patternSelected[index][1]
    ] = "alive";
  }
  document.getElementById("population").innerHTML = `Population: ${population}`;
  displayBoard();
}

//game controls

function pauseSimulation() {
  running = false;
  clearInterval(simulation);
}

function resetSimulation() {
  running = false;
  clearInterval(simulation);
  initializeGameBoard();
  document.getElementById("generation").innerHTML = `Generation: ${generation}`;
  document.getElementById("population").innerHTML = `Population: ${population}`;
  displayBoard();
}
