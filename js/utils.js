'use strict';

function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var gTotalSeconds;

function setTime() {
    var minutesLabel = document.getElementById('minutes');
    var secondsLabel = document.getElementById('seconds');
    gTotalSeconds++;
    secondsLabel.innerHTML = time(gTotalSeconds % 60);
    minutesLabel.innerHTML = time(parseInt(gTotalSeconds / 60));
}


function time(val) {
    var valString = val + '';
    if (valString.length < 2) {
        return '0' + valString;
    } else {
        return valString;
    }
}


// if(gGame.isFirst){
//     var currCell = !gGame.isMine; 
//  }





// if (currCell.isMine) {
//     str.innerText = MINE;
//     currCell.isShown = true;
//     GameOver();
//   } else {
//     str.innerText = neighbors;
//     gBoard[i][j].isShown = true;
//     expandShown(gBoard, currCell, i, j); 
//     renderBoard(gBoard);
//     var elBtn = document.querySelector('.newGame');
//     elBtn.innerText = AFRAID;
//     setTimeout(function () {
//       elBtn.innerText = HAPPY;
//     }, 150);
//     renderBoard(gBoard); 
// }
