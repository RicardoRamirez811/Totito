// js/app.js

function enlazarEventos() {
  UI.selectRival.addEventListener("change", () => {
    const esCPU = (UI.selectRival.value === "cpu");
    UI.selectDificultad.disabled = !esCPU;

    if (esCPU) {
      if (!UI.inputNombreO.value || UI.inputNombreO.value.trim() === "Jugador 2") {
        UI.inputNombreO.value = "CPU";
      }
      UI.textoAyudaO.textContent = "En CPU, el Jugador 2 se controla automáticamente.";
    } else {
      UI.textoAyudaO.textContent = "En CPU, este será el nombre de la máquina.";
    }
  });

  UI.btnIniciar.addEventListener("click", () => {
    pedirConfirmacion("¿Confirmas iniciar el juego? (Reinicia marcador, tablero e historial)", () => {
      ocultarConfirmacion();
      iniciarJuego();
    });
  });

  UI.btnReiniciarRonda.addEventListener("click", () => {
    pedirConfirmacion("¿Reiniciar la ronda? (Limpia tablero y pasa a nueva ronda)", () => {
      ocultarConfirmacion();
      reiniciarRonda();
    });
  });

  UI.btnNuevaSerie.addEventListener("click", () => {
    pedirConfirmacion("¿Iniciar una nueva serie? (Marcador e historial vuelven a 0)", () => {
      ocultarConfirmacion();
      nuevaSerie();
    });
  });

  UI.btnRendirse.addEventListener("click", () => {
    if (!Juego.iniciado || Juego.bloqueado) return;
    const nombre = Juego.jugadores[Juego.turno].nombre;
    pedirConfirmacion(`¿${nombre} (${Juego.turno}) se rinde? (Perderá la ronda)`, () => {
      ocultarConfirmacion();
      rendirseTurnoActual();
    });
  });

  UI.btnConfirmarSi.addEventListener("click", () => {
    if (typeof accionPendiente === "function") accionPendiente();
  });

  UI.btnConfirmarNo.addEventListener("click", () => {
    ocultarConfirmacion();
  });

  UI.btnOverlayNuevaSerie.addEventListener("click", () => {
  pedirConfirmacion("¿Iniciar una nueva serie? (Marcador e historial vuelven a 0)", () => {
    ocultarConfirmacion();
    nuevaSerie();
  });
});

  UI.tablero.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-indice]");
    if (!btn) return;
    manejarJugada(Number(btn.dataset.indice));
  });
}

function iniciarApp() {
  construirTableroUI();
  enlazarEventos();
  renderizarTodo();
}

iniciarApp();