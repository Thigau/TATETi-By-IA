document.addEventListener("DOMContentLoaded", () => {
    const menu = document.getElementById("menu");
    const gameModes = document.getElementById("game-modes");
    const mode3x3 = document.getElementById("mode-3x3");
    const board3x3 = document.getElementById("board-3x3");
    const reset3x3 = document.getElementById("reset-3x3");
    const backToMenu = document.getElementById("back-to-menu");

    // Detect browser language: Spanish for es-*, otherwise English
    let currentLanguage = navigator.language && navigator.language.startsWith('es') ? 'es' : 'en';
    const translations = {
        en: {
            title: 'Tic Tac Toe Interactive',
            menuHeading: 'Select Game',
            threeByThree: '3x3 Mode',
            fiveByFive: '5x5 Mode',
            customGame: 'Custom Mode',
            mode3x3Heading: '3x3 Mode',
            mode5x5Heading: '5x5 Mode',
            modeCustomHeading: 'Custom Mode',
            reset: 'Reset',
            backToMenu: 'Back to Menu',
            languageLabel: '🌐 Choose Language:'
        },
        es: {
            title: 'Ta Te Ti Interactivo',
            menuHeading: 'Seleccionar el juego',
            threeByThree: 'Modo 3x3',
            fiveByFive: 'Modo 5x5',
            customGame: 'Personalizado',
            mode3x3Heading: 'Modo 3x3',
            mode5x5Heading: 'Modo 5x5',
            modeCustomHeading: 'Personalizado',
            reset: 'Reiniciar',
            backToMenu: 'Volver al Menú',
            languageLabel: '🌐 Elegir idioma:'
        }
    };
    const languageSelect = document.getElementById('language-select');
    // Set selector to detected language
    languageSelect.value = currentLanguage;
    languageSelect.addEventListener('change', e => updateLanguage(e.target.value));

    function updateLanguage(lang) {
        // Set html lang attribute for accessibility
        document.documentElement.lang = lang;
        const t = translations[lang];
        currentLanguage = lang;
        document.title = t.title;
        document.querySelector('h1').textContent = t.title;
        document.querySelector('#menu h2').textContent = t.menuHeading;
        document.getElementById('three-by-three').textContent = t.threeByThree;
        document.getElementById('five-by-five').textContent = t.fiveByFive;
        document.getElementById('custom-game').textContent = t.customGame;
        document.querySelector('#mode-3x3 h2').textContent = t.mode3x3Heading;
        document.querySelector('#mode-5x5 h2').textContent = t.mode5x5Heading;
        document.querySelector('#mode-custom h2').textContent = t.modeCustomHeading;
        document.getElementById('reset-3x3').textContent = t.reset;
        document.getElementById('reset-5x5').textContent = t.reset;
        document.getElementById('reset-custom').textContent = t.reset;
        document.querySelectorAll('#back-to-menu').forEach(btn => btn.textContent = t.backToMenu);
        document.querySelector('label[for="language-select"]').textContent = t.languageLabel;
    }
    updateLanguage(currentLanguage);

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
            const text = currentLanguage === 'es' ? "¡Es un empate!" : "It's a tie!";
            winnerMessage.textContent = text;
            winnerMessage.classList.remove("hidden", "winner");
            winnerMessage.classList.add("tie");
        } else {
            const winText = currentLanguage === 'es' ? "ha ganado!" : "has won!";
            winnerMessage.textContent = `${winner} ${winText}`;
            winnerMessage.classList.remove("hidden", "tie");
            winnerMessage.classList.add("winner");
        }
        // Auto-reset game after showing result
        setTimeout(() => {
            reset3x3.click();
        }, 2000);
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