// Iconos de trazo propios (24×24). Heredan el color con currentColor.
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function IconoBasura(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  )
}

export function IconoQuema(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21c-3.9 0-6.5-2.6-6.5-6 0-3.6 3-5.6 3.6-9 2.3 1.5 3.4 3.4 3.4 5.4 1-.7 1.7-1.8 1.9-3.1 1.9 1.7 4.1 4 4.1 6.7 0 3.4-2.6 6-6.5 6Z" />
      <path d="M12 21c-1.5 0-2.5-1-2.5-2.4 0-1.5 1.2-2.3 2.5-3.6 1.3 1.3 2.5 2.1 2.5 3.6 0 1.4-1 2.4-2.5 2.4Z" />
    </svg>
  )
}

export function IconoAgua(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 7h10v4H3zM13 9h3a3 3 0 0 1 3 3v1" />
      <path d="M19 16.5c0 1.4-.9 2.5-2 2.5s-2-1.1-2-2.5c0-1.2 2-3.5 2-3.5s2 2.3 2 3.5Z" />
      <path d="M6 7V4M10 7V4" />
    </svg>
  )
}

export function IconoFoco(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" />
    </svg>
  )
}

export function IconoOtro(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4M12 16.8v.2" />
    </svg>
  )
}

export function IconoCamara(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8h3l1.5-2.5h7L17 8h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  )
}

export function IconoUbicacion(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

export function IconoPalomita(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.3 2.4 2.4 4.6-5" />
    </svg>
  )
}

export function IconoFlecha(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function IconoMarca(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" fill="none" stroke="var(--color-acento)" strokeWidth="2.5" />
      <circle cx="12" cy="12" r="4" fill="var(--color-primario)" />
    </svg>
  )
}

/** Icono que corresponde a la clave de cada categoría. */
export const ICONO_CATEGORIA = {
  basura: IconoBasura,
  quema: IconoQuema,
  aguas_negras: IconoAgua,
  alumbrado: IconoFoco,
  otro: IconoOtro,
}
