/* ============================================================
   ALBERGUE MISERICORDIA — Autenticación SIMULADA (demo)
   ------------------------------------------------------------
   ⚠️ IMPORTANTE — LEER:
   Esta autenticación es SOLO una demostración del lado del cliente.
   Las credenciales están escritas en este archivo, por lo que
   CUALQUIERA puede verlas mirando el código. NO es segura y NO
   debe usarse para proteger archivos o datos confidenciales reales.

   Para producción, migra a una autenticación real (ver README.md):
   recomendamos Supabase Auth o Firebase Authentication.
   ============================================================ */

/* ------------------------------------------------------------
   CREDENCIALES DE EJEMPLO — cámbialas fácilmente aquí.
   (Usuario y contraseña que pediremos en el login.)
   ------------------------------------------------------------ */
const USUARIOS = [
  { usuario: "admin",          clave: "albergue2024" },
  { usuario: "recepcion",      clave: "misericordia"  },
  // Agrega más usuarios aquí: { usuario: "...", clave: "..." },
];

/* Clave usada para recordar la sesión en el navegador */
const SESION_KEY = "am_sesion_activa";

/* ------------------------------------------------------------
   Login
   ------------------------------------------------------------ */
const formLogin = document.getElementById("form-login");
if (formLogin) {
  formLogin.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const usuario = document.getElementById("usuario").value.trim();
    const clave = document.getElementById("clave").value;
    const error = document.getElementById("error-login");

    const valido = USUARIOS.some((u) => u.usuario === usuario && u.clave === clave);

    if (valido) {
      // Guardamos una marca de sesión (solo demo)
      sessionStorage.setItem(SESION_KEY, usuario);
      window.location.href = "panel.html";
    } else {
      error.textContent = "Usuario o contraseña incorrectos.";
    }
  });
}

/* ------------------------------------------------------------
   Protección del panel: se llama desde panel.html
   ------------------------------------------------------------ */
function protegerPanel() {
  const usuario = sessionStorage.getItem(SESION_KEY);
  if (!usuario) {
    window.location.href = "login.html";
    return null;
  }
  return usuario;
}

/* Cerrar sesión */
function cerrarSesion() {
  sessionStorage.removeItem(SESION_KEY);
  window.location.href = "login.html";
}
