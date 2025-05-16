
document.addEventListener("DOMContentLoaded", () => {
    const menu = document.getElementById("menu");
    const gameModes = document.getElementById("game-modes");
    const mode3x3 = document.getElementById("mode-3x3");
    const board3x3 = document.getElementById("board-3x3");
    const reset3x3 = document.getElementById("reset-3x3");
    const backToMenu = document.getElementById("back-to-menu");
    const modeCustom = document.getElementById("mode-custom");

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
    let isVsIA = false; // Variable para determinar si el modo es VS IA
    let selectedMode3x3 = null; // 'pvp' | 'vsia' | null
    let iaDifficulty = 'easy';
    const iaDifficultySelect = document.getElementById('ia-difficulty');
    if (iaDifficultySelect) {
        iaDifficultySelect.addEventListener('change', (event) => {
            iaDifficulty = event.target.value;
            console.log(`Dificultad de IA actualizada a: ${iaDifficulty}`);
        });

        iaDifficultySelect.addEventListener('mouseover', () => {
            if (iaDifficultySelect.disabled) {
                iaDifficultySelect.style.cursor = 'not-allowed';
            } else {
                iaDifficultySelect.style.cursor = 'pointer';
            }
        });

        iaDifficultySelect.addEventListener('mouseout', () => {
            iaDifficultySelect.style.cursor = '';
        });
    }

    // Bloquear el menú de selección de dificultad durante la partida
    function bloquearMenuDificultad(bloquear) {
        if (iaDifficultySelect) {
            iaDifficultySelect.disabled = bloquear;
        }
    }

    // Mostrar el menú de dificultad solo al tocar Vs IA
    const vsIAButton = document.getElementById("vs-ia-3x3");
    const pvpButton = document.getElementById("pvp-3x3");

    function mostrarConfirmacionInicioJuego(modo) {
        // Prevent duplicate overlays
        if (document.getElementById("confirmation-overlay")) {
            return;
        }

        const confirmationOverlay = document.createElement("div");
        confirmationOverlay.id = "confirmation-overlay";
        confirmationOverlay.style.position = "absolute";
        confirmationOverlay.style.top = "50%";
        confirmationOverlay.style.left = "50%";
        confirmationOverlay.style.transform = "translate(-50%, -50%)";
        confirmationOverlay.style.zIndex = "1";
        confirmationOverlay.style.width = "250px";
        confirmationOverlay.style.height = "150px";
        confirmationOverlay.style.backgroundColor = "#4CAF50"; // Verde llamativo que combina con la página
        confirmationOverlay.style.color = "white"; // Texto blanco para buen contraste
        confirmationOverlay.style.padding = "20px";
        confirmationOverlay.style.borderRadius = "10px";
        confirmationOverlay.style.textAlign = "center";
        confirmationOverlay.style.display = "flex";
        confirmationOverlay.style.flexDirection = "column";

        const message = document.createElement("p");
        message.textContent = `¿Deseas comenzar el juego en modo ${modo}?`;
        confirmationOverlay.appendChild(message);

        const checkboxContainer = document.createElement("div");
        checkboxContainer.style.display = "flex";
        checkboxContainer.style.alignItems = "center";
        checkboxContainer.style.marginTop = "10px";
        // Center the checkbox label relative to the checkbox
        checkboxContainer.style.justifyContent = "center";

        const disableCheckbox = document.createElement("input");
        disableCheckbox.type = "checkbox";
        disableCheckbox.id = "disable-confirmation";
        disableCheckbox.style.marginRight = "10px";
        checkboxContainer.appendChild(disableCheckbox);

        const checkboxLabel = document.createElement("label");
        checkboxLabel.htmlFor = "disable-confirmation";
        checkboxLabel.textContent = "No mostrar mensaje";
        checkboxContainer.appendChild(checkboxLabel);

        confirmationOverlay.appendChild(checkboxContainer);

        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "center";
        buttonContainer.style.marginTop = "20px";

        const yesButton = document.createElement("button");
        yesButton.textContent = "Sí";
        yesButton.style.margin = "0 10px";
        yesButton.style.padding = "5px 10px";
        yesButton.addEventListener("click", () => {
            document.body.removeChild(confirmationOverlay);
            if (modo === 'PvP') {
                isVsIA = false;
                selectedMode3x3 = 'pvp';
                if (iaDifficultySelect) iaDifficultySelect.classList.add('hidden');
            } else if (modo === 'VS IA') {
                isVsIA = true;
                selectedMode3x3 = 'vsia';
                if (iaDifficultySelect) iaDifficultySelect.classList.remove('hidden');
            }
            create3x3Board();
        });
        buttonContainer.appendChild(yesButton);

        const noButton = document.createElement("button");
        noButton.textContent = "No";
        noButton.style.margin = "0 10px";
        noButton.style.padding = "5px 10px";
        noButton.addEventListener("click", () => {
            document.body.removeChild(confirmationOverlay);
        });
        buttonContainer.appendChild(noButton);
        confirmationOverlay.appendChild(buttonContainer);

        document.body.appendChild(confirmationOverlay);

        // Deshabilitar las casillas mientras el mensaje está visible
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => cell.style.pointerEvents = "none");

        // Rehabilitar las casillas cuando el mensaje desaparezca
        yesButton.addEventListener("click", () => {
            cells.forEach(cell => cell.style.pointerEvents = "auto");
        });
        noButton.addEventListener("click", () => {
            cells.forEach(cell => cell.style.pointerEvents = "auto");
        });
    }

    pvpButton.addEventListener("click", () => {
        mostrarConfirmacionInicioJuego('PvP');
    });

    vsIAButton.addEventListener("click", () => {
        mostrarConfirmacionInicioJuego('VS IA');
    });

    // Al iniciar, ocultar el menú de dificultad
    if (iaDifficultySelect) iaDifficultySelect.classList.add('hidden');

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

    // --- Memoria simple para la IA ---
    let userWinningMoves = [];

    function recordUserWin() {
        // Si el usuario gana, guardar las posiciones de sus movimientos
        let moves = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (boardState[row][col] === "X") {
                    moves.push(`${row},${col}`);
                }
            }
        }
        userWinningMoves.push(...moves);
    }

    function mostCommonUserMoves() {
        // Contar las posiciones más frecuentes donde el usuario gana
        const count = {};
        userWinningMoves.forEach(pos => {
            count[pos] = (count[pos] || 0) + 1;
        });
        // Ordenar por frecuencia
        return Object.entries(count).sort((a, b) => b[1] - a[1]).map(([pos]) => pos);
    }

    // Modificar displayWinner para bloquear el tablero mientras se muestra el mensaje
    function displayWinner(winner) {
        const winnerMessage = document.getElementById("winner-message");
        board3x3.classList.add("disabled");
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
            if (winner === "X" && isVsIA) {
                recordUserWin();
            }
        }
        // Mostrar el mensaje y ocultarlo después de 1.2s
        winnerMessage.style.opacity = "1";
        setTimeout(() => {
            create3x3Board();
            winnerMessage.classList.add("hidden");
            winnerMessage.textContent = "";
            winnerMessage.style.opacity = "0";
            board3x3.classList.remove("disabled");
            if (isVsIA) bloquearMenuDificultad(false);
            // Mantener la animación solo en el botón seleccionado
            const buttonGroup = document.querySelector('.button-group');
            if (buttonGroup) {
                buttonGroup.querySelectorAll('button').forEach(button => button.classList.remove('active'));
                if (selectedMode3x3 === 'pvp') {
                    document.getElementById('pvp-3x3').classList.add('active');
                } else if (selectedMode3x3 === 'vsia') {
                    document.getElementById('vs-ia-3x3').classList.add('active');
                }
            }
            bloquearMenuDificultad(false);
        }, 1200);
    }

    // Add a flag to track if AI is active
    let isAIActive = false;

    // Modify the reset logic to deactivate AI
    const resetGame = () => {
        create3x3Board();
        const winnerMessage = document.getElementById("winner-message");
        winnerMessage.classList.add("hidden");
        winnerMessage.textContent = "";
        bloquearMenuDificultad(false); // Desbloquear al reiniciar
        isAIActive = false; // Deactivate AI on reset
    };

    // Update the VS IA button logic to activate AI
    vsIAButton.addEventListener("click", () => {
        isAIActive = true; // Activate AI when VS IA button is clicked
        mostrarConfirmacionInicioJuego('VS IA');
    });

    // Modify AI turn logic to check if AI is active
    const aiTurn = () => {
        if (!isAIActive) return; // Skip AI turn if not active
        console.log('Turno de la IA. Nivel de dificultad:', iaDifficulty);

        bloquearMenuDificultad(true); // Bloquear durante la partida

        // Validar que el nivel de dificultad sea válido
        const validDifficulties = ['easy', 'normal', 'hard', 'impossible'];
        if (!validDifficulties.includes(iaDifficulty)) {
            console.error('Nivel de dificultad inválido:', iaDifficulty);
            return;
        }

        // Lógica para cada nivel de dificultad
        switch (iaDifficulty) {
            case 'easy':
                realizarMovimientoAleatorio();
                break;
            case 'normal':
                realizarMovimientoEstrategico(2);
                break;
            case 'hard':
                realizarMovimientoEstrategico(4);
                break;
            case 'impossible':
                realizarMovimientoEstrategico(null); // Sin límite de profundidad
                break;
        }
    };

    function realizarMovimientoAleatorio() {
        console.log('Ejecutando nivel fácil (movimiento aleatorio)');
        const availableMoves = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (!boardState[row][col]) {
                    availableMoves.push({ row, col });
                }
            }
        }
        if (availableMoves.length > 0) {
            const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            playIAMove(randomMove.row, randomMove.col);
        }
    }

    function realizarMovimientoEstrategico(maxDepth) {
        console.log(`Ejecutando nivel avanzado con profundidad máxima: ${maxDepth}`);
        let bestScore = -Infinity;
        let move = null;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (!boardState[row][col]) {
                    boardState[row][col] = "O";
                    let score = minimax(boardState, 0, false, maxDepth);
                    boardState[row][col] = null;
                    if (score > bestScore) {
                        bestScore = score;
                        move = { row, col };
                    }
                }
            }
        }
        if (move) {
            playIAMove(move.row, move.col);
        }
    }

    function minimax(state, depth, isMaximizing, maxDepth) {
        const winner = getMinimaxWinner(state);
        if (winner !== null) {
            if (winner === "O") return 10 - depth;
            if (winner === "X") return depth - 10;
            if (winner === "Empate") return 0;
        }
        if (maxDepth !== null && depth >= maxDepth) {
            return 0;
        }
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (!state[row][col]) {
                        state[row][col] = "O";
                        let score = minimax(state, depth + 1, false, maxDepth);
                        state[row][col] = null;
                        bestScore = Math.max(score, bestScore);
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (!state[row][col]) {
                        state[row][col] = "X";
                        let score = minimax(state, depth + 1, true, maxDepth);
                        state[row][col] = null;
                        bestScore = Math.min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    }

    function getMinimaxWinner(state) {
        // Chequear filas y columnas
        for (let i = 0; i < 3; i++) {
            if (state[i][0] && state[i][0] === state[i][1] && state[i][1] === state[i][2]) return state[i][0];
            if (state[0][i] && state[0][i] === state[1][i] && state[1][i] === state[2][i]) return state[0][i];
        }
        // Chequear diagonales
        if (state[0][0] && state[0][0] === state[1][1] && state[1][1] === state[2][2]) return state[0][0];
        if (state[0][2] && state[0][2] === state[1][1] && state[1][1] === state[2][0]) return state[0][2];
        // Empate
        if (state.flat().every(cell => cell !== null)) return "Empate";
        return null;
    }

    function playIAMove(row, col) {
        const cellIndex = row * 3 + col;
        const cell = board3x3.children[cellIndex];
        setTimeout(() => {
            if (!cell.textContent) {
                cell.textContent = "O";
                boardState[row][col] = "O";
                cell.classList.add("ai");
                const winner = checkWinner();
                if (winner === "X" || winner === "O" || winner === "Empate") {
                    board3x3.classList.add("disabled");
                    displayWinner(winner);
                } else {
                    currentPlayer = "X";
                    mostrarTurnoActual();
                }
            }
        }, 300);
    }

    reset3x3.addEventListener("click", resetGame);

    backToMenu.addEventListener("click", () => {
        mode3x3.classList.add("hidden");
        gameModes.classList.add("hidden");
        menu.classList.remove("hidden");
        bloquearMenuDificultad(false); // Desbloquear al volver al menú principal
    });

    // --- ARREGLO: Mostrar tablero 3x3 correctamente al volver al menú o seleccionar modo ---
    // Seleccionar el botón de volver al menú del modo 3x3
    const backToMenu3x3 = mode3x3.querySelector('#back-to-menu');
    if (backToMenu3x3) {
        backToMenu3x3.addEventListener('click', () => {
            mode3x3.classList.add('hidden');
            gameModes.classList.add('hidden');
            menu.classList.remove('hidden');
            if (iaDifficultySelect) iaDifficultySelect.classList.add('hidden');
            selectedMode3x3 = null;
        });
    }
    // Asegurar que el tablero se muestre correctamente al seleccionar el modo 3x3
    document.getElementById("three-by-three").addEventListener("click", () => {
        menu.classList.add("hidden");
        gameModes.classList.remove("hidden");
        mode3x3.classList.remove("hidden");
        mode5x5.classList.add("hidden");
        modeCustom.classList.add("hidden");
        selectedMode3x3 = null;
        create3x3Board();
    });
    document.getElementById("five-by-five").addEventListener("click", () => {
        menu.classList.add("hidden");
        gameModes.classList.remove("hidden");
        mode5x5.classList.remove("hidden");
        mode3x3.classList.add("hidden");
        modeCustom.classList.add("hidden");
        selectedMode5x5 = null;
        create5x5Board();
    });

    // --- MODO 5x5 ---
    const mode5x5 = document.getElementById("mode-5x5");
    const board5x5 = document.getElementById("board-5x5");
    const reset5x5 = document.getElementById("reset-5x5");
    const pvp5x5 = document.getElementById("pvp-5x5");
    const vsIA5x5 = document.getElementById("vs-ia-5x5");
    const iaDifficultySelect5x5 = document.getElementById("ia-difficulty-5x5");
    const turnoContainer5x5 = document.getElementById("turno-container-5x5");
    const warning5x5 = document.getElementById("warning-message-5x5");
    const winnerMessage5x5 = document.getElementById("winner-message-5x5");
    let boardState5x5 = Array(5).fill(null).map(() => Array(5).fill(null));
    let currentPlayer5x5 = "X";
    let isVsIA5x5 = false;
    let selectedMode5x5 = null;
    let iaDifficulty5x5 = 'easy';

    if (iaDifficultySelect5x5) {
        iaDifficultySelect5x5.addEventListener('change', (event) => {
            iaDifficulty5x5 = event.target.value;
        });
    }

    function bloquearMenuDificultad5x5(bloquear) {
        if (iaDifficultySelect5x5) iaDifficultySelect5x5.disabled = bloquear;
    }

    function seleccionarSimboloInicial5x5() {
        currentPlayer5x5 = Math.random() < 0.5 ? "X" : "O";
    }

    function mostrarTurnoActual5x5() {
        if (!turnoContainer5x5) return;
        if (!isVsIA5x5) {
            turnoContainer5x5.textContent = "";
            return;
        }
        const mensaje = currentPlayer5x5 === "X" ? (currentLanguage === 'es' ? "Turno: Usuario" : "Turn: User") : (currentLanguage === 'es' ? "Turno: IA" : "Turn: AI");
        turnoContainer5x5.textContent = mensaje;
    }

    function checkWinner5x5() {
        // Horizontal y vertical
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j <= 0; j++) {
                // Horizontal
                if (
                    boardState5x5[i][j] &&
                    boardState5x5[i][j] === boardState5x5[i][j+1] &&
                    boardState5x5[i][j] === boardState5x5[i][j+2] &&
                    boardState5x5[i][j] === boardState5x5[i][j+3] &&
                    boardState5x5[i][j] === boardState5x5[i][j+4]
                ) return boardState5x5[i][j];
                // Vertical
                if (
                    boardState5x5[j][i] &&
                    boardState5x5[j][i] === boardState5x5[j+1][i] &&
                    boardState5x5[j][i] === boardState5x5[j+2][i] &&
                    boardState5x5[j][i] === boardState5x5[j+3][i] &&
                    boardState5x5[j][i] === boardState5x5[j+4][i]
                ) return boardState5x5[j][i];
            }
        }
        // Diagonales principales
        for (let i = 0; i <= 0; i++) {
            for (let j = 0; j <= 0; j++) {
                // Principal
                if (
                    boardState5x5[i][j] &&
                    boardState5x5[i][j] === boardState5x5[i+1][j+1] &&
                    boardState5x5[i][j] === boardState5x5[i+2][j+2] &&
                    boardState5x5[i][j] === boardState5x5[i+3][j+3] &&
                    boardState5x5[i][j] === boardState5x5[i+4][j+4]
                ) return boardState5x5[i][j];
                // Secundaria
                if (
                    boardState5x5[i][j+4] &&
                    boardState5x5[i][j+4] === boardState5x5[i+1][j+3] &&
                    boardState5x5[i][j+4] === boardState5x5[i+2][j+2] &&
                    boardState5x5[i][j+4] === boardState5x5[i+3][j+1] &&
                    boardState5x5[i][j+4] === boardState5x5[i+4][j]
                ) return boardState5x5[i][j+4];
            }
        }
        // Empate
        if (boardState5x5.flat().every(cell => cell !== null)) return "Empate";
        return null;
    }

    function displayWinner5x5(winner) {
        winnerMessage5x5.classList.remove("hidden");
        if (winner === "Empate") {
            winnerMessage5x5.textContent = currentLanguage === 'es' ? "¡Es un empate!" : "It's a tie!";
            winnerMessage5x5.classList.remove("winner");
            winnerMessage5x5.classList.add("tie");
        } else {
            const winText = currentLanguage === 'es' ? "ha ganado!" : "has won!";
            winnerMessage5x5.textContent = `${winner} ${winText}`;
            winnerMessage5x5.classList.remove("tie");
            winnerMessage5x5.classList.add("winner");
        }
        setTimeout(() => {
            create5x5Board();
            winnerMessage5x5.classList.add("hidden");
            winnerMessage5x5.textContent = "";
        }, 1200);
    }

    function create5x5Board() {
        board5x5.innerHTML = "";
        boardState5x5 = Array(5).fill(null).map(() => Array(5).fill(null));
        seleccionarSimboloInicial5x5();
        mostrarTurnoActual5x5();
        if (warning5x5) {
            warning5x5.classList.add("hidden");
            warning5x5.textContent = "";
        }
        if (isVsIA5x5) bloquearMenuDificultad5x5(false);
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.addEventListener("click", () => {
                    if (!selectedMode5x5) {
                        if (warning5x5) {
                            warning5x5.textContent = currentLanguage === 'es' ? "Selecciona un modo de juego para jugar." : "Please select a game mode to play.";
                            warning5x5.classList.remove("hidden");
                        }
                        return;
                    }
                    if (!cell.textContent && !checkWinner5x5() && (!isVsIA5x5 || (isVsIA5x5 && currentPlayer5x5 === "X"))) {
                        cell.textContent = currentPlayer5x5;
                        boardState5x5[row][col] = currentPlayer5x5;
                        const winner = checkWinner5x5();
                        if (winner) {
                            displayWinner5x5(winner);
                        } else {
                            actualizarTurno5x5();
                        }
                    }
                });
                board5x5.appendChild(cell);
            }
        }
        if (isVsIA5x5 && currentPlayer5x5 === "O") {
            bloquearMenuDificultad5x5(false);
            setTimeout(() => {
                bloquearMenuDificultad5x5(true);
                aiTurn5x5();
                currentPlayer5x5 = "X";
                mostrarTurnoActual5x5();
                bloquearMenuDificultad5x5(false);
            }, 1000);
        }
    }

    function actualizarTurno5x5() {
        currentPlayer5x5 = currentPlayer5x5 === "X" ? "O" : "X";
        mostrarTurnoActual5x5();
        if (isVsIA5x5 && currentPlayer5x5 === "O") {
            bloquearMenuDificultad5x5(false);
            setTimeout(() => {
                bloquearMenuDificultad5x5(true);
                aiTurn5x5();
                currentPlayer5x5 = "X";
                mostrarTurnoActual5x5();
                bloquearMenuDificultad5x5(false);
            }, 1000);
        } else {
            if (isVsIA5x5) bloquearMenuDificultad5x5(false);
        }
    }

    function aiTurn5x5() {
        const validDifficulties = ['easy', 'normal', 'hard', 'impossible'];
        let difficulty = iaDifficulty5x5;
        if (!validDifficulties.includes(difficulty)) difficulty = 'easy';
        if (difficulty === 'easy') {
            // Movimiento aleatorio
            const availableMoves = [];
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    if (!boardState5x5[row][col]) {
                        availableMoves.push({ row, col });
                    }
                }
            }
            if (availableMoves.length > 0) {
                const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                setTimeout(() => {
                    const cellIndex = randomMove.row * 5 + randomMove.col;
                    const cell = board5x5.children[cellIndex];
                    if (!cell.textContent) {
                        cell.textContent = "O";
                        boardState5x5[randomMove.row][randomMove.col] = "O";
                        cell.classList.add("ai");
                        const winner = checkWinner5x5();
                        if (winner) {
                            displayWinner5x5(winner);
                        } else {
                            currentPlayer5x5 = "X";
                            mostrarTurnoActual5x5();
                        }
                    }
                }, 300);
            }
        } else {
            // Minimax adaptado a 5x5
            let maxDepth = null;
            if (difficulty === 'normal') maxDepth = 2;
            if (difficulty === 'hard') maxDepth = 3;
            if (difficulty === 'impossible') maxDepth = null;
            let bestScore = -Infinity;
            let move = null;
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    if (!boardState5x5[row][col]) {
                        boardState5x5[row][col] = "O";
                        let score = minimax5x5(boardState5x5, 0, false, maxDepth);
                        boardState5x5[row][col] = null;
                        if (score > bestScore) {
                            bestScore = score;
                            move = { row, col };
                        }
                    }
                }
            }
            if (move) {
                setTimeout(() => {
                    const cellIndex = move.row * 5 + move.col;
                    const cell = board5x5.children[cellIndex];
                    if (!cell.textContent) {
                        cell.textContent = "O";
                        boardState5x5[move.row][move.col] = "O";
                        cell.classList.add("ai");
                        const winner = checkWinner5x5();
                        if (winner) {
                            displayWinner5x5(winner);
                        } else {
                            currentPlayer5x5 = "X";
                            mostrarTurnoActual5x5();
                        }
                    }
                }, 300);
            }
        }
    }

    // --- EVENTO VOLVER AL MENÚ PARA 5x5 ---
    const backToMenu5x5 = mode5x5.querySelector('#back-to-menu');
    if (backToMenu5x5) {
        backToMenu5x5.addEventListener('click', () => {
            mode5x5.classList.add('hidden');
            gameModes.classList.add('hidden');
            menu.classList.remove('hidden');
            if (iaDifficultySelect5x5) iaDifficultySelect5x5.classList.add('hidden');
            selectedMode5x5 = null;
        });
    }

    // --- EVENTOS PARA MODO 5x5 ---
    function animarReiniciar5x5() {
        reset5x5.classList.add('active');
        setTimeout(() => {
            reset5x5.classList.remove('active');
        }, 200);
    }
    function actualizarBotones5x5() {
        const buttonGroup = mode5x5.querySelector('.button-group');
        if (buttonGroup) {
            buttonGroup.querySelectorAll('button').forEach(button => button.classList.remove('active'));
            if (selectedMode5x5 === 'pvp') {
                pvp5x5.classList.add('active');
            } else if (selectedMode5x5 === 'vsia') {
                vsIA5x5.classList.add('active');
            }
        }
    }
    pvp5x5.addEventListener("click", () => {
        isVsIA5x5 = false;
        selectedMode5x5 = 'pvp';
        if (iaDifficultySelect5x5) iaDifficultySelect5x5.classList.add('hidden');
        actualizarBotones5x5();
        create5x5Board();
    });
    vsIA5x5.addEventListener("click", () => {
        isVsIA5x5 = true;
        selectedMode5x5 = 'vsia';
        if (iaDifficultySelect5x5) iaDifficultySelect5x5.classList.remove('hidden');
        actualizarBotones5x5();
        create5x5Board();
    });
    reset5x5.addEventListener("click", () => {
        animarReiniciar5x5();
        actualizarBotones5x5();
        create5x5Board();
        if (iaDifficultySelect5x5) iaDifficultySelect5x5.disabled = false;
    });
    // Ocultar el menú de dificultad al iniciar
    if (iaDifficultySelect5x5) iaDifficultySelect5x5.classList.add('hidden');

    // --- ARREGLO: Mostrar solo el tablero correspondiente al modo seleccionado ---
    // Asegura que solo el tablero 3x3 esté visible en modo 3x3
    document.getElementById("three-by-three").addEventListener("click", () => {
        menu.classList.add("hidden");
        gameModes.classList.remove("hidden");
        mode3x3.classList.remove("hidden");
        mode5x5.classList.add("hidden");
        modeCustom.classList.add("hidden");
        selectedMode3x3 = null;
        create3x3Board();
    });
    // Asegura que solo el tablero 5x5 esté visible en modo 5x5
    document.getElementById("five-by-five").addEventListener("click", () => {
        menu.classList.add("hidden");
        gameModes.classList.remove("hidden");
        mode5x5.classList.remove("hidden");
        mode3x3.classList.add("hidden");
        modeCustom.classList.add("hidden");
        selectedMode5x5 = null;
        create5x5Board();
    });

    // --- ARREGLO DEFINITIVO: crear3x3Board debe crear el tablero y los listeners correctamente ---
    // --- FIX: Completar create3x3Board para que funcione y no quede cortada la función ---
    function create3x3Board() {
        board3x3.innerHTML = "";
        boardState = Array(3).fill(null).map(() => Array(3).fill(null));
        currentPlayer = "X";
        const turnoContainer = document.getElementById("turno-container");
        if (turnoContainer) {
            turnoContainer.textContent = isVsIA ? (currentLanguage === 'es' ? "Turno: Usuario" : "Turn: User") : "";
        }
        const warning = document.getElementById("warning-message");
        if (warning) {
            warning.classList.add("hidden");
            warning.textContent = "";
        }
        const winnerMessage = document.getElementById("winner-message");
        if (winnerMessage) {
            winnerMessage.classList.add("hidden");
            winnerMessage.textContent = "";
        }
        board3x3.classList.remove("disabled");
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.addEventListener("click", () => {
                    if (!selectedMode3x3) {
                        if (warning) {
                            warning.textContent = currentLanguage === 'es' ? "Selecciona un modo de juego para jugar." : "Please select a game mode to play.";
                            warning.classList.remove("hidden");
                        }
                        return;
                    }
                    if (!cell.textContent && !checkWinner() && (!isVsIA || (isVsIA && currentPlayer === "X"))) {
                        cell.textContent = currentPlayer;
                        boardState[row][col] = currentPlayer;
                        const winner = checkWinner();
                        if (winner) {
                            displayWinner(winner);
                        } else {
                            currentPlayer = currentPlayer === "X" ? "O" : "X";
                            if (isVsIA && currentPlayer === "O") {
                                setTimeout(aiTurn, 300);
                            } else {
                                if (turnoContainer) turnoContainer.textContent = isVsIA ? (currentLanguage === 'es' ? "Turno: Usuario" : "Turn: User") : "";
                            }
                        }
                    }
                });
                board3x3.appendChild(cell);
            }
        }
    }
});
