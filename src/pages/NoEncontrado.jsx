import { Link } from 'react-router-dom'

export default function NoEncontrado() {
  return (
    <div className="pagina contenedor">
      <header className="pagina__cabecera">
        <p className="etiqueta">Error 404</p>
        <h1>Esta página no existe</h1>
        <p>Puede que el enlace esté mal escrito.</p>
      </header>
      <Link to="/" className="boton boton--secundario">Volver al inicio</Link>
    </div>
  )
}
