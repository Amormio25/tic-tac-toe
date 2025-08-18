/**
 * state of each square on the board
 * X: player one
 * O: player two
 */
const cell = () => {
    let value = "";

    const setValue = (player) => value = player;
    const getValue = () => value;

    return { setValue , getValue };
};  

/**
 * handles state of the board (3x3)
 */
const gameboard = (function() {
    const winPatterns = [ [1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7] ];

    let board = [];
    let playerXMarks = [];
    let playerOMarks = [];
    let cellValue = 1;

    const createBoard = () => {
        board = [];
        playerXMarks = [];
        playerOMarks = [];
        cellValue = 1;
        for (let i = 0; i < 9; i++) {
            board[i] = cell();
            board[i].setValue(cellValue++);
        }
    }

    const getBoard = () => board;

    const showBoard = () => {
        for (let i = 0; i < 9; i += 3) {
            console.log(board[i].getValue() + " " + board[i+1].getValue() + " " + board[i+2].getValue());
        }
    };

    const getValidCells = () => board.filter((cell) => typeof cell.getValue() === "number").map(cell => cell.getValue());

    const placeMark = (cellValue, mark) => {
        mark == "X" ? playerXMarks.push(cellValue) : playerOMarks.push(cellValue);
        const index = board.findIndex(cell => cell.getValue() == cellValue);
        board[index].setValue(mark);
    };

    const hasWinner = (player) => {
        const playerMarks = (player == "playerX") ? playerXMarks : playerOMarks;
        if (playerMarks.length >= 3 && winPatterns.some((pattern) => playerMarks.every(cellValue => pattern.includes(cellValue)))) {
            return true;
        } else if (player == "playerX" && playerXMarks.length == 5) {
            return false;
        }
    }

    return { createBoard, getBoard, showBoard, getValidCells, placeMark, hasWinner };
})();  

/**
 * handles flow and state of the game
 * - player turn
 * - win condition
 */
const gameController = (function() {
    const board = gameboard;
    gameboard.createBoard();

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
        currentPlayer = (currentPlayer == players[0]) ? players[1] : players[0]
    };
    const getPlayerName = () => currentPlayer.name;
    const getPlayerMark = () => currentPlayer.mark;

    // show board state, say whose turn 
    const showGameDetails = () => {
        console.log("-> Current Board:");
        board.showBoard();
        console.log(`-> ${getPlayerName()}'s turn.`);
    };

    const setPlayerMark = () => {
        let validCells = board.getValidCells();
        let cellValue = prompt("Choose a cell to mark: ");
        while (cellValue !== null && !validCells.includes(parseInt(cellValue))) {
            cellValue = prompt("Invalid, please choose a valid cell.");
        }
        board.placeMark(parseInt(cellValue), getPlayerMark());
        board.showBoard();
        console.log(`-> ${getPlayerName()} marked cell ${cellValue}.`);
    }

    const printResult = () => {
        let result = board.hasWinner(getPlayerName());
        if (result == true) {
            console.log(`-> ${getPlayerName()} wins!`);
        } else if (result == false) {
            console.log("-> Tie Game!");
        } else {
            console.log("");
            switchPlayerTurn();
            playRound();
        }
    }

    const playRound = () => {
        showGameDetails();
        setTimeout(() => {
            setPlayerMark();
            printResult();
        }, 2000);
    };

    const startGame = () => {
        playRound();
    }
    
    return { startGame };
})();  

gameController.startGame();
