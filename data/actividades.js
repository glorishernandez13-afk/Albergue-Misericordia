/* ============================================================
   ALBERGUE MISERICORDIA — Datos del CALENDARIO de actividades
   ------------------------------------------------------------
   👉 PARA AGREGAR O EDITAR UNA ACTIVIDAD:
   Copia uno de los bloques de abajo y cambia los datos. El estado
   (pasada / actual / futura) se calcula AUTOMÁTICAMENTE comparando
   la fecha con el día de hoy, así que no tienes que indicarlo.

   Campos de cada actividad:
   - titulo:       nombre corto de la actividad
   - fecha:        fecha en formato "AAAA-MM-DD" (año-mes-día)
   - fechaFin:     (opcional) fecha de fin si dura varios días
   - lugar:        dónde se realiza
   - responsables: quién la organiza / contacto
   - descripcion:  detalle que se muestra al hacer clic

   ⚠️ Los datos marcados [COMPLETAR] son de EJEMPLO. Sustitúyelos
      por las actividades reales del albergue.
   ============================================================ */

const ACTIVIDADES = [
  {
    titulo: "Colecta en las calles de San Miguel",
    fecha: "2025-11-27",
    lugar: "Principales calles de San Miguel",
    responsables: "Equipo de recaudación de fondos",
    descripcion:
      "Colecta pública para reunir fondos en el marco del aniversario del albergue. (Actividad histórica de referencia.)",
  },
  {
    titulo: "Campaña “Yo Porto la Camiseta”",
    fecha: "2026-05-10",
    lugar: "Oficinas y empresas de la zona",
    responsables: "Colaboradores del albergue",
    descripcion:
      "Visitas a oficinas y empresas para obtener donativos económicos y en especie. [COMPLETAR: fechas y detalles reales]",
  },
  {
    titulo: "Jornada de voluntariado en cocina",
    fecha: "2026-05-28",
    lugar: "Albergue Misericordia",
    responsables: "Coordinación de voluntariado",
    descripcion:
      "Apoyo de voluntarios en la preparación de los tres tiempos de comida del día. [COMPLETAR: detalles reales]",
  },
  {
    titulo: "Reunión mensual del equipo",
    fecha: "2026-06-05",
    lugar: "Sala de reuniones del albergue",
    responsables: "Dirección y administración",
    descripcion:
      "Revisión de necesidades, ingresos de pacientes y planificación del mes. [COMPLETAR: detalles reales]",
  },
  {
    titulo: "Visita médica especializada",
    fecha: "2026-06-12",
    lugar: "Albergue Misericordia",
    responsables: "Equipo de enfermería",
    descripcion:
      "Jornada de control de salud para los residentes. [COMPLETAR: detalles reales]",
  },
  {
    titulo: "Actividad de recaudación de fondos",
    fecha: "2026-07-20",
    lugar: "[COMPLETAR: lugar]",
    responsables: "[COMPLETAR: responsables]",
    descripcion:
      "Evento para recaudar fondos destinados a la operación del albergue. [COMPLETAR: detalles reales]",
  },
];
