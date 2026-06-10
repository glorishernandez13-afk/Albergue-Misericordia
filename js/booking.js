/* =====================================================================
   MÓDULO DE RESERVAS — Jade García Beauty Studio
   ---------------------------------------------------------------------
   Controla el flujo: Servicio → Profesional → Fecha → Hora → Datos.
   Calcula los horarios REALMENTE disponibles según:
     - horario de cada profesional
     - días libres y feriados
     - duración del servicio elegido
     - buffer (descanso entre citas)
     - granularidad de slots
     - citas ya reservadas de esa profesional (sin choques)

   Toda la persistencia pasa por "BookingBackend" (backend-supabase.js),
   por lo que este módulo no depende de un proveedor concreto.
   ===================================================================== */

const Booking = (() => {
  const cfg = window.CONFIG;
  const agenda = cfg.agenda;

  // Estado de la reserva en curso
  const estado = { paso: 1, servicio: null, profesional: null, fecha: null, hora: null };

  // -------- Utilidades de tiempo --------
  const aMinutos = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };
  const aHHMM = (min) => {
    const h = String(Math.floor(min / 60)).padStart(2, "0");
    const m = String(min % 60).padStart(2, "0");
    return `${h}:${m}`;
  };
  const formatoHora12 = (hhmm) => {
    let [h, m] = hhmm.split(":").map(Number);
    const ampm = h >= 12 ? "p.m." : "a.m.";
    h = h % 12 || 12;
    return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  // Devuelve la lista de servicios "planos" con su categoría
  const todosLosServicios = () => {
    const lista = [];
    cfg.servicios.forEach((cat) =>
      cat.items.forEach((s) => lista.push({ ...s, categoria: cat.categoria }))
    );
    return lista;
  };
  const buscarServicio = (id) => todosLosServicios().find((s) => s.id === id);

  // Profesionales que pueden dar el servicio seleccionado
  const profesionalesPara = (servicioId) =>
    agenda.profesionales.filter(
      (p) => p.servicios.length === 0 || p.servicios.includes(servicioId)
    );

  /* ============================================================
     RENDER DE PASOS
     ============================================================ */
  const el = {};
  function cachearElementos() {
    el.form = document.getElementById("bookingForm");
    el.opcServicio = document.getElementById("opcionesServicio");
    el.opcProfesional = document.getElementById("opcionesProfesional");
    el.fecha = document.getElementById("bookingFecha");
    el.slots = document.getElementById("slotsGrid");
    el.steps = document.getElementById("bookingSteps");
    el.btnAtras = document.getElementById("btnAtras");
    el.btnSiguiente = document.getElementById("btnSiguiente");
    el.btnConfirmar = document.getElementById("btnConfirmar");
    el.feedback = document.getElementById("bookingFeedback");
    el.nav = document.getElementById("bookingNav");
  }

  function renderServicios() {
    el.opcServicio.innerHTML = "";
    todosLosServicios().forEach((s) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "option-card";
      card.setAttribute("role", "radio");
      card.setAttribute("aria-checked", "false");
      card.dataset.id = s.id;
      card.innerHTML = `<div class="opt-title">${s.nombre}</div>
        <div class="opt-sub">${s.categoria} · ${s.duracionMin} min</div>`;
      card.addEventListener("click", () => seleccionarServicio(s.id, card));
      el.opcServicio.appendChild(card);
    });
  }

  function seleccionarServicio(id, card) {
    estado.servicio = buscarServicio(id);
    estado.profesional = null;
    estado.hora = null;
    marcarSeleccion(el.opcServicio, card);
  }

  function renderProfesionales() {
    el.opcProfesional.innerHTML = "";
    const lista = profesionalesPara(estado.servicio.id);
    if (lista.length === 0) {
      el.opcProfesional.innerHTML = `<p class="demo-badge">No hay profesionales para este servicio.</p>`;
      return;
    }
    lista.forEach((p) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "option-card";
      card.setAttribute("role", "radio");
      card.setAttribute("aria-checked", "false");
      card.dataset.id = p.id;
      card.innerHTML = `<div class="opt-title">${p.nombre}</div>
        <div class="opt-sub">${p.especialidad}</div>`;
      card.addEventListener("click", () => {
        estado.profesional = p;
        estado.hora = null;
        marcarSeleccion(el.opcProfesional, card);
      });
      el.opcProfesional.appendChild(card);
    });
  }

  function marcarSeleccion(contenedor, card) {
    contenedor.querySelectorAll(".option-card").forEach((c) => {
      c.classList.remove("selected");
      c.setAttribute("aria-checked", "false");
    });
    card.classList.add("selected");
    card.setAttribute("aria-checked", "true");
  }

  /* ============================================================
     CÁLCULO DE HORARIOS DISPONIBLES
     ============================================================ */
  async function renderSlots() {
    el.slots.innerHTML = `<p class="demo-badge">Buscando horarios disponibles…</p>`;
    const fechaISO = el.fecha.value;
    if (!fechaISO) {
      el.slots.innerHTML = `<p class="demo-badge">Selecciona una fecha.</p>`;
      return;
    }

    const fecha = new Date(fechaISO + "T00:00:00");
    const diaSemana = fecha.getDay(); // 0=Dom ... 6=Sáb
    const prof = estado.profesional;

    // ¿La profesional descansa ese día?
    if (prof.diasLibres.includes(diaSemana)) {
      el.slots.innerHTML = `<p class="demo-badge">${prof.nombre} no atiende ese día. Prueba otra fecha.</p>`;
      return;
    }
    // ¿Es feriado?
    if (agenda.feriados.includes(fechaISO)) {
      el.slots.innerHTML = `<p class="demo-badge">Ese día el salón está cerrado (feriado).</p>`;
      return;
    }

    const dur = estado.servicio.duracionMin;
    const buffer = agenda.bufferMin || 0;
    const paso = agenda.granularidadMin || 30;
    const apertura = aMinutos(prof.horario.inicio);
    const cierre = aMinutos(prof.horario.fin);

    // Citas existentes de esta profesional ese día
    let ocupadas = [];
    try {
      ocupadas = await BookingBackend.listarCitasPorProfesional(prof.id, fechaISO);
    } catch (e) {
      el.slots.innerHTML = `<p class="demo-badge">No se pudieron cargar los horarios. Intenta de nuevo.</p>`;
      return;
    }

    // Si la fecha es hoy, no ofrecer horas ya pasadas
    const ahora = new Date();
    const esHoy = fecha.toDateString() === ahora.toDateString();
    const minutoActual = ahora.getHours() * 60 + ahora.getMinutes();

    const disponibles = [];
    for (let inicio = apertura; inicio + dur <= cierre; inicio += paso) {
      const fin = inicio + dur;
      if (esHoy && inicio <= minutoActual) continue;

      // ¿Choca con alguna cita existente (incluyendo buffer)?
      const choca = ocupadas.some(
        (c) => inicio < c.fin_min + buffer && c.inicio_min - buffer < fin
      );
      if (!choca) disponibles.push({ inicio, fin });
    }

    if (disponibles.length === 0) {
      el.slots.innerHTML = `<p class="demo-badge">No hay horarios disponibles ese día. Prueba otra fecha. 💗</p>`;
      return;
    }

    el.slots.innerHTML = "";
    disponibles.forEach((s) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slot-btn";
      btn.textContent = formatoHora12(aHHMM(s.inicio));
      btn.addEventListener("click", () => {
        estado.hora = { inicio: s.inicio, fin: s.fin, texto: aHHMM(s.inicio) };
        el.slots.querySelectorAll(".slot-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
      });
      el.slots.appendChild(btn);
    });
  }

  /* ============================================================
     NAVEGACIÓN ENTRE PASOS
     ============================================================ */
  function mostrarPaso(n) {
    estado.paso = n;
    el.form.querySelectorAll(".booking-panel").forEach((p) => {
      p.hidden = p.dataset.panel !== String(n);
    });
    // Indicador
    el.steps.querySelectorAll(".booking-step").forEach((s) => {
      const sn = Number(s.dataset.step);
      s.classList.toggle("active", sn === n);
      s.classList.toggle("done", sn < n);
    });
    // Botones
    el.btnAtras.hidden = n === 1;
    el.btnSiguiente.hidden = n === 4;
    el.btnConfirmar.hidden = n !== 4;
    ocultarFeedback();
  }

  function validarPaso(n) {
    if (n === 1 && !estado.servicio) return "Por favor elige un servicio.";
    if (n === 2 && !estado.profesional) return "Por favor elige una profesional.";
    if (n === 3) {
      if (!el.fecha.value) return "Por favor elige una fecha.";
      if (!estado.hora) return "Por favor elige un horario.";
    }
    return null;
  }

  function siguiente() {
    const error = validarPaso(estado.paso);
    if (error) return mostrarFeedback(error, "error");

    const destino = estado.paso + 1;
    if (destino === 2) renderProfesionales();
    if (destino === 3) { el.slots.innerHTML = `<p class="demo-badge">Selecciona una fecha.</p>`; estado.hora = null; }
    mostrarPaso(destino);
  }

  function atras() { if (estado.paso > 1) mostrarPaso(estado.paso - 1); }

  /* ============================================================
     ENVÍO DE LA RESERVA
     ============================================================ */
  async function enviar(e) {
    e.preventDefault();
    const nombre = document.getElementById("bookingNombre").value.trim();
    const telefono = document.getElementById("bookingTelefono").value.trim();
    const comentarios = document.getElementById("bookingComentarios").value.trim();

    if (!nombre) return mostrarFeedback("Por favor escribe tu nombre.", "error");
    if (!telefono || telefono.replace(/\D/g, "").length < 8)
      return mostrarFeedback("Por favor escribe un teléfono válido.", "error");

    el.btnConfirmar.disabled = true;
    el.btnConfirmar.innerHTML = `<span class="spinner"></span> Reservando…`;

    const cita = {
      servicio_id: estado.servicio.id,
      servicio_nombre: estado.servicio.nombre,
      profesional_id: estado.profesional.id,
      profesional_nombre: estado.profesional.nombre,
      fecha: el.fecha.value,
      hora: estado.hora.texto,
      inicio_min: estado.hora.inicio,
      fin_min: estado.hora.fin,
      nombre, telefono, comentarios,
    };

    try {
      const res = await BookingBackend.crearCita(cita);
      if (!res.ok) {
        // Otra clienta tomó ese horario mientras tanto
        mostrarFeedback("¡Lo sentimos! Ese horario acaba de ocuparse. Elige otro, por favor.", "error");
        mostrarPaso(3);
        await renderSlots();
        return;
      }
      mostrarExito(cita);
    } catch (err) {
      mostrarFeedback("Hubo un problema al reservar. Inténtalo de nuevo en un momento.", "error");
    } finally {
      el.btnConfirmar.disabled = false;
      el.btnConfirmar.textContent = "Confirmar cita";
    }
  }

  function mostrarExito(cita) {
    el.form.querySelectorAll(".booking-panel").forEach((p) => (p.hidden = true));
    el.nav.hidden = true;
    el.steps.querySelectorAll(".booking-step").forEach((s) => s.classList.add("done"));
    const panel = el.form.querySelector('[data-panel="success"]');
    panel.hidden = false;

    document.getElementById("successMsg").textContent = agenda.textoConfirmacion;
    document.getElementById("successResumen").innerHTML = `
      <dt>Servicio</dt><dd>${cita.servicio_nombre}</dd>
      <dt>Profesional</dt><dd>${cita.profesional_nombre}</dd>
      <dt>Fecha</dt><dd>${formatearFecha(cita.fecha)}</dd>
      <dt>Hora</dt><dd>${formatoHora12(cita.hora)}</dd>
      <dt>Nombre</dt><dd>${cita.nombre}</dd>`;

    // Enlace de confirmación por WhatsApp con los datos
    const msg = encodeURIComponent(
      `¡Hola! Confirmo mi cita en Jade García Beauty Studio:\n` +
      `• Servicio: ${cita.servicio_nombre}\n` +
      `• Profesional: ${cita.profesional_nombre}\n` +
      `• Fecha: ${formatearFecha(cita.fecha)}\n` +
      `• Hora: ${formatoHora12(cita.hora)}\n` +
      `• A nombre de: ${cita.nombre}`
    );
    document.getElementById("successWhatsApp").href =
      `https://wa.me/${cfg.redes.whatsappNumero}?text=${msg}`;
  }

  function formatearFecha(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("es-SV", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  function reiniciar() {
    estado.paso = 1; estado.servicio = null; estado.profesional = null; estado.fecha = null; estado.hora = null;
    el.form.reset();
    el.nav.hidden = false;
    el.opcServicio.querySelectorAll(".option-card").forEach((c) => c.classList.remove("selected"));
    el.slots.innerHTML = `<p class="demo-badge">Selecciona una fecha.</p>`;
    mostrarPaso(1);
  }

  // -------- Feedback --------
  function mostrarFeedback(msg, tipo) {
    el.feedback.textContent = msg;
    el.feedback.className = `booking-feedback show ${tipo}`;
  }
  function ocultarFeedback() { el.feedback.className = "booking-feedback"; }

  /* ============================================================
     INICIALIZACIÓN
     ============================================================ */
  function init() {
    cachearElementos();
    if (!el.form) return;

    renderServicios();

    // Rango de fechas del input (hoy hasta el máximo de anticipación)
    const hoy = new Date();
    const max = new Date();
    max.setDate(hoy.getDate() + (agenda.diasMaxAnticipacion || 60));
    el.fecha.min = hoy.toISOString().split("T")[0];
    el.fecha.max = max.toISOString().split("T")[0];

    el.fecha.addEventListener("change", () => { estado.hora = null; renderSlots(); });
    el.btnSiguiente.addEventListener("click", siguiente);
    el.btnAtras.addEventListener("click", atras);
    el.form.addEventListener("submit", enviar);
    document.getElementById("successNueva").addEventListener("click", reiniciar);

    // Aviso de modo demostración
    if (BookingBackend.modo === "demo") {
      const badge = document.getElementById("demoBadge");
      if (badge) badge.hidden = false;
    }

    mostrarPaso(1);
  }

  return { init };
})();
