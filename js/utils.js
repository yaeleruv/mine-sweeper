'use strict';

function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



var gTotalSeconds = 0;
var gElSec = document.querySelector('.seconds');
var gElMin = document.querySelector('.minutes');

function setTime() {
    gTotalSeconds++;
    gElSec.innerText = formatTime(gTotalSeconds % 60);
    gElMin.innerText = formatTime(parseInt(gTotalSeconds / 60));
}


function formatTime(val) {
    var valString = val.toString();
    if (valString.length < 2) {
        return '0' + valString;
    } else {
        return valString;
    }
}
