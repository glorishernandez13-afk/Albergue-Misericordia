# Jade García Beauty Studio — Sitio web

Sitio web del salón de belleza **Jade García Beauty Studio** (El Salvador): página de presentación, servicios, galería, testimonios y un **sistema de reservas en línea** con prevención de choques de horario por profesional.

Esta guía está escrita para que **cualquier persona, sin conocimientos técnicos**, pueda editar el contenido y publicar el sitio. 💗

---

## 📁 ¿Qué hay en cada carpeta?

```
index.html              → La página principal del sitio
admin.html              → Panel privado del salón (ver y gestionar citas)
css/                    → Diseño y colores (normalmente no se toca)
js/
  config.js   ⭐         → AQUÍ editas TODO: textos, precios, fotos, horarios…
  main.js                → Hace funcionar la página (no editar)
  booking.js             → Lógica de la agenda (no editar)
  backend-supabase.js    → Conexión con la base de datos (no editar)
  admin.js               → Panel del salón (no editar)
assets/
  logos/                 → Logos de la marca (reemplaza por los oficiales)
  patterns/              → Patrones decorativos
  img/                   → Fotos del salón, fundadora y galería
supabase/schema.sql      → Para activar la base de datos en la nube
```

> ⭐ **El único archivo que necesitas editar para el contenido es `js/config.js`.**

---

## ✏️ 1. Cómo cambiar textos, precios y datos

1. Abre el archivo **`js/config.js`** con un editor de texto (el Bloc de notas sirve, pero es mejor [Visual Studio Code](https://code.visualstudio.com/), gratis).
2. Cambia solo el texto que está **entre comillas** `"así"`.
3. Donde veas **`[EDITAR: ...]`**, reemplázalo por la información real (precios, dirección, etc.).
4. **No borres** las comas `,`, las llaves `{ }` ni los corchetes `[ ]`.
5. Guarda el archivo y recarga la página web.

Ejemplo — cambiar el teléfono:
```js
telefono: "+503 7777 8888",   // ← escribe tu número real aquí
```

---

## 🖼️ 2. Cómo cambiar las fotos

1. Prepara tus fotos (formato `.jpg`, de buena calidad, no muy pesadas).
2. Súbelas a la carpeta correspondiente dentro de **`assets/img/`**:
   - Foto principal del salón → `assets/img/hero.jpg`
   - Foto de la fundadora → `assets/img/founder/jade.jpg`
   - Fotos de trabajos → `assets/img/gallery/`
3. Si usas otros nombres de archivo, actualiza la ruta en `js/config.js`.

> Mientras no subas una foto real, el sitio muestra un marcador elegante con el nombre de la marca, así nunca se ve roto.

### Logos oficiales
Los archivos en `assets/logos/` son **versiones de muestra**. Sustitúyelos por los logos oficiales de la marca **manteniendo los mismos nombres de archivo**:
- `logo-horizontal.svg` → firma + “BEAUTY STUDIO” (rosa sobre claro)
- `logo-horizontal-crema.svg` → versión crema (para el footer oscuro)
- `insignia.svg` → insignia circular con monograma “J.” (favicon/avatar)
- `isotipo-corazon.svg` → corazón decorativo

---

## 🔗 3. Cómo editar redes sociales y WhatsApp

En `js/config.js`, sección `redes`:
```js
instagram: "https://instagram.com/tu_usuario",
whatsappNumero: "50370000000",   // código país + número, SIN espacios ni +
```

---

## 📅 4. Cómo conectar la agenda (base de datos en la nube)

La agenda funciona en **modo demostración** sin configurar nada, pero las citas se guardan **solo en el navegador** y no se comparten entre dispositivos. Para que sea real y evite choques de horario entre clientas, conecta **Supabase** (gratis):

### Paso a paso
1. Entra a **[supabase.com](https://supabase.com)** y crea una cuenta gratuita.
2. Crea un nuevo proyecto (**New project**). Anota la contraseña de la base de datos.
3. Cuando el proyecto esté listo, ve a **SQL Editor → New query**.
4. Abre el archivo **`supabase/schema.sql`** de este proyecto, copia **todo** su contenido, pégalo y pulsa **Run**. Esto crea las tablas y la protección de horarios.
5. Ve a **Settings (⚙️) → API** y copia dos datos:
   - **Project URL** (algo como `https://xxxx.supabase.co`)
   - **anon public** key (una clave larga)
6. Pégalos en `js/config.js`, sección `backend`:
   ```js
   backend: {
     proveedor: "supabase",
     supabaseUrl: "https://xxxx.supabase.co",
     supabaseAnonKey: "PEGA_AQUÍ_LA_CLAVE_ANON",
   },
   ```
7. Guarda y recarga. ¡Listo! Ahora las reservas se guardan en la nube.

> **¿Quieres cambiar de proveedor más adelante** (Firebase, Calendly, SimplyBook…)**?** Toda la conexión vive en `js/backend-supabase.js`. Se puede reemplazar ese archivo sin tocar el resto del sitio.

### Configurar profesionales, horarios y servicios
Todo se edita en `js/config.js`, sección `agenda`:
- **Profesionales**: nombre, horario, días libres y qué servicios da cada una.
- **Duración de cada servicio**: en la sección `servicios` (campo `duracionMin`), define cuánto tiempo bloquea en la agenda.
- **Granularidad** (cada cuántos minutos hay un horario), **buffer** (descanso entre citas) y **feriados**.

La regla clave: **dos profesionales distintas pueden atender a la misma hora**, pero **la misma profesional nunca tendrá dos citas que se solapen**.

---

## 🗂️ 5. Panel del salón (ver las citas)

1. Abre **`admin.html`** (por ejemplo `tusitio.com/admin.html`).
2. Ingresa la contraseña. La predeterminada es `jade2026` — **cámbiala** en `js/config.js`, sección `admin`.
3. Verás todas las citas agrupadas por día, con filtros por fecha, profesional y estado. Puedes marcar cada cita como **Atendida** o **Cancelar**.
4. En la pestaña **Testimonios** apruebas o rechazas los comentarios que envían las clientas (no se publican solos).

> 🔒 **Nota de seguridad:** la contraseña del panel es una protección básica del lado del navegador. Para datos sensibles de clientas, lo ideal es usar el sistema de usuarios de Supabase (Authentication) y endurecer las políticas del archivo `schema.sql`. Mientras tanto, no compartas la dirección de `admin.html` públicamente.

---

## 🌐 6. Cómo publicar en Hostinger (drag-and-drop)

1. Inicia sesión en **Hostinger** y entra al **Administrador de archivos** (File Manager) de tu dominio.
2. Entra a la carpeta **`public_html`**.
3. **Arrastra y suelta** TODOS los archivos y carpetas de este proyecto dentro de `public_html`:
   `index.html`, `admin.html`, y las carpetas `css/`, `js/`, `assets/`, `supabase/`.
   - ✅ Asegúrate de que `index.html` quede **directamente** dentro de `public_html` (no dentro de otra carpeta).
4. Espera a que termine la subida y visita tu dominio. ¡Tu sitio ya está en línea! 🎉

> Cada vez que cambies algo (por ejemplo, `js/config.js`), vuelve a subir ese archivo a Hostinger para que se actualice en línea.

---

## ✅ Lista rápida de tareas iniciales

- [ ] Reemplazar los logos de muestra por los oficiales en `assets/logos/`.
- [ ] Subir fotos reales (salón, fundadora, galería) a `assets/img/`.
- [ ] Completar todos los `[EDITAR: ...]` de `js/config.js`.
- [ ] Poner precios y duraciones reales de los servicios.
- [ ] Configurar profesionales y sus horarios.
- [ ] Cambiar la contraseña del panel (`admin.password`).
- [ ] Actualizar el mapa de Google con la dirección real.
- [ ] Conectar Supabase para reservas en la nube.
- [ ] Publicar en Hostinger.

---

## 💡 Preguntas frecuentes

**¿Necesito saber programar?** No. Solo editar textos entre comillas en `config.js`.

**¿Es gratis?** El sitio sí. Supabase tiene un plan gratuito generoso. Hostinger es el hosting (de pago) donde se publica.

**¿Puedo usar otro sistema de reservas externo (Calendly, etc.)?** Sí. Puedes enlazar la sección de agenda a un servicio externo o reemplazar `js/backend-supabase.js`. El resto del sitio no cambia.

---

Hecho con cariño para **Jade García Beauty Studio**. 🤍
