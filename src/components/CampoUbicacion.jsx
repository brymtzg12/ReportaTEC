import { IconoPalomita, IconoUbicacion } from './Iconos'

const MENSAJES_GPS = {
  1: 'No diste permiso para usar tu ubicación. Puedes elegir tu colonia o ejido de la lista.',
  2: 'Tu celular no pudo encontrar tu ubicación. Revisa que el GPS esté prendido o elige de la lista.',
  3: 'La ubicación tardó demasiado. Intenta otra vez o elige de la lista.',
}

/**
 * Ubicación del problema: por GPS o eligiendo colonia/ejido.
 * `gps` es { estado: 'inactivo' | 'buscando' | 'listo' | 'error', lat, lng, precision, mensaje }.
 */
export default function CampoUbicacion({
  gps, setGps, localidadId, setLocalidadId, referencia, setReferencia, localidades, idError,
}) {
  const hayGps = typeof navigator !== 'undefined' && 'geolocation' in navigator

  function pedirUbicacion() {
    if (!hayGps) {
      setGps({ estado: 'error', mensaje: 'Tu navegador no permite usar la ubicación. Elige de la lista.' })
      return
    }
    setGps({ estado: 'buscando' })
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setGps({
          estado: 'listo',
          lat: coords.latitude,
          lng: coords.longitude,
          precision: Math.round(coords.accuracy),
        }),
      (error) => setGps({ estado: 'error', mensaje: MENSAJES_GPS[error.code] ?? MENSAJES_GPS[2] }),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    )
  }

  const colonias = localidades.filter((l) => l.tipo === 'colonia')
  const ejidos = localidades.filter((l) => l.tipo === 'ejido')

  return (
    <div className="ubicacion">
      <div className={`gps${gps.estado === 'listo' ? ' gps--listo' : ''}`}>
        <div className="gps__estado" role="status">
          {gps.estado === 'listo' ? <IconoPalomita /> : <IconoUbicacion />}
          <div>
            {gps.estado === 'inactivo' && <span>Si estás donde está el problema, usa la ubicación de tu celular.</span>}
            {gps.estado === 'buscando' && <span>Buscando tu ubicación…</span>}
            {gps.estado === 'listo' && (
              <>
                <strong>Ubicación guardada</strong>
                <span className="gps__coordenadas">
                  {gps.lat.toFixed(5)}, {gps.lng.toFixed(5)} · precisión de ±{gps.precision} m
                </span>
              </>
            )}
            {gps.estado === 'error' && <span>{gps.mensaje}</span>}
          </div>
        </div>
        <div className="gps__acciones">
          {gps.estado === 'listo' ? (
            <>
              <button type="button" className="boton boton--secundario boton--chico" onClick={pedirUbicacion}>
                Volver a buscar
              </button>
              <button type="button" className="boton-texto" onClick={() => setGps({ estado: 'inactivo' })}>
                Quitar ubicación
              </button>
            </>
          ) : (
            <button
              type="button"
              className="boton boton--secundario boton--chico"
              onClick={pedirUbicacion}
              disabled={gps.estado === 'buscando'}
              aria-describedby={idError}
            >
              <IconoUbicacion /> {gps.estado === 'error' ? 'Intentar otra vez' : 'Usar mi ubicación'}
            </button>
          )}
        </div>
      </div>

      <div className="separador-o etiqueta" aria-hidden="true">o también</div>

      <div className="campo">
        <label htmlFor="localidad">
          Colonia o ejido {gps.estado === 'listo' && <span className="campo__opcional">(opcional)</span>}
        </label>
        <select
          id="localidad"
          className="control"
          value={localidadId}
          onChange={(e) => setLocalidadId(e.target.value)}
          aria-invalid={Boolean(idError) || undefined}
          aria-describedby={idError}
        >
          <option value="">Elige de la lista</option>
          {colonias.length > 0 && (
            <optgroup label="Colonias">
              {colonias.map((l) => <option key={l.id} value={l.id}>{l.nombre}</option>)}
            </optgroup>
          )}
          {ejidos.length > 0 && (
            <optgroup label="Ejidos">
              {ejidos.map((l) => <option key={l.id} value={l.id}>{l.nombre}</option>)}
            </optgroup>
          )}
        </select>
      </div>

      <div className="campo">
        <label htmlFor="referencia">
          Referencia <span className="campo__opcional">(opcional)</span>
        </label>
        <input
          id="referencia"
          className="control"
          type="text"
          maxLength={150}
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
          placeholder="Ej. frente a la tienda, esquina con calle Hidalgo"
          autoComplete="off"
        />
      </div>
    </div>
  )
}
