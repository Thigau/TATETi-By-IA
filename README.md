# 🕹️ Tateti Interactive Game (v1.0)

¡Bienvenido a la versión 1.0 de Tateti Interactivo!

## 🚀 Características principales
- **Modos de juego:**
  - 3x3 (PvP y Vs IA)
  - 5x5 y Personalizado (solo PvP)
- **Dificultad IA ajustable:**
  - Fácil: IA muy ganable, solo ve el próximo movimiento.
  - Normal: IA ve dos movimientos adelante, puede cometer errores.
  - Difícil: IA ve cuatro movimientos adelante, es desafiante pero ganable.
  - Imposible: IA perfecta, nunca pierde (Minimax sin límite).
- **Interfaz intuitiva:**
  - Botones grandes y menú de dificultad con estilo consistente.
  - Mensajes claros para selección de modo y final de partida.
- **Soporte multilenguaje:** Español e Inglés.
- **Responsive:** Adaptado para escritorio y móvil.

## 🎮 Cómo jugar
1. Elige el modo de juego desde el menú principal.
2. En 3x3, selecciona PvP o Vs IA. Si eliges Vs IA, selecciona la dificultad.
3. Haz clic en una celda vacía para colocar tu símbolo (❌ o ⭕).
4. El objetivo es alinear tres símbolos en fila, columna o diagonal.
5. El juego se reinicia automáticamente al terminar una partida.

## 🧠 Sobre la IA
- La IA utiliza el algoritmo Minimax con profundidad limitada según la dificultad.
- En Imposible, la IA es invencible.
- En niveles bajos, la IA puede cometer errores y es posible ganarle.

## 📂 Estructura del Proyecto
- `game/index.html`: Interfaz principal del juego.
- `game/tateti.css`: Estilos visuales.
- `game/tateti.js`: Lógica del juego y de la IA.

## 🛠️ Requisitos
- Navegador web moderno (Chrome, Firefox, Edge, etc.).

---

¡Disfruta del clásico Tateti con IA ajustable y desafía tus habilidades!
