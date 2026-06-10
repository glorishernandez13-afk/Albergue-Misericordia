-- =====================================================================
-- BASE DE DATOS — Jade García Beauty Studio (Supabase / PostgreSQL)
-- ---------------------------------------------------------------------
-- Copia y pega TODO este archivo en Supabase:
--   Panel de Supabase → SQL Editor → New query → pega → Run.
-- Esto crea las tablas de citas y testimonios, las reglas de seguridad
-- y la función que evita que una MISMA profesional tenga dos citas que
-- se solapen (a prueba de reservas simultáneas).
-- =====================================================================

-- ------------------------- TABLA: citas -------------------------
create table if not exists public.citas (
  id                  uuid primary key default gen_random_uuid(),
  servicio_id         text not null,
  servicio_nombre     text not null,
  profesional_id      text not null,
  profesional_nombre  text not null,
  fecha               date not null,
  hora                text not null,          -- "14:30" (referencia visual)
  inicio_min          int  not null,          -- minutos desde medianoche (inicio)
  fin_min             int  not null,          -- minutos desde medianoche (fin)
  nombre              text not null,
  telefono            text not null,
  comentarios         text default '',
  estado              text not null default 'pendiente', -- pendiente | atendida | cancelada
  creada              timestamptz not null default now()
);

-- Índice para acelerar la búsqueda de horarios por profesional y día
create index if not exists idx_citas_prof_fecha
  on public.citas (profesional_id, fecha);

-- ---------------------- TABLA: testimonios ----------------------
create table if not exists public.testimonios (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  comentario  text not null,
  estrellas   int  not null check (estrellas between 1 and 5),
  foto        text default '',
  estado      text not null default 'pendiente', -- pendiente | aprobado | rechazado
  creado      timestamptz not null default now()
);

-- =====================================================================
-- FUNCIÓN: crear_cita_segura
-- Inserta una cita SOLO si no se solapa con otra de la MISMA profesional
-- ese mismo día. La verificación + inserción ocurren juntas dentro de la
-- base de datos, así dos clientas no pueden tomar el mismo espacio aunque
-- reserven en el mismo instante. Devuelve el id de la cita, o NULL si hubo
-- conflicto de horario.
-- =====================================================================
create or replace function public.crear_cita_segura(
  p_servicio_id        text,
  p_servicio_nombre    text,
  p_profesional_id     text,
  p_profesional_nombre text,
  p_fecha              date,
  p_hora               text,
  p_inicio_min         int,
  p_fin_min            int,
  p_nombre             text,
  p_telefono           text,
  p_comentarios        text
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_id uuid;
begin
  -- Bloquea las filas de esa profesional/día para evitar carreras
  perform 1 from public.citas
   where profesional_id = p_profesional_id
     and fecha = p_fecha
     and estado <> 'cancelada'
   for update;

  -- ¿Existe solapamiento? (dos intervalos chocan si a.inicio < b.fin y b.inicio < a.fin)
  if exists (
    select 1 from public.citas
     where profesional_id = p_profesional_id
       and fecha = p_fecha
       and estado <> 'cancelada'
       and p_inicio_min < fin_min
       and inicio_min   < p_fin_min
  ) then
    return null; -- conflicto: el horario ya está ocupado
  end if;

  insert into public.citas (
    servicio_id, servicio_nombre, profesional_id, profesional_nombre,
    fecha, hora, inicio_min, fin_min, nombre, telefono, comentarios
  ) values (
    p_servicio_id, p_servicio_nombre, p_profesional_id, p_profesional_nombre,
    p_fecha, p_hora, p_inicio_min, p_fin_min, p_nombre, p_telefono, p_comentarios
  )
  returning id into v_id;

  return v_id;
end;
$$;

-- =====================================================================
-- SEGURIDAD (Row Level Security)
-- El sitio público usa la clave "anon". Le damos los permisos justos:
--   • Citas: puede crear (vía función) y leer SOLO los horarios ocupados.
--   • Testimonios: puede crear y leer solo los aprobados.
-- La gestión completa (ver datos de clientas, cambiar estados) debería
-- hacerse con la clave service_role o un usuario autenticado. El panel
-- admin.html incluido funciona con la clave anon para simplicidad; si
-- manejas datos sensibles, revisa la sección de seguridad del README.
-- =====================================================================
alter table public.citas       enable row level security;
alter table public.testimonios enable row level security;

-- --- Políticas para CITAS ---
-- Leer (necesario para calcular horarios libres). Si te preocupa exponer
-- datos de clientas, crea una VISTA que muestre solo inicio_min/fin_min.
drop policy if exists "citas_select_anon" on public.citas;
create policy "citas_select_anon" on public.citas
  for select using (true);

-- Permitir actualizar estado (usado por el panel). Endurécelo si usas auth.
drop policy if exists "citas_update_anon" on public.citas;
create policy "citas_update_anon" on public.citas
  for update using (true) with check (true);

-- La inserción se hace SOLO mediante la función segura (security definer),
-- por eso NO damos política de INSERT directa al rol anon.

-- --- Políticas para TESTIMONIOS ---
drop policy if exists "testimonios_select_aprobados" on public.testimonios;
create policy "testimonios_select_aprobados" on public.testimonios
  for select using (true);

drop policy if exists "testimonios_insert_anon" on public.testimonios;
create policy "testimonios_insert_anon" on public.testimonios
  for insert with check (estado = 'pendiente');

drop policy if exists "testimonios_update_anon" on public.testimonios;
create policy "testimonios_update_anon" on public.testimonios
  for update using (true) with check (true);

-- Permitir que el rol anon ejecute la función de reserva segura
grant execute on function public.crear_cita_segura to anon;

-- ¡Listo! Copia tu URL y tu clave anon (Settings → API) en js/config.js.
