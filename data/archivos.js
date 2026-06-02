/* ============================================================
   ALBERGUE MISERICORDIA — Lista de ARCHIVOS PRIVADOS (demo)
   ------------------------------------------------------------
   👉 PARA AGREGAR UN ARCHIVO:
   Sube el archivo a la carpeta "archivos/" del proyecto y añade
   un bloque aquí con su nombre, descripción, tipo y ruta.

   ⚠️ Estos son archivos de EJEMPLO. Además, recuerda que con la
      autenticación SIMULADA estos archivos NO están realmente
      protegidos. Para archivos confidenciales, usa un backend real
      (Supabase Storage / Firebase Storage). Ver README.md.

   Campos:
   - nombre:      nombre del archivo
   - descripcion: para qué sirve
   - tipo:        PDF, Excel, Word, etc.
   - tamano:      tamaño aproximado (texto libre)
   - ruta:        ubicación del archivo (ej. "archivos/manual.pdf")
   ============================================================ */

const ARCHIVOS = [
  {
    nombre: "Reglamento interno del albergue",
    descripcion: "Normas de convivencia para residentes y personal.",
    tipo: "PDF",
    tamano: "320 KB",
    ruta: "#", // [COMPLETAR: subir archivo real y poner la ruta, ej. "archivos/reglamento.pdf"]
  },
  {
    nombre: "Formato de estudio socioeconómico",
    descripcion: "Plantilla para evaluar el caso de cada paciente.",
    tipo: "Word",
    tamano: "85 KB",
    ruta: "#", // [COMPLETAR]
  },
  {
    nombre: "Control de inventario de insumos",
    descripcion: "Registro de alimentos y materiales donados.",
    tipo: "Excel",
    tamano: "120 KB",
    ruta: "#", // [COMPLETAR]
  },
  {
    nombre: "Lista de contactos de hospitales",
    descripcion: "Directorio de centros de tratamiento y referencias.",
    tipo: "PDF",
    tamano: "60 KB",
    ruta: "#", // [COMPLETAR]
  },
];
