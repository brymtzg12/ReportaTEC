import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Diseno from './components/Diseno'
import Inicio from './pages/Inicio'
import Reportar from './pages/Reportar'
import Folio from './pages/Folio'
import Panel from './pages/Panel'
import NoEncontrado from './pages/NoEncontrado'
import './styles/tokens.css'
import './styles/app.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Diseno />}>
          <Route index element={<Inicio />} />
          <Route path="reportar" element={<Reportar />} />
          <Route path="folio" element={<Folio />} />
          <Route path="panel" element={<Panel />} />
          <Route path="*" element={<NoEncontrado />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
