-- ============================================================
-- ReportaTEC · Datos de arranque
-- PROVISIONALES: categorías, dependencias y zonas de trabajo. La tabla definitiva
-- (categoría → dependencia y colonias/ejidos por zona, con datos del INEGI) la entrega
-- la Líder + Analista; cuando esté, se reemplazan los INSERT de abajo.
-- Las localidades marcadas «de ejemplo» son de prueba y se deben borrar.
-- ============================================================

insert into public.dependencias (nombre, descripcion) values
  ('Servicios Públicos Municipales', 'Recolección de basura y limpieza'),
  ('Ecología y Medio Ambiente',       'Quemas y contaminación'),
  ('Sistema Municipal de Agua',       'Drenaje, aguas negras y fugas'),
  ('Alumbrado Público',               'Lámparas y luminarias'),
  ('Atención Ciudadana',              'Reportes que no entran en otra categoría');

insert into public.categorias (clave, nombre, descripcion, dependencia_id, orden)
select v.clave, v.nombre, v.descripcion, d.id, v.orden
from (values
  ('basura',       'Basura tirada',    'Basura acumulada, tiraderos o contenedores llenos.',      'Servicios Públicos Municipales', 1),
  ('quema',        'Quema de basura',  'Humo o fuego por basura, llantas o maleza.',               'Ecología y Medio Ambiente',      2),
  ('aguas_negras', 'Aguas negras',     'Fugas de drenaje, alcantarillas tapadas o desbordadas.',   'Sistema Municipal de Agua',      3),
  ('alumbrado',    'Alumbrado',        'Lámparas fundidas, que parpadean o encendidas de día.',    'Alumbrado Público',              4),
  ('otro',         'Otro problema',    'Algo de un servicio público que no está en la lista.',     'Atención Ciudadana',             5)
) as v(clave, nombre, descripcion, dependencia, orden)
join public.dependencias d on d.nombre = v.dependencia;

insert into public.zonas (nombre) values ('Centro'), ('Norte'), ('Sur'), ('Ejidos');

insert into public.localidades (nombre, tipo, zona_id)
select v.nombre, v.tipo::public.tipo_localidad, z.id
from (values
  ('Zona Centro',              'colonia', 'Centro'),
  ('Colonia de ejemplo Norte', 'colonia', 'Norte'),
  ('Colonia de ejemplo Sur',   'colonia', 'Sur'),
  ('Ejido de ejemplo A',       'ejido',   'Ejidos'),
  ('Ejido de ejemplo B',       'ejido',   'Ejidos')
) as v(nombre, tipo, zona)
join public.zonas z on z.nombre = v.zona;
