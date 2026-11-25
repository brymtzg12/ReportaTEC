# ReportaTEC

Aplicación web para que los habitantes de San Pedro de las Colonias, Coahuila, y sus ejidos reporten problemas de servicios públicos (basura, quemas, aguas negras, alumbrado) con foto y ubicación. Cada reporte se canaliza a la dependencia municipal que lo atiende y el ciudadano sigue su avance con un folio.

**Equipo:** Los NavaScripts · Gestión de Proyectos de Software

| Parte | Tecnología |
|---|---|
| Interfaz | React 19 + Vite |
| Base de datos y fotos | Supabase (PostgreSQL + PostGIS + Storage) |
| Mapa (más adelante) | MapLibre + OpenStreetMap |
| Publicación | Cloudflare Pages |

Todo funciona en capas gratuitas.

---

## Correr el proyecto en tu computadora

Necesitas [Node.js](https://nodejs.org) 20 o más reciente.

```bash
npm install
npm run dev
```

Abre http://localhost:5173. Sin el archivo `.env` la app funciona en **modo sin conexión**: el formulario usa categorías y colonias de ejemplo y no guarda nada.

Para conectarla a la base de datos, copia `.env.example` como `.env` y pon las claves de Supabase (siguiente sección).

## Configurar Supabase (una sola vez)

1. Crea un proyecto en [supabase.com](https://supabase.com) (plan gratuito, región `us-east` o la más cercana).
2. Entra a **SQL Editor** y ejecuta, en este orden, el contenido de:
   1. `supabase/migrations/0001_esquema.sql`
   2. `supabase/migrations/0002_seguridad.sql`
   3. `supabase/seed.sql`
3. En **Project Settings → API** copia la *Project URL* y la clave *anon public* a tu `.env`:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
4. Reinicia `npm run dev`. El aviso de «modo sin conexión» debe desaparecer.

La clave *anon* es pública por diseño. Lo que protege los datos son las reglas RLS de `0002_seguridad.sql`. **Nunca** pongas la clave *service_role* en el `.env` ni en el código.

## Publicar en Cloudflare Pages

1. En Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**, elige este repositorio.
2. Configuración de compilación:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
3. En **Environment variables** agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
4. Rama de producción: `main`. Cloudflare publica además una vista previa de cada rama, así que `dev` tiene su propio enlace de pruebas.

El archivo `public/_redirects` hace que las rutas (`/reportar`, `/folio`) funcionen al recargar la página.

## Ramas y forma de trabajo

| Rama | Para qué |
|---|---|
| `main` | Versión publicada. Solo recibe cambios desde `dev` por pull request. |
| `dev` | Lo que se está probando. Se publica sola en el enlace de pruebas. |
| `feature/nombre-corto` | Una rama por tarea, sale de `dev` (ej. `feature/folio-envio`). |
| `fix/nombre-corto` | Una rama por corrección de error. |

En GitHub → **Settings → Branches** agrega una regla para `main` que pida pull request antes de unir cambios.

## Estructura

```
src/
  pages/          Inicio, Reportar, Folio, Panel
  components/     Formulario (fotos, ubicación), iconos y estructura de la página
  lib/            Conexión a Supabase, catálogos y compresión de fotos
  styles/         tokens.css (colores, tipografía, espacios) y app.css
supabase/
  migrations/     Tablas, reglas de seguridad y función crear_reporte
  seed.sql        Datos de arranque (provisionales)
docs/             Propuesta y plan de implementación
```

## Modelo de datos

| Tabla | Qué guarda |
|---|---|
| `dependencias` | Áreas del municipio que atienden reportes |
| `categorias` | Tipos de problema y la dependencia que los atiende |
| `zonas` | Agrupación de colonias y ejidos |
| `localidades` | Colonias y ejidos, con su zona |
| `reglas_canalizacion` | Excepciones: en cierta zona, una categoría la atiende otra dependencia |
| `reportes` | Cada reporte: folio, categoría, descripción, ubicación, estado y dependencia |
| `fotos_reporte` | Hasta 3 fotos por reporte (rutas en el bucket `fotos-reportes`) |
| `historial_estados` | Cada cambio de estado, con fecha, funcionario y nota |
| `funcionarios` | Cuentas del panel, ligadas a una dependencia |

Estados de un reporte: `recibido → asignado → en_proceso → resuelto` (o `rechazado`).

El ciudadano no lee ni escribe tablas directamente: crea su reporte con la función `crear_reporte()`, que valida los datos, evita duplicados al reintentar (con `clave_envio`) y regresa el folio. Un funcionario solo ve los reportes de su dependencia y solo puede cambiar el estado.
