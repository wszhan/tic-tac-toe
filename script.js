let isPlayerStrawberrysTurn = true;
let winner = undefined;

const STRAWBERRY_ICON_PATH = './assets/icons/icons8-blueberry-color-96.png';
const BLUEBERRY_ICON_PATH = './assets/icons/icons8-strawberry-color-96.png';
const STRAWBERRY_PLAYER_NAME = 'strawberry';
const BLUEBERRY_PLAYER_NAME = 'blueberry';
const START_MSG = 'Click any grid to start the game';
const WIN_MSG = `Player {$winner} wins!`;
const HINT = `Player ${isPlayerStrawberrysTurn ? 'Strawberry' : 'Blueberry'}'s turn`;

const gameboard = document.querySelector('div.gameboard');
const grids = [];

function makeGrid() {
    let gridOwner = undefined;
    return {
        setPlayer: player => gridOwner = player,
        DOMElement: createGridInDom(),
    };
}

function reset() {
    for (let i = 0; i < 9; i++) {
        grids.push(makeGrid());
    }
}

function createGridInDom() {
    const gridElement = document.createElement('div');
    gridElement.classList.add('gameboard-grid');
    const gridContent = document.createElement('div');
    gridContent.classList.add('grid-content');
    gridElement.appendChild(gridContent);
    gameboard.appendChild(gridElement);
    return gridElement;
}

function setGridIcon(gridElement, isPlayerStrawberry = true) {
    const gridIcon = document.createElement('img'); 
    gridIcon.setAttribute('src', isPlayerStrawberry ? STRAWBERRY_ICON_PATH : BLUEBERRY_ICON_PATH);
    gridElement['DOMElement'].querySelector('div.grid-content').appendChild(gridIcon);
}

function init() {
    reset();
}

init();