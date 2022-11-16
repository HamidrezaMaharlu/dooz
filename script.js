let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
];
let ai = 'X';
let human = 'O';
let currentPlayer = ai;
let numberOfMove = 0
let setTimeInHumanMove;
let setTimeInBestMoved;
let scores = {
    [ai]: 10,
    [human]: -10,
    "tie": 0
};
const container = document.querySelector(".container");
const result = document.querySelector(".result");
const X = document.querySelector(".X");
const O = document.querySelector(".O");

//add click event
function addX() {
    ai = 'X'
    human = 'O';
    currentPlayer = ai;
    X.style.background = "blue";
    scores = {
        [ai]: 10,
        [human]: -10,
        "tie": 0
    }
    O.removeEventListener("click", addO)
}

function addO() {
    ai = 'O'
    human = 'X';
    currentPlayer = ai;
    O.style.background = "blue";
    X.removeEventListener("click", addX)
    scores = {
        [ai]: 10,
        [human]: -10,
        "tie": 0
    }
    console.log(currentPlayer, ai)
}

X.addEventListener("click", addX, {once: true})
O.addEventListener("click", addO, {once: true})

container.addEventListener("click", function addClicked(e) {
    numberOfMove++;
    result.innerHTML = "";
    if (e.target.className !== "piece") return
    let i = e.target.getAttribute("data-i")
    let j = e.target.getAttribute("data-j")
    board[i][j] = currentPlayer;
    makeBoard()
    if (numberOfMove >= 2) {
        container.removeEventListener("click", addClicked)
        const setTimeClicked = setTimeout(() => bestMove(), 1000)
        showResult()
    }
    if (numberOfMove < 2) changeTurn()
})


function makeBoard() {
    container.innerHTML = "";
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            container.insertAdjacentHTML("beforeend", `<div data-i=${i} data-j=${j} class="piece">
<p>${board[i][j]}</p></div>`)
        }
    }

}

function changeTurn() {
    currentPlayer === human ? currentPlayer = ai : currentPlayer = human;
}

function checkThreeEqual(a, b, c) {
    return a === b && b === c && a !== '';
}

function checkWinner() {
    let winner = null;

    // check horizontally
    for (let i = 0; i < 3; i++) {
        if (checkThreeEqual(board[i][0], board[i][1], board[i][2])) {
            winner = board[i][0];
        }
    }

    // check Vertically
    for (let i = 0; i < 3; i++) {
        if (checkThreeEqual(board[0][i], board[1][i], board[2][i])) {
            winner = board[0][i];
        }
    }

    // check zarbedary :) :)
    if (checkThreeEqual(board[0][0], board[1][1], board[2][2])) {
        winner = board[0][0];
    }
    if (checkThreeEqual(board[2][0], board[1][1], board[0][2])) {
        winner = board[2][0];
    }

    // check for tie
    let notSelectedDiv = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                notSelectedDiv++;
            }
        }
    }
    if (winner == null && notSelectedDiv === 0) {
        return 'tie';
    } else {
        return winner;
    }
}

function showResult() {
    let winner = checkWinner()
    if (winner != null) {
        if (winner === 'tie') {
            result.innerHTML = 'Tie!';
        } else {
            result.innerHTML = `${winner} wins!`;
        }
        currentPlayer = ai;
        clearTimeout(setTimeInBestMoved)
        clearTimeout(setTimeInHumanMove)
        numberOfMove = 0;
    }
}

function humanMove() {
    here: for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            if (board[i][j] === '') {
                board[i][j] = human;
                break here;
            }
        }
    }
    makeBoard()
    numberOfMove++
    currentPlayer = ai;
    if (numberOfMove <= 9) {
        setTimeInHumanMove = setTimeout(() => bestMove(), 1000)
        console.log(numberOfMove)
        showResult()
    }

}

function bestMove() {
    // AI to make its turn
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            // Is the free space available?
            if (board[i][j] === '') {
                board[i][j] = ai;
                let score = minimax(board, 0, false);
                board[i][j] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = {i, j};
                }
            }
        }
    }
    board[move.i][move.j] = ai;
    currentPlayer = human;
    makeBoard()
    numberOfMove++
    if (numberOfMove <= 9) {
        setTimeInBestMoved = setTimeout(() => humanMove(), 1000);
        showResult()
    }
}


function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }
    // if (result !== null && result!==ai) {
    //     return score[result];
    // }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Is the spot available?
                if (board[i][j] == '') {
                    board[i][j] = ai;
                    let score = minimax(board, depth + 1, false);
                    board[i][j] = '';
                    bestScore = Math.max(score, bestScore);

                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Is the spot available?
                if (board[i][j] == '') {
                    board[i][j] = human;
                    let score = minimax(board, depth + 1, true);
                    board[i][j] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

makeBoard()
