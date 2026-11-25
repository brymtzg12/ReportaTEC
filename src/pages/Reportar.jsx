import { useEffect, useRef, useState } from 'react'
import CampoFotos from '../components/CampoFotos'
import CampoUbicacion from '../components/CampoUbicacion'
import { ICONO_CATEGORIA } from '../components/Iconos'
import { CATALOGOS_RESPALDO, cargarCatalogos } from '../lib/catalogos'
import { formatearPeso } from '../lib/comprimirImagen'

const DESCRIPCION_MIN = 10
const DESCRIPCION_MAX = 500

/** Revisa el formulario y regresa un objeto { campo: mensaje } con lo que falta. */
function validar({ categoriaId, descripcion, fotos, gps, localidadId }) {
  const errores = {}
  if (!categoriaId) errores.categoria = 'Elige qué tipo de problema es.'

  if (fotos.some((f) => f.procesando)) errores.fotos = 'Espera a que terminen de prepararse las fotos.'
  else if (fotos.length === 0) errores.fotos = 'Agrega al menos una foto del problema.'

  if (gps.estado !== 'listo' && !localidadId) {
    errores.ubicacion = 'Indica dónde está: usa tu ubicación o elige tu colonia o ejido.'
  }

  const texto = descripcion.trim()
  if (texto.length < DESCRIPCION_MIN) {
    errores.descripcion = `Cuéntanos un poco más: escribe al menos ${DESCRIPCION_MIN} letras.`
  } else if (texto.length > DESCRIPCION_MAX) {
    errores.descripcion = `La descripción puede tener hasta ${DESCRIPCION_MAX} letras.`
  }
  return errores
}

const CAMPO_DE_ERROR = { categoria: 'categoria-0', descripcion: 'descripcion', fotos: 'fotos', ubicacion: 'localidad' }

export default function Reportar() {
  const [catalogos, setCatalogos] = useState({ ...CATALOGOS_RESPALDO, origen: 'cargando' })
  const [categoriaId, setCategoriaId] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fotos, setFotos] = useState([])
  const [gps, setGps] = useState({ estado: 'inactivo' })
  const [localidadId, setLocalidadId] = useState('')
  const [referencia, setReferencia] = useState('')
  const [intentoEnviar, setIntentoEnviar] = useState(false)
  const [listo, setListo] = useState(null)
  const alertaRef = useRef(null)

  useEffect(() => {
    let activo = true
    cargarCatalogos()
      .then((datos) => activo && setCatalogos(datos))
      .catch(() => activo && setCatalogos({ ...CATALOGOS_RESPALDO, origen: 'error' }))
    return () => { activo = false }
  }, [])

  const errores = validar({ categoriaId, descripcion, fotos, gps, localidadId })
  const mostrar = (campo) => (intentoEnviar ? errores[campo] : undefined)
  const largo = descripcion.trim().length

  function enviar(evento) {
    evento.preventDefault()
    setIntentoEnviar(true)
    if (Object.keys(errores).length > 0) {
      // Lleva el foco al resumen de errores para que se lea en voz alta
      requestAnimationFrame(() => alertaRef.current?.focus())
      return
    }
    const categoria = catalogos.categorias.find((c) => String(c.id) === categoriaId)
    const localidad = catalogos.localidades.find((l) => String(l.id) === localidadId)
    // El guardado en Supabase y el folio se conectan en la tarea 4.
    setListo({
      categoria: categoria?.nombre,
      descripcion: descripcion.trim(),
      fotos: fotos.map((f) => f.archivo.size),
      ubicacion: gps.estado === 'listo' ? `${gps.lat.toFixed(5)}, ${gps.lng.toFixed(5)} (±${gps.precision} m)` : null,
      localidad: localidad ? `${localidad.nombre} · zona ${localidad.zona}` : null,
      referencia: referencia.trim() || null,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function nuevoReporte() {
    setListo(null)
    setIntentoEnviar(false)
    setCategoriaId('')
    setDescripcion('')
    fotos.forEach((f) => f.url && URL.revokeObjectURL(f.url))
    setFotos([])
    setGps({ estado: 'inactivo' })
    setLocalidadId('')
    setReferencia('')
  }

  const listaErrores = Object.entries(errores)

  return (
    <div className="pagina contenedor">
      {listo && (
        <section className="confirmacion entrada" aria-live="polite">
          <p className="etiqueta">Vista previa · modo desarrollo</p>
          <h2>El reporte está completo</h2>
          <p>
            El formulario pasó todas las validaciones. El envío a la base de datos y el folio se
            conectan en la siguiente tarea; por ahora esto es lo que se enviaría:
          </p>
          <dl>
            <dt>Problema</dt><dd>{listo.categoria}</dd>
            <dt>Descripción</dt><dd>{listo.descripcion}</dd>
            <dt>Fotos</dt><dd>{listo.fotos.length} ({listo.fotos.map(formatearPeso).join(', ')})</dd>
            {listo.ubicacion && <><dt>GPS</dt><dd>{listo.ubicacion}</dd></>}
            {listo.localidad && <><dt>Lugar</dt><dd>{listo.localidad}</dd></>}
            {listo.referencia && <><dt>Referencia</dt><dd>{listo.referencia}</dd></>}
          </dl>
          <div className="confirmacion__acciones">
            <button type="button" className="boton boton--secundario" onClick={() => setListo(null)}>
              Volver al formulario
            </button>
            <button type="button" className="boton-texto" onClick={nuevoReporte}>Empezar otro reporte</button>
          </div>
        </section>
      )}

      <div hidden={Boolean(listo)}>
        <header className="pagina__cabecera entrada">
          <p className="etiqueta">Nuevo reporte</p>
          <h1>¿Qué problema encontraste?</h1>
          <p>Llena los cuatro pasos. Tu reporte llega a la dependencia que atiende ese tipo de problema en tu zona.</p>
        </header>

        {catalogos.origen === 'respaldo' && (
          <p className="nota nota--modo">
            <strong>Modo sin conexión a la base de datos.</strong> Falta el archivo <code>.env</code> con las claves de
            Supabase; se usan categorías y colonias de ejemplo.
          </p>
        )}
        {catalogos.origen === 'error' && (
          <p className="nota nota--modo">
            No se pudo cargar la lista de categorías y colonias. Se muestran las de respaldo; revisa tu conexión.
          </p>
        )}

        <form className="formulario" onSubmit={enviar} noValidate>
          {/* 01 · Categoría */}
          <div className="bloque">
            <span className="bloque__numero" aria-hidden="true">01</span>
            <fieldset aria-describedby={mostrar('categoria') ? 'error-categoria' : undefined}>
              <legend>Tipo de problema</legend>
              <p className="bloque__ayuda">Elige el que más se parezca.</p>
              <div className="categorias">
                {catalogos.categorias.map((c, i) => {
                  const Icono = ICONO_CATEGORIA[c.clave] ?? ICONO_CATEGORIA.otro
                  return (
                    <label key={c.id} className="categoria">
                      <input
                        id={`categoria-${i}`}
                        type="radio"
                        name="categoria"
                        value={c.id}
                        checked={categoriaId === String(c.id)}
                        onChange={(e) => setCategoriaId(e.target.value)}
                      />
                      <span className="categoria__tarjeta">
                        <Icono className="categoria__icono" />
                        <span>
                          <span className="categoria__nombre">{c.nombre}</span>
                          <span className="categoria__desc">{c.descripcion}</span>
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
              {mostrar('categoria') && <p id="error-categoria" className="error-campo">{errores.categoria}</p>}
            </fieldset>
          </div>

          {/* 02 · Fotos */}
          <div className="bloque">
            <span className="bloque__numero" aria-hidden="true">02</span>
            <fieldset>
              <legend>Fotos</legend>
              <p className="bloque__ayuda">Hasta tres. Que se vea bien el problema y algo del lugar.</p>
              <CampoFotos fotos={fotos} setFotos={setFotos} idError={mostrar('fotos') ? 'error-fotos' : undefined} />
              {mostrar('fotos') && <p id="error-fotos" className="error-campo">{errores.fotos}</p>}
            </fieldset>
          </div>

          {/* 03 · Ubicación */}
          <div className="bloque">
            <span className="bloque__numero" aria-hidden="true">03</span>
            <fieldset>
              <legend>¿Dónde está?</legend>
              <p className="bloque__ayuda">Con una de las dos opciones es suficiente.</p>
              <CampoUbicacion
                gps={gps}
                setGps={setGps}
                localidadId={localidadId}
                setLocalidadId={setLocalidadId}
                referencia={referencia}
                setReferencia={setReferencia}
                localidades={catalogos.localidades}
                idError={mostrar('ubicacion') ? 'error-ubicacion' : undefined}
              />
              {mostrar('ubicacion') && <p id="error-ubicacion" className="error-campo">{errores.ubicacion}</p>}
            </fieldset>
          </div>

          {/* 04 · Descripción */}
          <div className="bloque">
            <span className="bloque__numero" aria-hidden="true">04</span>
            <div>
              <label htmlFor="descripcion" className="bloque__titulo">Cuéntanos qué pasa</label>
              <p className="bloque__ayuda">Desde cuándo está así, qué tan grande es o si afecta a alguien.</p>
              <div className="campo">
                <textarea
                  id="descripcion"
                  className="control"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  maxLength={DESCRIPCION_MAX + 50}
                  aria-invalid={Boolean(mostrar('descripcion')) || undefined}
                  aria-describedby={`contador-descripcion${mostrar('descripcion') ? ' error-descripcion' : ''}`}
                  placeholder="Ej. Hay una fuga de aguas negras desde hace tres días y ya llega a la banqueta."
                />
                <span id="contador-descripcion" className={`contador${largo > DESCRIPCION_MAX ? ' contador--limite' : ''}`}>
                  {largo} / {DESCRIPCION_MAX}
                </span>
              </div>
              {mostrar('descripcion') && <p id="error-descripcion" className="error-campo">{errores.descripcion}</p>}
            </div>
          </div>

          <div className="envio">
            {intentoEnviar && listaErrores.length > 0 && (
              <div className="alerta" role="alert" tabIndex={-1} ref={alertaRef}>
                <strong>Falta completar {listaErrores.length === 1 ? 'un paso' : `${listaErrores.length} pasos`}:</strong>
                <ul>
                  {listaErrores.map(([campo, mensaje]) => (
                    <li key={campo}><a href={`#${CAMPO_DE_ERROR[campo]}`}>{mensaje}</a></li>
                  ))}
                </ul>
              </div>
            )}
            <button type="submit" className="boton boton--bloque">Enviar reporte</button>
            <p className="envio__resumen">Al enviarlo recibirás un folio para consultar su avance.</p>
          </div>
        </form>
      </div>
    </div>
  )
}
