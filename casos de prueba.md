# Casos de prueba – ReportaTEC

**Proyecto:** ReportaTEC  
**Equipo:** Los NavaScripts  

## Objetivo

Comprobar que las funciones principales de ReportaTEC trabajen correctamente de acuerdo con los criterios de aceptación de la propuesta del proyecto.

## Casos de prueba

### CP-01. Enviar un reporte

**Objetivo:** Verificar que un ciudadano pueda enviar un reporte con fotografía y ubicación en menos de 2 minutos.

**Pasos:**
1. Abrir ReportaTEC desde un celular.
2. Entrar al formulario para crear un reporte.
3. Agregar una fotografía.
4. Seleccionar la categoría del problema.
5. Agregar la ubicación mediante GPS o seleccionar la colonia o ejido.
6. Escribir una descripción y enviar el reporte.

**Resultado esperado:** El reporte se envía correctamente y el proceso tarda menos de 2 minutos.

**Resultado obtenido:** Pendiente.

**Estado:** Pendiente.

---

### CP-02. Mostrar aviso cuando falla la conexión

**Objetivo:** Comprobar que la aplicación avise cuando no se pueda enviar un reporte por falta de internet.

**Pasos:**
1. Llenar el formulario de un reporte.
2. Desactivar la conexión a internet.
3. Intentar enviar el reporte.
4. Revisar el mensaje que muestra la aplicación.

**Resultado esperado:** La aplicación muestra un aviso indicando que no se pudo enviar el reporte por un problema de conexión.

**Resultado obtenido:** Pendiente.

**Estado:** Pendiente.

---

### CP-03. Evitar reportes duplicados

**Objetivo:** Verificar que al intentar enviar nuevamente un reporte no se registre más de una vez.

**Pasos:**
1. Llenar el formulario de un reporte.
2. Intentar enviarlo mientras la conexión presenta fallas.
3. Restablecer la conexión.
4. Volver a intentar el envío.
5. Revisar los reportes registrados.

**Resultado esperado:** El sistema registra el reporte una sola vez, aunque el usuario intente enviarlo nuevamente.

**Resultado obtenido:** Pendiente.

**Estado:** Pendiente.

---

### CP-04. Enviar el reporte a la dependencia correcta

**Objetivo:** Comprobar que los reportes se asignen a la dependencia correspondiente según su categoría y ubicación.

**Pasos:**
1. Crear un reporte con una categoría determinada.
2. Seleccionar una ubicación.
3. Enviar el reporte.
4. Revisar en el sistema a qué dependencia fue asignado.

**Resultado esperado:** El reporte aparece en la dependencia que corresponde a su categoría y zona.

**Resultado obtenido:** Pendiente.

**Estado:** Pendiente.

---

### CP-05. Cambiar el estado de un reporte

**Objetivo:** Verificar que un funcionario pueda actualizar el estado de un reporte.

**Pasos:**
1. Entrar al panel de funcionarios.
2. Buscar un reporte registrado.
3. Abrir la información del reporte.
4. Cambiar su estado.
5. Guardar los cambios.

**Resultado esperado:** El sistema guarda y muestra el nuevo estado del reporte.

**Resultado obtenido:** Pendiente.

**Estado:** Pendiente.

---

### CP-06. Consultar un reporte mediante su folio

**Objetivo:** Comprobar que un ciudadano pueda consultar el estado de su reporte utilizando el folio.

**Pasos:**
1. Abrir la sección de seguimiento.
2. Escribir el folio de un reporte existente.
3. Realizar la consulta.
4. Revisar la información que aparece.

**Resultado esperado:** El sistema muestra el reporte y su estado actualizado.

**Resultado obtenido:** Pendiente.

**Estado:** Pendiente.

---

### CP-07. Tiempo de carga de la aplicación

**Objetivo:** Comprobar que ReportaTEC cargue en menos de 3 segundos en un celular de gama media.

**Pasos:**
1. Abrir el navegador del celular.
2. Entrar a la dirección de ReportaTEC.
3. Medir el tiempo que tarda en cargar la página principal.

**Resultado esperado:** La página principal carga en menos de 3 segundos.

**Resultado obtenido:** Pendiente.

**Estado:** Pendiente.

---

### CP-08. Acceder a ReportaTEC desde internet

**Objetivo:** Comprobar que la aplicación se pueda abrir desde internet.

**Pasos:**
1. Abrir un navegador en un dispositivo.
2. Escribir la dirección web de ReportaTEC.
3. Esperar a que cargue la página.

**Resultado esperado:** La aplicación abre correctamente sin necesidad de ejecutarla desde la computadora donde se desarrolló.

**Resultado obtenido:** Pendiente.

**Estado:** Pendiente.

---

## Resumen de resultados

| ID | Caso de prueba | Estado |
|---|---|---|
| CP-01 | Enviar un reporte | Pendiente |
| CP-02 | Aviso por falla de conexión | Pendiente |
| CP-03 | Evitar reportes duplicados | Pendiente |
| CP-04 | Asignar a la dependencia correcta | Pendiente |
| CP-05 | Cambiar el estado de un reporte | Pendiente |
| CP-06 | Consultar reporte por folio | Pendiente |
| CP-07 | Tiempo de carga | Pendiente |
| CP-08 | Acceso desde internet | Pendiente |

## Observaciones

- Los casos de prueba están pendientes porque todavía deben ejecutarse en la aplicación.
- Después de realizar cada prueba, se debe escribir el resultado obtenido.
- Si el resultado coincide con el esperado, el estado se cambia a **Aprobado**. Si no coincide, se cambia a **Fallido**.
