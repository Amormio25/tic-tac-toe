/**
 * COMMENT AND UNCOMMENT MARKERS TO PLAY CONSOLE OR DISPLAY VERSION
 */

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
    let gameOverStatus = false;

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

    const isCellMarked = (cellValue) => {
        const validCells = board.filter((cell) => typeof cell.getValue() === "number").map(cell => cell.getValue());
        if (!validCells.includes(parseInt(cellValue))) {
            console.log("Invalid, please choose a valid cell.");
            return true;
        }
        return false;
    };

    const placeMark = (cellValue, mark) => {
        mark == "X" ? playerXMarks.push(cellValue) : playerOMarks.push(cellValue);
        const index = board.findIndex(cell => cell.getValue() == cellValue);
        board[index].setValue(mark);
    };

    const isGameOver = () => gameOverStatus;

    const hasWinner = (player) => {
        let playerMarks = (player == "playerX") ? playerXMarks : playerOMarks;
        if (playerMarks.length >= 3 && winPatterns.some(pattern => pattern.every(cellValue => playerMarks.includes(cellValue)))) {
            gameOverStatus = true;
            return winPatterns.find(pattern => pattern.every(cellValue => playerMarks.includes(cellValue)));
        } else if (player == "playerX" && playerXMarks.length == 5) {
            gameOverStatus = true;
            return false;
        }
    }

    const clearBoard = () => {
        board = [];
        gameOverStatus = false;
        cellValue = 1;
        for (let i = 0; i < 9; i++) {
            board[i] = cell();
            board[i].setValue(cellValue++);
        }
    };

    const clearPlayerMarks = () => {
        playerXMarks = [];
        playerOMarks = [];
    };

    return { getBoard, showBoard, isCellMarked, placeMark, isGameOver, hasWinner, clearBoard, clearPlayerMarks };
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

    const showGameDetails = () => {
        console.log("-> Current Board:");
        board.showBoard();
        console.log(`-> ${getPlayerName()}'s turn.`);
    };

    const setPlayerMark = (cellValue) => {
        // let cellValue = prompt("-> Choose a cell to mark: ");
        // while (cellValue !== null && !validCells.includes(parseInt(cellValue))) {
        //     cellValue = prompt("-> Invalid, please choose a valid cell.");
        // }

        board.placeMark(parseInt(cellValue), getPlayerMark());
        board.showBoard();
        console.log(`-> ${getPlayerName()} marked cell ${cellValue}.`);
        // return printResult(); 
    }

    const printResult = () => {
        const result = board.hasWinner(getPlayerName());
        if (Array.isArray(result)) {
            console.log(`-> ${getPlayerName()} wins!`);
            console.log("");
            return result;
        } else if (result == false) {
            console.log("-> Tie Game!");
            console.log("");
            return false;
        } else {
            console.log("");
            switchPlayerTurn();
            // playRound(); this line is for console version only
        }
    }

    // remove cellValue parameter for console version (prompt implementation)
    const playRound = (cellValue) => {
        if (board.isGameOver()) {
            return;
        }
        if (board.isCellMarked(cellValue)) {
            console.log("-> Invalid move! Cell is already marked.");
            return;
        } 
        showGameDetails();
        setPlayerMark(cellValue);
        return printResult();

        // setTimeout(() => {
        //     setPlayerMark(cellValue);
        //     printResult();
        // }, 2000);
    };

    const restartGame = () => {
        board.clearBoard();
        board.clearPlayerMarks();
        if (getPlayerName() == "playerO") {
            switchPlayerTurn();
        }
    };
    
    return { playRound, getPlayerName, restartGame };
})();  

/**
 * displays flow and state of the game
 * - board display
 * - dom listener for player turn
 */
const displayController = () => {
    const game = gameController;
    const playerTurnDisplay = document.querySelector(".turn");
    const restartButton = document.querySelector(".restart");
    const boardDiv = document.querySelector(".board-container");

    const updateDisplay = () => {
        boardDiv.textContent = "";

        const board = gameboard.getBoard();
        board.forEach((cell) => {
            const cellDiv = document.createElement("div");
            cellDiv.dataset.value = cell.getValue();
            cellDiv.textContent = (typeof cell.getValue() !== "number") ? cell.getValue() : "";

            cellDiv.classList.add("cell");
            cellDiv.classList.toggle("playerO", cell.getValue() === "O");
            boardDiv.appendChild(cellDiv);
        });
        playerTurnDisplay.textContent = `${game.getPlayerName()}'s turn`;
        playerTurnDisplay.classList.toggle("playerO", game.getPlayerName() === "playerO");
    };

    /** 
     * listener for which cell is clicked when a cell is 
     * clicked, modify playRound to take cell value 
     * parameter that passes down to setPlayerMark instead 
     * of prompting user in the console version
     */
    function handleClick(event) {
        const cellValue = event.target.dataset.value;
        const result =  game.playRound(cellValue);
        displayGameResult(result);
        updateDisplay();
    }
    
    const displayGameResult = (result) => {
        if (result == undefined) {
            return;
        }
        if (result) {
            animateWin(result);
        }
        displayModal(result);
    };

    const animateWin = (result) => {
        console.log(result);
        const winningDivs = [...boardDiv.children].filter((cellDiv) => result.includes(parseInt(cellDiv.dataset.value)));
        console.log(winningDivs)
        winningDivs.forEach(div => console.log(div.dataset.value))
    };

    const displayModal = (result) => {
        const modal = document.querySelector("[data-modal]");
        const resultDisplay = document.querySelector(".result");
        const playButton = document.querySelector(".play-again");
        const closeButton = document.querySelector(".close");

        modal.showModal();
        modal.classList.add("open");
        if (game.getPlayerName() == "playerO") resultDisplay.classList.add("playerO");
        resultDisplay.textContent = (result) ? `${game.getPlayerName()} wins!` : "Tie Game!";
        
        playButton.addEventListener("click", () => {
            modal.classList.remove("open");
            setTimeout(() => modal.close(), 300);
            game.restartGame();
            updateDisplay();
        });
        closeButton.addEventListener("click", () => {
            modal.classList.remove("open");
            setTimeout(() => modal.close(), 300);
        });
    };

    /** 
     * update display should be the first thing called 
     * when displayController is called, then listen
     */
    updateDisplay();
    boardDiv.addEventListener("click", handleClick);
    restartButton.addEventListener("click", () => {
        game.restartGame();
        updateDisplay();
    });
};

displayController();