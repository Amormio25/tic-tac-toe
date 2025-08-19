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

    for (let i = 0; i < 9; i++) {
        board[i] = cell();
        board[i].setValue(cellValue++);
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
        let playerMarks = (player == "playerX") ? playerXMarks : playerOMarks;
        if (player == "playerX" && playerXMarks.length == 5) {
            return false;
        } else if (playerMarks.length >= 3 && winPatterns.some(pattern => pattern.every(cellValue => playerMarks.includes(cellValue)))) {
            return true;
        }
    }

    return { getBoard, showBoard, getValidCells, placeMark, hasWinner };
})();  

/**
 * handles flow and state of the game
 * - player turn
 * - win condition
 */
const gameController = (function() {
    const board = gameboard;
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

    const setPlayerMark = (cellValue) => {
        let validCells = board.getValidCells();

        /**
         * UNCOMMENT TO PLAY CONSOLE VERSION
         * let cellValue = prompt("-> Choose a cell to mark: ");
         * while (cellValue !== null && !validCells.includes(parseInt(cellValue))) {
         *     cellValue = prompt("-> Invalid, please choose a valid cell.");
         * }
         */
        if (!validCells.includes(parseInt(cellValue))) {
            console.log("Invalid, please choose a valid cell.");
            return;
        }
        board.placeMark(parseInt(cellValue), getPlayerMark());
        board.showBoard();
        console.log(`-> ${getPlayerName()} marked cell ${cellValue}.`);
        printResult(); // moved here to prevent infinite loop
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
            // playRound(); commented out for event listener to get mark
        }
    }

    /**
     * modified to take parameter for the display version
     * -> remove parameters and uncomment code to play
     *    console version
     */
    const playRound = (cellValue) => {
        showGameDetails();
        // setTimeout(() => {
        //     setPlayerMark(cellValue);
        //     printResult();
        // }, 2000);
        setPlayerMark(cellValue);
    };
    
    return { playRound, getPlayerName };
})();  

// gameController.startGame();

/**
 * displays flow and state of the game
 * - board display
 * - dom listener for player turn
 */
const displayController = () => {
    const game = gameController;
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board-container");

    const updateDisplay = () => {
        boardDiv.textContent = "";

        const board = gameboard.getBoard();
        board.forEach((cell) => {
            const cellDiv = document.createElement("div");
            cellDiv.dataset.value = cell.getValue();
            cellDiv.textContent = (typeof cell.getValue() !== "number") ? cell.getValue() : "";

            cellDiv.classList.add("cell");
            boardDiv.appendChild(cellDiv);
        });
        playerTurnDiv.textContent = `${game.getPlayerName()}'s turn`;
    };

    /** 
     * listener for which cell is clicked when a cell is 
     * clicked, modify playRound to take cell value 
     * parameter that passes down to setPlayerMark instead 
     * of prompting user in the console version
     */
    function handleClick(event) {
        const cellValue = event.target.dataset.value;
        game.playRound(cellValue);
        updateDisplay();
    }

    /** 
     * update display should be the first thing called 
     * when displayController is called, then listen
     */
    updateDisplay();
    boardDiv.addEventListener("click", handleClick);
};

displayController();