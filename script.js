function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const checkWin = (mark) => {
        for (let i = 0; i < 3; i++) {
            if (board.every((row) => row[i].getValue() === mark)) return true;
        }
        for (let j = 0; j < 3; j++) {
            if (board[j].every((cell) => cell.getValue() === mark)) return true;
        }

        if (
            board[0][0].getValue() === mark &&
            board[1][1].getValue() === mark &&
            board[2][2].getValue() === mark
        ) return true;

        if (
            board[2][0].getValue() === mark &&
            board[1][1].getValue() === mark &&
            board[0][2].getValue() === mark
        ) return true;

        return false;
    }

    const markCell = (row, column, mark) => {
        const isCellAvailable = board[row][column].getValue() ? false : true;
        console.log(board[row][column].getValue())
        if (!isCellAvailable) return;
        board[row][column].addMarker(mark);
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) =>
            row.map((cell) => cell.getValue())
        );
        console.log(boardWithCellValues);
    };

    return {
        getBoard,
        markCell,
        printBoard,
        checkWin
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

function GameController() {
    playerOneName = "playerOneName";
    playerTwoName = "playerTwoName";

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

    const rowNames = ["top", "center", "bottom"];
    const columnNames = ["left", "middle", "right"];

    const switchActivePlayer = () => activePlayer = activePlayer === players[0] ? players[1] : players[0];

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {
        message = (row === 1 && column === 1) ?
            `${getActivePlayer().name} Marking into ${rowNames[1]}` :
            `${getActivePlayer().name} Marking into ${rowNames[row]} ${columnNames[column]}`
        console.log(message);
        board.markCell(row, column, getActivePlayer().mark);
        if (board.checkWin(activePlayer.mark)) {
            console.log("Player: " + activePlayer.name + " Wins");
            return;
        };
        switchActivePlayer();
        printNewRound();
    };

    printNewRound();

    //testing
    // p1 wins
    // playRound(0, 0);
    // playRound(0, 1);
    // playRound(1, 1);
    // playRound(0, 2);
    // playRound(2, 2);

    //p2 wins
    playRound(0, 1);
    playRound(0, 0);
    playRound(1, 2);
    playRound(1, 1);
    playRound(0, 2);
    playRound(2, 2);

    return { playRound, getActivePlayer }
}

const game = GameController();
