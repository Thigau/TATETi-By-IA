document.addEventListener("DOMContentLoaded", () => {
    const menu = document.getElementById("menu");
    const gameModes = document.getElementById("game-modes");
    const mode3x3 = document.getElementById("mode-3x3");
    const board3x3 = document.getElementById("board-3x3");
    const reset3x3 = document.getElementById("reset-3x3");
    const backToMenu = document.getElementById("back-to-menu");

    let currentPlayer = "X";
    let boardState = Array(3).fill(null).map(() => Array(3).fill(null));

    function checkWinner() {
        // Check rows and columns
        for (let i = 0; i < 3; i++) {
            if (
                boardState[i][0] &&
                boardState[i][0] === boardState[i][1] &&
                boardState[i][1] === boardState[i][2]
            ) {
                return boardState[i][0];
            }
            if (
                boardState[0][i] &&
                boardState[0][i] === boardState[1][i] &&
                boardState[1][i] === boardState[2][i]
            ) {
                return boardState[0][i];
            }
        }

        // Check diagonals
        if (
            boardState[0][0] &&
            boardState[0][0] === boardState[1][1] &&
            boardState[1][1] === boardState[2][2]
        ) {
            return boardState[0][0];
        }
        if (
            boardState[0][2] &&
            boardState[0][2] === boardState[1][1] &&
            boardState[1][1] === boardState[2][0]
        ) {
            return boardState[0][2];
        }

        // Check for a tie
        if (boardState.flat().every(cell => cell !== null)) {
            return "Empate";
        }

        return null;
    }

    function displayWinner(winner) {
        const winnerMessage = document.getElementById("winner-message");
        if (winner === "Empate") {
            winnerMessage.textContent = "¡Es un empate!";
            winnerMessage.classList.remove("hidden", "winner");
            winnerMessage.classList.add("tie");
        } else {
            winnerMessage.textContent = `${winner} ha ganado!`;
            winnerMessage.classList.remove("hidden", "tie");
            winnerMessage.classList.add("winner");
        }
    }

    function create3x3Board() {
        board3x3.innerHTML = "";
        boardState = Array(3).fill(null).map(() => Array(3).fill(null));
        currentPlayer = "X";

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.addEventListener("click", () => {
                    if (!cell.textContent && !checkWinner()) {
                        cell.textContent = currentPlayer;
                        boardState[row][col] = currentPlayer;
                        const winner = checkWinner();
                        if (winner) {
                            displayWinner(winner);
                        } else {
                            currentPlayer = currentPlayer === "X" ? "O" : "X";
                        }
                    }
                });
                board3x3.appendChild(cell);
            }
        }
    }

    reset3x3.addEventListener("click", () => {
        create3x3Board();
        const winnerMessage = document.getElementById("winner-message");
        winnerMessage.classList.add("hidden");
        winnerMessage.textContent = "";
    });

    backToMenu.addEventListener("click", () => {
        mode3x3.classList.add("hidden");
        gameModes.classList.add("hidden");
        menu.classList.remove("hidden");
    });

    document.getElementById("three-by-three").addEventListener("click", () => {
        menu.classList.add("hidden");
        gameModes.classList.remove("hidden");
        mode3x3.classList.remove("hidden");
        create3x3Board();
    });
});