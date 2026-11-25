create extension if not exists postgis with schema extensions;

-- ---------- Tipos ----------
create type public.estado_reporte as enum ('recibido', 'asignado', 'en_proceso', 'resuelto', 'rechazado');
create type public.tipo_localidad as enum ('colonia', 'ejido');

-- ---------- Catálogos ----------
create table public.dependencias (
  id          smallint generated always as identity primary key,
  nombre      text not null unique,
  descripcion text,
  activa      boolean not null default true
);
comment on table public.dependencias is 'Áreas del municipio que atienden reportes.';

create table public.zonas (
  id     smallint generated always as identity primary key,
  nombre text not null unique
);
comment on table public.zonas is 'Agrupación de colonias y ejidos para canalizar reportes.';

create table public.localidades (
  id      integer generated always as identity primary key,
  nombre  text not null,
  tipo    public.tipo_localidad not null,
  zona_id smallint not null references public.zonas (id),
  centro  extensions.geography(point, 4326),
  unique (nombre, tipo)
);
comment on table public.localidades is 'Colonias de la cabecera y ejidos del municipio.';
comment on column public.localidades.centro is 'Punto aproximado del centro; sirve para ubicar reportes hechos por GPS.';

create table public.categorias (
  id                     smallint generated always as identity primary key,
  clave                  text not null unique check (clave ~ '^[a-z_]+$'),
  nombre                 text not null,
  descripcion            text not null,
  dependencia_id         smallint not null references public.dependencias (id),
  orden                  smallint not null default 0,
  activa                 boolean not null default true
);
comment on column public.categorias.dependencia_id is 'Dependencia que atiende la categoría si no hay una regla por zona.';

-- Excepciones: en ciertas zonas una categoría la atiende otra dependencia.
create table public.reglas_canalizacion (
  categoria_id   smallint not null references public.categorias (id),
  zona_id        smallint not null references public.zonas (id),
  dependencia_id smallint not null references public.dependencias (id),
  primary key (categoria_id, zona_id)
);

-- ---------- Funcionarios ----------
create table public.funcionarios (
  id             uuid primary key references auth.users (id) on delete cascade,
  nombre         text not null,
  dependencia_id smallint not null references public.dependencias (id),
  activo         boolean not null default true,
  creado_en      timestamptz not null default now()
);
comment on table public.funcionarios is 'Cuentas del panel. Cada una pertenece a una dependencia.';

-- ---------- Reportes ----------
-- Folio legible y difícil de adivinar: RT-2611-K7Q3M (año y mes + 5 caracteres sin 0/O ni 1/I).
create or replace function public.generar_folio()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  alfabeto constant text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  sufijo text := '';
begin
  for i in 1..5 loop
    sufijo := sufijo || substr(alfabeto, 1 + floor(random() * length(alfabeto))::int, 1);
  end loop;
  return 'RT-' || to_char(now() at time zone 'America/Monterrey', 'YYMM') || '-' || sufijo;
end;
$$;

create table public.reportes (
  id             uuid primary key default gen_random_uuid(),
  folio          text not null unique default public.generar_folio(),
  clave_envio    uuid not null unique,
  categoria_id   smallint not null references public.categorias (id),
  descripcion    text not null check (char_length(btrim(descripcion)) between 10 and 500),
  localidad_id   integer references public.localidades (id),
  ubicacion      extensions.geography(point, 4326),
  precision_m    integer check (precision_m >= 0),
  referencia     text check (char_length(referencia) <= 150),
  estado         public.estado_reporte not null default 'recibido',
  dependencia_id smallint references public.dependencias (id),
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint reporte_con_ubicacion check (ubicacion is not null or localidad_id is not null)
);
comment on column public.reportes.clave_envio is 'Identificador que genera el celular; evita duplicados al reintentar un envío.';
comment on column public.reportes.dependencia_id is 'Se asigna con la canalización automática (tarea 5).';

create index reportes_dependencia_estado_idx on public.reportes (dependencia_id, estado);
create index reportes_creado_idx on public.reportes (creado_en desc);
create index reportes_ubicacion_idx on public.reportes using gist (ubicacion);

create table public.fotos_reporte (
  id         bigint generated always as identity primary key,
  reporte_id uuid not null references public.reportes (id) on delete cascade,
  ruta       text not null unique,
  orden      smallint not null check (orden between 1 and 3),
  unique (reporte_id, orden)
);
comment on column public.fotos_reporte.ruta is 'Ruta dentro del bucket fotos-reportes: {clave_envio}/{orden}.jpg';

create table public.historial_estados (
  id              bigint generated always as identity primary key,
  reporte_id      uuid not null references public.reportes (id) on delete cascade,
  estado_anterior public.estado_reporte,
  estado_nuevo    public.estado_reporte not null,
  nota            text check (char_length(nota) <= 500),
  funcionario_id  uuid references public.funcionarios (id),
  creado_en       timestamptz not null default now()
);
create index historial_reporte_idx on public.historial_estados (reporte_id, creado_en);

-- ---------- Disparadores ----------
-- Guarda cada cambio de estado en el historial y actualiza la fecha de modificación.
create or replace function public.registrar_cambio_estado()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.historial_estados (reporte_id, estado_anterior, estado_nuevo)
    values (new.id, null, new.estado);
  elsif new.estado is distinct from old.estado then
    new.actualizado_en := now();
    insert into public.historial_estados (reporte_id, estado_anterior, estado_nuevo, funcionario_id, nota)
    values (
      new.id, old.estado, new.estado,
      (select f.id from public.funcionarios f where f.id = auth.uid()),
      nullif(current_setting('reportatec.nota_estado', true), '')
    );
  end if;
  return new;
end;
$$;

create trigger reportes_historial_insert
  after insert on public.reportes
  for each row execute function public.registrar_cambio_estado();

create trigger reportes_historial_update
  before update of estado on public.reportes
  for each row execute function public.registrar_cambio_estado();
