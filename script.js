let isPlayerStrawberrysTurn = undefined;
let winner = undefined;

const STRAWBERRY_ICON_PATH = './assets/icons/icons8-strawberry-color-96.png';
const BLUEBERRY_ICON_PATH = './assets/icons/icons8-blueberry-color-96.png';
const STRAWBERRY_PLAYER_NAME = 'strawberry';
const BLUEBERRY_PLAYER_NAME = 'blueberry';
const START_MSG = 'Click any grid to start the game';
const WIN_MSG = `Player {$winner} wins!`;
const HINT = `Player ${isPlayerStrawberrysTurn ? 'Strawberry' : 'Blueberry'}'s turn`;

const gameboard = document.querySelector('div.gameboard');
const grids = [];

function makeGrid(index) {
    let gridOwner = undefined;
    return {
        setPlayer: player => gridOwner = player,
        DOMElement: createGridInDom(index),
    };
}

function addClickCallback(gridElement) {
    gridElement.addEventListener('click', e => {
        const currDivElement = e.target; // this might not be the div we want, e.g. it can be an image
        // 1. is this a div.grid-element?
        // 2. ts this grid occupied?
        if (!currDivElement.parentNode || currDivElement.parentNode !== gameboard) {
            return;
        }
        const divElementID = currDivElement.id;
        const gridObject = grids[divElementID];
        if (gridObject.DOMElement === currDivElement && gridObject.player) {
            return;
        }

        // all following is only valid in an empty/unoccupied grid
        setGridIcon(currDivElement);
        setGridPlayer(grids[divElementID]);

        swapTurn();
    });
}

function setGridPlayer(gridObj, strawberry = isPlayerStrawberrysTurn) {
    if (gridObj.player) {
        throw new Error('This grid is occupied.');
    }
    gridObj.player = strawberry ? STRAWBERRY_PLAYER_NAME : BLUEBERRY_PLAYER_NAME;
}

function swapTurn(forceTurn = undefined) {
    if (forceTurn) {
        isPlayerStrawberrysTurn = forceTurn;
        return;
    }
    isPlayerStrawberrysTurn = !isPlayerStrawberrysTurn;
}

function reset() {
    isPlayerStrawberrysTurn = true;

    for (let i = 0; i < 9; i++) {
        const grid = makeGrid(i);
        grids.push(grid);
        addClickCallback(grid.DOMElement);
    }
}

function createGridInDom(index) {
    const gridElement = document.createElement('div');
    gridElement.classList.add('gameboard-grid');
    gridElement.setAttribute('id', index);
    const gridContent = document.createElement('div');
    gridContent.classList.add('grid-content');
    gridElement.appendChild(gridContent);
    gameboard.appendChild(gridElement);
    return gridElement;
}

function setGridIcon(gridElement, strawberry=isPlayerStrawberrysTurn) {
    const gridIcon = document.createElement('img'); 
    gridIcon.setAttribute('src', strawberry ? STRAWBERRY_ICON_PATH : BLUEBERRY_ICON_PATH);
    gridElement.querySelector('div.grid-content').appendChild(gridIcon);
}

function init() {
    reset();
}

init();