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

- Selector de rango de fechas.
- Tonos de color nuevos para badges (D9).
- Migrar `Select` a `Popover`.
- `Accordion`, `Timeline`, `Avatar`, `Stepper`, `List`/`ListItem`: siguiente ola.
- Cambios de funcionalidad de filtrado más allá de D5.
- Subir la versión del paquete o publicar.
