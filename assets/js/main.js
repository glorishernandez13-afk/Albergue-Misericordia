/* ============================================================
   ALBERGUE MISERICORDIA — JavaScript principal
   ------------------------------------------------------------
   Funciones:
   1) Menú móvil (hamburguesa)
   2) Animaciones suaves al hacer scroll
   3) Botones de WhatsApp
   4) Envío de formularios (voluntarios / contacto)
   5) Año automático en el footer

   >>> CONFIGURACIÓN: edita el bloque CONFIG de abajo. <<<
   ============================================================ */

/* ------------------------------------------------------------
   CONFIG — cambia aquí los datos de contacto y el destino de
   los formularios. No necesitas tocar nada más.
   ------------------------------------------------------------ */
const CONFIG = {
  // Número de WhatsApp en formato internacional, SIN "+" ni espacios.
  // El Salvador = 503. Número oficial: +503 7474-5993
  whatsapp: "50374745993",

  // Cómo se envían los formularios. Opciones: "whatsapp" | "mailto" | "formspree"
  // - "whatsapp": abre WhatsApp con los datos ya escritos (no requiere registro).
  // - "mailto":   abre el correo del usuario con el mensaje listo para enviar.
  // - "formspree": envía los datos a un endpoint de Formspree (formulario que llega a tu correo).
  metodoFormulario: "whatsapp",

  // Correo destino (se usa solo si metodoFormulario = "mailto").
  correoDestino: "medico.albergue@cpses.org",

  // Endpoint de Formspree (se usa solo si metodoFormulario = "formspree").
  // Crea un formulario gratis en https://formspree.io y pega aquí tu URL.
  // [COMPLETAR: URL de Formspree, ej. https://formspree.io/f/xxxxxxx]
  formspreeURL: "",
};

/* ------------------------------------------------------------
   1) Menú móvil
   ------------------------------------------------------------ */
const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("menu");
if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const abierto = menu.classList.toggle("abierto");
    toggle.setAttribute("aria-expanded", abierto ? "true" : "false");
  });
  // Cerrar el menú al hacer clic en un enlace
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.remove("abierto");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

/* ------------------------------------------------------------
   2) Animaciones al hacer scroll (elementos con clase .reveal)
   ------------------------------------------------------------ */
const elementosReveal = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observador.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  elementosReveal.forEach((el) => observador.observe(el));
} else {
  // Navegadores antiguos: mostrar todo
  elementosReveal.forEach((el) => el.classList.add("visible"));
}

/* ------------------------------------------------------------
   3) Botones de WhatsApp
   Cualquier enlace con [data-whatsapp="mensaje"] abre WhatsApp.
   ------------------------------------------------------------ */
function enlaceWhatsApp(mensaje) {
  const texto = encodeURIComponent(mensaje || "Hola, me gustaría más información.");
  return `https://wa.me/${CONFIG.whatsapp}?text=${texto}`;
}
document.querySelectorAll("[data-whatsapp]").forEach((el) => {
  el.setAttribute("href", enlaceWhatsApp(el.dataset.whatsapp));
  el.setAttribute("target", "_blank");
  el.setAttribute("rel", "noopener");
});

/* ------------------------------------------------------------
   4) Envío de formularios
   ------------------------------------------------------------ */
document.querySelectorAll("form[data-form]").forEach((form) => {
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const datos = Object.fromEntries(new FormData(form).entries());
    const tipo = form.dataset.form; // "voluntario", etc.

    // Construye un texto legible con los datos
    const lineas = [`Solicitud: ${tipo}`];
    for (const [clave, valor] of Object.entries(datos)) {
      if (valor) lineas.push(`${clave}: ${valor}`);
    }
    const cuerpo = lineas.join("\n");

    if (CONFIG.metodoFormulario === "whatsapp") {
      window.open(enlaceWhatsApp(cuerpo), "_blank", "noopener");
      form.reset();
    } else if (CONFIG.metodoFormulario === "mailto") {
      const asunto = encodeURIComponent(`Nueva solicitud de ${tipo} — Albergue Misericordia`);
      window.location.href = `mailto:${CONFIG.correoDestino}?subject=${asunto}&body=${encodeURIComponent(cuerpo)}`;
      form.reset();
    } else if (CONFIG.metodoFormulario === "formspree") {
      if (!CONFIG.formspreeURL) {
        alert("Falta configurar la URL de Formspree en assets/js/main.js (CONFIG.formspreeURL).");
        return;
      }
      try {
        const resp = await fetch(CONFIG.formspreeURL, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (resp.ok) {
          alert("¡Gracias! Hemos recibido tu solicitud.");
          form.reset();
        } else {
          alert("Hubo un problema al enviar. Inténtalo de nuevo o escríbenos por WhatsApp.");
        }
      } catch (e) {
        alert("No se pudo enviar. Revisa tu conexión o escríbenos por WhatsApp.");
      }
    }
  });
});

/* ------------------------------------------------------------
   5) Galería / carrusel de fotos (lightbox)
   ------------------------------------------------------------
   👉 PARA AGREGAR FOTOS AL CARRUSEL:
   Sube la imagen a assets/img/ y añade una línea aquí con su
   archivo y su descripción (alt). El orden de la lista es el
   orden en que se mostrarán.
   ------------------------------------------------------------ */
const GALERIA = [
  { src: "assets/img/comedor-voluntarios.jpg", alt: "Personal y residentes del albergue en el comedor" },
  { src: "assets/img/atencion-medica.jpg",     alt: "Atención de salud a un paciente del albergue" },
  { src: "assets/img/testimonio-julian.jpg",   alt: "Residente del albergue en terapia ocupacional" },

  // ──────────────────────────────────────────────────────────
  // FOTOS NUEVAS: una vez que subas estos archivos a assets/img/,
  // quita las dos barras "//" del inicio de cada línea para que
  // aparezcan en el carrusel.
  // { src: "assets/img/manualidad-collar.jpg",  alt: "Collar artesanal hecho por las pacientes: 'Tejido con amor y esperanza por manos valientes'" },
  // { src: "assets/img/cocina-personal.jpg",    alt: "Integrante del equipo de cocina del albergue" },
  // { src: "assets/img/manualidad-pulseras.jpg",alt: "Pulseras artesanales elaboradas en el taller del albergue" },
  // { src: "assets/img/terapia-ocupacional.jpg",alt: "Taller de manualidades y terapia ocupacional con acompañamiento de enfermería" },
  // { src: "assets/img/rincon-espiritual.jpg",  alt: "Rincón con flores, Biblia y manualidades del albergue" },
];

const lightbox = document.getElementById("lightbox");
if (lightbox) {
  const lbImg = document.getElementById("lb-img");
  const lbCap = document.getElementById("lb-caption");
  const lbCont = document.getElementById("lb-contador");
  let indice = 0;

  function mostrar(i) {
    indice = (i + GALERIA.length) % GALERIA.length; // navegación circular
    const foto = GALERIA[indice];
    lbImg.src = foto.src;
    lbImg.alt = foto.alt;
    lbCap.textContent = foto.alt;
    lbCont.textContent = `${indice + 1} / ${GALERIA.length}`;
  }
  function abrir(i) { mostrar(i); lightbox.classList.add("abierto"); document.body.style.overflow = "hidden"; }
  function cerrar() { lightbox.classList.remove("abierto"); document.body.style.overflow = ""; }

  // Abrir desde el botón "+" o desde la foto de portada
  document.getElementById("galeria-abrir").addEventListener("click", () => abrir(0));
  const portada = document.getElementById("galeria-portada");
  if (portada) portada.addEventListener("click", () => abrir(0));

  document.getElementById("lb-cerrar").addEventListener("click", cerrar);
  document.getElementById("lb-prev").addEventListener("click", () => mostrar(indice - 1));
  document.getElementById("lb-next").addEventListener("click", () => mostrar(indice + 1));
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) cerrar(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("abierto")) return;
    if (e.key === "Escape") cerrar();
    if (e.key === "ArrowLeft") mostrar(indice - 1);
    if (e.key === "ArrowRight") mostrar(indice + 1);
  });
}

/* ------------------------------------------------------------
   6) Año automático en el footer
   ------------------------------------------------------------ */
const anio = document.getElementById("anio");
if (anio) anio.textContent = new Date().getFullYear();
