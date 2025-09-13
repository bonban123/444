// ------------------------------
// 🎮 Juego de Memoria en JS
// ------------------------------

// Lista de emojis (6 pares → 12 cartas)
const emojis = ["🍎","🍌","🍇","🍓","🍉","🍍"];
let cartas = [...emojis, ...emojis]; // duplicamos para formar pares

// Variables de control
let primeraCarta = null;
let segundaCarta = null;
let bloqueo = false;
let intentos = 0;
let paresEncontrados = 0;

// Temporizador
let tiempo = 0;
let temporizador = null;
let juegoIniciado = false;
let limiteTiempo = 60; // ⏳límite de segundos
document.getElementById("limite").textContent = limiteTiempo;
// Referencias al DOM
const tablero = document.getElementById("tablero");
const intentosHTML = document.getElementById("intentos");
const tiempoHTML = document.getElementById("tiempo");
const victoria = document.getElementById("victoria");
const finalIntentos = document.getElementById("final-intentos");
const finalTiempo = document.getElementById("final-tiempo");
const btnReiniciar = document.getElementById("reiniciar");

// ------------------------------
// 🔀 Mezclar cartas (Fisher-Yates)
// ------------------------------
function mezclar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ------------------------------
// 🃏 Crear tablero
// ------------------------------
function crearTablero() {
  tablero.innerHTML = "";
  cartas = mezclar(cartas);

  cartas.forEach((emoji) => {
    const carta = document.createElement("div");
    carta.classList.add("carta");
    carta.dataset.valor = emoji;

    carta.innerHTML = `
      <div class="carta-inner">
        <div class="carta-front">${emoji}</div>
        <div class="carta-back">❓</div>
      </div>
    `;

    carta.addEventListener("click", () => voltearCarta(carta));
    tablero.appendChild(carta);
  });
}

// ------------------------------
// ⏱️ Temporizador con límite
// ------------------------------
function iniciarTemporizador() {
  if (!juegoIniciado) {
    juegoIniciado = true;
    temporizador = setInterval(() => {
      tiempo++;
      tiempoHTML.textContent = tiempo;

      // ⏳ Si se acaba el tiempo
      if (tiempo >= limiteTiempo) {
        clearInterval(temporizador);
        alert("⏳ Se acabó el tiempo. El juego se reiniciará.");
        reiniciarJuego();
      }
    }, 1000);
  }
}

// ------------------------------
// 🔄 Reiniciar juego
// ------------------------------
function reiniciarJuego() {
  intentos = 0;
  paresEncontrados = 0;
  tiempo = 0;
  juegoIniciado = false;
  clearInterval(temporizador);

  intentosHTML.textContent = 0;
  tiempoHTML.textContent = 0;
  victoria.classList.add("oculto");

  crearTablero();
}

// ------------------------------
// 🎴 Voltear carta
// ------------------------------
function voltearCarta(carta) {
  if (bloqueo || carta.classList.contains("volteada")) return;

  iniciarTemporizador();
  carta.classList.add("volteada");

  if (!primeraCarta) {
    primeraCarta = carta;
  } else if (!segundaCarta) {
    segundaCarta = carta;
    intentos++;
    intentosHTML.textContent = intentos;

    verificarPareja();
  }
}

// ------------------------------
// ✅ Verificar pareja
// ------------------------------
function verificarPareja() {
  const valor1 = primeraCarta.dataset.valor;
  const valor2 = segundaCarta.dataset.valor;

  if (valor1 === valor2) {
    paresEncontrados++;
    primeraCarta = null;
    segundaCarta = null;

    if (paresEncontrados === emojis.length) {
      ganar();
    }
  } else {
    bloqueo = true;
    setTimeout(() => {
      primeraCarta.classList.remove("volteada");
      segundaCarta.classList.remove("volteada");
      primeraCarta = null;
      segundaCarta = null;
      bloqueo = false;
    }, 1000);
  }
}

// ------------------------------
// 🏆 Victoria
// ------------------------------
function ganar() {
  clearInterval(temporizador);
  finalIntentos.textContent = intentos;
  finalTiempo.textContent = tiempo;
  victoria.classList.remove("oculto");
}

// ------------------------------
// 🚀 Inicializar
// ------------------------------
btnReiniciar.addEventListener("click", reiniciarJuego);
reiniciarJuego();