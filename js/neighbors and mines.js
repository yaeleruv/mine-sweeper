'use strict';

function posMinesRandomly(noti, notj) {
    for (var i = 0; i < gLevel.mines; i++) {
        var randI = getRandomIntInclusive(0, gBoard.length - 1);
        var randJ = getRandomIntInclusive(0, gBoard[0].length - 1);
        if (randI === noti && randJ === notj) {
            i--;
            continue;
        }
        var randCell = gBoard[randI][randJ];
        randCell.isMine = true;
    }
}


function setMinesDifficulty() {
    if (gLevel.size === 4) {
        gLevel.mines = 2;
    } else if (gLevel.size === 8) {
        gLevel.mines = 12;
    } else {
        gLevel.mines = 30;
    }

    gGame.mines = gLevel.mines;
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
    return negsMineCount;
}