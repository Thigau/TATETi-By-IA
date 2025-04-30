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

        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "center";
        buttonContainer.style.marginTop = "20px";

        const yesButton = document.createElement("button");
        yesButton.textContent = "Sí";
        yesButton.style.margin = "0 10px";
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

    // Modificar displayWinner para registrar victorias del usuario
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
            if (winner === "X" && isVsIA) {
                recordUserWin();
            }
        }
        // Auto-reset game after showing result
        setTimeout(() => {
            // Reiniciar el tablero sin disparar el evento click del botón
            create3x3Board();
            const winnerMessage = document.getElementById("winner-message");
            winnerMessage.classList.add("hidden");
            winnerMessage.textContent = "";
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
            // Desbloquear el menú de selección de dificultad al finalizar el juego
            bloquearMenuDificultad(false);
        }, 700);
    }

    function makeIAMove() {
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
    }

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
            return 0; // No evalúa más allá de la profundidad máxima
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
        board3x3.classList.add("disabled");
        const cellIndex = row * 3 + col;
        const cell = board3x3.children[cellIndex];
        setTimeout(() => {
            if (!cell.textContent) {
                cell.textContent = "O";
                boardState[row][col] = "O";
                cell.classList.add("ai");
                const winner = checkWinner();
                if (winner) {
                    displayWinner(winner);
                } else {
                    currentPlayer = "X";
                }
            }
            board3x3.classList.remove("disabled");
        }, 300);
    }

    reset3x3.addEventListener("click", () => {
        create3x3Board();
        const winnerMessage = document.getElementById("winner-message");
        winnerMessage.classList.add("hidden");
        winnerMessage.textContent = "";
        bloquearMenuDificultad(false); // Desbloquear al reiniciar
    });

    backToMenu.addEventListener("click", () => {
        mode3x3.classList.add("hidden");
        gameModes.classList.add("hidden");
        menu.classList.remove("hidden");
        bloquearMenuDificultad(false); // Desbloquear al volver al menú principal
    });

    document.getElementById("three-by-three").addEventListener("click", () => {
        menu.classList.add("hidden");
        gameModes.classList.remove("hidden");
        mode3x3.classList.remove("hidden");
        selectedMode3x3 = null;
        create3x3Board();
    });

    // Seleccionar aleatoriamente el símbolo inicial para cada partida
    function seleccionarSimboloInicial() {
        currentPlayer = Math.random() < 0.5 ? "X" : "O";
        console.log(`El símbolo inicial es: ${currentPlayer}`);
    }

    // Mostrar a quién le toca el turno
    function mostrarTurnoActual() {
        const turnoContainer = document.getElementById("turno-container");
        if (!turnoContainer) {
            console.error("El contenedor 'turno-container' no se encuentra en el DOM.");
            return;
        }
        if (!isVsIA) {
            turnoContainer.textContent = ""; // Limpiar el mensaje si no es VS IA
            return;
        }
        const mensaje = currentPlayer === "X" ? (currentLanguage === 'es' ? "Turno: Usuario" : "Turn: User") : (currentLanguage === 'es' ? "Turno: IA" : "Turn: AI");
        turnoContainer.textContent = mensaje;
    }

    function actualizarTurno() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        mostrarTurnoActual();

        // Si es VS IA y es el turno de la IA, hacer que la IA juegue
        if (isVsIA && currentPlayer === "O") {
            setTimeout(() => {
                makeIAMove();
                currentPlayer = "X"; // Cambiar el turno de vuelta al usuario después del movimiento de la IA
                mostrarTurnoActual(); // Actualizar el turno después del movimiento de la IA
            }, 300);
        }
    }

    // Llamar a mostrarTurnoActual en los momentos clave
    function create3x3Board() {
        board3x3.innerHTML = "";
        boardState = Array(3).fill(null).map(() => Array(3).fill(null));
        seleccionarSimboloInicial(); // Asignar símbolo inicial aleatorio
        document.getElementById("mode-3x3").classList.remove("hidden"); // Asegurarse de que el contenedor esté visible
        mostrarTurnoActual(); // Mostrar el turno inicial
        const warning = document.getElementById("warning-message");
        if (warning) {
            warning.classList.add("hidden");
            warning.textContent = "";
        }
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
                        cell.classList.add("user");
                        const winner = checkWinner();
                        if (winner) {
                            displayWinner(winner);
                        } else {
                            actualizarTurno(); // Actualizar el turno después de cada movimiento
                        }
                    }
                });
                board3x3.appendChild(cell);
            }
        }

        // Si es VS IA y la IA debe empezar
        if (isVsIA && currentPlayer === "O") {
            setTimeout(() => {
                makeIAMove();
                mostrarTurnoActual(); // Asegurar que el turno se actualice después del movimiento inicial de la IA
            }, 300);
        }
    }

    // Lógica para los botones de dificultad
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            iaDifficulty = btn.getAttribute('data-difficulty');
            console.log(`Dificultad seleccionada: ${iaDifficulty}`); // Registro para verificar la selección
        });
    });

    const buttonGroup = document.querySelector('.button-group');
    buttonGroup.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            buttonGroup.querySelectorAll('button').forEach(button => button.classList.remove('active'));
            event.target.classList.add('active');
        }
    });
});