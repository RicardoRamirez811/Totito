// js/logicaJuego.js

function aplicarConfiguracionDesdeUI() {
  Juego.modo = UI.selectModo.value;
  Juego.rival = UI.selectRival.value;
  Juego.dificultad = UI.selectDificultad.value;

  Juego.victoriasNecesarias = (Juego.modo === "mejorDe3") ? 2 : 1;

  const nombreX = (UI.inputNombreX.value || "Jugador 1").trim();
  const nombreOPorDefecto = (Juego.rival === "cpu") ? "CPU" : "Jugador 2";
  const nombreO = (UI.inputNombreO.value || nombreOPorDefecto).trim();

  Juego.jugadores.X.nombre = nombreX;
  Juego.jugadores.O.nombre = nombreO;

  Juego.jugadores.X.esCPU = false;
  Juego.jugadores.O.esCPU = (Juego.rival === "cpu");
}

function reiniciarEstadoSerie() {
  Juego.victorias = { X: 0, O: 0 };
  Juego.ronda = 0;

  Juego.tablero = Array(9).fill("");
  Juego.turno = "X";

  Juego.lineaGanadora = null;
  Juego.historial = [];

  Juego.bloqueado = false;
  Juego.iniciado = false;

  Juego.serieFinalizada = false; // ✅ IMPORTANTE
}

function iniciarJuego() {
  aplicarConfiguracionDesdeUI();
  reiniciarEstadoSerie();
  Juego.iniciado = true;
  iniciarNuevaRonda();
}

function iniciarNuevaRonda() {
  // ✅ Evitar rondas extra cuando ya terminó la serie
  if (Juego.serieFinalizada) {
    fijarEstado("La serie ya terminó. Presiona “Nueva serie” para volver a jugar.", "secondary", "Serie finalizada");
    renderizarTodo();
    return;
  }

  Juego.ronda += 1;
  Juego.tablero = Array(9).fill("");
  Juego.lineaGanadora = null;

  // alternar quién inicia
  Juego.turno = (Juego.ronda % 2 === 1) ? "X" : "O";

  Juego.bloqueado = false;

  const nombreInicial = Juego.jugadores[Juego.turno].nombre;
  fijarEstado(`Ronda ${Juego.ronda} iniciada. Turno de ${nombreInicial} (${Juego.turno}).`, "info", "Ronda activa");

  renderizarTodo();
  intentarJugadaCPU();
}

function manejarJugada(indice) {
  if (!Juego.iniciado || Juego.bloqueado || Juego.serieFinalizada) return;
  if (Juego.tablero[indice] !== "") return;

  // si es CPU y el usuario intenta jugar en su turno, ignorar
  if (Juego.jugadores[Juego.turno].esCPU) return;

  jugarEn(indice);
}

function jugarEn(indice) {
  if (Juego.tablero[indice] !== "" || Juego.bloqueado || Juego.serieFinalizada) return;

  Juego.tablero[indice] = Juego.turno;

  const infoGanador = obtenerInfoGanador(Juego.tablero);
  if (infoGanador) {
    Juego.lineaGanadora = infoGanador.linea;
    finalizarRonda(infoGanador.ganador, "ganó por línea de 3.");
    return;
  }

  if (esEmpate(Juego.tablero)) {
    finalizarRonda("empate", "la ronda terminó en empate.");
    return;
  }

  alternarTurno();
  renderizarTodo();
  intentarJugadaCPU();
}

function alternarTurno() {
  Juego.turno = (Juego.turno === "X") ? "O" : "X";
}

function obtenerInfoGanador(tablero) {
  const lineas = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (const linea of lineas) {
    const [a, b, c] = linea;
    if (tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
      return { ganador: tablero[a], linea };
    }
  }
  return null;
}

function esEmpate(tablero) {
  return tablero.every(celda => celda !== "");
}

function finalizarRonda(resultado, textoRazon) {
  Juego.bloqueado = true;

  if (resultado === "X" || resultado === "O") {
    Juego.victorias[resultado] += 1;
    const nombre = Juego.jugadores[resultado].nombre;
    fijarEstado(`${nombre} (${resultado}) ${textoRazon}`, "warning", "Ronda finalizada");
  } else {
    fijarEstado(`Empate: ${textoRazon}`, "warning", "Ronda finalizada");
  }

  // historial
  Juego.historial.push({
    ronda: Juego.ronda,
    resultado,
    razon: textoRazon,
  });

  renderizarTodo();

  // ¿terminó la serie?
  if (Juego.victorias.X >= Juego.victoriasNecesarias || Juego.victorias.O >= Juego.victoriasNecesarias) {
    finalizarSerie();
  }
}

function finalizarSerie() {
  const ganador = (Juego.victorias.X > Juego.victorias.O) ? "X" : "O";
  const nombre = Juego.jugadores[ganador].nombre;

  fijarEstado(
    `¡Serie terminada! Ganador: ${nombre} (${ganador}) — Marcador ${Juego.victorias.X}-${Juego.victorias.O}.`,
    "dark",
    "Serie finalizada"
  );

  Juego.bloqueado = true;
  Juego.serieFinalizada = true; // ✅ IMPORTANTE

  renderizarTodo();
}

function reiniciarRonda() {
  if (!Juego.iniciado) return;

  // ✅ Si la serie terminó, no se permite reiniciar ronda
  if (Juego.serieFinalizada) {
    fijarEstado("La serie ya terminó. Presiona “Nueva serie” para volver a jugar.", "secondary", "Serie finalizada");
    renderizarTodo();
    return;
  }

  iniciarNuevaRonda();
  ocultarConfirmacion();
}

function nuevaSerie() {
  if (!Juego.iniciado) return;

  aplicarConfiguracionDesdeUI();

  Juego.victorias = { X: 0, O: 0 };
  Juego.ronda = 0;
  Juego.historial = [];

  Juego.serieFinalizada = false; // ✅ IMPORTANTE
  Juego.bloqueado = false;

  iniciarNuevaRonda();
  ocultarConfirmacion();
}

function rendirseTurnoActual() {
  if (!Juego.iniciado || Juego.bloqueado || Juego.serieFinalizada) return;

  const perdedor = Juego.turno;
  const ganador = (perdedor === "X") ? "O" : "X";

  // al rendirse no hay línea ganadora
  Juego.lineaGanadora = null;

  finalizarRonda(ganador, "ganó porque el rival se rindió.");
}