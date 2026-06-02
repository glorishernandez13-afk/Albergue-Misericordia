# 💜 Sitio web — Albergue Misericordia

Sitio web del **Albergue Misericordia**, un hogar que acoge a pacientes con
cáncer mientras reciben su tratamiento. Hecho con **HTML, CSS y JavaScript
puros** (sin frameworks ni instalaciones), para que sea fácil de editar y de
publicar en cualquier hosting.

---

## 📂 Estructura de carpetas

```
Albergue-Misericordia/
├── index.html            ← Página principal (todas las secciones)
├── login.html            ← Acceso privado de administradores
├── panel.html            ← Panel interno (calendario + archivos)
├── README.md             ← Este archivo
├── assets/
│   ├── css/
│   │   └── styles.css     ← Todos los estilos (colores, tipografía, diseño)
│   ├── js/
│   │   ├── main.js        ← Navegación, animaciones, WhatsApp y formularios
│   │   ├── auth.js        ← Login SIMULADO (cambiar credenciales aquí)
│   │   └── panel.js       ← Lógica del calendario y archivos
│   └── img/
│       ├── logo-marca.png         ← Logo oficial: solo el corazón (cabecera/footer)
│       ├── logo-completo.png      ← Logo oficial completo con texto (login)
│       ├── favicon.svg            ← Ícono de la pestaña del navegador
│       ├── comedor-voluntarios.jpg← Foto real (comedor)
│       ├── fachada.jpg            ← Foto real (edificio, tono lavanda)
│       ├── atencion-medica.jpg    ← Foto real (atención médica)
│       └── testimonio-julian.jpg  ← Foto real (residente)
└── data/
    ├── actividades.js     ← 📅 Actividades del calendario (editar aquí)
    └── archivos.js        ← 📁 Lista de archivos privados (editar aquí)
```

---

## ▶️ Cómo verlo en tu computadora (local)

No necesitas instalar nada. Tienes dos opciones:

**Opción A — La más sencilla:** haz doble clic en `index.html` y se abrirá en tu navegador.

**Opción B — Recomendada** (para que todo funcione bien, incluido el panel):
abre una terminal en esta carpeta y ejecuta uno de estos comandos:

```bash
# Si tienes Python instalado:
python3 -m http.server 8000

# O si tienes Node.js:
npx serve
```

Luego abre en el navegador: **http://localhost:8000**

---

## 🌐 Cómo publicarlo en internet (hosting gratis)

Al ser un sitio estático, puedes subirlo gratis a cualquiera de estos servicios:

- **Netlify** (más fácil): entra a [netlify.com](https://www.netlify.com), crea una
  cuenta y **arrastra la carpeta completa** a la zona de "deploy". Listo.
- **GitHub Pages**: sube el proyecto a un repositorio de GitHub y actívalo en
  *Settings → Pages*.
- **Vercel**, **Cloudflare Pages**, o el hosting que ya tenga el albergue.

Después de publicarlo, recuerda actualizar el dominio en las etiquetas
`og:url` y `canonical` dentro de `index.html` (para que se vea bien al
compartir en Facebook/WhatsApp).

---

## ✉️ Formularios (voluntarios, donantes, contacto)

El destino de los formularios se configura en **`assets/js/main.js`**, en el
bloque `CONFIG`. Hay tres métodos disponibles (cambia `metodoFormulario`):

| Método      | Qué hace                                                        | Requiere |
|-------------|-----------------------------------------------------------------|----------|
| `whatsapp`  | Abre WhatsApp con los datos ya escritos (**activado por defecto**) | Número de WhatsApp |
| `mailto`    | Abre el correo del usuario con el mensaje listo                  | Correo destino |
| `formspree` | Envía los datos a tu correo mediante un formulario en línea     | Cuenta gratis en [Formspree](https://formspree.io) |

**Actualmente está configurado en `whatsapp`.** Para cambiarlo, edita:

```js
const CONFIG = {
  whatsapp: "50374745993",                 // ← número oficial (sin + ni espacios)
  metodoFormulario: "whatsapp",            // ← "whatsapp" | "mailto" | "formspree"
  correoDestino: "medico.albergue@cpses.org", // ← si usas mailto
  formspreeURL: "",                        // ← si usas formspree
};
```

> **Donaciones en dinero:** el botón "Donar en línea" enlaza a la plataforma
> oficial del Comité de Proyección Social en
> [yomeuno.com](https://yomeuno.com/el-salvador/organizaciones/comite-de-proyeccion-social-el-salvador).
> Las **donaciones en especie** se coordinan por WhatsApp.

---

## 🔒 Acceso de administradores (IMPORTANTE)

El login es una **demostración simulada en el navegador**. Las credenciales
están en `assets/js/auth.js`:

```
Usuario: admin        Contraseña: albergue2024
Usuario: recepcion    Contraseña: misericordia
```

### ⚠️ Esto NO es seguro
Cualquier persona puede ver estas credenciales mirando el código del sitio.
**No subas archivos confidenciales reales** con este sistema. Sirve solo para
demostrar cómo se verá el panel.

### Cómo migrar a una autenticación REAL
Cuando quieras proteger datos de verdad, recomendamos:

- **Supabase** (gratis para empezar) → [supabase.com](https://supabase.com):
  1. Crea un proyecto y activa *Authentication*.
  2. Crea los usuarios del personal.
  3. Reemplaza la lógica de `auth.js` por el SDK de Supabase
     (`supabase.auth.signInWithPassword`).
  4. Guarda los archivos en *Supabase Storage* con políticas de acceso (RLS).
- **Firebase** → [firebase.google.com](https://firebase.google.com): usa
  *Firebase Authentication* + *Cloud Storage* de forma equivalente.

Con cualquiera de los dos, las contraseñas dejan de estar en el código y los
archivos quedan protegidos en el servidor.

---

## 📅 Editar el calendario y los archivos (sin saber programar)

- **Actividades:** abre `data/actividades.js` y copia/edita un bloque. El
  estado (pasada / en curso / próxima) se calcula solo según la fecha.
- **Archivos privados:** abre `data/archivos.js`, agrega el archivo a la
  carpeta del proyecto y registra su ruta.

Ambos archivos están comentados paso a paso en español.

---

## ✅ Accesibilidad y SEO

- Contraste de colores conforme a **WCAG AA**.
- Navegación por teclado y foco visible; enlace "saltar al contenido".
- Texto alternativo (`alt`) en todas las imágenes.
- Respeta `prefers-reduced-motion` (menos animación si el usuario lo pide).
- SEO básico + **Open Graph** (vista previa al compartir) + favicon.

---

## 📝 Lista de datos pendientes `[COMPLETAR]`

Busca el texto `[COMPLETAR` en el proyecto para encontrarlos.

✅ **Ya completados:** logo oficial, dirección, mapa de Google, correo,
Facebook, número de WhatsApp, enlace de donación en línea (yomeuno.com),
opción de donación en especie y transparencia (100% al albergue).

⏳ **Pendientes:**

1. **Otros servicios** del albergue (tarjeta "Y más" en "Lo que ofrecemos").
2. **Áreas y requisitos específicos** de voluntariado.
3. **Tercer testimonio** (voluntario o familiar) con nombre y foto.
4. **Actividades reales** del calendario (`data/actividades.js`) — ahora hay ejemplos.
5. **Archivos privados reales** (`data/archivos.js`) — ahora hay ejemplos.
6. **Dominio final** del sitio (etiquetas `og:url` y `canonical` en `index.html`).
7. *(Opcional)* **Fotos adicionales** (habitaciones, actividades, etc.).

---

## 📌 Nota sobre el contenido

La información del sitio proviene de los materiales propios del albergue
(artículo informativo y fotos). El documento de presentación/investigación
(PDF) se usó **solo como contexto de fondo** y **no** como contenido público
del sitio.
