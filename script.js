let isPlayerStrawberrysTurn = true;
let winner = undefined;
let moves = 0;

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

function checkThreeGrids(first, second, third) {
    if (first && second && first.getPlayer() === second.getPlayer() &&
        third && second.getPlayer() === third.getPlayer()) {
            return first.getPlayer();
    }

    return undefined;
}

function checkWinner(gamegrids=grids) {
    let result = undefined;
    const offset = 3;

    // check rows
    for (let row = 0; row < 3; row++) {
        const startIndex = row * 3;
        const first = gamegrids[startIndex], second = gamegrids[startIndex+1], third = gamegrids[startIndex+2];
        result = checkThreeGrids(first, second, third);
        if (result) return result; 
    }

    // check cols 
    for (let col = 0; col < 3; col++) {
        const first = gamegrids[col], second = gamegrids[col+offset], third = gamegrids[col+offset*2];
        result = checkThreeGrids(first, second, third);
        if (result) return result; 
    }
    // check diagonals
    result = checkThreeGrids(
        gamegrids[0], gamegrids[4], gamegrids[8]
    );
    if (result) return result;
    result = checkThreeGrids(
        gamegrids[2], gamegrids[4], gamegrids[6]
    );
    if (result) return result;

    return undefined;
}

function addClickCallback(gridElement) {
    gridElement.addEventListener('click', e => {
        if (moves === 9 || winner) return;

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
        moves++;

        winner = checkWinner();

        if (moves === 9 || winner) {
            updateInfoControlArea();
        }
    });
}

function updateInfoControlArea() {
    updateHint();
    // updateInfo();
    updateWhosturn();
}

function whosturnMessage(strawberry=isPlayerStrawberrysTurn) {
    if (winner || moves === 9) return 'No more moves.';
    return `Player ${strawberry ? 'Strawberry' : 'Blueberry'}'s turn`;
}
// function updateInfo() {
// }
function updateWhosturn(documentElement=whosturnInfo) {
    documentElement.textContent = whosturnMessage();
}
function updateHint(hintMessage, gameEnd=false) {
    if (moves === 0) {
        gamehint.textContent = START_MSG;
        return;
    }

    if (winner) {
        gamehint.textContent = `The winner is ${winner}!`;
        return;
    }
    if (moves === 9) {
        gamehint.textContent = "This is a tie.";
        return;
    }

    gamehint.textContent = 'Keep going.';
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
    resetGameState();

    initGameboard();

    updateInfoControlArea();
}

function resetGameState() {
    moves = 0;
    winner = undefined;
    swapTurn(true); // set to strawberry
}

function reset() {
    resetGameState();
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