/* =====================================================================
   MAIN.JS — Jade García Beauty Studio
   Rellena el sitio con el contenido de config.js y activa las
   interacciones (menú, animaciones, pestañas, galería, etc.).
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const C = window.CONFIG;

  /* ---- Placeholder automático para imágenes que aún no existen ---- */
  // Si una foto real no se ha subido todavía, mostramos un marcador
  // elegante con los colores de la marca en lugar de un ícono roto.
  function placeholderSVG(texto, w, h) {
    const t = (texto || "Foto").replace(/[<>&]/g, "");
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
      <rect width='100%' height='100%' fill='#E5CEC8'/>
      <text x='50%' y='48%' font-family='Cormorant Garamond, serif' font-size='${Math.round(w/16)}' fill='#3C1F19' text-anchor='middle'>Jade García</text>
      <text x='50%' y='58%' font-family='Inter, sans-serif' font-size='${Math.round(w/30)}' fill='#6b5048' text-anchor='middle'>${t}</text>
    </svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  function imgConFallback(img, src, alt, w, h) {
    img.alt = alt || "";
    img.loading = "lazy";
    img.src = src;
    img.addEventListener("error", function handler() {
      img.removeEventListener("error", handler);
      img.src = placeholderSVG(alt, w || 600, h || 600);
    });
  }

  /* ================= HERO ================= */
  document.getElementById("heroTitulo").innerHTML =
    `<span class="script">${C.hero.titulo}</span>`;
  document.getElementById("heroSubtitulo").textContent = C.hero.subtitulo;
  document.getElementById("heroBtn").textContent = C.hero.textoBotonPrincipal;
  imgConFallback(document.getElementById("heroImg"), C.hero.imagen, C.hero.imagenAlt, 560, 700);

  /* ================= QUIÉNES SOMOS ================= */
  document.getElementById("nosotrosTitulo").textContent = C.quienesSomos.titulo;
  document.getElementById("nosotrosParrafos").innerHTML =
    C.quienesSomos.parrafos.map((p) => `<p>${p}</p>`).join("");
  document.getElementById("valores").innerHTML = C.quienesSomos.valores
    .map(
      (v) => `<div class="valor">
        <div class="valor-icon">♥</div>
        <div><h4>${v.titulo}</h4><p>${v.texto}</p></div>
      </div>`
    )
    .join("");

  /* ================= FUNDADORA ================= */
  imgConFallback(document.getElementById("founderFoto"), C.fundadora.foto, C.fundadora.fotoAlt, 500, 667);
  document.getElementById("founderNombre").textContent = C.fundadora.nombre;
  document.getElementById("founderRol").textContent = C.fundadora.rol;
  document.getElementById("founderBio").innerHTML =
    C.fundadora.bio.map((p) => `<p>${p}</p>`).join("");

  const bloques = [
    { titulo: "Formación", datos: C.fundadora.cursos },
    { titulo: "Certificaciones", datos: C.fundadora.certificaciones },
    { titulo: "Experiencia", datos: C.fundadora.experiencia },
    { titulo: "Técnicas", datos: C.fundadora.tecnicas },
  ];
  document.getElementById("founderDetalles").innerHTML = bloques
    .filter((b) => b.datos && b.datos.length)
    .map(
      (b) => `<div class="founder-block">
        <h4>${b.titulo}</h4>
        <ul>${b.datos.map((d) => `<li>${d}</li>`).join("")}</ul>
      </div>`
    )
    .join("");

  /* ================= SERVICIOS ================= */
  const tabs = document.getElementById("serviciosTabs");
  const grid = document.getElementById("serviciosGrid");
  const categorias = ["Todos", ...C.servicios.map((s) => s.categoria)];

  categorias.forEach((cat, i) => {
    const btn = document.createElement("button");
    btn.className = "tab-btn" + (i === 0 ? " active" : "");
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      tabs.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderServicios(cat);
    });
    tabs.appendChild(btn);
  });

  function renderServicios(filtro) {
    const cats = filtro === "Todos" ? C.servicios : C.servicios.filter((s) => s.categoria === filtro);
    let html = "";
    cats.forEach((cat) => {
      cat.items.forEach((s) => {
        html += `<article class="servicio-card">
          <span class="servicio-cat">${cat.icono} ${cat.categoria}</span>
          <h3>${s.nombre}</h3>
          <p>${s.descripcion}</p>
          <div class="servicio-meta">
            <span class="servicio-precio">${s.precio}</span>
            <span class="servicio-duracion">🕐 ${s.duracionMin} min</span>
          </div>
          <a href="#agenda" class="btn btn--outline btn--block">Reservar</a>
        </article>`;
      });
    });
    grid.innerHTML = html;
  }
  renderServicios("Todos");

  /* ================= AGENDA (módulo de reservas) ================= */
  if (window.Booking) Booking.init();

  /* ================= TESTIMONIOS ================= */
  renderTestimonios();
  async function renderTestimonios() {
    const cont = document.getElementById("testimoniosGrid");
    let lista = [...(C.testimonios.destacados || [])];
    // Suma los testimonios aprobados guardados en el backend
    try {
      const aprobados = await BookingBackend.listarTestimonios(true);
      lista = lista.concat(
        aprobados.map((t) => ({ nombre: t.nombre, estrellas: t.estrellas, comentario: t.comentario, foto: t.foto || "" }))
      );
    } catch (e) { /* sin conexión: solo destacados */ }

    cont.innerHTML = lista
      .map((t) => {
        const estrellas = "★".repeat(t.estrellas) + "☆".repeat(5 - t.estrellas);
        const inicial = (t.nombre || "?").trim().charAt(0).toUpperCase();
        const avatar = t.foto
          ? `<img src="${t.foto}" alt="Foto de ${t.nombre}" loading="lazy" />`
          : `<div class="testimonio-avatar" aria-hidden="true">${inicial}</div>`;
        return `<article class="testimonio-card">
          <div class="testimonio-stars" aria-label="${t.estrellas} de 5 estrellas">${estrellas}</div>
          <p>“${t.comentario}”</p>
          <div class="testimonio-autor">${avatar}<strong>${t.nombre}</strong></div>
        </article>`;
      })
      .join("");
  }

  // Formulario de testimonios (con moderación)
  if (C.testimonios.permitirEnvios) {
    document.getElementById("testimonioFormWrap").hidden = false;
    const form = document.getElementById("testimonioForm");
    const fb = document.getElementById("testimonioFeedback");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nombre = document.getElementById("tNombre").value.trim();
      const comentario = document.getElementById("tComentario").value.trim();
      const estrellasInput = form.querySelector('input[name="estrellas"]:checked');
      if (!nombre || !comentario || !estrellasInput) {
        fb.className = "booking-feedback show error";
        fb.textContent = "Completa tu nombre, calificación y comentario.";
        return;
      }
      try {
        await BookingBackend.crearTestimonio({ nombre, comentario, estrellas: Number(estrellasInput.value), foto: "" });
        fb.className = "booking-feedback show success";
        fb.textContent = "¡Gracias! Tu testimonio será revisado antes de publicarse.";
        form.reset();
      } catch (err) {
        fb.className = "booking-feedback show error";
        fb.textContent = "No se pudo enviar. Inténtalo más tarde.";
      }
    });
  }

  /* ================= GALERÍA ================= */
  const galGrid = document.getElementById("galeriaGrid");
  const galFiltros = document.getElementById("galeriaFiltros");
  const cats = ["Todos", ...new Set(C.galeria.fotos.map((f) => f.categoria))];

  cats.forEach((cat, i) => {
    const btn = document.createElement("button");
    btn.className = "tab-btn" + (i === 0 ? " active" : "");
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      galFiltros.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderGaleria(cat);
    });
    galFiltros.appendChild(btn);
  });

  function renderGaleria(filtro) {
    const fotos = filtro === "Todos" ? C.galeria.fotos : C.galeria.fotos.filter((f) => f.categoria === filtro);
    galGrid.innerHTML = "";
    fotos.forEach((f) => {
      const item = document.createElement("div");
      item.className = "galeria-item";
      const img = document.createElement("img");
      imgConFallback(img, f.src, f.alt, 400, 400);
      item.appendChild(img);
      const tag = document.createElement("span");
      tag.className = "cat-tag";
      tag.textContent = f.categoria;
      item.appendChild(tag);
      galGrid.appendChild(item);
    });
  }
  renderGaleria("Todos");

  // Antes y después (comparador deslizante)
  const ad = document.getElementById("antesDespues");
  (C.galeria.antesDespues || []).forEach((par, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "comparador";
    wrap.innerHTML = `
      <img class="img-antes" alt="Antes: ${par.alt}" />
      <img class="img-despues" alt="Después: ${par.alt}" />
      <span class="tag tag-antes">Antes</span>
      <span class="tag tag-despues">Después</span>
      <div class="slider-line"></div>
      <div class="slider-handle">⇆</div>
      <input type="range" min="0" max="100" value="50" aria-label="Comparar antes y después" />`;
    ad.appendChild(wrap);
    imgConFallback(wrap.querySelector(".img-antes"), par.antes, "Antes", 600, 450);
    imgConFallback(wrap.querySelector(".img-despues"), par.despues, "Después", 600, 450);
    const range = wrap.querySelector("input");
    const after = wrap.querySelector(".img-despues");
    const line = wrap.querySelector(".slider-line");
    const handle = wrap.querySelector(".slider-handle");
    range.addEventListener("input", () => {
      const v = range.value;
      after.style.clipPath = `inset(0 0 0 ${v}%)`;
      line.style.left = `${v}%`;
      handle.style.left = `${v}%`;
    });
  });

  /* ================= REDES SOCIALES ================= */
  const ICONOS = {
    instagram: `<svg viewBox="0 0 24 24" fill="#CF9089"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68A6.16 6.16 0 1018.16 12 6.16 6.16 0 0012 5.84zm0 10.16A4 4 0 1116 12a4 4 0 01-4 4zm6.4-10.4a1.44 1.44 0 11-1.44-1.44 1.44 1.44 0 011.44 1.44z"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" fill="#CF9089"><path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z"/></svg>`,
    tiktok: `<svg viewBox="0 0 24 24" fill="#CF9089"><path d="M16.6 5.82a4.28 4.28 0 01-1.05-2.82h-3.06v12.3a2.59 2.59 0 11-1.83-2.48V9.72a5.66 5.66 0 00-.76-.05A5.66 5.66 0 1015.56 15V9.01a7.3 7.3 0 004.27 1.37V7.32a4.28 4.28 0 01-3.23-1.5z"/></svg>`,
    whatsapp: `<svg viewBox="0 0 24 24" fill="#CF9089"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.207z"/></svg>`,
  };
  const redesGrid = document.getElementById("redesGrid");
  const redes = [
    { k: "instagram", n: "Instagram", url: C.redes.instagram },
    { k: "facebook", n: "Facebook", url: C.redes.facebook },
    { k: "tiktok", n: "TikTok", url: C.redes.tiktok },
    { k: "whatsapp", n: "WhatsApp", url: waLink() },
  ];
  redesGrid.innerHTML = redes
    .map((r) => `<a class="red-btn" href="${r.url}" target="_blank" rel="noopener">${ICONOS[r.k]} ${r.n}</a>`)
    .join("");
  document.getElementById("footerSocial").innerHTML = redes
    .map((r) => `<a href="${r.url}" target="_blank" rel="noopener" aria-label="${r.n}">${ICONOS[r.k]}</a>`)
    .join("");

  function waLink() {
    return `https://wa.me/${C.redes.whatsappNumero}?text=${encodeURIComponent(C.redes.whatsappMensaje)}`;
  }

  /* ================= CONTACTO ================= */
  const ci = document.getElementById("contactoInfo");
  ci.innerHTML = `
    <div class="contacto-item"><div class="ic">📍</div><div><h4>Dirección</h4><p>${C.contacto.direccion}</p></div></div>
    <div class="contacto-item"><div class="ic">📞</div><div><h4>Teléfono</h4><a href="tel:${C.contacto.telefono.replace(/\s/g,"")}">${C.contacto.telefono}</a></div></div>
    <div class="contacto-item"><div class="ic">✉️</div><div><h4>Correo</h4><a href="mailto:${C.contacto.correo}">${C.contacto.correo}</a></div></div>
    <div class="contacto-item"><div class="ic">🕐</div><div><h4>Horarios</h4>
      <ul class="contacto-horarios">${C.contacto.horariosTexto.map((h)=>`<li><span>${h.dia}</span><span>${h.horas}</span></li>`).join("")}</ul>
    </div></div>`;
  document.getElementById("mapaIframe").src = C.contacto.mapaEmbedUrl;

  /* ================= FOOTER ================= */
  document.getElementById("footerEslogan").textContent = C.negocio.eslogan;
  document.getElementById("footerPrivacidad").textContent = C.privacidad;
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("footerContacto").innerHTML = `
    <li><a href="tel:${C.contacto.telefono.replace(/\s/g,"")}">${C.contacto.telefono}</a></li>
    <li><a href="mailto:${C.contacto.correo}">${C.contacto.correo}</a></li>
    <li>${C.contacto.direccion}</li>`;

  /* ================= WHATSAPP FLOTANTE ================= */
  const wa = document.getElementById("waFloat");
  wa.href = waLink();
  window.addEventListener("scroll", () => {
    wa.classList.toggle("show", window.scrollY > 400);
  });

  /* ================= SEO dinámico ================= */
  document.title = `${C.negocio.nombre} | ${C.negocio.eslogan}`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = C.negocio.descripcionSEO;
  // Completa los datos estructurados
  try {
    const schema = JSON.parse(document.getElementById("schema-jsonld").textContent);
    schema.name = C.negocio.nombre;
    schema.telephone = C.contacto.telefono;
    schema.url = C.negocio.url;
    schema.address.streetAddress = C.contacto.direccion;
    document.getElementById("schema-jsonld").textContent = JSON.stringify(schema);
  } catch (e) {}

  /* ================= NAVEGACIÓN MÓVIL ================= */
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  toggle.addEventListener("click", () => {
    const abierto = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", abierto);
    toggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ================= HEADER AL HACER SCROLL ================= */
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  });

  /* ================= ANIMACIONES DE APARICIÓN ================= */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((r) => io.observe(r));
  } else {
    reveals.forEach((r) => r.classList.add("visible"));
  }
});
