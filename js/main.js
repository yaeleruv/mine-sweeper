'use strict';
// const EMPTY = '🔲';
// const TIMER = '🕔';
//const NUM1 = '1️⃣';
//const NUM2 = '2️⃣';
const FLAG = '🚩'; // right click on mouse on suspected cell to be a mine
const HAPPY = '😃'; // when restart game
const SAD = '☹️'; // when game over
const MINE = '💣'; //left click on mouse and if it is a mine - game over!

var gMines;

// The model
var gBoard;

var gLevel = { //set's game level on board
    size: 4,
    mines: 2
};

var gGame;

//This is called when page loads
function initGame(size) {
    // console.log('hi there');
    gLevel.size = size;
    setMinesDifficulty();
    // posMinesRandomly = mine;
    gBoard = buildBoard();
    posMinesRandomly();
    setMinesNegsCount(gBoard);
    renderBoard(gBoard);
    gGame = {
        isOn: true,   //Boolean, when true we let the user play
        shownCount: 0,  //How many cells are shown
        markedCount: 0, //How many cells are marked (with a flag)
        secsPassed: 0,  //How many seconds passed
        // mines: 0
        // timer: 0

    };
    // renderTimer();
}


// add timer!
// function renderTimer() {
//     document.querySelector('h3 span').innerText = gGame.timer;
// }



// Builds the board V  
// Set mines at random ocations, before - place them manually V
// Call setMinesNegsCount() 
// Return the created board V
function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.size; j++) {
            board[i][j] = {
                isShown: false,
                isMine: false,
                isMarked: false,
                minesAroundCount: 0
            }
        }

    }
    // console.table('board:', board);
    return board;
}


function posMinesRandomly() {
    for (var i = 0; i < gLevel.mines; i++) {
        var randI = getRandomIntInclusive(0, gBoard.length - 1);
        var randJ = getRandomIntInclusive(0, gBoard[0].length - 1);
        var randCell = gBoard[randI][randJ];
        randCell.isMine = true;
    }
    // console.log('posMinesRandomly is: ', posMinesRandomly);
}


function setMinesDifficulty() {
    if (gLevel.size === 4) {
        gLevel.mines = 2;
    } else if (gLevel.size === 8) {
        gLevel.mines = 12;
    } else {
        gLevel.mines = 30;
    }
}

// Count mines around each cell 
// and set the cell's minesAroundCount.
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = gBoard[i][j];
            currCell.minesAroundCount = countMinesNegs(i, j);
        }
    }
}


function countMinesNegs(i, j) {
    var negsMineCount = 0;
    for (var rowIdx = i - 1; rowIdx <= i + 1; rowIdx++) {
        if (rowIdx < 0 || rowIdx >= gBoard.length) continue;
        for (var colIdx = j - 1; colIdx <= j + 1; colIdx++) {
            if (colIdx < 0 || colIdx >= gBoard.length) continue;
            var currCell = gBoard[rowIdx][colIdx];
            if (!currCell.isMine) continue;
            else negsMineCount++;
        }
    }
    // console.table('negsMineCount is:', negsMineCount);
    return negsMineCount;
}


// Render the board as a <table> to the page
// check how to hide the context menu on right click
function renderBoard(board) {
    var strHTML = `<table border="0"><tbody>`;
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`;
        for (var j = 0; j < board[0].length; j++) {
            var cell = gBoard[i][j];
            var cellValue = (cell.isMine) ? MINE : cell.minesAroundCount;

            var className = `cell cell${i}-${j}`;
            strHTML += `<td onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(this,${i},${j}); return false;"
            class="${className}" > <span>${cellValue}</span></td>`;
        }
        strHTML += `</tr>`;
    }
    strHTML += `</tbody></table>`;
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}


//what happen when a cell clicked
function cellClicked(elCell, i, j) {
    var elSpan = document.querySelector(`.cell${i}-${j} span`);
    console.log(elCell);
    console.log('elSpan is:', elSpan);

    elSpan.style.display = 'block';
    gGame.shownCount++;
    if (gBoard[i][j].minesAroundCount === 0) {
        expandShown(gBoard, elCell, i, j);
    }
    if (elCell.innerText === MINE) {
        gameOver();
    }
    checkVictory();
} //add a victorius massege to the user


// Called on right click to mark a cell (suspected to be a mine)
function cellMarked(elCell, i, j) {
    elCell.innerText = FLAG;
    gGame.markedCount++;
    checkVictory();
}


// Game ends when all mines are marked with flaga, 
// and all the other cells are shown
function checkVictory() {
    var totalCells = gLevel.size * gLevel.size;
    var nonMinesCells = totalCells - gLevel.mines;
    var minesMarkedDiff = gLevel.mines - gGame.markedCount;
    // var unmarkedMines = gLevel.mines - gGame.markedCount;
    var hiddenCells = nonMinesCells - gGame.shownCount;
    if (hiddenCells === 0 && minesMarkedDiff === 0) {
        console.log('YOOOHOOO');

        // gameOver();
    }
}


// When user clicks a cell with no mines around, 
// we need to open not only that cell, but also its neighbors. 
// NOTE: start with a basic implementation that only opens 
// the non-mine 1st degree neighbors

function expandShown(board, elCell, i, j) {

    for (var rowIdx = i - 1; rowIdx <= i + 1; rowIdx++) {
        if (rowIdx < 0 || rowIdx >= board.length) continue;
        for (var colIdx = j - 1; colIdx <= j + 1; colIdx++) {
            if (colIdx < 0 || colIdx >= board.length) continue;
            var currCell = board[rowIdx][colIdx];
            currCell.isShown = true;
            var elSpan = document.querySelector(`.cell${rowIdx}-${colIdx} span`);
            console.log(elCell);
            console.log('elSpan is:', elSpan);

            elSpan.style.display = 'block';
            gGame.shownCount++;
        }
    }

}




// function countAllMarkedMines(){

// }


// function renderCell(i, j) {
//     // var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
//     var elCell = document.querySelector(`.cell-${i}-${j}`);
//     elCell.innerText = strHTML;
// }


