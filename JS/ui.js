// js/ui.js
const UI = {
  selectModo: document.getElementById("selectModo"),
  selectRival: document.getElementById("selectRival"),
  selectDificultad: document.getElementById("selectDificultad"),

  btnIniciar: document.getElementById("btnIniciar"),
  btnReiniciarRonda: document.getElementById("btnReiniciarRonda"),
  btnRendirse: document.getElementById("btnRendirse"),
  btnNuevaSerie: document.getElementById("btnNuevaSerie"),

  inputNombreX: document.getElementById("inputNombreX"),
  inputNombreO: document.getElementById("inputNombreO"),
  textoAyudaO: document.getElementById("textoAyudaO"),

  etiquetaX: document.getElementById("etiquetaX"),
  etiquetaO: document.getElementById("etiquetaO"),
  marcadorX: document.getElementById("marcadorX"),
  marcadorO: document.getElementById("marcadorO"),
  etiquetaRonda: document.getElementById("etiquetaRonda"),

  textoEstado: document.getElementById("textoEstado"),
  insigniaTurno: document.getElementById("insigniaTurno"),

  tablero: document.getElementById("tablero"),

  // ✅ Overlay
  overlaySerieFinalizada: document.getElementById("overlaySerieFinalizada"),
  btnOverlayNuevaSerie: document.getElementById("btnOverlayNuevaSerie"),

  cajaConfirmacion: document.getElementById("cajaConfirmacion"),
  textoConfirmacion: document.getElementById("textoConfirmacion"),
  btnConfirmarSi: document.getElementById("btnConfirmarSi"),
  btnConfirmarNo: document.getElementById("btnConfirmarNo"),

  listaHistorial: document.getElementById("listaHistorial"),
};

function construirTableroUI() {
  UI.tablero.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const col = document.createElement("div");
    col.className = "col-4";

    const btn = document.createElement("button");
    btn.className = "btn btn-outline-dark w-100";
    btn.style.height = "90px";
    btn.style.fontSize = "2rem";
    btn.dataset.indice = String(i);
    btn.disabled = true;
    btn.textContent = "";

    col.appendChild(btn);
    UI.tablero.appendChild(col);
  }
}

function fijarEstado(texto, colorInsignia, textoInsignia) {
  UI.textoEstado.textContent = texto;
  UI.insigniaTurno.className = `badge text-bg-${colorInsignia}`;
  UI.insigniaTurno.textContent = textoInsignia;
}

function renderizarEncabezado() {
  UI.etiquetaX.textContent = `${Juego.jugadores.X.nombre} (X)`;
  UI.etiquetaO.textContent = `${Juego.jugadores.O.nombre} (O)`;

  UI.marcadorX.textContent = String(Juego.victorias.X);
  UI.marcadorO.textContent = String(Juego.victorias.O);
  UI.etiquetaRonda.textContent = Juego.iniciado ? String(Juego.ronda) : "-";

  if (!Juego.iniciado) {
    fijarEstado("Configura y presiona “Iniciar”.", "secondary", "Sin iniciar");
    return;
  }
  if (Juego.bloqueado) return;

  const nombreTurno = Juego.jugadores[Juego.turno].nombre;
  const color = (Juego.turno === "X") ? "primary" : "success";
  fijarEstado(`Turno de ${nombreTurno} (${Juego.turno})`, color, `Turno: ${Juego.turno}`);
}

function renderizarTablero() {
  const botones = UI.tablero.querySelectorAll("button[data-indice]");
  botones.forEach(btn => {
    const idx = Number(btn.dataset.indice);
    btn.textContent = Juego.tablero[idx] || "";

    // bloqueo normal + bloqueo por overlay (serie finalizada)
    btn.disabled = !Juego.iniciado || Juego.bloqueado || Juego.serieFinalizada || Juego.tablero[idx] !== "";

    // reset estilo
    btn.classList.remove("btn-success", "btn-outline-dark");
    btn.classList.add("btn-outline-dark");

    // resaltar línea ganadora
    if (Juego.lineaGanadora && Juego.lineaGanadora.includes(idx)) {
      btn.classList.remove("btn-outline-dark");
      btn.classList.add("btn-success");
    }
  });
}

function renderizarOverlaySerieFinalizada() {
  if (!UI.overlaySerieFinalizada) return;

  if (Juego.iniciado && Juego.serieFinalizada) {
    UI.overlaySerieFinalizada.classList.remove("d-none");
    UI.overlaySerieFinalizada.classList.add("d-flex");
  } else {
    UI.overlaySerieFinalizada.classList.add("d-none");
    UI.overlaySerieFinalizada.classList.remove("d-flex");
  }
}

function renderizarControles() {
  const activo = Juego.iniciado;

  // ✅ Si la serie terminó, solo dejamos "Nueva serie"
  UI.btnReiniciarRonda.disabled = !activo || Juego.serieFinalizada;
  UI.btnRendirse.disabled = !activo || Juego.serieFinalizada;
  UI.btnNuevaSerie.disabled = !activo;

  UI.selectDificultad.disabled = (UI.selectRival.value !== "cpu");
}

function renderizarHistorial() {
  UI.listaHistorial.innerHTML = "";
  if (Juego.historial.length === 0) {
    const li = document.createElement("li");
    li.className = "list-group-item text-muted";
    li.textContent = "Aún no hay rondas registradas.";
    UI.listaHistorial.appendChild(li);
    return;
  }

  const items = [...Juego.historial].reverse();
  for (const h of items) {
    const li = document.createElement("li");
    li.className = "list-group-item";

    let textoResultado = "";
    if (h.resultado === "empate") textoResultado = "Empate";
    else textoResultado = `Ganó ${Juego.jugadores[h.resultado].nombre} (${h.resultado})`;

    li.innerHTML = `<strong>Ronda ${h.ronda}:</strong> ${textoResultado} <span class="text-muted">— ${h.razon}</span>`;
    UI.listaHistorial.appendChild(li);
  }
}

function renderizarTodo() {
  renderizarTablero();
  renderizarEncabezado();
  renderizarControles();
  renderizarHistorial();
  renderizarOverlaySerieFinalizada(); // ✅ NUEVO
}

let accionPendiente = null;

function pedirConfirmacion(mensaje, accion) {
  accionPendiente = accion;
  UI.textoConfirmacion.textContent = mensaje;
  UI.cajaConfirmacion.classList.remove("d-none");
}

function ocultarConfirmacion() {
  accionPendiente = null;
  UI.cajaConfirmacion.classList.add("d-none");
}