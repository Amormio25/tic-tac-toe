/**
 * COMMENT AND UNCOMMENT MARKERS TO PLAY CONSOLE OR DISPLAY VERSION
 */

/**
 * state of each square on the board
 * id: location of cell on the board from 1-9
 * X: player one
 * O: player two
 */
const cell = () => {
    let id;
    let value = "";

    const setID = (newID) => id = newID;
    const getID = () => id;
    const setValue = (mark) => value = mark;
    const getValue = () => value;

    return { setID, getID, setValue , getValue };
};  

/**
 * handles state of the board (3x3)
 */
const gameboard = (function() {
    const winPatterns = [ [1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7] ];

    let board = [];
    let playerXMarks = [];
    let playerOMarks = [];
    let gameOverStatus = false;

    let id = 1
    let value = 1;

    for (let i = 0; i < 9; i++) {
        board[i] = cell();
        board[i].setID(id++);
        board[i].setValue(value++);
    }

    const getBoard = () => board;

    const showBoard = () => {
        for (let i = 0; i < 9; i += 3) {
            console.log(board[i].getValue() + " " + board[i+1].getValue() + " " + board[i+2].getValue());
        }
    };

    const isCellMarked = (id) => {
        const validCells = board.filter((cell) => typeof cell.getValue() === "number").map(cell => cell.getID());
        if (!validCells.includes(parseInt(id))) {
            console.log("Invalid, please choose a valid cell.");
            return true;
        }
        return false;
    };

    const placeMark = (id, mark) => {
        (mark == "X") ? playerXMarks.push(id) : playerOMarks.push(id);
        const index = board.findIndex(cell => cell.getID() == id);
        board[index].setValue(mark);
    };

    const isGameOver = () => gameOverStatus;

    const hasWinner = (player) => {
        const playerMarks = (player == "playerX") ? playerXMarks : playerOMarks;
        if (playerMarks.length >= 3 && winPatterns.some(pattern => pattern.every(id => playerMarks.includes(id)))) {
            const winPattern = winPatterns.find(pattern => pattern.every(id => playerMarks.includes(id)));
            gameOverStatus = true;
            return winPattern;
        } else if (player == "playerX" && playerXMarks.length == 5) {
            gameOverStatus = true;
            return false;
        }
    }

    const clearBoard = () => {
        board = [];
        gameOverStatus = false;

        id = 1;
        value = 1;

        for (let i = 0; i < 9; i++) {
            board[i] = cell();
            board[i].setID(id++);
            board[i].setValue(value++);
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

    const setPlayerMark = (id) => {
        // let id = prompt("-> Choose a cell to mark: ");
        // while (id !== null && !validCells.includes(parseInt(id))) {
        //     id = prompt("-> Invalid, please choose a valid cell.");
        // }

        board.placeMark(parseInt(id), getPlayerMark());
        board.showBoard();
        console.log(`-> ${getPlayerName()} marked cell ${id}.`);
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

    // remove id parameter for console version (prompt implementation)
    const playRound = (id) => {
        if (board.isGameOver()) return;
        if (board.isCellMarked(id)) {
            console.log("-> Invalid move! Cell is already marked.");
            return;
        } 
        showGameDetails();
        setPlayerMark(id);
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
            cellDiv.dataset.id = cell.getID();
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
        if (gameboard.isGameOver()) return;
        const id = event.target.dataset.id;
        const result =  game.playRound(id);

        updateDisplay();
        displayGameResult(result);
    }
    
    const displayGameResult = (result) => {
        if (result == undefined) return;
        if (result) {
            setTimeout(() => animateWin(result), 200);
            setTimeout(() => displayModal(result), 1500)  
        } else {
            displayModal(result)
        }
    };

    const animateWin = (result) => {
        const winDivs = [...boardDiv.children].filter((cellDiv) => result.includes(parseInt(cellDiv.dataset.id)));
        winDivs.forEach((div, index) => {
            setTimeout(() => {
                div.style.color = "lime";
            }, index * 400);
        });
    };

    const displayModal = (result) => {
        const modal = document.querySelector("[data-modal]");
        const resultDisplay = document.querySelector(".result");
        const playButton = document.querySelector(".play-again");
        const closeButton = document.querySelector(".close");

        modal.showModal();
        modal.classList.add("open");
        if (game.getPlayerName() == "playerO") {
            resultDisplay.classList.add("playerO");
        } else {
            resultDisplay.classList.remove("playerO");
        }
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