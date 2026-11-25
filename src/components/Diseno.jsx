import { Link, NavLink, Outlet } from 'react-router-dom'
import { IconoMarca } from './Iconos'

/** Estructura común de todas las páginas: encabezado, contenido y pie. */
export default function Diseno() {
  return (
    <div className="app">
      <header className="encabezado">
        <div className="contenedor encabezado__fila">
          <Link to="/" className="marca" aria-label="ReportaTEC, inicio">
            <IconoMarca />
            <span>Reporta<span className="marca__tec">TEC</span></span>
          </Link>
          <nav className="nav" aria-label="Principal">
            <NavLink to="/reportar">Reportar</NavLink>
            <NavLink to="/folio">Mi folio</NavLink>
            <NavLink to="/panel" className="nav__opcional">Funcionarios</NavLink>
          </nav>
        </div>
      </header>

      <main id="contenido">
        <Outlet />
      </main>

      <footer className="pie">
        <div className="contenedor">
          <span>ReportaTEC · San Pedro de las Colonias, Coahuila</span>
          <span>Emergencias: llama al 911</span>
        </div>
      </footer>
    </div>
  )
}
