import { useEffect, useRef } from 'react'
import { comprimirImagen, formatearPeso } from '../lib/comprimirImagen'
import { IconoCamara } from './Iconos'

export const MAX_FOTOS = 3
let siguienteId = 0

/**
 * Selector de hasta tres fotos. Cada foto se comprime en el celular al elegirla.
 * `fotos` es una lista de { id, archivo, url, pesoOriginal, procesando, error }.
 */
export default function CampoFotos({ fotos, setFotos, idError }) {
  const urlsCreadas = useRef(new Set())

  // Libera la memoria de las vistas previas al salir de la página
  useEffect(() => {
    const urls = urlsCreadas.current
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  async function agregar(evento) {
    const elegidos = Array.from(evento.target.files ?? [])
    evento.target.value = '' // permite volver a elegir la misma foto
    const lugares = MAX_FOTOS - fotos.length
    const nuevos = elegidos.slice(0, lugares).map((archivo) => ({
      id: ++siguienteId,
      archivo: null,
      url: null,
      pesoOriginal: archivo.size,
      procesando: true,
      original: archivo,
    }))
    if (nuevos.length === 0) return
    setFotos((actuales) => [...actuales, ...nuevos])

    for (const foto of nuevos) {
      try {
        const archivo = await comprimirImagen(foto.original)
        const url = URL.createObjectURL(archivo)
        urlsCreadas.current.add(url)
        setFotos((actuales) =>
          actuales.map((f) => (f.id === foto.id ? { ...f, archivo, url, procesando: false, original: null } : f)),
        )
      } catch {
        // Si una foto no se puede leer, se quita y se avisa
        setFotos((actuales) => actuales.filter((f) => f.id !== foto.id))
        window.alert(`No se pudo usar «${foto.original.name}». Prueba con otra foto.`)
      }
    }
  }

  function quitar(foto) {
    if (foto.url) {
      URL.revokeObjectURL(foto.url)
      urlsCreadas.current.delete(foto.url)
    }
    setFotos((actuales) => actuales.filter((f) => f.id !== foto.id))
  }

  return (
    <div>
      <ul className="fotos" role="list">
        {fotos.map((foto, i) => (
          <li key={foto.id} className={`foto${foto.procesando ? ' foto--procesando' : ''}`}>
            {foto.procesando ? (
              <span className="girando" role="status" aria-label={`Preparando foto ${i + 1}`} />
            ) : (
              <>
                <img src={foto.url} alt={`Foto ${i + 1} del reporte`} />
                <span className="foto__peso">
                  {formatearPeso(foto.pesoOriginal)} → {formatearPeso(foto.archivo.size)}
                </span>
                <button type="button" className="foto__quitar" onClick={() => quitar(foto)} aria-label={`Quitar foto ${i + 1}`}>
                  <span aria-hidden="true">×</span>
                </button>
              </>
            )}
          </li>
        ))}
        {fotos.length < MAX_FOTOS && (
          <li className="foto-agregar">
            <IconoCamara />
            <span>{fotos.length === 0 ? 'Tomar o elegir foto' : 'Agregar otra'}</span>
            <input
              id="fotos"
              type="file"
              accept="image/*"
              multiple
              onChange={agregar}
              aria-describedby={`fotos-nota${idError ? ` ${idError}` : ''}`}
              aria-label="Tomar o elegir fotos del problema"
            />
          </li>
        )}
      </ul>
      <p id="fotos-nota" className="fotos__nota">
        {fotos.length} de {MAX_FOTOS} fotos. Se hacen más ligeras antes de enviarse para que no gastes tantos datos.
      </p>
    </div>
  )
}
