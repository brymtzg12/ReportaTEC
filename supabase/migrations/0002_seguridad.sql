-- ============================================================
-- ReportaTEC · 0002 · Seguridad (RLS), almacenamiento de fotos y creación de reportes
--
-- Reglas:
--   · Cualquiera puede leer los catálogos (categorías, colonias, zonas, dependencias).
--   · El ciudadano (anon) NO lee ni modifica tablas: solo crea reportes con crear_reporte()
--     y sube fotos al bucket.
--   · Un funcionario solo ve los reportes de su dependencia y solo puede cambiar su estado.
-- ============================================================

-- ---------- Función auxiliar ----------
-- Dependencia del funcionario con sesión iniciada (null si no es funcionario).
create or replace function public.mi_dependencia()
returns smallint
language sql
stable
security definer
set search_path = ''
as $$
  select f.dependencia_id
  from public.funcionarios f
  where f.id = auth.uid() and f.activo
$$;

-- ---------- Activar RLS en todas las tablas ----------
alter table public.dependencias        enable row level security;
alter table public.zonas               enable row level security;
alter table public.localidades         enable row level security;
alter table public.categorias          enable row level security;
alter table public.reglas_canalizacion enable row level security;
alter table public.funcionarios        enable row level security;
alter table public.reportes            enable row level security;
alter table public.fotos_reporte       enable row level security;
alter table public.historial_estados   enable row level security;

-- ---------- Permisos base ----------
-- Se quita todo y se da solo lo necesario; RLS filtra además las filas.
revoke all on all tables in schema public from anon, authenticated;

grant select on public.dependencias, public.zonas, public.localidades, public.categorias
  to anon, authenticated;
grant select on public.funcionarios, public.reportes, public.fotos_reporte, public.historial_estados,
  public.reglas_canalizacion
  to authenticated;
grant update (estado) on public.reportes to authenticated;  -- solo la columna estado

-- ---------- Políticas: catálogos ----------
create policy "catálogo visible" on public.dependencias for select to anon, authenticated using (true);
create policy "catálogo visible" on public.zonas        for select to anon, authenticated using (true);
create policy "catálogo visible" on public.localidades  for select to anon, authenticated using (true);
create policy "catálogo visible" on public.categorias   for select to anon, authenticated using (true);
create policy "reglas visibles a funcionarios" on public.reglas_canalizacion
  for select to authenticated using (public.mi_dependencia() is not null);

-- ---------- Políticas: funcionarios ----------
create policy "ve su propia cuenta" on public.funcionarios
  for select to authenticated using (id = auth.uid());

-- ---------- Políticas: reportes ----------
create policy "ve reportes de su dependencia" on public.reportes
  for select to authenticated
  using (dependencia_id = public.mi_dependencia());

create policy "actualiza reportes de su dependencia" on public.reportes
  for update to authenticated
  using (dependencia_id = public.mi_dependencia())
  with check (dependencia_id = public.mi_dependencia());

create policy "ve fotos de su dependencia" on public.fotos_reporte
  for select to authenticated
  using (exists (
    select 1 from public.reportes r
    where r.id = reporte_id and r.dependencia_id = public.mi_dependencia()
  ));

create policy "ve historial de su dependencia" on public.historial_estados
  for select to authenticated
  using (exists (
    select 1 from public.reportes r
    where r.id = reporte_id and r.dependencia_id = public.mi_dependencia()
  ));

-- ---------- Almacenamiento de fotos ----------
-- Bucket privado: solo JPEG de hasta 1 MB (la app las comprime a ~350 KB).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos-reportes', 'fotos-reportes', false, 1048576, array['image/jpeg'])
on conflict (id) do nothing;

-- El ciudadano solo puede subir con la forma {clave_envio}/{1|2|3}.jpg y no puede sobrescribir.
create policy "ciudadano sube fotos" on storage.objects
  for insert to anon, authenticated
  with check (
    bucket_id = 'fotos-reportes'
    and name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[1-3]\.jpg$'
  );

create policy "funcionario ve fotos de su dependencia" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'fotos-reportes'
    and exists (
      select 1
      from public.fotos_reporte f
      join public.reportes r on r.id = f.reporte_id
      where f.ruta = storage.objects.name and r.dependencia_id = public.mi_dependencia()
    )
  );

-- ---------- Creación de reportes ----------
-- Única forma en que el ciudadano crea un reporte. Es idempotente: si el celular reintenta
-- con la misma clave_envio, regresa el mismo folio en lugar de duplicar el reporte.
create or replace function public.crear_reporte(
  p_clave_envio  uuid,
  p_categoria_id smallint,
  p_descripcion  text,
  p_fotos        text[],
  p_localidad_id integer default null,
  p_lat          double precision default null,
  p_lng          double precision default null,
  p_precision_m  integer default null,
  p_referencia   text default null
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_folio text;
  v_id    uuid;
  v_ruta  text;
  v_orden smallint := 0;
begin
  select r.folio into v_folio from public.reportes r where r.clave_envio = p_clave_envio;
  if found then
    return v_folio;
  end if;

  if coalesce(array_length(p_fotos, 1), 0) not between 1 and 3 then
    raise exception 'El reporte necesita entre 1 y 3 fotos.' using errcode = '22023';
  end if;
  if (p_lat is null) <> (p_lng is null) then
    raise exception 'La ubicación GPS está incompleta.' using errcode = '22023';
  end if;
  if p_lat is not null and not (p_lat between 25.0 and 26.5 and p_lng between -104.0 and -102.0) then
    raise exception 'La ubicación está fuera del municipio.' using errcode = '22023';
  end if;
  if not exists (select 1 from public.categorias c where c.id = p_categoria_id and c.activa) then
    raise exception 'La categoría no existe.' using errcode = '22023';
  end if;

  foreach v_ruta in array p_fotos loop
    v_orden := v_orden + 1;
    if v_ruta <> p_clave_envio::text || '/' || v_orden || '.jpg'
       or not exists (select 1 from storage.objects o where o.bucket_id = 'fotos-reportes' and o.name = v_ruta) then
      raise exception 'La foto % no se subió correctamente.', v_orden using errcode = '22023';
    end if;
  end loop;

  insert into public.reportes (clave_envio, categoria_id, descripcion, localidad_id, ubicacion, precision_m, referencia)
  values (
    p_clave_envio,
    p_categoria_id,
    btrim(p_descripcion),
    p_localidad_id,
    case when p_lat is not null
      then extensions.st_setsrid(extensions.st_makepoint(p_lng, p_lat), 4326)::extensions.geography end,
    p_precision_m,
    nullif(btrim(p_referencia), '')
  )
  returning id, folio into v_id, v_folio;

  insert into public.fotos_reporte (reporte_id, ruta, orden)
  select v_id, ruta, ordinality::smallint
  from unnest(p_fotos) with ordinality as t(ruta, ordinality);

  return v_folio;
end;
$$;

revoke all on function public.crear_reporte from public;
grant execute on function public.crear_reporte to anon, authenticated;
revoke all on function public.mi_dependencia from public;
grant execute on function public.mi_dependencia to authenticated;
revoke all on function public.generar_folio from public, anon, authenticated;
revoke all on function public.registrar_cambio_estado from public, anon, authenticated;
