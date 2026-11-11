# Requisitos: componentes de la librería para el panel interno

**Repo:** `pf-library-frontend-components` (paquete `@ai27-tech/ui`)
**Fuente:** 7 tarjetas `[Librería]` del backlog de Trello, tablero "Argos V1 - Sprint 5 - 9 nov a 23 nov".
**Estado:** borrador para revisión. Las secciones marcadas **Propuesta** no están en las tarjetas y requieren validación.
**Formato:** spec de tres documentos: `requirements.md` (este), `design.md` y `tasks.md`. Cada parte corresponde a una tarjeta.

| Parte | Tarjeta | Componentes |
| --- | --- | --- |
| 1 | [Tabs](https://trello.com/c/JtfXhDiL) | `Tabs` |
| 2 | [PageHeader y Breadcrumb](https://trello.com/c/psGPCUWp) | `PageHeader`, `Breadcrumb` |
| 3 | [Estados de página](https://trello.com/c/cX0D0WJw) | `EmptyState`, `Skeleton`, `Spinner`, `Alert` |
| 4 | [ConfirmDialog](https://trello.com/c/DOwa74Vg) | `ConfirmDialog` |
| 5 | [DescriptionList](https://trello.com/c/E60dxgU1) | `DescriptionList`, `DescriptionItem` |
| 6 | [Timeline](https://trello.com/c/VMepg8J0) | `Timeline`, `TimelineItem` |
| 7 | [Pagination por cursor](https://trello.com/c/9ntONQ7Y) | `CursorPagination` |

---

## 0. Contexto y alcance

El panel interno (`pf-web-frontend-internal`) improvisa localmente piezas que deberían vivir en la librería. La regla del workspace (`ai27-tech-library-first`) es no duplicar. Este spec cubre **solo** el lado de la librería. El consumo en el panel está en las tarjetas `[Interno]` y queda fuera.

**Historia común.** Como desarrollador de las aplicaciones de AI27, quiero estos componentes en `@ai27-tech/ui`, para no armarlos a mano en cada repo y que todas las pantallas se vean igual.

### 0.1 Estado verificado del repo (rama `pf-lf-d`, `0.2.0-beta.8`)

- Las tarjetas dicen que la librería está en `0.2.0-beta.6` y no exporta Tabs. En el repo la versión es `0.2.0-beta.8`. Confirmé en `src/index.ts` que ninguno de los 12 componentes de este spec existe. Las brechas siguen vigentes.
- Existen `Modal` (portal, trampa de foco, `Escape`, retorno de foco), `Pagination` (numérico, con `total`), `Badge`, `Toast`, `Card`, `Button`, `Table`.
- `Modal` tiene textos en inglés (`aria-label="Close"`) y `Pagination` también (`"Pagination"`, `"Previous page"`, `"of"`). Los componentes nuevos deben nacer en español con textos configurables.
- Cada componente vive en `src/components/<Nombre>/` con `index.ts`, `<Nombre>.tsx`, `<Nombre>.module.css` y `<Nombre>.stories.tsx`. Los exports se agregan a `src/index.ts`.
- Pruebas unitarias: proyecto `unit` de Vitest (jsdom). Hoy solo existe `Button.test.tsx`.

### 0.2 Requisitos transversales (aplican a las 7 partes)

Vienen del steering `components-library-steering.md` y de las tarjetas.

- **RT-1.** Solo tokens `--ui-*`. Sin colores, fuentes ni valores mágicos nuevos. Si falta un token de tamaño, forma o espaciado, se agrega primero a `tokens.css`.
- **RT-2.** Clases tipográficas `ui-text-*` para texto.
- **RT-3.** Tema claro y oscuro. Verificar con la story `DarkMode`.
- **RT-4.** No romper la API pública. Todo lo nuevo es aditivo. `Modal` y `Pagination` no cambian de contrato.
- **RT-5.** Accesibilidad: foco visible, teclado completo, roles ARIA correctos, `prefers-reduced-motion` respetado en toda animación.
- **RT-6.** Textos por defecto en español (México) y sobrescribibles por prop.
- **RT-7.** Cada componente trae stories (ejemplos y documentación) y pruebas unitarias de su comportamiento accesible.
- **RT-8.** Cada cambio se registra en `CHANGELOG.md` en español, según el steering `changelog.md`.
- **RT-9.** Sin dependencias nuevas. Justificar por escrito cualquier excepción.
- **RT-10.** Se publica en una versión nueva de `@ai27-tech/ui` (ver `tasks.md`, sección 9).

---

## Parte 1. Tabs

### Necesidad
El detalle del viaje (Detalle, Ficha, Histórico, Expediente) y Administración (Usuarios, Organizaciones) hoy usan `Button` dentro de un `<nav>`.

### Requisitos (de la tarjeta)
- **R1.1** Exporta `Tabs` con pestaña activa, pestaña deshabilitada y contador o `Badge` opcional por pestaña.
- **R1.2** Modo controlado: pestaña activa y `onChange`.
- **R1.3** Modo navegación por enlaces, para usarse con el router.
- **R1.4** Teclado: flechas, `Inicio` y `Fin`. Roles `tablist`, `tab` y `aria-selected`.
- **R1.5** Tokens `--ui-*`, tema claro y oscuro.
- **R1.6** Documentación, ejemplos y versión publicada.

---

## Parte 2. PageHeader y Breadcrumb

### Necesidad
Cada pantalla pinta su propio `h1`, sin migas, descripción ni zona de acciones. El botón "Volver" cambia de una pantalla a otra.

### Requisitos (de la tarjeta)
- **R2.1** `PageHeader` con título (`h1`), descripción opcional, zona de metadatos (por ejemplo `Badge` de estado), migas y zona de acciones a la derecha.
- **R2.2** `Breadcrumb` con enlaces, último elemento sin enlace, `aria-label="Migas de pan"` y `aria-current="page"`.
- **R2.3** Las acciones pasan a una segunda línea en pantallas angostas (`flex-wrap`).
- **R2.4** Tokens `--ui-*` y clases `ui-text-*`.
- **R2.5** Documentación, ejemplos y versión publicada.

---

## Parte 3. Estados de página: EmptyState, Skeleton, Spinner y Alert

### Necesidad
El panel reimplementa "cargando", "vacío" y "error" en más de seis archivos con `Card` y `<p>`. Los avisos importantes se muestran como una tarjeta cualquiera.

### Requisitos (de la tarjeta)
- **R3.1** `EmptyState`: icono opcional, título, descripción y acción opcional (por ejemplo "Limpiar filtro").
- **R3.2** `Skeleton` con variantes línea, bloque y fila de tabla.
- **R3.3** `Spinner`. `Skeleton` y `Spinner` con `aria-busy` y `role="status"`.
- **R3.4** `Alert`/`Banner` con variantes información, éxito, advertencia y error. Acción opcional y botón de cierre opcional. Los errores usan `role="alert"`.
- **R3.5** Respetar `prefers-reduced-motion` en animaciones.
- **R3.6** Tokens `--ui-*`. Documentación, ejemplos y versión publicada.

---

## Parte 4. ConfirmDialog

### Necesidad
Cada confirmación arma su propio bloque de botones (emergencias, devolución de conversaciones, administración) y varias acciones irreversibles no confirman. Modelo de referencia: `DialogoAdministracion.tsx` en `pf-web-frontend-internal`.

### Requisitos (de la tarjeta)
- **R4.1** `ConfirmDialog` con título, mensaje, etiqueta de confirmar y de cancelar, y variante `danger` o normal.
- **R4.2** Bloquea los botones y muestra `loading` mientras se envía. Evita el doble envío.
- **R4.3** Muestra un error del servidor dentro del diálogo sin cerrarlo.
- **R4.4** Foco al abrir, trampa de foco, `Escape` para cerrar y retorno del foco.
- **R4.5** Tokens `--ui-*`. Documentación, ejemplos y versión publicada.

---

## Parte 5. DescriptionList

### Necesidad
El panel muestra datos (origen, cliente, ETA, escolta, datos del caso de emergencia) con párrafos sueltos o con un `Dato` local que cada archivo redefine, con estilos inline repetidos.

### Requisitos (de la tarjeta)
- **R5.1** `DescriptionList` y `DescriptionItem`, que generan `<dl>`, `<dt>` y `<dd>`.
- **R5.2** Variantes de una columna y de rejilla de 2 a 3 columnas que colapsa en pantallas angostas.
- **R5.3** Valor vacío con texto configurable (por ejemplo "Sin ETA") y acción opcional junto al valor (por ejemplo "Editar").
- **R5.4** Tokens `--ui-*`. Documentación, ejemplos y versión publicada.

---

## Parte 6. Timeline

### Necesidad
El histórico del viaje (notas, estadías, incidencias), las notas de emergencia y el seguimiento del cliente se dibujan con `<ul>` y un borde de 3 px hardcodeado.

### Requisitos (de la tarjeta)
- **R6.1** `Timeline` y `TimelineItem` con fecha, título, descripción, `Badge` de tipo e icono opcional.
- **R6.2** Eventos abiertos (por ejemplo, una estadía en curso) con indicador distinto y contenido dinámico.
- **R6.3** Estados de carga y vacío.
- **R6.4** `<ol>` semántico y tokens `--ui-*`. Documentación, ejemplos y versión publicada.

---

## Parte 7. Paginación por cursor

### Necesidad
El BFF pagina por cursor opaco y no devuelve total ni tamaño de página. El `Pagination` numérico se adapta con un `total` inventado (`pagina * 20 + 1`) y `showInfo={false}`, y muestra números de página inalcanzables. Brecha registrada en `tasks.md` (#4) de la bandeja de viajes; uso actual en `BandejaViajes.tsx` líneas 136-151.

### Requisitos (de la tarjeta)
- **R7.1** `CursorPagination` (o variante de `Pagination`) con "Anterior" y "Siguiente", deshabilitados según haya página previa o siguiente.
- **R7.2** Muestra el número de página actual y, opcionalmente, "N resultados" cuando se conozca el total.
- **R7.3** Estado de carga que evita pulsaciones repetidas.
- **R7.4** Etiquetas accesibles y navegación con teclado. Documentación, ejemplos y versión publicada.

---

## 8. Decisiones

**Decididas (2026-11-11, aprobadas por el solicitante; pendientes de registro formal):** P-1, P-2 y P-6. Son las que afectan la API que usará el panel, por eso se cerraron antes de implementar. Las demás siguen como propuesta.

| ID | Pregunta | Opción propuesta |
| --- | --- | --- |
| P-1 ✅ **Decidida** | En modo enlaces, ¿`Tabs` conserva `role="tab"` o usa navegación con `aria-current="page"`? La tarjeta pide ambos: roles `tab` y enlaces. El patrón WAI-ARIA de pestañas no contempla enlaces dentro de un `tablist` con la misma semántica. | Mantener `tablist`/`tab` en modo controlado. En modo enlaces, `<nav>` + `<a aria-current="page">`, con la misma navegación por flechas. Documentar la diferencia. |
| P-2 ✅ **Decidida** | ¿Cómo se integra con el router sin importarlo? | Prop `renderLink`, igual en `Tabs` y `Breadcrumb`. |
| P-3 | ¿Se acepta agregar `initialFocusRef` (aditivo) a `Modal`? Sin eso no se puede enfocar "Cancelar" en acciones `danger`. | Sí. Si no se acepta, el foco inicial queda en el botón de cerrar. |
| P-4 | ¿La librería formatea fechas en `Timeline`? | No. Recibe el valor ya formateado. |
| P-5 | ¿Qué cuenta como valor vacío en `DescriptionItem`? | `null`, `undefined` y `""`. No `0` ni `false`. |
| P-6 ✅ **Decidida** | ¿`Alert` o `Banner`? | `Alert`. Un solo nombre exportado. |
| P-7 | ¿Se traduce el texto en inglés de `Modal` y `Pagination` (`"Close"`, `"Previous page"`)? | Fuera de alcance de este spec. Se reporta como brecha aparte; los componentes nuevos nacen en español. |
| P-8 | ¿Una sola versión publicada o una por componente? | Ver `tasks.md`, sección 9. |

---

## 10. Fuera de alcance

- Cualquier cambio en `pf-web-frontend-internal` (tarjetas `[Interno]`), incluido reemplazar `DialogoAdministracion`, el `Dato` local y el `total` inventado de `BandejaViajes`.
- Subir la versión de `@ai27-tech/ui` en el panel.
- Traducir los textos existentes de `Modal` y `Pagination` (P-7).
- Cambios de colores, fuentes o paleta.
- Panel de contenido (`tabpanel`) dentro de `Tabs`.

---

## 11. Trazabilidad

| Tarjeta | Referencia de auditoría | Requisitos |
| --- | --- | --- |
| Tabs | brechas de librería | R1.1 a R1.6 |
| PageHeader y Breadcrumb | T3 | R2.1 a R2.5 |
| Estados de página | T5 | R3.1 a R3.6 |
| ConfirmDialog | T6 | R4.1 a R4.5 |
| DescriptionList | D1, G | R5.1 a R5.4 |
| Timeline | D4 | R6.1 a R6.4 |
| Pagination por cursor | D2 | R7.1 a R7.4 |
