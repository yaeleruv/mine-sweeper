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

//when gLevel.size=4, gLevel.mines=2
//when gLevel.size=8, gLevel.mines=12
//when gLevel.size=12, gLevel.mines=30
function setMinesDifficulty() {
    switch (gLevel.size) {
        case 4:
            gLevel.mines = 2;
            break;

        case 8:
            gLevel.mines = 12;
            break;

        case 12:
            gLevel.mines = 30;
            break;

        default:

            break;
    }

}

// Count mines around each cell 
// and set the cell's minesAroundCount.
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            currCell.minesAroundCount = countMinesNegs(i, j);
        }
    }
}


function countMinesNegs(i, j) {
    var negsMineCount = 0;
    for (var rowIdx = i - 1; rowIdx <= i + 1; rowIdx++) { //defining the borders we want the loop to run
        if (rowIdx < 0 || rowIdx >= gBoard.length) continue; //if the loop runs out of range --> continue
        for (var colIdx = j - 1; colIdx <= j + 1; colIdx++) {//defining the borders we want the loop to run
            if (colIdx < 0 || colIdx >= gBoard.length) continue; //if the loop runs out of range --> continue
            if (rowIdx === i && colIdx === j) continue; //if the loop check the currCell --> continue. we cant add the currCell(cellChecked) to the count
            var currCell = gBoard[rowIdx][colIdx];
            if (!currCell.isMine) continue;
            else negsMineCount++;
        }
    }
    return negsMineCount;
}
