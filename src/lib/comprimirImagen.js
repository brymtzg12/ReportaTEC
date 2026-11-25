const LADO_MAXIMO = 1280
const CALIDAD_INICIAL = 0.72
const PESO_OBJETIVO = 350 * 1024 // 350 KB: sube rápido aun con poca señal

function cargarImagen(archivo) {
  // createImageBitmap respeta la orientación EXIF de las fotos del celular
  if ('createImageBitmap' in window) {
    return createImageBitmap(archivo, { imageOrientation: 'from-image' })
  }
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(img.src); resolve(img) }
    img.onerror = () => reject(new Error('No se pudo leer la imagen.'))
    img.src = URL.createObjectURL(archivo)
  })
}

function aBlob(lienzo, calidad) {
  return new Promise((resolve) => lienzo.toBlob(resolve, 'image/jpeg', calidad))
}

/**
 * Reduce una foto en el propio celular antes de subirla:
 * lado mayor de 1280 px y JPEG de hasta ~350 KB.
 * @param {File} archivo
 * @returns {Promise<File>}
 */
export async function comprimirImagen(archivo) {
  if (!archivo.type.startsWith('image/')) {
    throw new Error('El archivo no es una imagen.')
  }

  const imagen = await cargarImagen(archivo)
  const escala = Math.min(1, LADO_MAXIMO / Math.max(imagen.width, imagen.height))
  const ancho = Math.round(imagen.width * escala)
  const alto = Math.round(imagen.height * escala)

  const lienzo = document.createElement('canvas')
  lienzo.width = ancho
  lienzo.height = alto
  const ctx = lienzo.getContext('2d')
  ctx.fillStyle = '#ffffff' // las PNG con transparencia no quedan en negro
  ctx.fillRect(0, 0, ancho, alto)
  ctx.drawImage(imagen, 0, 0, ancho, alto)
  imagen.close?.()

  let calidad = CALIDAD_INICIAL
  let blob = await aBlob(lienzo, calidad)
  while (blob && blob.size > PESO_OBJETIVO && calidad > 0.4) {
    calidad -= 0.1
    blob = await aBlob(lienzo, calidad)
  }
  if (!blob) throw new Error('No se pudo procesar la imagen.')

  // Si la original ya era más ligera, se queda la original
  if (archivo.type === 'image/jpeg' && archivo.size <= blob.size && escala === 1) {
    return archivo
  }
  const nombre = archivo.name.replace(/\.[^.]+$/, '') + '.jpg'
  return new File([blob], nombre, { type: 'image/jpeg', lastModified: Date.now() })
}

/** 1534000 → "1.5 MB" */
export function formatearPeso(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
