/**
 * handles state of the board (3x3)
 */
const gameboard = (function() {
    const rows = 3, columns = 3;
    let board = [];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            board[i][j] = '';
        }
    }

    const showBoard = () => {

    };

    const placeMarker = () => {

    };
})();  

/**
 * state of each square on the board
 * X: player one
 * O: player two
 */
const cell = (function() {
    let value = "";

    const setValue = (player) => {
        value = player;
    }
    const getValue = () => value;

    return { setValue , getValue };
})();  

/**
 * handles flow and state of the game
 * - player turn
 * - win condition
 */
const gameController = (function() {
    const game = gameboard();
    const playerX = "playerX";
    const playerO = "playerO";

    const players = [
        {
            name: playerX,
            mark: "X"
        },
        {
            name:  playerO,
            mark: "O"
        }
    ];
    let currentPlayer = players[0];

    const switchPlayerTurn = () => {
        currentPlayer = (currentPlayer == playerX) ? playerO : playerX
    };
    const getPlayerTurn = () => currentPlayer;

    // show board state, say whose turn 
    const newRound = () => {
        board.showBoard();
        console.log(`${getPlayerTurn().name}'s turn.`);
    }

    // new round, set cell (update board and print choice), switch turns
    const playRound = (row, column) => {
        newRound();
        board.placeMarker(row, column, getPlayerTurn().mark);
        console.log(`${getPlayerTurn().name} marked row: ${row}, column: ${column}.`);
        switchPlayerTurn();
    }
    
    return { playRound, getPlayerTurn };
})();  

