import { Link } from 'react-router-dom'
import { IconoFlecha } from '../components/Iconos'

function Sello() {
  return (
    <svg className="sello" viewBox="0 0 200 200" role="img" aria-label="Sello de ReportaTEC">
      <defs>
        <path id="circulo-texto" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
      </defs>
      <g className="sello__anillo">
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 5" />
        <text>
          <textPath href="#circulo-texto">
            SAN PEDRO DE LAS COLONIAS · REPORTE CIUDADANO · FOLIO ·
          </textPath>
        </text>
      </g>
      <circle className="sello__centro" cx="100" cy="100" r="50" />
      <circle cx="100" cy="100" r="22" fill="none" stroke="var(--color-acento)" strokeWidth="6" />
      <circle className="sello__marca" cx="100" cy="100" r="8" />
    </svg>
  )
}

export default function Inicio() {
  return (
    <>
      <section className="portada contenedor">
        <div className="portada__rejilla">
          <div className="entrada">
            <p className="etiqueta">San Pedro de las Colonias y sus ejidos</p>
            <h1>
              ¿Viste un problema en tu calle? <em>Repórtalo</em> en dos minutos.
            </h1>
            <p className="portada__bajada">
              Basura, quemas, aguas negras o una lámpara fundida. Toma una foto, marca dónde está
              y tu reporte llega a la dependencia que lo atiende.
            </p>
            <div className="portada__acciones">
              <Link to="/reportar" className="boton">
                Hacer un reporte <IconoFlecha />
              </Link>
              <Link to="/folio" className="boton boton--secundario">
                Consultar mi folio
              </Link>
            </div>
          </div>
          <Sello />
        </div>
      </section>

      <section className="contenedor" aria-labelledby="como-funciona">
        <h2 id="como-funciona" className="solo-lectores">Cómo funciona</h2>
        <ol className="pasos" role="list">
          <li className="paso">
            <span className="paso__numero" aria-hidden="true">01</span>
            <h3>Toma una foto</h3>
            <p>Hasta tres fotos. La app las hace más ligeras para que se envíen aunque tengas poca señal.</p>
          </li>
          <li className="paso">
            <span className="paso__numero" aria-hidden="true">02</span>
            <h3>Marca dónde está</h3>
            <p>Usa la ubicación de tu celular o elige tu colonia o ejido de la lista.</p>
          </li>
          <li className="paso">
            <span className="paso__numero" aria-hidden="true">03</span>
            <h3>Guarda tu folio</h3>
            <p>Con el folio ves si tu reporte ya se asignó, si está en proceso o si ya se resolvió.</p>
          </li>
        </ol>

        <p className="nota nota--espacio">
          ReportaTEC no atiende emergencias. Si hay peligro para alguna persona, llama al <strong>911</strong>.
        </p>
      </section>
    </>
  )
}
