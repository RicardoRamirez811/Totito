// js/ia.js

function intentarJugadaCPU() {
  if (!Juego.iniciado || Juego.bloqueado) return;
  if (!Juego.jugadores[Juego.turno].esCPU) return;

  setTimeout(() => {
    let jugada = null;

    if (Juego.dificultad === "facil") jugada = cpuFacil();
    else if (Juego.dificultad === "medio") jugada = cpuMedio();
    else jugada = cpuDificilMinimax(); // dificil

    if (jugada !== null) jugarEn(jugada);
  }, 350);
}

function cpuFacil() {
  const vacias = obtenerCasillasVacias(Juego.tablero);
  if (vacias.length === 0) return null;
  return vacias[Math.floor(Math.random() * vacias.length)];
}

// Heurística medio:
// 1) ganar, 2) bloquear, 3) centro, 4) esquinas, 5) lados
function cpuMedio() {
  const cpu = Juego.turno;
  const humano = (cpu === "X") ? "O" : "X";

  const ganar = encontrarJugadaGanadora(Juego.tablero, cpu);
  if (ganar !== null) return ganar;

  const bloquear = encontrarJugadaGanadora(Juego.tablero, humano);
  if (bloquear !== null) return bloquear;

  if (Juego.tablero[4] === "") return 4;

  const esquinas = [0,2,6,8].filter(i => Juego.tablero[i] === "");
  if (esquinas.length) return esquinas[Math.floor(Math.random() * esquinas.length)];

  const lados = [1,3,5,7].filter(i => Juego.tablero[i] === "");
  if (lados.length) return lados[Math.floor(Math.random() * lados.length)];

  return null;
}

/*
  DIFÍCIL (Minimax):
  - CPU juega óptimo (siempre busca ganar o empatar).
  - Para evitar “siempre la misma primera jugada”, si hay empate de puntajes
    se elige aleatoriamente entre las mejores.
*/
function cpuDificilMinimax() {
  const cpu = Juego.turno;
  const humano = (cpu === "X") ? "O" : "X";

  const vacias = obtenerCasillasVacias(Juego.tablero);
  if (vacias.length === 0) return null;

  let mejorPuntaje = -Infinity;
  let mejoresJugadas = [];

  for (const idx of vacias) {
    const copia = Juego.tablero.slice();
    copia[idx] = cpu;

    const puntaje = minimax(copia, 0, false, cpu, humano);

    if (puntaje > mejorPuntaje) {
      mejorPuntaje = puntaje;
      mejoresJugadas = [idx];
    } else if (puntaje === mejorPuntaje) {
      mejoresJugadas.push(idx);
    }
  }

  return mejoresJugadas[Math.floor(Math.random() * mejoresJugadas.length)];
}

// Minimax estándar: CPU maximiza, Humano minimiza
// Puntajes: ganar CPU = 10 - profundidad, ganar humano = profundidad - 10, empate = 0
function minimax(tablero, profundidad, esMaximizador, cpu, humano) {
  const info = obtenerInfoGanador(tablero);
  if (info) {
    if (info.ganador === cpu) return 10 - profundidad;
    if (info.ganador === humano) return profundidad - 10;
  }
  if (esEmpate(tablero)) return 0;

  const vacias = obtenerCasillasVacias(tablero);

  if (esMaximizador) {
    let mejor = -Infinity;
    for (const idx of vacias) {
      const copia = tablero.slice();
      copia[idx] = cpu;
      mejor = Math.max(mejor, minimax(copia, profundidad + 1, false, cpu, humano));
    }
    return mejor;
  } else {
    let mejor = Infinity;
    for (const idx of vacias) {
      const copia = tablero.slice();
      copia[idx] = humano;
      mejor = Math.min(mejor, minimax(copia, profundidad + 1, true, cpu, humano));
    }
    return mejor;
  }
}

function obtenerCasillasVacias(tablero) {
  const res = [];
  for (let i = 0; i < tablero.length; i++) {
    if (tablero[i] === "") res.push(i);
  }
  return res;
}

function encontrarJugadaGanadora(tablero, jugador) {
  const vacias = obtenerCasillasVacias(tablero);
  for (const idx of vacias) {
    const copia = tablero.slice();
    copia[idx] = jugador;
    const info = obtenerInfoGanador(copia);
    if (info && info.ganador === jugador) return idx;
  }
  return null;
}