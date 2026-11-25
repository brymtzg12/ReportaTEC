import { supabase } from './supabase'

/**
 * Catálogos de respaldo. Son los mismos datos que supabase/seed.sql y se usan
 * cuando Supabase no está configurado, para poder trabajar en la interfaz sin la base de datos.
 * La lista definitiva de categorías, dependencias y localidades la entrega la Líder + Analista.
 */
export const CATALOGOS_RESPALDO = {
  categorias: [
    { id: 1, clave: 'basura', nombre: 'Basura tirada', descripcion: 'Basura acumulada, tiraderos o contenedores llenos.' },
    { id: 2, clave: 'quema', nombre: 'Quema de basura', descripcion: 'Humo o fuego por basura, llantas o maleza.' },
    { id: 3, clave: 'aguas_negras', nombre: 'Aguas negras', descripcion: 'Fugas de drenaje, alcantarillas tapadas o desbordadas.' },
    { id: 4, clave: 'alumbrado', nombre: 'Alumbrado', descripcion: 'Lámparas fundidas, que parpadean o encendidas de día.' },
    { id: 5, clave: 'otro', nombre: 'Otro problema', descripcion: 'Algo de un servicio público que no está en la lista.' },
  ],
  localidades: [
    { id: 1, nombre: 'Zona Centro', tipo: 'colonia', zona: 'Centro' },
    { id: 2, nombre: 'Colonia de ejemplo Norte', tipo: 'colonia', zona: 'Norte' },
    { id: 3, nombre: 'Colonia de ejemplo Sur', tipo: 'colonia', zona: 'Sur' },
    { id: 4, nombre: 'Ejido de ejemplo A', tipo: 'ejido', zona: 'Ejidos' },
    { id: 5, nombre: 'Ejido de ejemplo B', tipo: 'ejido', zona: 'Ejidos' },
  ],
}

/** Trae categorías y localidades de Supabase. Si no hay conexión configurada, usa los de respaldo. */
export async function cargarCatalogos() {
  if (!supabase) return { ...CATALOGOS_RESPALDO, origen: 'respaldo' }

  const [categorias, localidades] = await Promise.all([
    supabase.from('categorias').select('id, clave, nombre, descripcion').eq('activa', true).order('orden'),
    supabase.from('localidades').select('id, nombre, tipo, zonas(nombre)').order('nombre'),
  ])
  if (categorias.error) throw categorias.error
  if (localidades.error) throw localidades.error

  return {
    categorias: categorias.data,
    localidades: localidades.data.map(({ zonas, ...l }) => ({ ...l, zona: zonas?.nombre ?? '' })),
    origen: 'supabase',
  }
}
