/* =====================================================================
   ADMIN.JS — Panel del salón Jade García Beauty Studio
   Login simple, listado/calendario de citas y moderación de testimonios.
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const C = window.CONFIG;
  const SESION_KEY = "jg_admin_sesion";

  const loginView = document.getElementById("adminLogin");
  const panelView = document.getElementById("adminPanel");
  const loginForm = document.getElementById("loginForm");
  const loginFeedback = document.getElementById("loginFeedback");

  /* ================= LOGIN ================= */
  function entrar() {
    loginView.hidden = true;
    panelView.hidden = false;
    const badge = document.getElementById("modoBadge");
    if (BookingBackend.modo === "demo") {
      badge.textContent = "Modo demostración (sin nube)";
      badge.classList.add("demo");
    } else {
      badge.textContent = "Conectado a la nube";
    }
    initPanel();
  }

  // Mantener sesión durante la pestaña abierta
  if (sessionStorage.getItem(SESION_KEY) === "ok") entrar();

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const pass = document.getElementById("adminPass").value;
    if (pass === C.admin.password) {
      sessionStorage.setItem(SESION_KEY, "ok");
      entrar();
    } else {
      loginFeedback.className = "booking-feedback show error";
      loginFeedback.textContent = "Contraseña incorrecta.";
    }
  });

  document.getElementById("btnSalir").addEventListener("click", () => {
    sessionStorage.removeItem(SESION_KEY);
    location.reload();
  });

  /* ================= PANEL ================= */
  let todasLasCitas = [];

  function initPanel() {
    // Pestañas
    document.querySelectorAll(".admin-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".admin-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const destino = tab.dataset.tab;
        document.getElementById("tabCitas").hidden = destino !== "citas";
        document.getElementById("tabTestimonios").hidden = destino !== "testimonios";
        if (destino === "testimonios") cargarTestimonios();
      });
    });

    // Filtro de profesionales
    const selProf = document.getElementById("filtroProfesional");
    selProf.innerHTML = `<option value="">Todas las profesionales</option>` +
      C.agenda.profesionales.map((p) => `<option value="${p.id}">${p.nombre}</option>`).join("");

    document.getElementById("btnRecargar").addEventListener("click", cargarCitas);
    document.getElementById("filtroFecha").addEventListener("change", renderCitas);
    document.getElementById("filtroProfesional").addEventListener("change", renderCitas);
    document.getElementById("filtroEstado").addEventListener("change", renderCitas);
    document.getElementById("btnLimpiar").addEventListener("click", () => {
      document.getElementById("filtroFecha").value = "";
      document.getElementById("filtroProfesional").value = "";
      document.getElementById("filtroEstado").value = "";
      renderCitas();
    });

    cargarCitas();
  }

  async function cargarCitas() {
    const cont = document.getElementById("adminCitas");
    cont.innerHTML = `<div class="admin-empty">Cargando citas…</div>`;
    try {
      todasLasCitas = await BookingBackend.listarTodasLasCitas();
      renderCitas();
    } catch (e) {
      cont.innerHTML = `<div class="admin-empty">No se pudieron cargar las citas. Revisa la conexión con Supabase.</div>`;
    }
  }

  function formatoHora12(hhmm) {
    let [h, m] = hhmm.split(":").map(Number);
    const ampm = h >= 12 ? "p.m." : "a.m.";
    h = h % 12 || 12;
    return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
  }
  function formatearFecha(iso) {
    return new Date(iso + "T00:00:00").toLocaleDateString("es-SV", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
  }

  function renderCitas() {
    const cont = document.getElementById("adminCitas");
    const fFecha = document.getElementById("filtroFecha").value;
    const fProf = document.getElementById("filtroProfesional").value;
    const fEstado = document.getElementById("filtroEstado").value;

    let citas = todasLasCitas.filter((c) => {
      if (fFecha && c.fecha !== fFecha) return false;
      if (fProf && c.profesional_id !== fProf) return false;
      if (fEstado && c.estado !== fEstado) return false;
      return true;
    });

    // Estadísticas
    const stats = {
      total: citas.length,
      pendientes: citas.filter((c) => c.estado === "pendiente").length,
      atendidas: citas.filter((c) => c.estado === "atendida").length,
      canceladas: citas.filter((c) => c.estado === "cancelada").length,
    };
    document.getElementById("adminStats").innerHTML = `
      <div class="stat-card"><div class="num">${stats.total}</div><div class="lbl">Citas</div></div>
      <div class="stat-card"><div class="num">${stats.pendientes}</div><div class="lbl">Pendientes</div></div>
      <div class="stat-card"><div class="num">${stats.atendidas}</div><div class="lbl">Atendidas</div></div>
      <div class="stat-card"><div class="num">${stats.canceladas}</div><div class="lbl">Canceladas</div></div>`;

    if (citas.length === 0) {
      cont.innerHTML = `<div class="admin-empty">No hay citas que coincidan con los filtros. 💗</div>`;
      return;
    }

    // Agrupar por fecha
    const porFecha = {};
    citas.forEach((c) => { (porFecha[c.fecha] = porFecha[c.fecha] || []).push(c); });

    cont.innerHTML = Object.keys(porFecha).sort().map((fecha) => {
      const filas = porFecha[fecha]
        .sort((a, b) => a.hora.localeCompare(b.hora))
        .map((c) => citaRowHTML(c)).join("");
      return `<div class="dia-grupo">
        <h3 class="dia-titulo">${formatearFecha(fecha)}</h3>${filas}</div>`;
    }).join("");

    // Listeners de acciones
    cont.querySelectorAll("[data-accion]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const { id, accion } = btn.dataset;
        btn.disabled = true;
        await BookingBackend.actualizarEstadoCita(id, accion);
        await cargarCitas();
      });
    });
  }

  function citaRowHTML(c) {
    const tel = (c.telefono || "").replace(/\D/g, "");
    const acciones = c.estado === "pendiente"
      ? `<button class="btn-atender" data-accion="atendida" data-id="${c.id}">✓ Atendida</button>
         <button class="btn-cancelar" data-accion="cancelada" data-id="${c.id}">✕ Cancelar</button>`
      : `<span class="estado-pill ${c.estado}">${c.estado}</span>`;
    return `<div class="cita-row estado-${c.estado}">
      <div class="cita-hora">${formatoHora12(c.hora)}<small>${c.servicio_nombre ? "" : ""}</small></div>
      <div class="cita-info">
        <h4>${c.nombre}</h4>
        <div class="meta">${c.servicio_nombre} · ${c.profesional_nombre}</div>
        <div class="tel">📞 <a href="https://wa.me/${tel}" target="_blank" rel="noopener">${c.telefono}</a></div>
        ${c.comentarios ? `<div class="coment">“${c.comentarios}”</div>` : ""}
      </div>
      <div class="cita-acciones">${acciones}</div>
    </div>`;
  }

  /* ================= TESTIMONIOS ================= */
  async function cargarTestimonios() {
    const cont = document.getElementById("adminTestimonios");
    cont.innerHTML = `<div class="admin-empty">Cargando testimonios…</div>`;
    let lista = [];
    try {
      lista = await BookingBackend.listarTestimonios(false);
    } catch (e) {
      cont.innerHTML = `<div class="admin-empty">No se pudieron cargar los testimonios.</div>`;
      return;
    }
    if (lista.length === 0) {
      cont.innerHTML = `<div class="admin-empty">Aún no hay testimonios enviados por clientas.</div>`;
      return;
    }
    cont.innerHTML = lista.map((t) => {
      const stars = "★".repeat(t.estrellas) + "☆".repeat(5 - t.estrellas);
      const acciones = t.estado === "aprobado"
        ? `<button class="btn-cancelar" data-tid="${t.id}" data-estado="pendiente">Ocultar</button>`
        : `<button class="btn-atender" data-tid="${t.id}" data-estado="aprobado">Aprobar</button>
           <button class="btn-cancelar" data-tid="${t.id}" data-estado="rechazado">Rechazar</button>`;
      return `<div class="admin-test-card">
        <div class="stars">${stars}</div>
        <p>“${t.comentario}”</p>
        <div class="autor">— ${t.nombre} <span class="estado-pill ${t.estado === "aprobado" ? "atendida" : "pendiente"}">${t.estado}</span></div>
        <div class="acciones">${acciones}</div>
      </div>`;
    }).join("");

    cont.querySelectorAll("[data-tid]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        btn.disabled = true;
        await BookingBackend.actualizarEstadoTestimonio(btn.dataset.tid, btn.dataset.estado);
        cargarTestimonios();
      });
    });
  }
});
