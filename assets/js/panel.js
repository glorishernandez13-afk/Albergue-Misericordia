/* ============================================================
   ALBERGUE MISERICORDIA — Lógica del PANEL interno
   ------------------------------------------------------------
   - Protege el acceso (requiere haber iniciado sesión).
   - Dibuja el calendario mensual con eventos.
   - Clasifica cada actividad como PASADA, ACTUAL o FUTURA
     comparando su fecha con el día de hoy.
   - Muestra el detalle de la actividad en un modal.
   - Lista los archivos privados.

   Los datos vienen de: data/actividades.js y data/archivos.js
   ============================================================ */

/* 1) Protección de acceso (definida en auth.js) */
const usuarioActivo = protegerPanel();
if (usuarioActivo) {
  document.getElementById("saludo").textContent = "Hola, " + usuarioActivo;
}
document.getElementById("btn-salir").addEventListener("click", cerrarSesion);

/* ------------------------------------------------------------
   2) Utilidades de fecha
   ------------------------------------------------------------ */
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const MESES_CORTO = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
const DIAS = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

const HOY = new Date();
HOY.setHours(0, 0, 0, 0);

// Convierte "AAAA-MM-DD" en objeto Date (a medianoche, hora local)
function aFecha(texto) {
  const [a, m, d] = texto.split("-").map(Number);
  return new Date(a, m - 1, d);
}

// Devuelve "pasado" | "actual" | "futuro" para una actividad
function estadoActividad(act) {
  const inicio = aFecha(act.fecha);
  const fin = act.fechaFin ? aFecha(act.fechaFin) : inicio;
  if (fin < HOY) return "pasado";
  if (inicio <= HOY && HOY <= fin) return "actual";
  return "futuro";
}

const ETIQUETAS = { pasado: "Pasada", actual: "En curso", futuro: "Próxima" };

/* ------------------------------------------------------------
   3) Calendario mensual
   ------------------------------------------------------------ */
let mesActual = HOY.getMonth();
let anioActual = HOY.getFullYear();

function dibujarCalendario() {
  const grid = document.getElementById("cal-grid");
  document.getElementById("cal-titulo").textContent = MESES[mesActual] + " " + anioActual;
  grid.innerHTML = "";

  // Encabezados de días
  DIAS.forEach((d) => {
    const c = document.createElement("div");
    c.className = "cal-dianombre";
    c.textContent = d;
    grid.appendChild(c);
  });

  const primerDia = new Date(anioActual, mesActual, 1).getDay(); // 0=Dom
  const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();

  // Celdas vacías antes del día 1
  for (let i = 0; i < primerDia; i++) {
    const v = document.createElement("div");
    v.className = "cal-celda vacia";
    grid.appendChild(v);
  }

  // Celdas de cada día
  for (let dia = 1; dia <= diasEnMes; dia++) {
    const celda = document.createElement("div");
    celda.className = "cal-celda";

    const fechaCelda = new Date(anioActual, mesActual, dia);
    if (fechaCelda.getTime() === HOY.getTime()) celda.classList.add("hoy");

    const num = document.createElement("div");
    num.className = "numero";
    num.textContent = dia;
    celda.appendChild(num);

    // Eventos que caen en este día
    ACTIVIDADES.forEach((act, idx) => {
      const inicio = aFecha(act.fecha);
      const fin = act.fechaFin ? aFecha(act.fechaFin) : inicio;
      if (fechaCelda >= inicio && fechaCelda <= fin) {
        const estado = estadoActividad(act);
        const btn = document.createElement("button");
        btn.className = "cal-evento ev-" + estado;
        btn.textContent = act.titulo;
        btn.title = act.titulo;
        btn.addEventListener("click", () => abrirModal(idx));
        celda.appendChild(btn);
      }
    });

    grid.appendChild(celda);
  }
}

document.getElementById("cal-prev").addEventListener("click", () => {
  mesActual--;
  if (mesActual < 0) { mesActual = 11; anioActual--; }
  dibujarCalendario();
});
document.getElementById("cal-next").addEventListener("click", () => {
  mesActual++;
  if (mesActual > 11) { mesActual = 0; anioActual++; }
  dibujarCalendario();
});

/* ------------------------------------------------------------
   4) Lista de próximas actividades (futuras y actuales)
   ------------------------------------------------------------ */
function dibujarProximas() {
  const cont = document.getElementById("lista-proximas");
  cont.innerHTML = "";

  const proximas = ACTIVIDADES
    .map((act, idx) => ({ act, idx, estado: estadoActividad(act) }))
    .filter((x) => x.estado !== "pasado")
    .sort((a, b) => aFecha(a.act.fecha) - aFecha(b.act.fecha));

  if (proximas.length === 0) {
    cont.innerHTML = '<p class="ayuda">No hay actividades próximas registradas.</p>';
    return;
  }

  proximas.forEach(({ act, idx, estado }) => {
    const f = aFecha(act.fecha);
    const fila = document.createElement("button");
    fila.className = "actividad-fila";
    fila.addEventListener("click", () => abrirModal(idx));
    fila.innerHTML = `
      <div class="actividad-fecha">
        <div class="dia">${f.getDate()}</div>
        <div class="mes">${MESES_CORTO[f.getMonth()]}</div>
      </div>
      <div style="flex:1">
        <strong>${act.titulo}</strong><br>
        <span class="ayuda">📍 ${act.lugar}</span>
      </div>
      <span class="etiqueta ${estado}">${ETIQUETAS[estado]}</span>
    `;
    cont.appendChild(fila);
  });
}

/* ------------------------------------------------------------
   5) Modal de detalle
   ------------------------------------------------------------ */
const modal = document.getElementById("modal");
function abrirModal(idx) {
  const act = ACTIVIDADES[idx];
  const estado = estadoActividad(act);
  const f = aFecha(act.fecha);
  let fechaTexto = `${f.getDate()} de ${MESES[f.getMonth()]} de ${f.getFullYear()}`;
  if (act.fechaFin) {
    const ff = aFecha(act.fechaFin);
    fechaTexto += ` al ${ff.getDate()} de ${MESES[ff.getMonth()]}`;
  }

  document.getElementById("modal-titulo").textContent = act.titulo;
  document.getElementById("modal-cuerpo").innerHTML = `
    <p><span class="etiqueta ${estado}">${ETIQUETAS[estado]}</span></p>
    <div class="modal-dato"><span class="ico">📅</span> <span>${fechaTexto}</span></div>
    <div class="modal-dato"><span class="ico">📍</span> <span>${act.lugar}</span></div>
    <div class="modal-dato"><span class="ico">👤</span> <span>${act.responsables}</span></div>
    <p style="margin-top:1rem">${act.descripcion}</p>
  `;
  modal.classList.add("abierto");
}
function cerrarModal() { modal.classList.remove("abierto"); }
document.getElementById("modal-cerrar").addEventListener("click", cerrarModal);
modal.addEventListener("click", (e) => { if (e.target === modal) cerrarModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarModal(); });

/* ------------------------------------------------------------
   6) Tabla de archivos privados
   ------------------------------------------------------------ */
function dibujarArchivos() {
  const body = document.getElementById("tabla-archivos-body");
  body.innerHTML = "";
  ARCHIVOS.forEach((arch) => {
    const tr = document.createElement("tr");
    const descargable = arch.ruta && arch.ruta !== "#";
    tr.innerHTML = `
      <td><strong>📄 ${arch.nombre}</strong></td>
      <td>${arch.descripcion}</td>
      <td>${arch.tipo}</td>
      <td>${arch.tamano}</td>
      <td>${
        descargable
          ? `<a class="btn btn--secundario" style="padding:.4rem .9rem" href="${arch.ruta}" download>Descargar</a>`
          : `<span class="ayuda">Sin archivo</span>`
      }</td>
    `;
    body.appendChild(tr);
  });
}

/* ------------------------------------------------------------
   7) Pestañas
   ------------------------------------------------------------ */
document.querySelectorAll(".panel-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".panel-tab").forEach((t) => t.setAttribute("aria-selected", "false"));
    document.querySelectorAll(".panel-pane").forEach((p) => p.classList.remove("activo"));
    tab.setAttribute("aria-selected", "true");
    document.getElementById("pane-" + tab.dataset.pane).classList.add("activo");
  });
});

/* ------------------------------------------------------------
   8) Inicializar
   ------------------------------------------------------------ */
if (usuarioActivo) {
  dibujarCalendario();
  dibujarProximas();
  dibujarArchivos();
}
