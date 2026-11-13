# Requisitos — Evolución de `@ai27-tech/ui` (ola v2)

Parte de `recomendacion.md` (misma carpeta), ya validada con el equipo. Un solo spec dividido en 7 partes (P1 a P7). Cada parte se puede implementar, revisar y publicar como beta por separado.

## Contexto

La librería (`0.2.0-beta.8`) no tiene breadcrumb, skeletons ni pickers de fecha u hora. Los consumidores (`pf-web-frontend-internal`, `pf-web-frontend-analist-panel`, `pf-web-frontend-client`) arman la estructura de pantalla con `Card` y `Button`. Esta ola agrega esos componentes y mejora tablas, filtros, formularios, badges y el botón de colapso del `Sidebar`.

## Restricciones (de `components-library-steering.md`)

- Sin colores ni fuentes nuevos. Todo valor de color sale de tokens existentes.
- Sin romper la API pública: props nuevos opcionales, con defaults equivalentes al comportamiento actual.
- Sin dependencias nuevas. Los iconos nuevos son SVG inline. Fechas con `Intl`, sin `dayjs` ni `@mantine/*`.
- Todo valor de tamaño, forma o espaciado sale de tokens (`tokens.css`); si falta uno, se agrega primero.
- Cada componente nuevo: estados hover, focus, active, disabled, loading y error cuando apliquen; `prefers-reduced-motion`; teclado completo; stories.
- Convención de nombres: documentación y comentarios en español (México), identificadores en inglés.

## Glosario

- **Hora de pared**: fecha u hora sin zona horaria, tal como la ve el usuario. Formatos: fecha `YYYY-MM-DD`, hora `HH:mm` o `HH:mm:ss`, fecha y hora `YYYY-MM-DDTHH:mm`.
- **Valor vacío**: en los pickers es la cadena `""`.
- **Soft / solid / outline**: tres apariencias de un mismo tono de badge (relleno translúcido, relleno sólido, solo borde).

## Decisiones tomadas

| # | Decisión | Estado |
| --- | --- | --- |
| D1 | Badges: opción A (ejes `appearance` y `size`, alias semánticos). Tonos nuevos quedan para una decisión de diseño aparte | Confirmada |
| D2 | `Sidebar` colapsada: solo el botón de colapso, centrado en el encabezado | Confirmada |
| D3 | Pickers: valores como cadenas de hora de pared. Sin selector de rango en esta ola | Confirmada |
| D4 | Textos por defecto de `Table`, `FilterTable` y `FilterBar` pasan a español, con CHANGELOG | Confirmada |
| D5 | `FilterTable` pasa `variant`, `searchPlaceholder`, `noResultsText` e `icon` a `FilterBar` | Confirmada |
| D6 | Un solo spec, bien particionado (P1 a P7) | Confirmada |
| D7 | Mejoras de formularios: se detallan sobre la marcha, tras una auditoría (tarea 18) | Confirmada |
| D8 | Primer día de la semana del calendario: lunes por defecto, configurable con `weekStartsOn` | Pendiente de confirmar (cambia un default, no la API) |
| D9 | Tonos de badge adicionales (derivados con `color-mix` o tokens nuevos) | Pendiente de diseño; fuera de esta ola |
| D10 | Texto de badges `solid` sobre ámbar/verde en tema claro puede no llegar a contraste AA con `--ui-color-on-primary`; si falla, se necesitan tokens `on-success`/`on-warning` | Pendiente: se mide en la tarea 33 |

---

## P1. Fundaciones

### R1. Popover

1. Existe un componente `Popover` que se renderiza en un portal a `document.body` y se posiciona con `position: fixed` a partir del ancla.
2. `position` acepta `"bottom"`, `"top"` y `"auto"`. En `"auto"` se abre abajo si cabe y arriba si no.
3. Se desplaza horizontalmente para no salirse del viewport.
4. Se reposiciona en scroll de cualquier ancestro y en resize.
5. Se cierra con clic fuera (sin contar el ancla) y con `Escape`.
6. Con `matchAnchorWidth`, el ancho es el del ancla.
7. Se muestra por encima de `Modal`. Usa el token `--ui-z-popover`.
8. Un picker dentro de `Modal`, `Table` o cualquier contenedor con `overflow: hidden` no se recorta.

### R2. Utilidades compartidas

1. `cx` vive en `src/utils/cx.ts` y la usan los componentes nuevos. Los existentes no se refactorizan.
2. Una clase de solo lectura de pantalla (texto visible solo para lectores) está disponible para los componentes de carga.

---

## P2. Cargas (Skeleton, Spinner, ProgressBar)

### R3. Skeleton

1. `Skeleton` con `variant` `"text" | "circle" | "rect"`, `width`, `height` y `animation` `"shimmer" | "pulse" | false` (por defecto `"shimmer"`).
2. Los colores salen de `--ui-color-surface-container-high` y `--ui-color-surface-container-highest`. No hay colores nuevos.
3. Con `prefers-reduced-motion: reduce` no hay animación.
4. `SkeletonText` muestra `lines` líneas; la última es más corta.
5. `SkeletonCard` y `SkeletonTable` (`rows`, `columns`) reproducen la forma de `Card` y `Table`.
6. Los compuestos exponen `role="status"`, `aria-busy="true"` y un texto "Cargando" solo para lectores. Los elementos internos son `aria-hidden`.

### R4. Spinner y ProgressBar

1. `Spinner` con tamaños `sm | md | lg`, `role="status"` y `label` (por defecto "Cargando").
2. `ProgressBar` con `value` (0 a 100) determinada; sin `value` es indeterminada. Expone `role="progressbar"` y `aria-valuenow`/`aria-valuemin`/`aria-valuemax` cuando es determinada.

### R5. Integración con la tabla

1. `Table` con `loading` muestra filas skeleton con las columnas reales en lugar del spinner. Cambio visible.
2. `loadingRows` (por defecto 5) controla cuántas filas.
3. Respetar `density`, `selectable` y `expandable` en las filas skeleton, para que no haya salto de layout al llegar los datos.
4. La tabla expone `aria-busy` mientras carga.

---

## P3. Navegación (Sidebar y Breadcrumb)

### R6. Botón de colapso del Sidebar

1. El botón de colapso está en el extremo derecho del encabezado, solo icono, sin texto.
2. Área de clic de al menos 2.5 rem.
3. Conserva `aria-label` ("Contraer barra lateral" / "Expandir barra lateral") y `aria-expanded`, y agrega `title` con el mismo texto.
4. El icono cambia entre estado expandido y contraído.
5. Con la barra colapsada, el encabezado muestra solo el botón, centrado (D2).
6. El encabezado se renderiza si hay `header` o `onToggleCollapse`.
7. El pie queda solo para la prop `footer`.
8. Las props de `Sidebar` no cambian. El estilo del SVG de la marca (`header`) no afecta al icono del botón.
9. Si no se pasa `onToggleCollapse`, no hay botón (igual que hoy).

### R7. Breadcrumb

1. `Breadcrumb` recibe `items`: `{ label, href?, icon?, onClick?, as? }[]`.
2. Se renderiza como `<nav aria-label="Ruta de navegación"><ol>`. El último elemento lleva `aria-current="page"` y no es enlace.
3. `as` permite usar el `Link` del router; `href` y `onClick` se pasan al elemento.
4. `separator` configurable; por defecto un chevron SVG decorativo (`aria-hidden`).
5. Con `maxItems`, si hay más elementos se muestran el primero, un botón "…" y los últimos `maxItems - 1`. El botón abre un `Popover` con los elementos ocultos.
6. Etiquetas largas se truncan con puntos suspensivos y llevan `title` con el texto completo cuando es cadena.
7. Estados hover y foco visible. Se mantiene en una línea con scroll horizontal si no cabe.

---

## P4. Estructura de información

### R8. Layout

1. `Stack` (columna), `Inline` (fila) y `Grid` aceptan `gap` de 0 a 6, mapeado a `--ui-space-*`.
2. `Stack` e `Inline` aceptan `align`, `justify` y `as`. `Inline` acepta `wrap`.
3. `Grid` acepta `columns` (número fijo) o `minItemWidth` (columnas automáticas).

### R9. PageHeader

1. Recibe `title`, `description`, `breadcrumb`, `actions` y `children` (zona inferior, por ejemplo tabs).
2. El título es `h1` por defecto y admite `titleAs` (`"h1" | "h2"`).
3. En pantallas angostas, las acciones pasan debajo del título.

### R10. Section

1. Recibe `title`, `description`, `actions` y `divider`.
2. Con `collapsible`, el encabezado es un botón con `aria-expanded`. Soporta modo controlado (`collapsed`, `onCollapsedChange`) y no controlado (`defaultCollapsed`).
3. Se renderiza como `<section>` con `aria-labelledby` apuntando al título.

### R11. DescriptionList

1. Recibe `items: { label, value, span? }[]`, `columns` (1 a 4) y `orientation` `"vertical" | "horizontal"`.
2. Usa `<dl>`, `<dt>` y `<dd>`.
3. Un valor `null`, `undefined` o `""` se muestra como `emptyValue` (por defecto "—").

### R12. Stat

1. Recibe `label`, `value`, `icon`, `helpText`, `trend` (`{ direction: "up" | "down" | "flat", value }`) y `loading`.
2. Los colores de la tendencia usan los tokens de éxito y peligro. `invertTrend` intercambia el significado de subir y bajar.
3. Con `loading`, muestra `Skeleton`.

### R13. EmptyState, Alert, Divider

1. `EmptyState`: `icon`, `title`, `description`, `action`, `size` `sm | md`.
2. `Alert`: `variant` `info | success | warning | danger`, `title`, `children`, `icon`, `onDismiss`. `warning` y `danger` usan `role="alert"`; `info` y `success`, `role="status"`.
3. `Divider`: `orientation` y `label` opcional.

### R14. Tabs

1. Composable: `Tabs`, `TabList`, `Tab`, `TabPanel`. Modo controlado (`value`, `onChange`) y no controlado (`defaultValue`).
2. Patrón ARIA de tabs: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`.
3. Teclado: flechas izquierda/derecha, `Home`, `End`. Las pestañas deshabilitadas se omiten.
4. `Tab` admite `icon` y `badge`.

---

## P5. Formularios y pickers

### R15. Calendar (interno, exportado)

1. Vistas de días, meses y años; el encabezado alterna entre ellas.
2. Props: `value`, `onChange`, `min`, `max`, `isDateDisabled`, `locale` (por defecto `"es-MX"`) y `weekStartsOn` (por defecto lunes, D8).
3. Nombres de meses y días vienen de `Intl.DateTimeFormat`.
4. Patrón ARIA de grid de fechas: flechas mueven el día; `PageUp`/`PageDown` cambian de mes; `Shift` + estas, de año; `Home`/`End` van al inicio/fin de la semana; `Enter` o `Espacio` seleccionan.
5. Marca visualmente hoy, el día seleccionado y los días deshabilitados.
6. Todas las operaciones de fecha son aritmética de año/mes/día. No dependen de la zona horaria del navegador.

### R16. DateInput

1. Campo de texto con formato de despliegue `DD/MM/AAAA`, más botón de calendario que abre un `Popover` con `Calendar`.
2. `value` y `onChange` son cadenas `YYYY-MM-DD`; vacío es `""`.
3. Se puede escribir. Al salir del campo o con `Enter`, el texto se interpreta; si no es una fecha válida dentro de `min`/`max`, se restaura la fecha vigente. Aceptar separadores `/`, `-` y `.`.
4. `presets`: lista de `{ label, value }` mostrada junto al calendario. `value` puede ser una cadena o una función que devuelve una cadena.
5. `clearable`, `min`, `max`, `size`, `invalid`, `disabled`, `readOnly`, `placeholder`.
6. Compatible con `FormField`: acepta `id`, `invalid` y `aria-describedby` y los aplica al campo.
7. Modo controlado y no controlado.
8. Abrir con clic en el botón, o `ArrowDown` en el campo. `Escape` cierra y devuelve el foco al campo.

### R17. TimePicker

1. Campos segmentados horas, minutos y (con `withSeconds`) segundos; con `format="12h"` se agrega AM/PM.
2. `value` y `onChange` son `HH:mm` o `HH:mm:ss`; vacío es `""`. Solo se emite un valor cuando todos los segmentos están completos.
3. Flechas arriba/abajo cambian el segmento según `hoursStep`, `minutesStep` y `secondsStep`. Al escribir dos dígitos, el foco pasa al siguiente segmento. `Backspace` vacía el segmento.
4. Dropdown (`withDropdown`, por defecto sí) con columnas de horas, minutos, segundos y AM/PM. Cada columna es un `listbox`; el valor vigente se desplaza a la vista al abrir.
5. `presets`: lista de cadenas `HH:mm` o grupos `{ label, values }`. `closeDropdownOnPresetSelect`. Helper exportado `getTimeRange({ start, end, interval })`.
6. `dropdownPosition`: `"bottom" | "top" | "auto"`, por defecto `"auto"`.
7. `min` y `max`: los valores fuera de rango aparecen deshabilitados en el dropdown; al salir del campo, un valor fuera de rango se ajusta al límite más cercano.
8. Pegar `HH:mm` o `HH:mm:ss` rellena los segmentos.
9. `clearable`, `size`, `invalid`, `disabled`, `readOnly`. Compatible con `FormField`.

### R18. DateTimeInput

1. Compone `DateInput` y `TimePicker` en una sola fila. `value` y `onChange` son `YYYY-MM-DDTHH:mm` (con `:ss` si `withSeconds`); vacío es `""`.
2. Solo emite un valor no vacío cuando fecha y hora están completas. No asigna una hora por omisión, salvo que el consumidor pase `defaultTime`.
3. Mientras falte una parte, conserva la parte completada en estado interno.
4. Compatible con `FormField`, y con `min`/`max` de fecha-hora.

### R19. Mejora de formularios existentes

1. La tarea 18 produce `auditoria-formularios.md` con el estado actual de altura, radio, foco, deshabilitado, error y solo lectura de `Input`, `Select`, `Textarea`, `Checkbox`, `Radio`, `Switch`, `FormField` y `Form`.
2. Con la auditoría se acuerdan los cambios concretos. Candidatos: alturas y estados unificados, `FormField` con indicador de opcional, contador de caracteres y orientación horizontal, `Input` con `clearable` y botón de mostrar/ocultar contraseña, `FormActions` pegajoso, `FormSection` colapsable.
3. Ningún cambio altera la API existente ni los colores.

---

## P6. Tablas y filtros (solo estilo)

### R20. Table

1. `stickyHeader` fija el encabezado; el scroll horizontal muestra sombra en el borde.
2. `striped` (por defecto `true`, igual que hoy) controla las rayas de fila.
3. La selección usa el `Checkbox` de la librería con foco y estados consistentes.
4. El indicador de orden muestra un estado neutro atenuado en columnas ordenables sin orden activo.
5. Separadores de fila con `--ui-color-divider`.
6. El panel expandido entra con una transición breve (opacidad y desplazamiento); sin transición con movimiento reducido.
7. `bulkActions?: (selectedKeys: Set<Key>) => ReactNode`: con filas seleccionadas, muestra una barra con "N seleccionados" y las acciones.
8. Columnas: `minWidth` y `truncate`.
9. `emptyState` por defecto usa `EmptyState`.
10. `labels` permite sobrescribir los textos. Defaults en español (D4): sin datos, seleccionar todas, seleccionar fila, expandir fila, contraer fila, cargando.

### R21. FilterBar y FilterTable

1. `FilterBar` acepta `layout` `"panel" | "toolbar"` (por defecto `"panel"`, el actual).
2. `"toolbar"`: una fila con búsqueda y un botón "Filtros (n)" que abre un `Popover` con los controles. Los chips de filtros activos van debajo.
3. Chips como píldoras con botón de quitar e icono SVG (no el carácter "✕"). Control con filtro activo resaltado con borde primario.
4. Etiquetas de los selects con el mismo tratamiento que `FormField`.
5. Textos por defecto en español, con `labels` (D4).
6. `FilterTable` pasa `variant`, `searchPlaceholder`, `noResultsText` e `icon` a `FilterBar` (D5), expone `filterLayout`, y su conteo dice "resultado" / "resultados".
7. `FilterTable` y `FilterBar` aceptan `loading` y lo propagan a la tabla.

---

## P7. Badges

### R22. Apariencia, tamaño y alias

1. `appearance`: `"soft" | "solid" | "outline"`, por defecto `"soft"` (apariencia actual).
2. `size`: `"sm" | "md"`, por defecto `"sm"` (20 px, igual que hoy). `md` usa 24 px y la escala `label-md`.
3. Variantes nuevas por alias de tokens existentes: `info`, `primary`, `secondary`. Las cinco variantes actuales no cambian.
4. `solid` usa el tono como fondo y `--ui-color-on-primary` como texto (D10).
5. `outline` usa fondo transparente, borde y texto del tono.
6. Todas las combinaciones funcionan con `dot`, `pulse`, `pill`, `truncate`, `expandOnHover`, `fixedWidth` y `tooltip`.
7. Una story documenta cómo mapear los estados del viaje a variante + apariencia.

---

---

# Ampliación (2026-11-12): P8, P9 y P10

P1 a P7 están implementados. Esta ampliación agrega tres partes. **Orden de implementación: P10, P8, P9.** P10 va primero para que P8 y P9 nazcan con Lucide y no se reescriban.

## Decisiones de la ampliación

| # | Decisión | Estado |
| --- | --- | --- |
| D11 | Lucide en todo el repo (código, stories, docs). Se mantiene empaquetado dentro de `dist` (hoy ya lo está) y no se vuelve peer dependency | Confirmada |
| D12 | `Mensaje.secuenciaMensaje` se renombra a `secuencia`, que es el nombre real del contrato. Ruptura en beta: ningún portal usa el tipo hoy | Confirmada |
| D13 | Textos por defecto de mensajería pasan a español, con `labels` para sobrescribirlos (misma lógica que D4) | Confirmada |
| D14 | El panel de mensajes conserva montado su contenido al minimizar (`keepMounted`, por defecto `true`) para no perder el scroll de la conversación. Hoy se desmonta | Confirmada (cambia comportamiento) |
| D15 | El muelle sube de nivel de capa a un token propio por debajo de `Modal`. Hoy comparte `z-index` con el overlay del `Modal` | Confirmada (cambia comportamiento) |
| D16 | Se agrega el hook `useMessageDock` para manejar paneles abiertos, minimizados y desbordados | Confirmada |
| D17 | Adjuntos en el chat: componente de presentación `MessageAttachment`. La subida (`intenciones-subida`) queda en el consumidor | Confirmada |
| D18 | `rolAlEnviar` se mantiene `string`; el contrato ya tiene el enum `Rol` de ocho valores (ADR 22), pero la librería no importa contratos (D1 de `mensajes-contrato-tracer-9`) | Abierta; sin cambio |

## P8. Mensajería (`MessagePanel`) al día con el contrato y afinada

**Contrato de referencia:** `pf-pkg-contracts`, tag `v0.1.0-tracer.40`, `contracts/openapi/mensajeria.yaml`. La librería hoy declara `v0.1.0-tracer.9`. El checkout local del repo de contratos está en una rama de feature, así que el contrato se lee del tag y no del árbol de trabajo.

**Qué cambió en el contrato desde `tracer.9` (verificado):** los esquemas `Mensaje`, `Conversacion`, `EstadoConversacion`, `EnviarMensajeEntrada` e `IntencionSubida` no cambiaron. Lo nuevo es `TrabajoBandeja` y `RevisionBandeja` (bandeja con cursor), emergencias (`CasoEmergencia`, `EmergenciaReaccion`, `NotaEmergencia`), auditoría de conversaciones, y reglas de acceso: `supervisor` y `coordinador` solo leen conversaciones y reciben `403` al enviar, reclamar, liberar, transferir, marcar atendida o registrar recibos (DEC-127). Por tanto la alineación **no** requiere campos nuevos en `Mensaje`. Sí requiere corregir un nombre y cubrir lo que hoy cada portal arma a mano.

**Evidencia de lo que falta (de `pf-web-frontend-internal/src/features/conversaciones/PanelConversacion.tsx`):** usa las props `author` y `time`, ya obsoletas; arma a mano el banner de estado, la fila de botones (reclamar, devolver, marcar atendida), el botón y el estado de "cargar anteriores", el estado vacío y el texto "Atendida"; y monta `MessagePanel` con `open` fijo y sin `onToggle`.

### R25. Alineación con el contrato

1. `Mensaje` usa el campo `secuencia` (D12). Los demás campos coinciden con el contrato en camelCase: `conversacionId`, `clientMessageId`, `audienciaAutor`, `aliasMostrado`, `actorReal`, `rolAlEnviar`, `cuerpo`, `adjuntosIds`, `creadoEn`.
2. `MessageList` y la documentación hablan de `secuencia`; `ultimaSecuencia` se conserva (coincide con `Conversacion.ultima_secuencia`).
3. `CONSUMING.md` incluye una tabla "campo del contrato → prop de la librería" para `Mensaje`, `Conversacion` (estado, `escritura_hasta`, `reclamo_activo`, `atendida_en`, `ultima_secuencia`) y `EnviarMensajeEntrada`.
4. Todo comentario que cite `v0.1.0-tracer.9` pasa a citar `v0.1.0-tracer.40`.
5. La librería sigue sin importar `@ai27-tech/contracts`. Un test unitario con un `Mensaje` completo basado en el ejemplo del contrato verifica que el tipo y el componente aceptan todos sus campos.
6. `MessageBubble` deja de recomendar `author` y `time`; se retiran de las stories y del test. Las props siguen funcionando (obsoletas) hasta la próxima beta mayor.

### R26. Estado de la conversación y acciones

1. Existe `ConversationStatus`, componente de presentación que recibe: `estado` (`abierta | solo_lectura | cerrada`), `escrituraHasta`, `atendida`, `reclamadaPor` (alias de quien tiene el reclamo) y `reclamoPropio` (si el reclamo es del visor). Muestra una `Badge` de estado, el responsable y, si aplica, hasta cuándo se puede escribir.
2. `MessagePanel` acepta `toolbar` (fila de acciones bajo el encabezado, para botones como reclamar, devolver y marcar atendida) y `notice` (franja de aviso, por ejemplo "información desactualizada"). Ambos con estilo propio, sin estilos en línea del consumidor.
3. La librería no decide qué acción está permitida; esa regla (`capacidades`) es del consumidor. Con `supervisor` o `coordinador` el consumidor puede pasar el compositor deshabilitado y un `notice`.
4. `ConversationStatus` y el compositor son coherentes: si `estado` es `solo_lectura` o `cerrada`, el compositor está inactivo y muestra el texto de solo lectura (ya existe).
5. **Qué ve cada audiencia.** En el contrato, `reclamo_activo` y `bandeja_id` solo se entregan a audiencia Interno. Todos los datos de reclamo de `ConversationStatus` son opcionales: si el portal del cliente no los pasa, no se muestra nada del reclamo ni del pool. Hay una story "Vista del cliente" (solo estado y hasta cuándo puede escribir).
6. **El responsable es un alias que pone el consumidor.** El contrato entrega `responsable_id` (un identificador), no un nombre. `reclamadaPor` es el nombre ya resuelto por el portal.
7. **Reglas de la conversación documentadas, no codificadas.** La librería no decide quién puede reclamar, devolver, transferir, marcar atendida o responder. Esas reglas son del contrato y las aplica el consumidor. `CONSUMING.md` las resume en una tabla (R25.3): solo `ejecutivo` reclama; solo el responsable con reclamo activo responde, libera, transfiere y marca atendida; `supervisor` y `coordinador` solo leen y reciben `403`; responder no marca atendida (DEC-117); el override de supervisor está cerrado en V1 (DEC-107); un reclamo concurrente perdido responde `409 conflicto_version_reclamo`; una conversación vencida responde `409 conversacion_solo_lectura`.

### R27. Mensajes

1. `MessageBubble` acepta `deliveryStatus` `"sending" | "sent" | "failed"` (por defecto `"sent"`), `deliveryError` (texto del motivo) y `onRetry`. En `sending` muestra un indicador discreto. En `failed` muestra el aviso y el motivo; el botón "Reintentar" aparece **solo si el consumidor pasa `onRetry`**. Reintentar debe reenviar el mismo `clientMessageId`: el contrato lo trata como idempotente y devuelve el mensaje original. No tiene sentido reintentar con el mismo envío cuando la causa es `409 conflicto_version_reclamo`, `409 conversacion_solo_lectura` o `403`; en esos casos el consumidor no pasa `onRetry` y explica el motivo en `deliveryError`.
2. Los mensajes consecutivos del mismo autor (misma `audienciaAutor` y `aliasMostrado`, a menos de 5 minutos entre sí) se agrupan: el alias solo aparece en el primero y la hora solo en el último.
3. Existe `MessageThread`, que recibe `mensajes: Mensaje[]`, `isOwn(mensaje)` y `pendientes?: MensajePendiente[]`, y renderiza la lista con divisores de día automáticos (Hoy, Ayer, fecha), agrupación y `slotAuditoria` por mensaje. **El orden es siempre por `secuencia` ascendente, nunca por `creadoEn`** (el contrato lo exige en `listarMensajes`). Un mensaje con el mismo `id` que otro ya presente se ignora. `MensajePendiente` (`clientMessageId`, `cuerpo`, `creadoEn`, `deliveryStatus`, `deliveryError?`, `onRetry?`) representa un envío que todavía no tiene `secuencia`; se dibuja al final, después del último mensaje confirmado, y desaparece cuando llega el mensaje con ese `clientMessageId`. Los componentes de bajo nivel (`MessageList`, `MessageBubble`, `MessageDayDivider`) siguen disponibles.
4. `MessageAttachment` (D17): recibe `nombre`, `tamanoBytes`, `tipoMedio` (nombres del contrato), `status` (`ready | uploading | error`) y `onOpen`. La librería no descarga ni sube archivos.
5. `slotAuditoria` (actor real y rol al enviar) se muestra con un estilo discreto de metadatos, claramente distinto del cuerpo, y solo si el consumidor lo pasa.
6. El texto del mensaje conserva saltos de línea (`white-space: pre-wrap`) y rompe palabras largas y URL sin desbordar la burbuja.

### R28. Lista de mensajes

1. El auto-desplazamiento solo ocurre si el usuario está cerca del final (umbral de 4 rem) o si el mensaje nuevo es propio. Si el usuario leía historial, no se mueve el scroll.
2. Cuando llegan mensajes mientras el usuario no está al final, aparece un botón flotante "N mensajes nuevos" que baja al final al activarlo.
3. Al cargar mensajes anteriores (`onCargarAnteriores`), la posición de lectura se conserva; no salta.
4. `loadingPrevious` deshabilita el control y lo muestra en estado de carga.
5. `emptyState` (nodo) y `loading` (muestra esqueletos de burbujas con `Skeleton`).
6. Un divisor "Mensajes nuevos" puede colocarse antes del primer mensaje no leído mediante `ultimaSecuenciaLeida` (el consumidor la obtiene del recibo `leido`).
7. El contenedor tiene `role="log"`, `aria-live="polite"` y `aria-relevant="additions"`.

### R29. Compositor

1. Enter envía; Shift+Enter inserta salto de línea; durante composición con IME (`isComposing`) Enter no envía.
2. `sending` muestra el botón de envío en estado de carga y evita doble envío.
3. `onAttach` (opcional) muestra un botón de clip que el consumidor atiende; la librería no abre el selector.
4. `maxLength` opcional con contador visible al acercarse al límite.
5. Se puede enfocar desde fuera (`composerRef` o `autoFocus`).
6. El borrador no se pierde al minimizar el panel (D14).
7. Textos por defecto en español (D13).

### R30. Abrir y cerrar el panel

1. El encabezado del panel no anida botones: el control de título/avatar es un `<button>` y las acciones de minimizar y cerrar son botones hermanos. Hoy hay un `<button>` dentro de otro `<button>`, que es HTML inválido.
2. Modo controlado (`open` y `onOpenChange`) y no controlado (`defaultOpen`). `onToggle` se conserva y se llama junto con `onOpenChange`.
3. `aria-expanded` y `aria-controls` en el botón del encabezado, apuntando al cuerpo.
4. Al minimizar, el cuerpo sigue montado (D14) pero oculto: sale del orden de tabulación y de los lectores de pantalla (`visibility: hidden`).
5. Al expandir por acción del usuario, el foco pasa al compositor si hay uno habilitado. Al minimizar con el foco dentro del panel, el foco vuelve al botón del encabezado.
6. La expansión y el minimizado se animan con una transición breve y respetan `prefers-reduced-motion`.
7. `onClose` oculta el panel desde fuera; el botón de cerrar solo aparece si hay `onClose`.
8. Clic en el encabezado alterna; clic en minimizar alterna una sola vez (hoy hay `stopPropagation` por la anidación).

### R31. Muelle (`MessageDock`) y barra

1. El muelle usa un token de capa propio `--ui-z-dock` por debajo de `--ui-z-modal` (D15). Un `Modal` abierto queda por encima del muelle.
2. `useMessageDock` (D16) maneja la lista de paneles: `open(id)`, `close(id)`, `toggle(id)`, `barOpen`, `toggleBar()`, `panels` (visibles) y `overflow`. Abrir un panel lo coloca en primer lugar; si se excede la capacidad, el más antiguo pasa a `overflow`. La capacidad se calcula por ancho de la ventana (`maxPanels` la fija).
3. `MessageDock` muestra un chip "+N" cuando hay paneles en `overflow`; al activarlo abre un `Popover` con la lista para traerlos al frente.
4. En pantallas de 560 px o menos, solo hay un panel visible, a todo el ancho, y la barra principal ocupa el ancho disponible.
5. La barra principal (`MessageDockBar`) tiene encabezado sin botones anidados (misma corrección que R30.1), contador de no leídos y lista con: nombre, vista previa, hora del último mensaje (`lastMessageAt`), indicador de no leído y estado opcional.
6. Los textos por defecto del muelle y de la barra están en español: "Mensajería", "Minimizar", "Expandir", "Cerrar conversación", "Sin leer". `role="region"` con nombre accesible único (hoy el muelle y la barra se llaman igual).
7. El muelle ignora los eventos de puntero fuera de sus hijos (ya lo hace) y no bloquea el contenido de la página.

### R32. Estilo

1. Encabezado con avatar, presencia, nombre, subtítulo y badge de no leídos, sin saltos de layout al truncar.
2. Burbujas con jerarquía clara: propias con `--ui-color-primary`, ajenas con `--ui-color-surface-raised`; radios por posición en el grupo; hora y alias con la escala de tipografía de tokens.
3. Altura del cuerpo `min(28rem, 70dvh)`; barra de scroll fina con colores de tokens.
4. Estados de foco visibles en encabezado, acciones, lista, compositor y botón de envío.
5. Sin colores ni valores de tamaño fuera de tokens (steering §1 y §3). Los tamaños sueltos actuales del CSS de `MessagePanel` (`0.6875rem`, `0.625rem`, `0.15rem`) pasan a tokens existentes o a variables locales.
6. Tema claro y oscuro verificados en Storybook.

## P9. Línea del tiempo (`Timeline`)

### R33. Datos y semántica

1. `Timeline` recibe `items`: `{ id, title, description?, timestamp?, dateTime?, icon?, status?, content? }[]`.
2. `status`: `completed | current | upcoming | error | warning`. Por defecto `upcoming`.
3. Se renderiza como `<ol>` con un `<li>` por punto. El punto actual lleva `aria-current="step"`. Cada estado tiene un texto solo para lectores de pantalla ("Completado", "En curso", "Pendiente", "Error", "Aviso"), sobrescribible con `labels`.
4. Si hay `dateTime`, la marca de tiempo se renderiza como `<time dateTime>`.
5. `onItemClick(item, index)` opcional: con él, el contenido del punto es un `<button>`.

### R34. Orientación y responsividad

1. `orientation`: `"vertical"` (por defecto) o `"horizontal"`.
2. Vertical: marcador a la izquierda y contenido a la derecha, línea de conexión continua. Con `align="alternate"` y contenedor ancho (40 rem o más), el contenido alterna a izquierda y derecha; en contenedores angostos vuelve a una sola columna.
3. Horizontal: los puntos se reparten el ancho disponible de forma uniforme; cada punto tiene un ancho mínimo (`minItemWidth`, por defecto 8 rem). Si no caben, el contenedor hace scroll horizontal con `scroll-snap`, atenuado en los bordes, y el punto `current` se centra al montar.
4. `stackBelow` (px): por debajo de ese ancho de contenedor, una línea del tiempo horizontal se muestra vertical. Se mide con `ResizeObserver` sobre el contenedor, no sobre la ventana.
5. Horizontal con `align="alternate"`: el contenido alterna arriba y abajo de la línea para aprovechar el ancho con muchos puntos.
6. Funciona con 0, 1, 2 y N puntos (probado con 100). Con 1 punto no dibuja línea; con 0 muestra `emptyState`.
7. `maxVisible` limita los puntos mostrados y agrega un control "Mostrar N más" / "Mostrar menos" con `aria-expanded`.
8. `reverse` invierte el orden visual (más reciente primero) sin cambiar el arreglo recibido.
9. El texto largo no desborda: títulos y descripciones se ajustan en varias líneas, las palabras largas se rompen.

### R35. Estilo y estados

1. Tamaños `sm | md | lg` (marcador de 1, 1.5 y 2 rem).
2. Colores de estado solo con tokens existentes: `completed` y `current` con `--ui-color-primary`; `error` con `--ui-color-danger`; `warning` con `--ui-color-warning`; `upcoming` con borde `--ui-color-border-strong` y marcador hueco.
3. El tramo de línea que sale de un punto `completed` es sólido y de color primario; los demás tramos son punteados y atenuados.
4. Icono por defecto por estado, de Lucide: `Check` para `completed`, `X` para `error`, `TriangleAlert` para `warning`; `current` y `upcoming` sin icono. `icon` lo sustituye.
5. El punto `current` tiene un anillo con pulso suave; sin movimiento con `prefers-reduced-motion`.
6. `loading` muestra esqueletos con la misma forma de la línea; `loadingItems` controla cuántos.
7. Hover y foco visibles en puntos clickables.

### R36. Calidad

1. Stories (R24): vertical, horizontal, alternada, con 1, 3, 12 y 100 puntos, `maxVisible`, `reverse`, `stackBelow`, cargando, vacío, tamaños, estados, con iconos propios, ancho angosto, y un ejemplo "Historial de estados del viaje" con los estados del contrato `viaje.estados.yaml`.
2. Exportado en `src/index.ts` con sus tipos.
3. Probada la navegación por teclado (Tab sobre puntos clickables) y el panel de accesibilidad.

## P10. Iconos con Lucide en todo el repo

### R37. Sin SVG hechos a mano

1. Ningún archivo bajo `src/` (componentes, stories, tests) define iconos con `<svg>`, `<path>`, `<circle>`, `<rect>`, `<polyline>` ni `<line>` escritos a mano. Todo icono viene de `lucide-react`.
2. Cubre al menos los 16 archivos de componentes con iconos en línea (`Calendar`, `DateInput`, `TimePicker`, `FilterBar`, `FilterTable`, `Form`, `Checkbox`, `Input`, `Select`, `SelectSearchable`, `MessagePanel/shared`, `Table`, `Modal`, `Navbar`, `Pagination`, `Toast`) y las stories de `Button`, `Card`, `Navbar` e `Input`.
3. Los iconos se importan por nombre (`import { X } from "lucide-react"`), para que el empaquetado conserve solo los usados.
4. Un icono decorativo es `aria-hidden`; uno que es el único contenido de un botón lleva el nombre en el botón (`aria-label`).
5. El aspecto no cambia: tamaño, grosor y alineación se conservan (por ejemplo `strokeWidth={3}` en el check de `Checkbox`). Las reglas de CSS que dimensionan `svg` siguen aplicando.
6. Si un icono necesario no existe en Lucide, se usa `createLucideIcon` y se documenta; no se escribe un `<svg>` suelto.

### R38. Verificación y empaquetado

1. Una regla de ESLint (`no-restricted-syntax`) prohíbe `<svg>` en `src/` y `.storybook/`. `pnpm lint` falla si reaparece.
2. `pnpm build:lib` genera `dist` sin referencias a `lucide-react` como import externo y con un tamaño de `dist/ui-library.js` comparable al anterior (se reporta la diferencia).
3. `lucide-react` sigue como `devDependency` y empaquetado (D11). `CONSUMING.md` dice que la librería lo incluye y que los portales no necesitan instalarlo para usar `@ai27-tech/ui`.
4. Las demás menciones de iconos en `README.md`, `CONSUMING.md` y documentación de stories se actualizan.

---

## Requisitos transversales

### R24. Storybook

Storybook es la muestra oficial de cada componente. Aplica a todo componente nuevo y a todo componente existente que cambie.

1. Cada componente nuevo tiene `Nombre.stories.tsx` junto a su código, con `title: "Components/Nombre"`, `tags: ["autodocs"]` y `satisfies Meta<typeof Nombre>`, igual que `Sidebar.stories.tsx`.
2. Las stories cubren como mínimo: un caso por defecto o interactivo, cada variante y tamaño, cada estado aplicable (deshabilitado, error, cargando, vacío, solo lectura) y casos de borde (texto largo, muchos elementos).
3. Las props llevan comentario JSDoc, de modo que la página de autodocs y los controles las describan. Las props de tipo enumerado aparecen como selector en los controles.
4. Los componentes que se combinan con otros tienen una story de composición: pickers dentro de `FormField` y de `Modal`, `Table` con filtros, `PageHeader` con `Breadcrumb` y `Tabs`.
5. Cada story se ve bien en tema claro y oscuro con el selector de la barra de Storybook. Las stories no definen colores propios; usan solo tokens.
6. Los ejemplos y textos de las stories están en español (México).
7. El panel de accesibilidad de Storybook no muestra violaciones nuevas en las stories de componentes nuevos. Hoy `a11y.test` está en `'todo'` (solo informa), así que la revisión es manual.
8. Las stories de componentes existentes que cambian se actualizan en la misma parte: `Sidebar`, `Table`, `FilterTable`, `Badge`, `Form`, `Input`, `Select`. Se agrega `FilterBar.stories.tsx`, que hoy no existe.
9. `pnpm build-storybook` termina sin errores al cerrar cada parte.

### R23. Calidad, exportación y documentación

1. Todo componente y tipo nuevo se exporta desde `src/index.ts`.
2. Stories según R24 (steering §7).
3. `CHANGELOG.md` registra cada parte en `[Unreleased]`, con sección "Cambiado" para los cambios visibles: botón del `Sidebar`, `Table loading`, textos en español.
4. `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build:lib` pasan al cerrar cada parte.
5. Los consumidores (`NavigationSidebar` en internal, `AppShell` en analist-panel) se revisan visualmente tras P3 y P6 contra el build local de la librería.
6. `CONSUMING.md` documenta los componentes nuevos y el contrato de valores de los pickers.

## Fuera de alcance

- De P8: aplicar permisos de la conversación (quién puede reclamar, devolver, transferir, responder); pantalla o diálogo de transferencia; manejo del `409` de reclamo (lo muestra el consumidor con `notice`); override de supervisor (cerrado en V1, DEC-107); notas de emergencia (`NotaEmergencia`, superficie distinta de la conversación); eventos de "escribiendo" (no verificados en el contrato).

- Selector de rango de fechas.
- Tonos de color nuevos para badges (D9).
- Migrar `Select` a `Popover`.
- `Accordion`, `Timeline`, `Avatar`, `Stepper`, `List`/`ListItem`: siguiente ola.
- Cambios de funcionalidad de filtrado más allá de D5.
- Subir la versión del paquete o publicar.
