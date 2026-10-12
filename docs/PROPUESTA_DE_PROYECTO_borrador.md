# PROPUESTA DE PROYECTO

> **Estado:** Borrador. Pendiente definir los roles del equipo.

## ReportaTEC

**Equipo:** Los NavaScripts
**Materia:** Gestión de Proyectos de Software
**Integrantes:**
- Bryan Martinez Gonzalez
- Mariam Getzamaret Gomez Renteria
- Jesus Fernando Rodriguez Nava
- Baruk Omar Garza Pineda

**Roles del equipo:** [Pendiente]
**Docente:** Roman Antonio Gomez Peralta
**Versión del documento:** 1.0

### Control de versiones

| Versión | Fecha | Autor(es) | Descripción del cambio |
|---|---|---|---|
| 1.0 | 12/10/2026 | Los NavaScripts | Versión inicial de la propuesta |

---

### 1. Resumen ejecutivo

ReportaTEC es una aplicación web que permite a los habitantes de San Pedro de las Colonias y sus ejidos reportar problemas de servicios públicos: basura tirada o quemada, fugas de aguas negras y fallas de alumbrado, entre otros. Desde su celular y con conexión a internet, el ciudadano toma una foto, marca la ubicación y envía su reporte, y el sistema lo hace llegar a la dependencia municipal que corresponde. Los funcionarios atienden y actualizan los reportes desde un panel, y el ciudadano puede seguir su avance con un número de folio. Todo se construirá con herramientas gratuitas y de código abierto, sin costo para el municipio.

### 2. Antecedentes y planteamiento del problema

Hoy, cuando alguien en San Pedro o en un ejido ve una fuga, un foco fundido o basura quemándose, casi siempre tiene que llamar por teléfono, ir a Presidencia o publicar en redes sociales. Muchas veces no sabe a qué área acudir, el reporte se pierde y nadie le avisa si se atendió.

Esto afecta sobre todo a los ejidos, donde las oficinas quedan lejos y trasladarse cuesta tiempo y dinero. Para el municipio, el problema es que no tiene un registro ordenado de lo que pasa ni en dónde pasa. Si no se resuelve, los problemas se acumulan, crecen los riesgos de salud y contaminación, y la gente pierde confianza en que reportar sirva de algo.

### 3. Justificación y beneficios esperados

ReportaTEC concentra todos los reportes en un solo lugar, con foto y ubicación, y los envía automáticamente al área responsable. Los beneficios que buscamos son:

- **Reportar en menos de 2 minutos** desde el celular, sin trámites ni traslados.
- **Canalizar el 100% de los reportes** a la dependencia correcta sin intervención manual.
- **Darle seguimiento al ciudadano** con un folio, sin necesidad de llamar para preguntar.
- **Ver dónde se concentran los problemas** en un mapa, para que el municipio priorice con datos.
- **Costo de infraestructura de $0.**

### 4. Objetivos del proyecto

**Objetivo general:**
Desarrollar, en un plazo de 8 semanas, una aplicación web que permita a los habitantes de San Pedro de las Colonias y sus ejidos reportar en línea problemas de servicios públicos con foto y ubicación, y que canalice cada reporte a la dependencia municipal correspondiente, usando únicamente tecnologías gratuitas y de código abierto.

**Objetivos específicos:**
1. Implementar un formulario de reporte en línea que comprima las fotos en el celular para que se envíen rápido, y que permita ubicar el problema por GPS o eligiendo la colonia o ejido de una lista.
2. Diseñar un sistema de canalización y seguimiento que asigne cada reporte según su categoría y ubicación, y que registre cada cambio de estado.
3. Desarrollar un panel para funcionarios con un mapa de reportes e indicadores básicos de atención por dependencia.

### 5. Alcance del proyecto

| Incluye (dentro del alcance) | No incluye (fuera del alcance) |
|---|---|
| Formulario de reporte en línea con foto, categoría, ubicación y descripción | Funcionamiento sin conexión a internet |
| Compresión de fotos para envíos rápidos con poca señal | Aplicación nativa en Play Store o App Store |
| Canalización automática por categoría y zona | Notificaciones por SMS o WhatsApp (tienen costo) |
| Panel de funcionarios para asignar y cambiar el estado de los reportes | Integración con sistemas internos del Ayuntamiento |
| Consulta de seguimiento por folio | Inteligencia artificial para clasificar fotos |
| Mapa de reportes e indicadores básicos | Atención de emergencias (para eso existe el 911) |
| Control de spam y de reportes duplicados | |

### 6. Interesados (stakeholders)

| Interesado / Rol | Interés en el proyecto | Nivel de influencia | Expectativa principal |
|---|---|---|---|
| Ciudadanos de San Pedro y ejidos | Reportar problemas fácilmente | Alto | Que su reporte sí se atienda |
| Dependencias municipales | Recibir reportes ordenados y con evidencia | Alto | Una herramienta simple para dar seguimiento |
| Líder del equipo ([Pendiente]) | Coordinar y entregar a tiempo | Alto | Cumplir el alcance acordado |
| Equipo de desarrollo | Construir un sistema funcional y de calidad | Alto | Aplicar y aprender tecnologías nuevas |
| Docente / evaluador | Validar el cumplimiento académico | Medio | Un proyecto bien gestionado y documentado |

### 7. Entregables principales

| # | Entregable | Descripción breve | Fecha estimada |
|---|---|---|---|
| 1 | Documento de requerimientos | Casos de uso, categorías y modelo de datos | Semana 2 (23/10/2026) |
| 2 | Prototipo funcional | Formulario de reporte en línea y canalización básica | Semana 4 (06/11/2026) |
| 3 | Versión beta | Panel de funcionarios, folio de seguimiento y mapa | Semana 6 (20/11/2026) |
| 4 | Versión final del sistema | Sistema desplegado, probado y con indicadores | Semana 8 (04/12/2026) |
| 5 | Manual y presentación | Manual de usuario, documentación técnica y demo final | Semana 8 (04/12/2026) |

### 8. Metodología de gestión y desarrollo a emplear

Usaremos **Scrum con sprints de 2 semanas**, organizados en un tablero de GitHub Projects. Elegimos Scrum porque el proyecto es corto, el equipo es pequeño y algunos requerimientos (como las categorías o qué dependencia atiende qué) se irán afinando sobre la marcha. Cada sprint cierra con un avance funcional que podemos mostrar y ajustar. Los cambios se integran en GitHub mediante ramas y revisión de código.

**Asignación de roles y ramas de trabajo:** [Pendiente]

### 9. Cronograma estimado de alto nivel

| Hito | Descripción | Fecha estimada | Entregable asociado |
|---|---|---|---|
| H1 | Aprobación de la propuesta | 16/10/2026 | Este documento |
| H2 | Requerimientos y diseño listos | 23/10/2026 | Documento de requerimientos |
| H3 | Prototipo funcional | 06/11/2026 | Prototipo |
| H4 | Versión beta completa | 20/11/2026 | Versión beta |
| H5 | Entrega final del proyecto | 04/12/2026 | Sistema final, manual y presentación |

### 10. Estimación de recursos

| Tipo de recurso | Detalle | Estimación |
|---|---|---|
| Humano | 4 integrantes. Roles: [Pendiente] | 4 personas, ~8 h por semana cada una |
| Técnico | React + Vite, Supabase (PostgreSQL + PostGIS), MapLibre + OpenStreetMap, GitHub, Cloudflare Pages | Planes gratuitos, sin licencias |
| Económico | Hosting, base de datos y almacenamiento en capas gratuitas | $0 MXN |

### 11. Riesgos iniciales identificados

| Riesgo identificado | Probabilidad | Impacto | Estrategia de respuesta |
|---|---|---|---|
| Falta de disponibilidad de un integrante | Media | Alto | Documentar tareas en el tablero para que otro integrante pueda continuarlas |
| Conexión lenta o inestable en ejidos | Alta | Alto | App ligera, fotos comprimidas y aviso claro al usuario si el envío falla para que pueda reintentar |
| Superar los límites de las capas gratuitas | Baja | Medio | Comprimir fotos, limitar a 3 por reporte y monitorear el uso |
| Reportes falsos o spam | Media | Medio | CAPTCHA, límite de reportes por usuario y revisión antes de canalizar |
| No contar con apoyo directo del municipio | Media | Medio | Simular el rol de funcionarios para la demo y buscar una carta de interés |

### 12. Criterios de aceptación y de éxito del proyecto

- Un ciudadano puede enviar un reporte con foto y ubicación en menos de 2 minutos.
- Si el envío falla por la conexión, la app avisa al usuario y el reporte no se duplica al reintentar.
- Cada reporte llega automáticamente a la dependencia correcta según su categoría y zona.
- Un funcionario puede cambiar el estado de un reporte y el ciudadano lo ve al consultar su folio.
- La aplicación carga en menos de 3 segundos en un celular de gama media.
- El sistema está desplegado en internet y opera con un costo de $0.

### 13. Restricciones y supuestos

**Restricciones:**
- El proyecto debe entregarse dentro del semestre (8 semanas).
- El presupuesto es de $0: solo se usan herramientas gratuitas y de código abierto.
- Los servicios gratuitos tienen límites de almacenamiento y uso.
- La aplicación requiere conexión a internet para enviar y consultar reportes.

**Supuestos:**
- Los integrantes cuentan con computadora e internet para trabajar.
- Los usuarios tienen un celular con navegador, cámara y acceso a internet (datos móviles o wifi).
- Los datos geográficos del INEGI sobre colonias y ejidos están disponibles y actualizados.
- El docente estará disponible para revisar avances al final de cada sprint.

### 14. Aprobación

| Rol | Integrante | Firma / visto bueno |
|---|---|---|
| [Pendiente] | Bryan Martinez Gonzalez | |
| [Pendiente] | Mariam Getzamaret Gomez Renteria | |
| [Pendiente] | Jesus Fernando Rodriguez Nava | |
| [Pendiente] | Baruk Omar Garza Pineda | |
| Docente / evaluador | Roman Antonio Gomez Peralta | |
