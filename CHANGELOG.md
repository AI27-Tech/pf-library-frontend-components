# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Agregado
- **Fechas y horas (`DatePicker`)**: `Calendar` (vistas de días, meses y años; teclado de rejilla ARIA; `min`, `max`, `isDateDisabled`, `weekStartsOn`), `DateInput` (escritura `DD/MM/AAAA`, presets, `clearable`, `displayFormat`), `TimePicker` (segmentos de hora, minuto y segundo; AM/PM con `format="12h"`; dropdown con opciones deshabilitadas fuera de rango; presets y pegado), `DateTimeInput` (fecha y hora en un solo valor `YYYY-MM-DDTHH:mm`) y `getTimeRange` para generar listas de horas. Contrato de valores documentado en el README.
- **`FormField`**: prop `showOptional` (muestra "(opcional)") y `orientation="horizontal"`.
- **`Textarea`**: prop `showCount` con contador de caracteres (`actual/máximo` con `maxLength`).
- **`Input`**: `clearable` con `onClear`, y `passwordToggle` para mostrar u ocultar contraseñas. Estado de solo lectura con `readOnly`.
- **`Select`**: `state`, `readOnly`, `id` y `aria-describedby`.
- **`Checkbox`, `Radio` y `Switch`**: prop `size` (`sm`, `md`, `lg`) e `invalid`.
- **`FormSection`**: prop `collapsible` con `defaultOpen`, `open` y `onOpenChange`.
- **`FormActions`**: prop `sticky`.
- **`Popover`**: contenedor flotante anclado a un elemento. Se renderiza en un portal a `document.body` con `position: fixed`, abre `bottom`, `top` o `auto`, se ajusta al viewport, se reposiciona en scroll y resize, y se cierra con clic fuera o `Escape`. Acepta `align`, `offset`, `matchAnchorWidth` y `role`. Usa el token `--ui-z-popover`.
- **Clase `.ui-sr-only`** en `base.css`: texto visible solo para lectores de pantalla.
- **`Skeleton`, `SkeletonText`, `SkeletonCard` y `SkeletonTable`**: placeholders de carga. Son decorativos para lectores de pantalla, y el contenedor anuncia "Cargando" con `role="status"` y `aria-busy`. `SkeletonCard` usa `Card` como contenedor.
- **`Spinner`**: indicador giratorio en tamaños `sm`, `md` y `lg`, con etiqueta accesible.
- **`ProgressBar`**: barra determinada (con `value`, ajustado a 0-100) e indeterminada.
- **`Table`**: prop `loadingRows` (por defecto 5) para el número de filas en carga.
- **`Breadcrumb`**: ruta de navegación con `items` (`label`, `href`, `icon`, `onClick`, `as`), separador configurable y `maxItems`. Con `maxItems`, los elementos intermedios se pliegan tras un botón "…" que abre un `Popover`. El último elemento lleva `aria-current="page"`. Las etiquetas largas se truncan y muestran el texto completo en `title`.
- **`Stack`, `Inline` y `Grid`**: contenedores de disposición con `gap` de 0 a 6 (mapeado a `--ui-space-*`), `align`, `justify`, `as`, `wrap` en `Inline`, y `columns` o `minItemWidth` en `Grid`.
- **`PageHeader`**: encabezado de página con título (`h1` o `h2` según `titleAs`), descripción, `breadcrumb`, `actions` y una zona inferior para `Tabs`. Bajo 40 rem de ancho, las acciones pasan debajo del título.
- **`Section`**: sección con `<section>` y `aria-labelledby`. Con `collapsible`, el encabezado es un botón con `aria-expanded`; admite modo controlado y no controlado.
- **`DescriptionList`**: lista clave-valor con `dl`, `dt` y `dd`. Admite de 1 a 4 columnas, orientación `vertical` u `horizontal`, `span` por elemento y `emptyValue` para valores vacíos.
- **`Stat`**: métrica sobre `Card` con valor, icono, texto de apoyo y tendencia. La tendencia se comunica con flecha y texto accesible, no solo con color. `invertTrend` invierte el color de subir y bajar. `loading` muestra `Skeleton`.
- **`EmptyState`**: estado vacío con icono, título, descripción y acción, en tamaños `sm` y `md`.
- **`Alert`**: mensaje en línea con variantes `info`, `success`, `warning` y `danger`. `warning` y `danger` usan `role="alert"`; las otras dos, `role="status"`. Botón de cierre opcional.
- **`Divider`**: separador horizontal o vertical, con etiqueta opcional en horizontal.
- **`Tabs`, `TabList`, `Tab` y `TabPanel`**: pestañas controladas y no controladas, con navegación por teclado (flechas con vuelta, `Home` y `End`), `icon`, `badge` y `disabled`.

- **`Table`**: `stickyHeader` (encabezado fijo), `striped`, `bulkActions` (barra de acciones masivas con contador), `labels` (tipo `TableLabels`, exportado), `emptyState` por defecto con `EmptyState`, y columnas con `minWidth` y `truncate`.
- **`FilterBar`**: `layout="toolbar"` (búsqueda, botón "Filtros (n)" que abre un `Popover`, chips debajo), `labels` (tipo `FilterBarLabels`) y `loading`.
- **`FilterTable`**: `filterLayout`, `labels` (tipo `FilterTableLabels`), `tableLabels` (pasa los textos a `Table`) y `loading`, que llega también a la barra de filtros. Los filtros se pasan completos a `FilterBar`: antes se perdían `variant`, `searchPlaceholder`, `noResultsText` e `icon`.
- **Storybook**: historias nuevas de `Table` (encabezado fijo, sin rayas, `minWidth` y `truncate`, acciones masivas, etiquetas personalizadas), de `FilterTable` (disposiciones, filtros activos, carga, selección, filtro buscable) y el archivo nuevo `FilterBar.stories.tsx`.

- **`Badge`**: `appearance` (`"soft"` por defecto, `"solid"`, `"outline"`), `size` (`"sm"` por defecto, `"md"` de 24 px) y las variantes `info`, `primary` y `secondary`. Las cinco variantes existentes en `soft` y `sm` se ven igual. Se agregan historias de matriz y de combinaciones.

### Cambiado
- **Textos por defecto en español** (`Table`, `FilterTable`, `FilterBar`): "No data to display." pasa a "No hay datos para mostrar."; "Select all rows" a "Seleccionar todas las filas"; "Search..." a "Buscar..."; "Clear" a "Limpiar"; "N result(s)" a "N resultado(s)". Se sobrescriben con `labels`.
- **`Table`**: los checkboxes de selección usan el `Checkbox` de la librería. Las columnas ordenables sin orden activo muestran dos flechas atenuadas. Los separadores usan `--ui-color-divider`. Las rayas alternas se controlan con `striped` (por defecto, igual que antes). El panel expandido entra con una transición breve, sin ella con movimiento reducido. Mientras carga, la tabla usa "Cargando" como `aria-label` si no se pasa uno.
- **`FilterBar`**: los chips usan un icono SVG en lugar de "✕" y el estilo de píldora. Las etiquetas de los filtros siguen el estilo de `FormField`, y un control con filtro activo se resalta con borde primario.
- **`Popover`**: si el contenido no cabe ni arriba ni abajo, se mantiene dentro del viewport. Nueva prop `onPositioned`, que avisa cuando el contenido ya es visible.
- **`Input`**: el estado `error` ahora pinta el borde. Antes solo marcaba `aria-invalid`.
- **`Select`**: `FormField` lo asocia con su etiqueta y con el texto de ayuda o error (antes el `id` no llegaba al control).
- **`Checkbox`, `Radio` y `Switch`**: ya no envían la prop `invalid` al `<input>`. Si el control está inválido, se marca con `aria-invalid`. El radio del checkbox pasa a `--ui-radius`, igual que `Input`.
- **`Form`**: `Form.tsx` usa el `cx` compartido de `Input/utils.ts`.
- **`Table` con `loading`**: muestra filas en skeleton que conservan las columnas, la selección y la expansión, en lugar de un spinner. El checkbox de seleccionar todo queda deshabilitado mientras carga. Se quitó el spinner y su CSS de `Table.module.css`.
- **`ImageCard`** (y `ImageGrid`, que la usa): mientras la imagen carga, muestra un placeholder `Skeleton` sobre el area de imagen. Si la imagen falla, el placeholder se retira. No cambian las props.
- **`Sidebar`**: el botón de colapso pasa del pie al encabezado y es solo icono (`PanelLeftClose` / `PanelLeftOpen` de `lucide-react`), centrado cuando la barra está contraída. El encabezado se muestra si hay `header` u `onToggleCollapse`. La prop `footer` ahora es la única que renderiza el pie. Sin `onToggleCollapse` no hay botón, como antes. Si una barra con `onToggleCollapse` no tenía `header`, ahora muestra una fila de encabezado de 3.5 rem con solo el botón.

## [0.2.0-beta.8] — 2026-11-06

### Agregado

- **`FilterBar`**: `FilterDefinition` acepta `variant` (`"searchable"` para filtrar escribiendo), `searchPlaceholder` y `noResultsText`, que se pasan al `Select`. Sin `variant`, el comportamiento no cambia.

### Corregido

- **`eslint.config.js`**: `storybook-static` queda excluido del lint, igual que `dist`. `pnpm lint` completo ya no falla por artefactos de build.
- **`formatSmartTimestamp`**: una fecha inválida devuelve cadena vacía en lugar de `NaN`.

## [0.2.0-beta.7] — 2026-11-06

### Agregado

- **`Select` con variante buscable**: nueva prop `variant="searchable"` que permite escribir para filtrar las opciones. Incluye las props `searchPlaceholder` y `noResultsText`, navegación con teclado (flechas, Enter, Escape, Tab) y atributos ARIA de combobox. La variante por defecto conserva su DOM; la única diferencia de comportamiento es la corrección listada en "Corregido". Spec en `.kiro/specs/select-buscable/`.
- **CI (E8-T1)**: Workflow `ci.yml` que corre `lint`, `typecheck` y `test` en cada pull request y en cada push a las tres ramas del flujo (`pf-lf-m/d/q`), al estilo de los backends de la plataforma. `publish.yml` no se tocó: la publicación sigue disparándose por `release`.
- **Flujo de ramas (E8-T1)**: Workflows `promotion-pr-dq.yml` y `promotion-pr-qm.yml`, copiados del patrón de la plataforma. Mantienen al día un PR `d → q` y otro `q → m`; derivan la rama destino del sufijo y no fusionan (merge manual).
- **Pruebas unitarias**: Proyecto `unit` de Vitest en jsdom (independiente del proyecto `storybook`, que corre en navegador real y queda fuera del CI de PR), con `Button.test.tsx` (render, `onClick`, estado deshabilitado y `aria-busy`). Scripts `test` y `test:watch` que corren solo el proyecto `unit`, y `typecheck` (`tsc -b`).
- **Pre-commit**: Hook de Husky (`lint-staged` + `tsc -b`) para alinear la línea base de calidad con los portales. No se introdujo Prettier en la librería (queda como decisión abierta del equipo).

- **Mensajería alineada al contrato `v0.1.0-tracer.9`**: tipos `Mensaje`, `AudienciaAutor`, `EstadoConversacion` y `EnviarMensajeEntrada`. `MessageBubble` acepta `mensaje`, `aliasMostrado`, `creadoEn`, `adjuntos` y `slotAuditoria`. `MessageList` acepta `hayMas`, `onCargarAnteriores` y `ultimaSecuencia`. `MessageComposer` acepta `estadoConversacion` y `textoSoloLectura`. `DockConversation` acepta `conversacionId`. Spec en `.kiro/specs/mensajes-contrato-tracer-9/`.

### Corregido

- **`Select` por defecto**: un `defaultValue` con `placeholder` ya se muestra. Antes, el placeholder reemplazaba el valor inicial. Este es el único cambio de comportamiento de la variante por defecto.

### Cambiado

- **`vite.config.ts`**: `test.projects` ahora declara dos proyectos (`unit` y `storybook`); antes solo `storybook`.
- **`tsconfig.build.json`**: excluye `src/vitest-env.d.ts` del build de publicación, además de las stories y los tests, para que `dist` no lleve artefactos de prueba.
- **`MessageComposer`**: `onSend` recibe `{ cuerpo, clientMessageId }`. El `clientMessageId` es un UUID nuevo por envío. Un callback sin parámetros sigue compilando.

### Obsoleto

- **`MessageBubble`**: las props `author` y `time` quedan obsoletas. Usar `aliasMostrado` y `creadoEn`. Siguen funcionando en esta beta.

## [0.2.0-beta.6] — 2026-09-28

### Agregado

- **Tooltip**: Nuevo componente de presentación flotante (`position: fixed` vía portal a `document.body`) para mostrar texto completo sin que lo recorten contenedores con `overflow`, `transform` o `backdrop-filter`. Se posiciona a partir de coordenadas de viewport; quien lo usa controla su visibilidad.
- **Badge — `truncate`**: Recorta el texto largo con puntos suspensivos ("…") en vez de dejar que crezca o se corte contra el borde. Acepta `true`, un número (px) o un string CSS de ancho máximo. Al desbordar, muestra el valor completo en un tooltip.
- **Badge — `expandOnHover`**: Con `truncate`, despliega el badge completo al pasar el cursor para leer todo el texto (sin animación de scroll).
- **Badge — `fixedWidth`**: Con `truncate`, da al badge un ancho fijo para que todos midan lo mismo y se vean parejos en una rejilla o columna.
- **Badge — `tooltip`**: Con `truncate`, elige cómo mostrar el texto completo al pasar el cursor: `"custom"` (tooltip propio, por defecto), `"native"` (atributo `title`) o `false`.
- **ImageCard — `BadgeConfig`**: Reenvía `truncate`, `expandOnHover`, `fixedWidth` y `tooltip` al Badge interno, para poder usar el recorte y el tooltip en los badges del grid.
- **Storybook**: Historias nuevas del Badge (`TruncatedInNarrowCells`, `TruncateComparison`, `ExpandOnHover`, `FixedWidthDiagnostic`, `InImageGrid`) y del `Tooltip`.

### Cambiado

- **Badge**: El `.badge` base ahora tiene `max-width: 100%` para no rebasar su contenedor. Solo tiene efecto visible cuando un badge se desbordaría; los badges que ya cabían no cambian.

### Arreglado

- **ImageCard**: Los badges anchos ya no se desbordan del borde de la card. Los `.badgeWrapper` ahora ceden espacio (`min-width: 0`, `flex` ajustado) en vez de empujar fuera del contenedor. Los badges que ya cabían no cambian de posición.

## [0.2.0-beta.2] — 2026-09-22

### Agregado

- **ImageCard**: Componente de tarjeta con imagen 16:9, badges posicionables (dot, pulse, pill) en 4 esquinas, footer customizable
- **ImageCarousel**: Carrusel responsivo con layout por secciones temáticas y scroll horizontal suave
- **ImageGrid**: Grid responsivo (1–6 columnas) con ImageCards e integración de FilterBar unificado
- **FilterBar**: Componente unificado de filtros reutilizable con header, contador de activos, grid-responsive
- **Visor**: Visualizador genérico `<T extends Medium>` para mediums (IMAGE/AUDIO) con:
  - Zoom 1x–8x (rueda, teclado, botones)
  - Rotación ±90° (teclado, botones)
  - Panning con drag cuando zoom > 1x
  - Reproductor de audio HTML5 integrado
  - Keyboard shortcuts: Esc, ←/→, +/−, r, 0
  - Navegación entre múltiples mediums
- **lucide-react@^1.47.0**: Integración de 1500+ iconos tree-shakeable (9 utilizados: ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCcw, RotateCw, Maximize, Headphones)
- **CSS Modules**: Estilos locales para todos los componentes (sin colisiones globales)
- **Storybook stories**: Historias interactivas con código copy-paste para todos los componentes nuevos

### Cambiado

- **Visor tematización**: Sistema de temas ahora respeta `data-theme` global en `<html>` en lugar de forzar tema oscuro
- **Visor CSS**: Eliminación de fallbacks hardcodeados (`var(--ui-color-text, #e2e8f0)` → `var(--ui-color-text)`); confianza total en tokens `--ui-color-*`
- **FilterBar types**: `FilterDefinition` y `FilterValues` ahora compartidas entre FilterBar, FilterTable, ImageGrid (fuente única de verdad)
- **src/index.ts**: Consolidación de exports de todos los nuevos componentes y tipos
- **package.json**: Agregado `lucide-react@^1.47.0` en devDependencies

### Arreglado

- **Visor**: Alineación con arquitectura de temas Nocturne dark-first (respeta preferencias globales)
- **Build**: Resolución de dependencias React 19 con `lucide-react@^1.47.0` (compatible con React 18 y 19)

## [0.2.0-beta.1] — 2026-09-15

### Agregado

- Initial beta release with basic component structure
- Button, Input, Checkbox, Radio, Switch, FormField components
- Badge component with variants
- Card component with header, body, footer
- Modal component
- Toast / ToastContainer components
- MessagePanel ecosystem (MessageDock, MessageList, MessageBubble, MessageComposer)
- Table component with sorting
- Pagination component
- Form component with FormSection, FormRow, FormActions
- FilterTable component with inline filters
- Navbar, NavbarLink components
- Sidebar, SidebarGroup, SidebarItem components
- Design tokens (Nocturne dark-first)
- Storybook setup
- GitHub Packages publishing configuration

---

## Guía de Versiones

### Semver

- **PATCH** (0.2.1): Bug fixes, actualizaciones menores
- **MINOR** (0.3.0): Nuevas características (backward compatible)
- **MAJOR** (1.0.0): Breaking changes, rediseños

### Beta Versioning

- **0.2.0-beta.1** → **0.2.0-beta.2** → ... → **0.2.0-rc.1** → **0.2.0** (release)

---

## Cómo Actualizar Este CHANGELOG

1. **Antes de hacer release**, agrega cambios en sección `[Unreleased]`
2. **Al hacer release**, reemplaza `[Unreleased]` con `[VERSION] — YYYY-MM-DD`
3. **Commit**: `chore: bump version to X.Y.Z`

### Ejemplo

```markdown
## [Unreleased]

### Agregado
- Nueva feature X

## [0.2.1] — 2026-10-01

### Agregado
- Nueva feature X

### Arreglado
- Bug Y
```
