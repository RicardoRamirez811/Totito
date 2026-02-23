// js/estado.js
const Juego = {
  // Configuración
  modo: "unica",           // unica | mejorDe3
  rival: "jugador",        // jugador | cpu
  dificultad: "facil",     // facil | medio | dificil
  victoriasNecesarias: 1,

  // Jugadores
  jugadores: {
    X: { nombre: "Jugador 1", esCPU: false },
    O: { nombre: "Jugador 2", esCPU: false },
  },

  // Partida
  tablero: Array(9).fill(""),
  turno: "X",
  iniciado: false,
  bloqueado: false,

  // Serie
  ronda: 0,
  victorias: { X: 0, O: 0 },
  serieFinalizada: false, // ✅ NUEVO

  // Resaltado
  lineaGanadora: null, // [a,b,c] o null

  // Historial
  historial: [], // { ronda, resultado: "X"|"O"|"empate", razon }
};