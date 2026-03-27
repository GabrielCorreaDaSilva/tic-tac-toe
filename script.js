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
        printBoard
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
        switchActivePlayer();
        printNewRound();
    };

    printNewRound();

    return { playRound, getActivePlayer }
}

const game = GameController();
