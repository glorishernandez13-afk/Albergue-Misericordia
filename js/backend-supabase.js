/* =====================================================================
   ADAPTADOR DE BACKEND — Jade García Beauty Studio
   ---------------------------------------------------------------------
   Este archivo aísla TODO el acceso a la base de datos. El resto del
   sitio (booking.js, admin.js) habla solo con "BookingBackend" y NO sabe
   si por debajo hay Supabase, modo demostración u otro proveedor.

   👉 Para cambiar de proveedor (Firebase, Calendly, etc.) en el futuro,
      basta con reescribir este archivo respetando los mismos métodos:
        - listarCitasPorProfesional(profesionalId, fechaISO)
        - crearCita(cita)
        - listarTodasLasCitas()
        - actualizarEstadoCita(id, estado)
        - listarTestimonios(soloAprobados)
        - crearTestimonio(testimonio)
        - actualizarEstadoTestimonio(id, estado)

   Si no hay credenciales de Supabase en config.js, funciona en MODO DEMO
   guardando los datos en este navegador (localStorage).
   ===================================================================== */

const BookingBackend = (() => {
  const cfg = (window.CONFIG && window.CONFIG.backend) || {};
  const usaSupabase =
    cfg.proveedor === "supabase" && cfg.supabaseUrl && cfg.supabaseAnonKey;

  // -------- Cliente de Supabase (solo si está configurado) --------
  let sb = null;
  if (usaSupabase && window.supabase) {
    sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  }

  /* ============================================================
     IMPLEMENTACIÓN MODO DEMO (localStorage)
     ============================================================ */
  const DEMO = {
    _leer(clave) {
      try { return JSON.parse(localStorage.getItem(clave)) || []; }
      catch { return []; }
    },
    _guardar(clave, datos) {
      localStorage.setItem(clave, JSON.stringify(datos));
    },

    async listarCitasPorProfesional(profesionalId, fechaISO) {
      return this._leer("jg_citas").filter(
        (c) => c.profesional_id === profesionalId &&
               c.fecha === fechaISO &&
               c.estado !== "cancelada"
      );
    },

    async crearCita(cita) {
      const citas = this._leer("jg_citas");
      // Verificación de choque por profesional (misma fecha, solapamiento horario)
      const choca = citas.some(
        (c) =>
          c.profesional_id === cita.profesional_id &&
          c.fecha === cita.fecha &&
          c.estado !== "cancelada" &&
          cita.inicio_min < c.fin_min &&
          c.inicio_min < cita.fin_min
      );
      if (choca) return { ok: false, motivo: "conflicto" };

      cita.id = "demo_" + Date.now();
      cita.estado = "pendiente";
      cita.creada = new Date().toISOString();
      citas.push(cita);
      this._guardar("jg_citas", citas);
      return { ok: true, cita };
    },

    async listarTodasLasCitas() {
      return this._leer("jg_citas").sort((a, b) =>
        (a.fecha + a.hora).localeCompare(b.fecha + b.hora)
      );
    },

    async actualizarEstadoCita(id, estado) {
      const citas = this._leer("jg_citas");
      const c = citas.find((x) => x.id === id);
      if (c) { c.estado = estado; this._guardar("jg_citas", citas); }
      return { ok: !!c };
    },

    async listarTestimonios(soloAprobados) {
      let t = this._leer("jg_testimonios");
      if (soloAprobados) t = t.filter((x) => x.estado === "aprobado");
      return t;
    },

    async crearTestimonio(testimonio) {
      const t = this._leer("jg_testimonios");
      testimonio.id = "demo_" + Date.now();
      testimonio.estado = "pendiente";
      testimonio.creado = new Date().toISOString();
      t.push(testimonio);
      this._guardar("jg_testimonios", t);
      return { ok: true };
    },

    async actualizarEstadoTestimonio(id, estado) {
      const t = this._leer("jg_testimonios");
      const item = t.find((x) => x.id === id);
      if (item) { item.estado = estado; this._guardar("jg_testimonios", t); }
      return { ok: !!item };
    },
  };

  /* ============================================================
     IMPLEMENTACIÓN SUPABASE
     ============================================================ */
  const SUPA = {
    async listarCitasPorProfesional(profesionalId, fechaISO) {
      const { data, error } = await sb
        .from("citas")
        .select("inicio_min, fin_min")
        .eq("profesional_id", profesionalId)
        .eq("fecha", fechaISO)
        .neq("estado", "cancelada");
      if (error) throw error;
      return data || [];
    },

    async crearCita(cita) {
      // Usa la función SQL "crear_cita_segura" que verifica el choque por
      // profesional DENTRO de la base de datos (a prueba de carreras).
      const { data, error } = await sb.rpc("crear_cita_segura", {
        p_servicio_id: cita.servicio_id,
        p_servicio_nombre: cita.servicio_nombre,
        p_profesional_id: cita.profesional_id,
        p_profesional_nombre: cita.profesional_nombre,
        p_fecha: cita.fecha,
        p_hora: cita.hora,
        p_inicio_min: cita.inicio_min,
        p_fin_min: cita.fin_min,
        p_nombre: cita.nombre,
        p_telefono: cita.telefono,
        p_comentarios: cita.comentarios || "",
      });
      if (error) throw error;
      // La función devuelve null si hubo conflicto de horario.
      if (!data) return { ok: false, motivo: "conflicto" };
      return { ok: true, cita: { ...cita, id: data } };
    },

    async listarTodasLasCitas() {
      const { data, error } = await sb
        .from("citas")
        .select("*")
        .order("fecha", { ascending: true })
        .order("hora", { ascending: true });
      if (error) throw error;
      return data || [];
    },

    async actualizarEstadoCita(id, estado) {
      const { error } = await sb.from("citas").update({ estado }).eq("id", id);
      return { ok: !error };
    },

    async listarTestimonios(soloAprobados) {
      let q = sb.from("testimonios").select("*").order("creado", { ascending: false });
      if (soloAprobados) q = q.eq("estado", "aprobado");
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },

    async crearTestimonio(testimonio) {
      const { error } = await sb.from("testimonios").insert([
        { ...testimonio, estado: "pendiente" },
      ]);
      return { ok: !error };
    },

    async actualizarEstadoTestimonio(id, estado) {
      const { error } = await sb.from("testimonios").update({ estado }).eq("id", id);
      return { ok: !error };
    },
  };

  const impl = usaSupabase ? SUPA : DEMO;

  return {
    modo: usaSupabase ? "supabase" : "demo",
    ...impl,
  };
})();

if (typeof window !== "undefined") window.BookingBackend = BookingBackend;
