function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    const newBoard = () => {
        board.length = 0;
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
    }

    const getBoard = () => board;

    const isBoardFull = () => {
        return board.every(row => row.every(cell => cell.getValue() !== ""));
    }

    const checkWin = (player) => {
        for (let i = 0; i < rows; i++) {
            if (board.every((row) => row[i].getValue() === player.mark)) return { status: "win", winner: player.name };
        }
        for (let j = 0; j < columns; j++) {
            if (board[j].every((cell) => cell.getValue() === player.mark)) return { status: "win", winner: player.name };
        }

        if (
            (
                board[0][0].getValue() === player.mark &&
                board[1][1].getValue() === player.mark &&
                board[2][2].getValue() === player.mark
            ) || (
                board[2][0].getValue() === player.mark &&
                board[1][1].getValue() === player.mark &&
                board[0][2].getValue() === player.mark
            )) return { status: "win", winner: player.name };

        if (isBoardFull()) return { status: "draw", winner: null };
        return { status: "in progress", winner: null };
    }

    const markCell = (row, column, mark) => {
        const isCellAvailable = !board[row][column].getValue();
        if (!isCellAvailable) return false;
        board[row][column].addMarker(mark);
        return true;
    };

    newBoard();

    return {
        getBoard,
        markCell,
        checkWin,
        newBoard
    }

}

function Cell() {
    let value = "";

    const addMarker = (mark) => value = mark;
    const getValue = () => value;

    return {
        addMarker,
        getValue
    };
}

function GameController(
    playerOneName = "Red",
    playerTwoName = "Blu"
) {
    let gameState = { status: "in progress", winner: null };
    const board = GameBoard();

    const players = [
        {
            name: playerOneName,
            mark: "X"
        },
        {
            name: playerTwoName,
            mark: "O"
        }
    ];

    let activePlayer = players[0];

    const getGameState = () => gameState;

    const switchActivePlayer = () => activePlayer = activePlayer === players[0] ? players[1] : players[0];

    const getActivePlayer = () => activePlayer;

    const playRound = (row, column) => {
        if (gameState.status !== "in progress") return;

        const player = getActivePlayer();

        if (!board.markCell(row, column, player.mark)) return;

        gameState = board.checkWin(player);
        if (gameState.status === "in progress")
            switchActivePlayer();
    };

    const newGame = () => {
        activePlayer = players[0];
        board.newBoard();
        gameState = { status: "in progress", winner: null }
    }

    return { playRound, getActivePlayer, getBoard: board.getBoard, getGameState, newGame }
}

function ScreenController(playerOneName, playerTwoName) {
    const game = GameController(playerOneName, playerTwoName);
    const activePlayerDisplay = document.querySelector(".turn");
    const boardDisplay = document.querySelector(".board");

    const endScreen = document.querySelector(".result");
    const gameResultH1 = endScreen.querySelector(".game-result");

    function endGameScreenDisplay() {
        const message = (game.getGameState().status === "win") ?
            game.getGameState().winner + " wins!" :
            "Draw.";
        gameResultH1.textContent = message;
        endScreen.showModal();
    }

    function UpdateScreen() {
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        boardDisplay.textContent = "";

        activePlayerDisplay.textContent = activePlayer.name + "'s turn"
        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const newCell = document.createElement("button");
                newCell.classList.add("cell");
                newCell.dataset.row = rowIndex;
                newCell.dataset.column = columnIndex;
                newCell.textContent = cell.getValue();
                boardDisplay.append(newCell);
            });
        });
        if (game.getGameState().status !== "in progress") endGameScreenDisplay();
    }
    function clickHandlerBoard(e) {
        const selectedRow = +e.target.dataset.row;
        const selectedColumn = +e.target.dataset.column;

        if (!e.target.classList.contains("cell")) return;

        game.playRound(selectedRow, selectedColumn);
        UpdateScreen();
    }
    boardDisplay.addEventListener("click", clickHandlerBoard);
    const newGamebtn = endScreen.querySelector(".new-game");
    newGamebtn.addEventListener("click", () => {
        game.newGame();
        endScreen.close();
        UpdateScreen();
    });
    UpdateScreen();
}

(() => {
    const startScreen = document.querySelector(".start-game");
    startScreen.showModal();
    const playerOneNameInput = startScreen.querySelector("#player-one-name");
    const playertwoNameInput = startScreen.querySelector("#player-two-name");

    const startButton = startScreen.querySelector(".start-button");
    startButton.addEventListener("click", () => {
        ScreenController(playerOneNameInput.value, playertwoNameInput.value);
        startScreen.close();
    });

})();

