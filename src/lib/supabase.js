import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const claveAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

/** true cuando el archivo .env tiene las claves de Supabase. */
export const supabaseConfigurado = Boolean(url && claveAnon)

/** Cliente de Supabase, o null si falta configurar el .env. */
export const supabase = supabaseConfigurado ? createClient(url, claveAnon) : null
