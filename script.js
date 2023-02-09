let isPlayerStrawberrysTurn = true;
let winner = undefined;

const STRAWBERRY_ICON_PATH = './assets/icons/icons8-strawberry-color-96.png';
const BLUEBERRY_ICON_PATH = './assets/icons/icons8-blueberry-color-96.png';
const STRAWBERRY_PLAYER_NAME = 'strawberry';
const BLUEBERRY_PLAYER_NAME = 'blueberry';
const START_MSG = 'Click any grid to start the game';
const WIN_MSG = `Player {$winner} wins!`;
const RESTART_PROMPT_MSG = 'Do you want to restart the game? If yes, input \'y\'.';
const ACCEPTABLE_RESTART_MESSAGES = ['y', 'yes', 'yeah', 'ya', 'yup'];

const restartButton = document.querySelector('button#restart-button');
const gameboard = document.querySelector('div.gameboard');
const whosturnInfo = document.querySelector('div.player-turn');
const gamehint = document.querySelector('div.game-state');

let grids = [];

function makeGrid(index) {
    let gridOwner = undefined;

    return {
        setPlayer: (player) => (gridOwner = player),
        getPlayer: () => gridOwner,
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
        if (gridObject.DOMElement === currDivElement && gridObject.getPlayer()) {
            return;
        }

        // all following is only valid in an empty/unoccupied grid
        setGridIcon(currDivElement);
        setGridPlayer(grids[divElementID]);
        swapTurn();
        updateInfoControlArea();
    });
}

function updateInfoControlArea() {
    updateHint();
    // updateInfo();
    updateWhosturn();
}

function whosturnMessage(strawberry=isPlayerStrawberrysTurn) {
    return `Player ${strawberry ? 'Strawberry' : 'Blueberry'}'s turn`;
}
function updateInfo() {
}
function updateWhosturn(documentElement=whosturnInfo) {
    documentElement.textContent = whosturnMessage();
}
function updateHint(hintMessage, gameEnd=false) {
    if (!hintMessage) {
        gamehint.textContent = START_MSG;
    }

    // if game ends and no winner, it's a tie.
    // if game ends and winner, there's a winner
    // otherwise continue

}

function setGridPlayer(gridObj, strawberry = isPlayerStrawberrysTurn) {
    if (gridObj.getPlayer()) {
        throw new Error('This grid is occupied.');
    }
    gridObj.setPlayer(strawberry ? STRAWBERRY_PLAYER_NAME : BLUEBERRY_PLAYER_NAME);
}

function swapTurn(forceTurn = undefined) {
    if (forceTurn) {
        isPlayerStrawberrysTurn = forceTurn;
        return;
    }
    isPlayerStrawberrysTurn = !isPlayerStrawberrysTurn;
}

function initGameboard() {
    for (let i = 0; i < 9; i++) {
        const grid = makeGrid(i);
        grids.push(grid);
        addClickCallback(grid.DOMElement);
    }
}
function resetGameboard() {
    grids.forEach(g => {
    // remove player from grid object
        g.setPlayer(null);
    // remove image from div.grid-content DOM object
        g.DOMElement.querySelector('div.grid-content').innerHTML = "";
    });
}

function initGame() {
    swapTurn(true); // set to strawberry

    initGameboard();

    updateInfoControlArea();
}

function reset() {
    // isPlayerStrawberrysTurn = true;
    swapTurn(true); // set to strawberry

    resetGameboard();

    updateInfoControlArea();
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

function addResetButtonCallback(button=restartButton) {
    button.addEventListener('click', e => {
        const reply = prompt(RESTART_PROMPT_MSG).toLowerCase();
        if (ACCEPTABLE_RESTART_MESSAGES.includes(reply)) {
            reset();
        }
    });
}

function init() {
    addResetButtonCallback();
    // reset();
    initGame();
}

init();