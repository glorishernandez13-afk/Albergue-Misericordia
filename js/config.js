/* =====================================================================
   JADE GARCÍA BEAUTY STUDIO — ARCHIVO DE CONFIGURACIÓN CENTRAL
   =====================================================================

   👋 ¡Hola! Este es el ÚNICO archivo que necesitas editar para cambiar
   los textos, precios, fotos, horarios, profesionales, redes sociales y
   datos de contacto del sitio.

   ⚠️  Reglas simples para no romper nada:
   - Edita SOLO el texto que está entre comillas "así".
   - No borres las comas (,) ni las llaves { } ni los corchetes [ ].
   - Las líneas que empiezan con // son comentarios de ayuda y NO afectan
     al sitio.
   - Cuando veas [EDITAR: ...] reemplázalo por la información real.

   Después de guardar este archivo, recarga la página web para ver los
   cambios. Si algo deja de verse, revisa que no hayas borrado una coma.
   ===================================================================== */

const CONFIG = {

  /* -------------------------------------------------------------------
     1) DATOS GENERALES DEL NEGOCIO
     ------------------------------------------------------------------- */
  negocio: {
    nombre: "Jade García Beauty Studio",
    // Frase corta que describe el salón (aparece en SEO y al compartir)
    eslogan: "Tu belleza, nuestra pasión",
    // Descripción para buscadores (Google) — máx. ~160 caracteres
    descripcionSEO: "Salón de belleza en El Salvador. Cabello, uñas, pedicure y faciales. Agenda tu cita en línea con Jade García Beauty Studio.",
    ciudad: "[EDITAR: Ciudad, El Salvador]",
    // Moneda que se muestra junto a los precios
    moneda: "USD $",
    // Dirección del sitio una vez publicado (para SEO / compartir)
    url: "https://www.jadegarciabeauty.com",
  },

  /* -------------------------------------------------------------------
     2) CONTACTO Y UBICACIÓN
     ------------------------------------------------------------------- */
  contacto: {
    direccion: "[EDITAR: Calle / Avenida, Colonia, Ciudad, El Salvador]",
    telefono: "+503 0000 0000",      // Teléfono visible
    correo: "hola@jadegarciabeauty.com",
    // Horarios de atención que se MUESTRAN en la sección Contacto.
    // (El horario que controla la AGENDA se configura más abajo en "agenda".)
    horariosTexto: [
      { dia: "Lunes a Viernes", horas: "9:00 a.m. – 6:00 p.m." },
      { dia: "Sábado",          horas: "9:00 a.m. – 4:00 p.m." },
      { dia: "Domingo",         horas: "Cerrado" },
    ],
    // Mapa de Google. Para cambiarlo: en Google Maps busca tu dirección,
    // pulsa "Compartir" → "Insertar un mapa" → copia SOLO el enlace que
    // está dentro de src="..." y pégalo aquí entre comillas.
    mapaEmbedUrl: "https://www.google.com/maps?q=San+Salvador,El+Salvador&output=embed",
  },

  /* -------------------------------------------------------------------
     3) REDES SOCIALES Y WHATSAPP
     ------------------------------------------------------------------- */
  redes: {
    instagram: "https://instagram.com/[EDITAR_usuario]",
    facebook:  "https://facebook.com/[EDITAR_pagina]",
    tiktok:    "https://tiktok.com/@[EDITAR_usuario]",
    // Número de WhatsApp en formato internacional SIN espacios ni signos.
    // Ejemplo El Salvador: 50370000000  (503 = código país)
    whatsappNumero: "50370000000",
    // Mensaje que se escribe solo cuando la clienta abre WhatsApp.
    whatsappMensaje: "Hola, quiero más información sobre los servicios de Jade García Beauty Studio",
  },

  /* -------------------------------------------------------------------
     4) SECCIÓN INICIO (HERO)
     ------------------------------------------------------------------- */
  hero: {
    titulo: "Realza tu belleza natural",
    subtitulo: "Un espacio íntimo y sofisticado donde cada detalle está pensado para que te sientas radiante. Cabello, uñas, faciales y cuidado personal con la firma de Jade García.",
    textoBotonPrincipal: "Agenda tu cita",
    // Imagen grande del hero (reemplázala por una foto real del salón).
    imagen: "assets/img/hero.jpg",
    imagenAlt: "Interior elegante del salón Jade García Beauty Studio",
  },

  /* -------------------------------------------------------------------
     5) QUIÉNES SOMOS
     ------------------------------------------------------------------- */
  quienesSomos: {
    titulo: "Quiénes somos",
    parrafos: [
      "En Jade García Beauty Studio creemos que la belleza es una forma de cuidado personal y de amor propio. Desde hace [EDITAR: número] años acompañamos a nuestras clientas en cada etapa, ofreciendo servicios de alta calidad en un ambiente cálido, limpio y sofisticado.",
      "Nuestra misión es realzar la belleza única de cada mujer con técnicas actualizadas, productos de primera y un trato cercano y honesto. Lo que nos diferencia es la atención al detalle y el cariño con el que tratamos a cada persona que entra por nuestra puerta.",
    ],
    // Tres valores o diferenciadores breves (ícono + título + texto)
    valores: [
      { titulo: "Profesionalismo", texto: "Técnicas actualizadas y productos de alta calidad." },
      { titulo: "Cercanía",        texto: "Te escuchamos para lograr justo lo que imaginas." },
      { titulo: "Higiene",         texto: "Protocolos estrictos de limpieza y bioseguridad." },
    ],
  },

  /* -------------------------------------------------------------------
     6) SOBRE LA FUNDADORA
     ------------------------------------------------------------------- */
  fundadora: {
    titulo: "Sobre la fundadora",
    nombre: "Jade García",
    rol: "Fundadora & Estilista Profesional",
    foto: "assets/img/founder/jade.jpg",
    fotoAlt: "Jade García, fundadora del estudio de belleza",
    bio: [
      "[EDITAR: Escribe aquí la historia de Jade — cómo nació su pasión por la belleza, su trayectoria y lo que la inspira cada día.]",
    ],
    // Listas editables. Agrega o quita líneas según corresponda.
    cursos:         ["[EDITAR: Curso o formación 1]", "[EDITAR: Curso 2]"],
    certificaciones:["[EDITAR: Certificación 1]", "[EDITAR: Certificación 2]"],
    experiencia:    ["[EDITAR: Años de experiencia / lugares donde trabajó]"],
    tecnicas:       ["[EDITAR: Técnica especializada 1]", "[EDITAR: Técnica 2]"],
  },

  /* -------------------------------------------------------------------
     7) SERVICIOS
     ------------------------------------------------------------------- */
  // Categorías y sus servicios. El campo "duracionMin" (en minutos) es
  // IMPORTANTE: define cuánto tiempo bloquea cada servicio en la agenda.
  // El campo "id" debe ser único y NO debe llevar espacios ni acentos.
  servicios: [
    {
      categoria: "Cabello",
      icono: "✂️",
      items: [
        { id: "corte-dama",   nombre: "Corte de dama",        descripcion: "Corte personalizado según tu rostro y estilo.", duracionMin: 60,  precio: "[EDITAR: $ – $]" },
        { id: "tinte",        nombre: "Tinte / Color",        descripcion: "Coloración profesional con productos de cuidado.", duracionMin: 120, precio: "[EDITAR: $ – $]" },
        { id: "tratamiento",  nombre: "Tratamiento capilar",  descripcion: "Hidratación profunda y reparación.",            duracionMin: 60,  precio: "[EDITAR: $ – $]" },
        { id: "peinado",      nombre: "Peinado / Recogido",   descripcion: "Para eventos especiales y ocasiones únicas.",   duracionMin: 60,  precio: "[EDITAR: $ – $]" },
      ],
    },
    {
      categoria: "Uñas",
      icono: "💅",
      items: [
        { id: "manicure",     nombre: "Manicure clásico",     descripcion: "Cuidado y esmaltado de manos.",                 duracionMin: 45,  precio: "[EDITAR: $ – $]" },
        { id: "acrilicas",    nombre: "Uñas acrílicas",       descripcion: "Diseño y modelado a tu gusto.",                 duracionMin: 90,  precio: "[EDITAR: $ – $]" },
        { id: "gelish",       nombre: "Esmaltado en gel",     descripcion: "Color duradero con acabado brillante.",         duracionMin: 60,  precio: "[EDITAR: $ – $]" },
      ],
    },
    {
      categoria: "Pedicure",
      icono: "🦶",
      items: [
        { id: "pedicure-spa", nombre: "Pedicure spa",         descripcion: "Relajante, con exfoliación y masaje.",          duracionMin: 60,  precio: "[EDITAR: $ – $]" },
        { id: "pedicure-gel", nombre: "Pedicure con gel",     descripcion: "Esmaltado duradero para tus pies.",             duracionMin: 75,  precio: "[EDITAR: $ – $]" },
      ],
    },
    {
      categoria: "Faciales",
      icono: "✨",
      items: [
        { id: "facial-limpieza", nombre: "Limpieza facial profunda", descripcion: "Renueva e ilumina tu piel.",            duracionMin: 75,  precio: "[EDITAR: $ – $]" },
        { id: "facial-hidra",    nombre: "Facial hidratante",        descripcion: "Nutrición e hidratación intensiva.",     duracionMin: 60,  precio: "[EDITAR: $ – $]" },
      ],
    },
  ],

  /* -------------------------------------------------------------------
     8) SISTEMA DE AGENDA / RESERVAS
     ------------------------------------------------------------------- */
  agenda: {
    // PROFESIONALES del salón. Cada una tiene su propio horario.
    // "id" único sin espacios. "diasLibres" usa números: 0=Domingo,
    // 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado.
    // "servicios" = lista de IDs de servicios que ofrece (de la sección 7).
    // Deja la lista de "servicios" vacía [] si atiende TODOS los servicios.
    profesionales: [
      {
        id: "jade",
        nombre: "Jade García",
        especialidad: "Cabello y color",
        horario: { inicio: "09:00", fin: "18:00" }, // formato 24h
        diasLibres: [0],            // descansa domingos
        servicios: [],              // [] = todos
      },
      {
        id: "prof-2",
        nombre: "[EDITAR: Profesional 2]",
        especialidad: "Uñas y pedicure",
        horario: { inicio: "09:00", fin: "17:00" },
        diasLibres: [0, 1],         // descansa domingo y lunes
        servicios: ["manicure", "acrilicas", "gelish", "pedicure-spa", "pedicure-gel"],
      },
    ],

    // FERIADOS o días cerrados (no se podrá reservar). Formato: "AAAA-MM-DD".
    feriados: ["[EDITAR: 2026-12-25]"],

    // Cada cuántos minutos se ofrece un horario disponible (30 = cada media hora).
    granularidadMin: 30,

    // Minutos de descanso entre una cita y la siguiente (limpieza/preparación).
    bufferMin: 10,

    // Con cuántos días de anticipación máxima se puede reservar.
    diasMaxAnticipacion: 60,

    textoConfirmacion: "¡Tu cita ha sido registrada! Te esperamos. Recibirás los detalles y, si lo deseas, puedes confirmar por WhatsApp.",
  },

  /* -------------------------------------------------------------------
     9) TESTIMONIOS
     ------------------------------------------------------------------- */
  // Si "permitirEnvios" está en true, las clientas pueden mandar testimonios,
  // pero NO se publican automáticamente: quedan pendientes de aprobación en
  // el panel del salón (admin.html).
  testimonios: {
    permitirEnvios: true,
    // Testimonios fijos que siempre se muestran (los apruebas tú aquí).
    destacados: [
      { nombre: "[EDITAR: Nombre clienta]", estrellas: 5, comentario: "[EDITAR: Comentario de la clienta sobre su experiencia.]", foto: "" },
      { nombre: "[EDITAR: Nombre clienta]", estrellas: 5, comentario: "[EDITAR: Otro comentario positivo.]", foto: "" },
      { nombre: "[EDITAR: Nombre clienta]", estrellas: 5, comentario: "[EDITAR: Un tercer testimonio.]", foto: "" },
    ],
  },

  /* -------------------------------------------------------------------
     10) GALERÍA
     ------------------------------------------------------------------- */
  // Cada imagen tiene una "categoria": "Cabello", "Uñas", "Pies", "Faciales".
  // Para "Antes y después" usa el tipo "antes-despues" con dos imágenes.
  galeria: {
    fotos: [
      { categoria: "Cabello",  src: "assets/img/gallery/cabello-1.jpg",  alt: "Trabajo de cabello realizado en el salón" },
      { categoria: "Uñas",     src: "assets/img/gallery/unas-1.jpg",     alt: "Diseño de uñas" },
      { categoria: "Pies",     src: "assets/img/gallery/pies-1.jpg",     alt: "Resultado de pedicure" },
      { categoria: "Faciales", src: "assets/img/gallery/facial-1.jpg",   alt: "Tratamiento facial" },
      { categoria: "Cabello",  src: "assets/img/gallery/cabello-2.jpg",  alt: "Color de cabello" },
      { categoria: "Uñas",     src: "assets/img/gallery/unas-2.jpg",     alt: "Uñas acrílicas con diseño" },
    ],
    // Pares de antes y después
    antesDespues: [
      { antes: "assets/img/gallery/antes-1.jpg", despues: "assets/img/gallery/despues-1.jpg", alt: "Transformación de cabello antes y después" },
    ],
  },

  /* -------------------------------------------------------------------
     11) AVISO DE PRIVACIDAD (footer)
     ------------------------------------------------------------------- */
  privacidad: "Al reservar, recopilamos tu nombre y teléfono únicamente para gestionar tu cita. No compartimos tus datos con terceros.",

  /* -------------------------------------------------------------------
     12) CONEXIÓN CON EL BACKEND DE RESERVAS (Supabase)
     ------------------------------------------------------------------- */
  // 👉 Lee el README (sección "Conectar la agenda") para obtener estos datos.
  // Mientras estén vacíos, la agenda funciona en MODO DEMOSTRACIÓN
  // (guarda las citas solo en este navegador, sin nube).
  backend: {
    proveedor: "supabase",        // "supabase" o "demo"
    supabaseUrl: "",              // [EDITAR: https://xxxx.supabase.co]
    supabaseAnonKey: "",          // [EDITAR: clave pública anon]
  },

  /* -------------------------------------------------------------------
     13) PANEL DEL SALÓN (admin.html)
     ------------------------------------------------------------------- */
  // Contraseña simple para entrar al panel. CÁMBIALA por una propia.
  // Nota: es una protección básica del lado del cliente; para máxima
  // seguridad usa además las políticas de Supabase (ver README).
  admin: {
    password: "jade2026",
  },
};

// No edites esta línea (hace que la configuración esté disponible en el sitio).
if (typeof window !== "undefined") { window.CONFIG = CONFIG; }
