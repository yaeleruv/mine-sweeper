'use strict';

const FLAG = '🚩';
const MINE = '💣';
const HAPPY = '😊';
const WIN = '😃';
const SAD = '😩'; //lose after using lives

var gLevel = {
    size: 4,
    mines: 2
};

var gGame;
var gBoard;
var gTimeInterval;


function initGame(size = gLevel.size) {
    gLevel.size = size;

    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: gLevel.size === 4 ? 2 : 3, //if gLevel.size===4, set 2 lives, else, set 3 lives.
        isFirstClick: true
    };
    setMinesDifficulty();
    gBoard = buildBoard();
    renderBoard(gBoard);
    setEmoji(HAPPY);
    setLives(gGame.lives);
    setMessage('');
}


function setLives(lives) {
    document.querySelector('.lives').innerText = lives;
}


function setEmoji(emoji) {
    document.querySelector('.restart-game > button').innerHTML = emoji;
}


function setMessage(messages) {
    document.querySelector('.messages').innerText = messages;
}

//first clearInterval
//then initiate the gTotalSeconds to 0;
//then start the interval
function startTimer() {
    clearInterval(gTimeInterval);
    gTotalSeconds = 0;
    gTimeInterval = setInterval(setTime, 1000);
}

//בניית הלוח
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
    return board;
}


function renderBoard(board) {
    var strHTML = `<table border="0"><tbody>`;
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`;
        for (var j = 0; j < board[0].length; j++) {
            strHTML += renderCell(i, j);
        }
        strHTML += `</tr>`;
    }
    strHTML += `</tbody></table>`;
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}



function renderCell(i, j) {
    var cell = gBoard[i][j];
    var cellValue = (cell.isMine) ? MINE : cell.minesAroundCount;

    var className = `cell cell${i}-${j}`;
    // console.log(className);
    return `<td onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(this,${i},${j}); return false;"
            class="${className}" > <span>${cellValue !== 0 && cellValue || ' '}</span></td>`;

}


//התנהגות בלחיצה על התאים
function cellClicked(elCell, i, j) {
    if (!gGame.isOn) {
        return;
    }

    if (gGame.isFirstClick) {
        posMinesRandomly(i, j);
        setMinesNegsCount(gBoard);
        renderBoard(gBoard);
        startTimer();
        gGame.isFirstClick = false;
    }

    var elSpan = document.querySelector(`.cell${i}-${j} span`);
    // console.log(elSpan);
    revealCell(elSpan);
    if (gBoard[i][j].minesAroundCount === 0) {
        expandShown(gBoard, elCell, i, j);
    }

    if (!gBoard[i][j].isShown && elCell.innerText === MINE) {
        gBoard[i][j].isShown = true;
        gGame.lives--;
        gGame.mines--;
        setLives(gGame.lives);
        if (gGame.lives === 2) {
            setMessage('Be careful, you have 2 more lives');
        }
        if (gGame.lives === 1) {
            setMessage('Be careful, you have 1 more lives');
        }
        if (gGame.lives === 0) {
            gameOver();
        }
        return;
    }

    gBoard[i][j].isShown = true;

    checkVictory();

}


function revealCell(elSpan) {
    elSpan.style.display = 'block';
    elSpan.style.backgroundColor = "white";
}


//--------------------------------
function cellMarked(elCell, i, j) {
    if (!gGame.isOn) {
        return;
    }

    if (gGame.isFirstClick) {
        posMinesRandomly(i, j);
        setMinesNegsCount(gBoard);
        renderBoard(gBoard);
        startTimer();
        gGame.isFirstClick = true;
    }

    if (gBoard[i][j].isShown) {
        return;
    }

    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true;
        elCell.innerText = FLAG;
        gGame.markedCount++;
        if (gBoard[i][j].isMarked === gGame.isMine) {
            gGame.mines--;
        }

    } else {
        gBoard[i][j].isMarked = false;
        gGame.markedCount--;
        elCell.innerHTML = renderCell(i, j);
    }

    checkVictory();
}



//תנאים לניצחון//
function checkVictory() {

    var totalCells = gLevel.size * gLevel.size; // כלל התאים = גודל המשחק לפי רמת הקושי בחזקת 2
    var nonMinesCells = totalCells - gGame.mines; // תאים שהם לא מוקשים = כלל התאים - תאים מוקשים
    var minesMarkedDiff = gGame.mines - gGame.markedCount;// הפרש המוקשים שסומנו = תאים מוקשים - ספירת התאים שסומנו
    gGame.shownCount = calcShown();
    var hiddenCells = nonMinesCells - gGame.shownCount; //תאים לא חשופים = תאים שהם לא מוקשים - ספירת התאים החשופים
    if (hiddenCells === 0 && minesMarkedDiff === 0) {
        gGame.isOn = false;
        // gGame.isOver = true;
        setEmoji(WIN);
        clearInterval(gTimeInterval);
        setMessage('You Win!!!');
    }
}


//ספירת התאים החשופים
function calcShown() {
    var shownCount = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isShown) {
                shownCount++;
            }
        }
    }
    return shownCount;
}


// When user clicks a cell with no mines around, 
// we need to open not only that cell, but also its neighbors. 
function expandShown(board, elCell, i, j) {
    for (var rowIdx = i - 1; rowIdx <= i + 1; rowIdx++) {
        if (rowIdx < 0 || rowIdx >= board.length) continue;
        for (var colIdx = j - 1; colIdx <= j + 1; colIdx++) {
            if (colIdx < 0 || colIdx >= board.length) continue;
            var currCell = board[rowIdx][colIdx];

            if (!currCell.isShown && currCell.minesAroundCount === 0 && rowIdx !== i && colIdx !== j) {
                expandShown(board, null, rowIdx, colIdx);
            }
            currCell.isShown = true;
            var elSpan = document.querySelector(`.cell${rowIdx}-${colIdx} span`);

            revealCell(elSpan);


        }
    }

}



function gameOver() {
    gGame.isOn = false;
    clearInterval(gTimeInterval);

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine) {
                var elSpan = document.querySelector(`.cell${i}-${j} span`);
                revealCell(elSpan);

                setEmoji(SAD);
                setMessage('Ohh, try again');
            }
        }
    }
    // console.log('game over');
}



