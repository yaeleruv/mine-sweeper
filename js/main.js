'use strict';
const MINE = 'MINE';
const FLAG = 'FLAG';
const NUM1 = 'NUM1'; //blue color
const NUM2 = 'NUM2'; //green color
const NUM3 = 'NUM3'; //red color

const MINE_IMG = 'mm'; //'<img src="img/mine.png"/>'; check how to put pic in board!!
const FLAG_IMG = 'ff'; //'<img src="img/flag.png"/>';
const NUM1_IMG = '1'; //<img src="img/num1.png"/>';
const NUM2_IMG = '2'; //'<img src="img/num2.png"/>';
const NUM3_IMG = '3'; //<img src="img/num3.png"/>';

var gMines; //?

//The model
// var gBoard = {
//     minesAroundCount: 4, into buildBoard function.
//     isShown: true,
//     isMine: false,
//     isMarked: true
// };

var gBoard;

var gLevel = { //set's game level on board
    size: 4,
    mines: 2
};

var gGame = {
    isOn: false,   //Boolean, when true we let the user play
    shownCount: 0,  //How many cells are shown
    markedCount: 0, //How many cells are marked (with a flag)
    secsPassed: 0  //How many seconds passed
};


//This is called when page loads
function initGame() {
    gBoard = buildBoard();
    setMinesNegsCount(gBoard);
    posMines();
    renderBoard(gBoard);
    // gLevel;
}

// Builds the board V  
// Set mines at random ocations 
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
            };
        }

    }
    console.table('board:', board)
    return board;
}


function posMines() {
    for (var i = 0; i < gGame.mines; i++) {
        var randI = getRandomIntInclusive(0, gBoard.length - 1);
        var randJ = getRandomIntInclusive(0, gBoard[0].length - 1);
        var randCell = gBoard[randI][randJ];
        randCell.isMine = true;
    }
    // console.log('posMines is: ', )
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

// function blowUpNegs()
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
    console.table('negsMineCount:', negsMineCount);
    return negsMineCount;
}



// function renderCell(i, j) {
//     // var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
//     var elCell = document.querySelector(`.cell-${i}-${j}`);
//     elCell.innerText = strHTML;
// }

// Render the board as a <table> to the page
function renderBoard(board) {
    var strHTML = `<table border="0"><tbody>`;
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`;
        for (var j = 0; j < board[0].length; j++) {
            var cell = gBoard[i][j];
            var cellValue = (cell.isMine) ? MINE : cell.minesAroundCount;
            var className = `cell cell${i}-${j}`;
            strHTML += `<td onclick="cellClicked(this,${i},${j})" onkeyup="handleKey(event)" 
            class="${className}" > <span>${cellValue}</span></td>`;
        }
        strHTML += `</tr>`;
    }
    strHTML += `</tbody></table>`;
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}


function cellClicked(elCell, i, j) {
    var elSpan = document.querySelector(`.cell${i}-${j} span`);
    console.log(elCell);
    console.log('elSpan is:', elSpan);

    elspan.style.display = 'block';
    if (elCell.innerText === MINE) {
        gameOver();
    }
}





// Called on right click to mark a cell (suspected to be a mine)
// Search the web (and implement) how to hide the context menu on right click
// function cellMarked(elCell);




// Game ends when all mines are marked, 
// and all the other cells are shown
function checkGameOver() {
    if (!countAllMarkedMines(gBoard) === gGame.mines)
        return;
    // console.log('YOOOHOOO');
}


// When user clicks a cell with no mines around, 
// we need to open not only that cell, but also its neighbors. 
// NOTE: start with a basic implementation that only opens 
// the non-mine 1st degree neighbors

// function expandShown(board, elCell, i, j); //a part of the bonus



// function handleKey(ev) {
//     if (ev.key = 3) {
//         console.log('key event good!');
//     }
// }