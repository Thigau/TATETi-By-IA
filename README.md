# Informe de Desarrollo del Proyecto TATETi-By-IA

Este documento detalla el proceso de desarrollo del juego interactivo de Ta-Te-Ti, destacando los cambios realizados y las decisiones tomadas durante su implementación.

## Introducción

El proyecto TATETi-By-IA es un juego interactivo desarrollado utilizando tecnologías web como HTML, CSS y JavaScript. El objetivo principal fue crear una experiencia de usuario sencilla y funcional que permita jugar al clásico juego de Ta-Te-Ti en un entorno digital.

## Proceso de Desarrollo

### 1. Subida Inicial del Proyecto
Se realizó la subida inicial del proyecto al repositorio de GitHub, estableciendo la base para el control de versiones y la colaboración futura.

### 2. Creación de la Estructura Básica
Se generaron los archivos principales del proyecto:
- `index.html`: Contiene la estructura HTML del juego.
- `tateti.css`: Define los estilos visuales del tablero y los elementos del juego.
- `tateti.js`: Implementa la lógica del juego.

### 3. Implementación de la Interfaz Gráfica
Se diseñó la interfaz gráfica del tablero de Ta-Te-Ti en el archivo `index.html`, asegurando una disposición clara y funcional. Los estilos básicos se aplicaron en `tateti.css` para mejorar la experiencia visual.

### 4. Desarrollo de la Lógica del Juego
En el archivo `tateti.js` se implementaron las reglas básicas del juego, incluyendo:
- Manejo de turnos entre los jugadores.
- Detección de combinaciones ganadoras.
- Gestión de empates.

### 5. Pruebas y Corrección de Errores
Se realizaron pruebas manuales para verificar el correcto funcionamiento del juego. Durante esta etapa, se identificaron y corrigieron errores en la lógica y la interfaz.

### 6. Documentación Inicial
Se creó este archivo `README.md` para documentar el proceso de desarrollo y proporcionar una visión general del proyecto.

## Cambios Recientes

### 7. Implementación de la Selección de Dificultad
Se agregó un menú desplegable para seleccionar el nivel de dificultad de la IA. Los niveles disponibles son:
- Fácil
- Normal
- Difícil
- Imposible

### 8. Bloqueo del Menú de Dificultad Durante la Partida
El menú de selección de dificultad ahora se bloquea automáticamente durante la partida en el modo VS IA. Se desbloquea al reiniciar el juego, cambiar al modo PvP o regresar al menú principal.

### 9. Indicador Visual de Bloqueo
Cuando el menú de selección de dificultad está bloqueado, el cursor cambia a un estilo visual de "no permitido" (`not-allowed`) al pasar sobre él, indicando al usuario que no puede interactuar con el menú en ese momento.


