# Diseño — Evolución de `@ai27-tech/ui` (ola v2)

Requisitos en `requirements.md`. Este documento fija la API y las decisiones técnicas de cada parte. Todo lo listado como API es **propuesta de diseño** hasta que se implemente.

## Orden y dependencias

```
P1 Fundaciones ──┬─> P2 Cargas ──┬─> P4 Estructura ──> P6 Tablas y filtros
                 │               │
                 ├─> P3 Navegación (Breadcrumb colapsa con Popover)
                 └─> P5 Formularios y pickers (Calendar, TimePicker usan Popover)
P7 Badges: independiente, puede ir en cualquier punto.
```

Orden de implementación: P1, P2, P3, P4, P5, P6, P7. P6 necesita `Skeleton` (P2), `Popover` (P1) y `EmptyState` (P4). `PageHeader` (P4) usa `Breadcrumb` (P3) solo como contenido de un slot, sin importarlo.

## Estado actual verificado

- `Sidebar.tsx`: el botón de colapso está en un `div.footer`, con `<span>Contraer</span>` cuando está expandido. En `Sidebar.module.css`, la regla `.header :global(svg)` da 1.5 rem y color primario a **todo** SVG del encabezado. Un botón con SVG dentro del encabezado heredaría esa regla.
- `Table.tsx`: `loading` pinta una fila con `<span class="spinner">`. Los checkboxes son `<input type="checkbox">` nativos. El texto por defecto de `emptyState` es "No data to display.". Las rayas de fila son fijas (`:nth-child(even)`).
- `FilterTable.tsx`: reconstruye los filtros con `{ key, label, options, placeholder }` y descarta el resto.
- `Checkbox.tsx` se puede usar sin `label` (renderiza `label` solo si existe) y reenvía `...props` al `<input>`; sirve para la tabla.
- `Input.tsx` envuelve un `div.field` con `startAdornment`/`endAdornment`. No expone el ref del contenedor. Los pickers usan su propio contenedor como ancla del `Popover`.
- `FormField` hace `cloneElement` del hijo con `id`, `invalid` y `aria-describedby`. Los pickers deben aceptar esas tres props.
- `Badge.module.css`: alturas y fuentes del badge están en valores sueltos (`1.25rem`, `0.625rem`).
- Z-index: `--ui-z-modal: 1000`; `Tooltip` usa `9999` fijo.

## Convenciones para código nuevo

- Una carpeta por componente: `Nombre.tsx`, `Nombre.module.css`, `Nombre.stories.tsx`, `index.ts` (y `Nombre.test.tsx` si se decide probar).
- `cx` desde `src/utils/cx.ts` (nuevo, R2.1).
- Iconos como SVG inline con `aria-hidden="true"`.
- Variables CSS locales de un componente que dependan del tema se declaran **dentro de la clase del componente** (`.skeleton { --sk-base: var(--ui-color-...) }`) y no en `:root`. Un `var()` declarado en `:root` se resuelve ahí; un contenedor anidado con `data-theme` distinto heredaría el valor del tema equivocado.

---

## P1. Fundaciones

### Tokens (en el bloque estructural de `tokens.css`)

```css
--ui-z-popover: 1100;   /* sobre --ui-z-modal (1000) */
```

No se agregan tokens de color.

### Popover

```ts
export interface PopoverProps {
  /** Elemento al que se ancla. */
  anchorRef: RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  position?: "bottom" | "top" | "auto";   // por defecto "auto"
  align?: "start" | "end";                 // por defecto "start"
  offset?: number;                         // px entre ancla y contenido; por defecto 4
  matchAnchorWidth?: boolean;
  role?: "dialog" | "listbox" | "menu";    // por defecto "dialog"
  "aria-label"?: string;
  id?: string;
  className?: string;
  children: ReactNode;
}
```

Implementación:

- Si `!open` o `typeof document === "undefined"`, no renderiza (mismo patrón que `Tooltip`).
- `useLayoutEffect` mide ancla y contenido con `getBoundingClientRect`, calcula `top`/`left` en coordenadas de viewport y las guarda en estado. Se ejecuta al abrir y en `scroll` (fase de captura, para capturar scroll de ancestros) y `resize`.
- `auto`: abre abajo si `espacioAbajo >= alturaContenido`; si no, arriba si `espacioArriba > espacioAbajo`; si no, abajo.
- Horizontal: `left` se limita a `[8, viewportWidth - anchoContenido - 8]`.
- Cierre: `pointerdown` en `document` fuera del contenido y fuera del ancla, y `keydown` `Escape`. Los listeners se registran solo mientras está abierto.
- Uso dentro de `Modal` (por ejemplo `DateInput` en un formulario modal). Verificado en `Modal.tsx`:
  - El clic no cierra el `Modal`: su `onMouseDown` de overlay solo actúa si `e.target === e.currentTarget`, y el contenido del popover nunca es el overlay.
  - **`Escape` sí es un problema**: el `Modal` escucha `keydown` en `document` en fase de captura y cierra al instante. Un `Escape` pensado para cerrar solo el popover cerraría también el `Modal`. Solución: el `Popover` registra su `keydown` en `window` en fase de captura (corre antes que `document`), y al cerrar llama `e.stopPropagation()` para que el `Modal` no lo reciba. Solo actúa si hay un popover abierto.
  - El focus trap del `Modal` solo intercepta `Tab` en el primer y último elemento del diálogo. Un foco dentro del popover (fuera del DOM del diálogo) no se ve afectado, pero se verifica en la tarea 3.2.
- Estilo: fondo `--ui-color-surface` (la misma superficie de `Select` y `Modal`), borde `--ui-color-border`, sombra `--ui-shadow-md`, radio `--ui-radius-lg`, padding `--ui-space-2`, tipografía de la plataforma y un fade corto (`prefers-reduced-motion` lo desactiva).

El manejo de foco **no** vive en `Popover`: lo gestiona cada consumidor (ver P5), porque Breadcrumb, DateInput y FilterBar lo necesitan distinto.

### Utilidades

- `src/utils/cx.ts`: `cx(...classes: Array<string | false | null | undefined>)`.
- `src/styles/base.css`: clase global `.ui-sr-only` (patrón clip estándar). Se usa desde los componentes de carga. Revisar antes si `base.css` ya la define.

---

## P2. Cargas

### Skeleton

```ts
export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "text" | "circle" | "rect";   // por defecto "text"
  width?: number | string;                 // número = px
  height?: number | string;
  animation?: "shimmer" | "pulse" | false; // por defecto "shimmer"
}
```

CSS:

```css
.skeleton {
  --sk-base: var(--ui-color-surface-container-high);
  --sk-highlight: var(--ui-color-surface-container-highest);
  background: linear-gradient(90deg, var(--sk-base) 25%, var(--sk-highlight) 50%, var(--sk-base) 75%);
  background-size: 200% 100%;
  animation: ui-skeleton-shimmer 1.4s var(--ui-ease-standard) infinite;
}
@media (prefers-reduced-motion: reduce) { .skeleton { animation: none; } }
```

- `text`: altura `1em`, radio `--ui-radius-sm`. `circle`: `border-radius: 50%` y alto = ancho. `rect`: `--ui-radius`.
- `pulse`: animación de opacidad en lugar de gradiente.
- El elemento es `aria-hidden="true"`. El lector de pantalla recibe el aviso del contenedor.

Compuestos (todos con `role="status"`, `aria-busy="true"` y `<span class="ui-sr-only">Cargando</span>`):

- `SkeletonText { lines?: number (3); lastLineWidth?: string ("60%") }`.
- `SkeletonCard { lines?: number; media?: boolean }`: usa los mismos paddings y borde que `Card`.
- `SkeletonTable { rows?: number (5); columns?: number (4); density?: "comfortable" | "compact"; selectable?: boolean; expandable?: boolean }`. Se reutiliza dentro de `Table` como `SkeletonRows`, un componente interno que **solo** devuelve `<tr>`/`<td>`; el wrapper con `role="status"` es para uso fuera de tabla.

### Spinner y ProgressBar

- `Spinner { size?: "sm" | "md" | "lg"; label?: string }`: el borde giratorio actual de `Table`, parametrizado por tamaño. No se toca el spinner interno de `Button`.
- `ProgressBar { value?: number; label?: string; size?: "sm" | "md" }`: pista `--ui-color-surface-container-highest`, relleno `--ui-color-primary`. Indeterminada: barra que se desplaza (sin movimiento con `prefers-reduced-motion`: barra estática al 40 %).

### Integración con Table

- `loading` pinta `SkeletonRows` con `loadingRows` filas, usando `columns.length` y las banderas `selectable`/`expandable` ya calculadas.
- El ancho de cada skeleton de celda varía por columna con un patrón determinista (`[80, 60, 70, 50]%` repetido) para evitar un aspecto de rejilla uniforme y sin `Math.random` (evita desajustes de hidratación).
- `<table aria-busy={loading || undefined}>`.
- Cambio visible: ya no hay spinner en la tabla. `Spinner` queda disponible para otros usos.

---

## P3. Navegación

### Sidebar

Estructura nueva del encabezado:

```tsx
{(header || onToggleCollapse) && (
  <div className={styles.header}>
    {header && <div className={styles.headerContent}>{header}</div>}
    {onToggleCollapse && <button className={styles.toggle} ...><PanelIcon collapsed={collapsed} /></button>}
  </div>
)}
```

CSS:

- `.header { justify-content: space-between; }`; `.headerContent { flex: 1 1 auto; min-width: 0; overflow: hidden; display: flex; align-items: center; gap: ... }`.
- La regla `.header :global(svg)` pasa a `.headerContent :global(svg)`, para que el icono del botón no la herede.
- `.collapsed .headerContent { display: none; }` y `.collapsed .header { justify-content: center; padding: 0; }` (D2).
- `.toggle`: `width/height: 2.5rem`, sin borde, radio `--ui-radius`, color `--ui-color-text-muted`, hover `--ui-color-surface-container-high`, foco con `--ui-focus-ring`, SVG de `1.25rem`.
- El `div.footer` solo se renderiza si hay `footer`.
- Icono: SVG de "panel lateral" (rectángulo con barra vertical izquierda y flecha). Expandido, la flecha apunta a la izquierda; contraído, a la derecha (rotación 180° con transición `--ui-transition`).
- Los textos de `aria-label` y `aria-expanded` no cambian; se agrega `title`.

Riesgo: una barra sin `header` ni `onToggleCollapse` no cambia. Una con `onToggleCollapse` y sin `header` ahora muestra una fila de encabezado de 3.5 rem con solo el botón (antes mostraba un botón en el pie). Es el comportamiento pedido y se documenta en el CHANGELOG.

### Breadcrumb

```ts
export interface BreadcrumbItemData {
  label: ReactNode;
  href?: string;
  icon?: ReactNode;
  onClick?: MouseEventHandler;
  as?: ElementType;            // p. ej. el Link del router
}
export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItemData[];
  separator?: ReactNode;
  maxItems?: number;            // mínimo efectivo 2
}
```

- Cada elemento, salvo el último, se renderiza con `as ?? (href ? "a" : onClick ? "button" : "span")`.
- Colapso con `maxItems = n` y `items.length > n`: `[items[0], "…", ...items.slice(-(n - 1))]`. El botón "…" (`aria-haspopup="true"`, `aria-expanded`) abre un `Popover` con los elementos intermedios como lista de enlaces. Sin `maxItems` no hay colapso.
- Truncado: `.item { max-width: var(--ui-breadcrumb-item-max, 12rem); overflow: hidden; text-overflow: ellipsis; white-space: nowrap }` y `title` si `label` es cadena. No se usa `Tooltip` (requiere coordenadas manuales y este caso no lo justifica).
- Variable local `--ui-breadcrumb-item-max` en la clase del componente.

---

## P4. Estructura de información

Todos usan solo tokens existentes y `cx` de `src/utils/cx.ts`.

### Layout

```ts
type Gap = 0 | 1 | 2 | 3 | 4 | 5 | 6;
Stack  { gap?: Gap; align?: "start"|"center"|"end"|"stretch"; justify?: ...; as?: ElementType }
Inline { gap?: Gap; align?: ...; justify?: ...; wrap?: boolean; as?: ElementType }
Grid   { gap?: Gap; columns?: number; minItemWidth?: string; as?: ElementType }
```

El gap se aplica con un estilo en línea `gap: var(--ui-space-N)` (o `0`). `Grid` usa `repeat(columns, minmax(0, 1fr))` o `repeat(auto-fit, minmax(minItemWidth, 1fr))`. Si se pasan ambos, gana `columns`.

### PageHeader, Section, DescriptionList

- `PageHeader`: grid de dos zonas (texto, acciones). `<header>` con título `h1`/`h2` según `titleAs`, escala `--ui-text-headline-lg-*`. Bajo 40 rem de ancho, las acciones pasan debajo.
- `Section`: `<section aria-labelledby={id}>`. Título con `--ui-text-title-md-*`. Con `collapsible`, el encabezado completo es un `<button aria-expanded aria-controls>`; el contenido se oculta con el atributo `hidden`.
- `DescriptionList`: `<dl>` en grid; cada item es `<div><dt/><dd/></div>`. `span` permite ocupar varias columnas. `orientation="horizontal"` pone `dt` y `dd` en la misma fila. Etiquetas en `--ui-text-label-md-*` con color `--ui-color-text-muted`.

### Stat, EmptyState, Alert, Divider

- `Stat` se apoya en `Card` (`variant="outlined"`). Valor con `--ui-text-telemetry-lg-*`. Tendencia: `up` y `down` usan `--ui-color-success` y `--ui-color-danger`; `flat` usa `--ui-color-text-muted`; `invertTrend` los intercambia. La dirección también se comunica con una flecha SVG y texto accesible ("Sube"/"Baja"/"Sin cambio"), no solo con color.
- `EmptyState`: columna centrada, icono de `3rem` en color atenuado, título, descripción, `action`.
- `Alert`: fondo `color-mix(in srgb, var(--ui-color-X) 12%, transparent)` y borde con 28 %, igual que `Badge`. `info` usa `--ui-color-primary`; `success`, `warning` y `danger` usan sus tokens. Botón de cierre con `aria-label="Cerrar"`.
- `Divider`: `<hr>` o `div role="separator"` con `aria-orientation`; con `label`, línea–texto–línea.

### Tabs

Composición con contexto:

```tsx
<Tabs defaultValue="resumen">
  <TabList aria-label="Secciones del viaje">
    <Tab value="resumen" icon={...} badge={3}>Resumen</Tab>
    <Tab value="historial" disabled>Historial</Tab>
  </TabList>
  <TabPanel value="resumen">...</TabPanel>
</Tabs>
```

- IDs derivados con `useId()` más `value` para enlazar `aria-controls`/`aria-labelledby`.
- Roving tabindex: solo la pestaña activa tiene `tabIndex=0`. Flechas, `Home` y `End` mueven el foco y activan (activación automática). Se omiten las deshabilitadas.
- `TabPanel` solo monta el contenido de la pestaña activa y el resto con `hidden`.
- Estilo "línea": borde inferior `--ui-color-border`, indicador activo `--ui-color-primary`.

---

## P5. Formularios y pickers

### Módulo de fechas (`src/components/DatePicker/dateUtils.ts`)

Funciones puras sobre `{ y, m, d }` (mes 1 a 12). No usan `new Date(string)`, que interpreta cadenas ISO como UTC y desfasa un día en zonas al oeste de UTC.

- `parseISODate(s): {y,m,d} | null` (valida mes, día y años bisiestos).
- `formatISODate({y,m,d}): string`.
- `daysInMonth(y, m)`, `weekdayOf({y,m,d}): 0..6` (con `Date.UTC`), `addDays`, `addMonths`, `compareDates`, `isWithin(date, min, max)`.
- `buildMonthGrid(y, m, weekStartsOn): {y,m,d}[][]` (6 semanas, con días de meses vecinos).
- `parseDisplayDate(text): {y,m,d} | null` (acepta `/`, `-`, `.`; año de 4 dígitos) y `formatDisplayDate`.
- `today(): {y,m,d}` (la única función que lee el reloj local).

Nombres de meses y días: `Intl.DateTimeFormat(locale, { month: "long" })` y `{ weekday: "short" }` sobre fechas construidas con `Date.UTC` y `timeZone: "UTC"`.

### Calendar

```ts
export interface CalendarProps {
  value?: string;               // YYYY-MM-DD o ""
  onChange?: (value: string) => void;
  min?: string; max?: string;
  isDateDisabled?: (value: string) => boolean;
  locale?: string;              // "es-MX"
  weekStartsOn?: 0|1|2|3|4|5|6; // 1 (D8)
  autoFocus?: boolean;
  className?: string;
}
```

- Estado interno: `view` (`days|months|years`) y `cursor` (`{y,m}` del mes visible). La celda con foco usa roving tabindex.
- Estructura: encabezado (botón anterior, botón de título que cambia de vista, botón siguiente) y `role="grid"` con `role="row"` y `role="gridcell"` / botones por día. Los días de otros meses se ven atenuados y se pueden elegir.
- Hoy: borde primario; seleccionado: relleno `--ui-color-primary` con texto `--ui-color-on-primary`; deshabilitado: opacidad `--ui-opacity-disabled`.
- La vista de años muestra un bloque de 12 años; la de meses, 12 meses.

### DateInput

```ts
export interface DatePreset { label: string; value: string | (() => string); }
export interface DateInputProps {
  value?: string; defaultValue?: string;
  onChange?: (value: string) => void;
  min?: string; max?: string;
  presets?: DatePreset[];
  clearable?: boolean;
  placeholder?: string;      // "DD/MM/AAAA"
  size?: InputSize; invalid?: boolean; disabled?: boolean; readOnly?: boolean;
  id?: string; name?: string; "aria-describedby"?: string;
  locale?: string; weekStartsOn?: 0|1|2|3|4|5|6;
  className?: string;
}
```

- Renderiza `<div ref=anchor>` con el componente `Input` (texto, `inputMode="numeric"`) y un `endAdornment` con botones de limpiar (si `clearable` y hay valor) y de calendario. Las clases de tamaño y estado salen de `Input`, por lo que alturas y errores son idénticos.
- Estado: `text` (lo escrito), `open`. Al abrir o al cambiar el valor desde fuera, `text` se sincroniza con `formatDisplayDate`.
- Confirmación del texto: en `blur` y `Enter`. Si `parseDisplayDate` da una fecha válida y dentro de `min`/`max`, se emite; si no, `text` vuelve al valor vigente (mismo criterio que `Select` buscable). Si el texto queda vacío y hay `clearable`, se emite `""`.
- Teclado: `ArrowDown` o clic en el botón abren; el foco pasa al día seleccionado (o a hoy) del `Calendar` (`autoFocus`). `Escape` cierra y devuelve el foco al campo. `Tab` cierra.
- `Popover` con `role="dialog"`, `aria-label="Calendario"`. Contenido: lista de presets (columna izquierda, solo si hay) y `Calendar`. Elegir una fecha o un preset emite el valor y cierra.
- `aria-haspopup="dialog"`, `aria-expanded` en el campo.

### TimePicker

```ts
export interface TimePreset { label?: string; values: string[]; }
export interface TimePickerProps {
  value?: string; defaultValue?: string; onChange?: (value: string) => void;
  format?: "24h" | "12h";            // "24h"
  withSeconds?: boolean;
  hoursStep?: number; minutesStep?: number; secondsStep?: number;  // 1
  min?: string; max?: string;
  withDropdown?: boolean;            // true
  dropdownPosition?: "bottom" | "top" | "auto";  // "auto"
  presets?: Array<string | TimePreset>;
  closeDropdownOnPresetSelect?: boolean;
  clearable?: boolean;
  size?: InputSize; invalid?: boolean; disabled?: boolean; readOnly?: boolean;
  id?: string; name?: string; "aria-describedby"?: string;
  className?: string;
}
export function getTimeRange(opts: { start: string; end: string; interval: string }): string[];
```

- Contenedor con la apariencia de `Input` (clases de `Input.module.css`) y dentro `<input>` por segmento con `aria-label` "Horas", "Minutos", "Segundos", "AM/PM", separados por ":" decorativo. El contenedor es el ancla del `Popover`.
- Segmentos: estado `{ h, m, s, period }` como cadenas de 2 dígitos o vacío. Reglas: dos dígitos válidos avanzan al siguiente segmento; un primer dígito que no admite un segundo (p. ej. `3` en horas 24h) completa con cero y avanza. `Backspace` vacía; flechas incrementan y decrementan con el paso, con vuelta al otro extremo. AM/PM: `A`, `P`, o flechas.
- Emisión: cuando todos los segmentos requeridos están completos se emite `HH:mm[:ss]` en 24 h (aunque se muestre 12 h). Si el usuario vacía cualquier segmento y antes había valor, se emite `""`.
- `min`/`max`: al salir del campo con valor fuera de rango, se ajusta al límite más cercano y se emite. En el dropdown, los valores de cada columna que producirían una hora fuera de rango se ven deshabilitados.
- Dropdown: `Popover` con `role="dialog"`, columnas `role="listbox"` por segmento, opciones `role="option"` con `aria-selected`. Se abre al enfocar un segmento si `withDropdown`. Seleccionar una opción actualiza el segmento sin quitar el foco del campo. `scrollIntoView({ block: "nearest" })` del valor vigente al abrir.
- Presets: botones en una columna a la izquierda o debajo; agrupados con su `label`.
- `getTimeRange`: genera `["08:00","08:30",...]`; valida el formato y devuelve `[]` si `interval` es 0 o el rango es inválido.
- Pegado: `onPaste` en cualquier segmento; si el texto coincide con `^\d{1,2}:\d{2}(:\d{2})?$`, rellena segmentos.

### DateTimeInput

```ts
export interface DateTimeInputProps {
  value?: string; defaultValue?: string;           // YYYY-MM-DDTHH:mm[:ss]
  onChange?: (value: string) => void;
  withSeconds?: boolean; defaultTime?: string;
  min?: string; max?: string;                      // fecha-hora
  dateProps?: Partial<DateInputProps>; timeProps?: Partial<TimePickerProps>;
  size?; invalid?; disabled?; readOnly?; id?; "aria-describedby"?; className?;
}
```

- Fila `Inline` con `DateInput` (flex 1) y `TimePicker` (ancho natural). Estado interno `{ date, time }` derivado de `value`.
- Cuando cambia una parte: si ambas están completas, `onChange(date + "T" + time)`; si solo hay una, se conserva en el estado interno y se emite `""` solo si antes había un valor completo.
- Sincronización externa: cuando `value` llega con un valor no vacío distinto del combinado actual, se reemplazan las dos partes. Un `value=""` externo no borra una parte a medias; para forzarlo, el consumidor cambia la `key`. Se documenta en la story.
- Si hay `defaultTime` y el usuario elige fecha con la hora vacía, se rellena con `defaultTime`.
- `min`/`max` se reparten: la parte de fecha recibe la fecha; la hora se valida contra la hora del límite solo cuando la fecha elegida coincide con la fecha del límite.

### Mejora de formularios

La tarea 18 genera `auditoria-formularios.md` y su salida define los cambios. No hay diseño detallado hasta entonces, para no fijar APIs sobre supuestos. Restricciones ya conocidas: todo cambio mantiene la API, no usa colores nuevos y reutiliza `Input.module.css` / `Choice.module.css` / `FormField.module.css`.

---

## P6. Tablas y filtros

### Table

Props nuevas, todas opcionales:

```ts
interface TableProps<T> {
  stickyHeader?: boolean;                               // false
  striped?: boolean;                                    // true (igual que hoy)
  loadingRows?: number;                                 // 5
  bulkActions?: (selectedKeys: Set<Key>) => ReactNode;
  labels?: Partial<TableLabels>;
}
interface TableLabels {
  empty: string;          // "No hay datos para mostrar."
  selectAll: string;      // "Seleccionar todas las filas"
  selectRow: string;      // "Seleccionar fila"
  expandRow: string;      // "Expandir fila"
  collapseRow: string;    // "Contraer fila"
  loading: string;        // "Cargando"
}
interface Column<T> { minWidth?: string; truncate?: boolean; }
```

- `stickyHeader`: `.wrapper` pasa a tener `max-height` solo si el consumidor la limita; `th` con `position: sticky; top: 0` y fondo `--ui-color-surface`. La sombra de scroll horizontal se logra con un par de pseudo-elementos en `.wrapper` y un `scroll` listener ligero que activa `data-scroll-start/end` (solo cuando hay desbordamiento).
- `striped={false}` quita la regla `nth-child(even)`.
- Selección: reemplazar `<input type="checkbox">` por `<Checkbox>` sin `label` y con `aria-label` de `labels`. El checkbox de "seleccionar todas" queda marcado cuando están todas las filas; el estado indeterminado no está en alcance.
- Orden: `SortIcon` cambia a flecha doble atenuada (dos chevrons) cuando la columna es ordenable y no está activa; activa muestra una sola flecha (como hoy). `aria-sort` no cambia.
- Panel expandido: `.detailCell > *` recibe animación de entrada `ui-table-detail-in` (opacidad 0 a 1, `translateY(-4px)` a 0, `--ui-duration-base`). Solo entrada; la salida desmonta de inmediato (no hay animación de cierre porque el `<tr>` se elimina).
- Barra de acciones masivas: un `div` encima del `<table>` dentro del `.wrapper`, visible si `selectedKeys.size > 0` y se pasó `bulkActions`. Texto "{n} seleccionada(s)" con singular/plural, `aria-live="polite"`.
- `emptyState` por defecto: `<EmptyState title={labels.empty} size="sm" />`. Un `emptyState` pasado por el consumidor se respeta tal cual.
- Los textos hardcodeados pasan a `labels` (D4).

### FilterBar

- `layout="panel"` (por defecto) conserva el DOM y las clases actuales. Se aplican los cambios visuales de chips y etiquetas, y los textos en español.
- `layout="toolbar"`: `div.toolbar` con búsqueda (si hay `onSearchChange`), un `Button` "Filtros" con contador (`aria-haspopup="dialog"`, `aria-expanded`) y, si `viewToggle`, el selector de vista. El `Popover` (`role="dialog"`, `align="start"`) contiene la `filtersGrid` y el botón "Limpiar". Los chips activos van en una fila bajo la barra.
- Chip: `button` con el texto y un SVG "x" de `0.875rem`; estilo píldora con `color-mix` del primario al 14 % y borde al 32 %, como el estado activo de `SidebarItem`.
- Control con filtro activo: `Select` con `data-active`; borde `--ui-color-primary`. Para no tocar `Select`, el estilo se aplica en `.filterColumn[data-active] ...` sobre el elemento que ya expone `.field`.
- `labels`: `{ title: "Filtros", search: "Buscar...", clearAll: "Limpiar todos los filtros", all: "Todos", remove: (label, value) => string }`.
- `FilterBar` acepta `loading`: los selects y la búsqueda se muestran deshabilitados.

### FilterTable

- Pasa los filtros sin reconstruirlos: `filters` se entrega a `FilterBar` tal cual (D5). Se conserva el fallback `label || placeholder || key`.
- Nuevas props: `filterLayout?: "panel" | "toolbar"` y `labels?: Partial<{ search, clear, resultsOne, resultsMany }>`.
- Defaults: "Buscar...", "Limpiar", "{n} resultado" / "{n} resultados".
- `loading` (que ya viene en `TableProps`) también se pasa a `FilterBar`.

---

## P7. Badges

### API

```ts
export type BadgeVariant = "secure" | "alert" | "escort" | "warning" | "neutral"
  | "info" | "primary" | "secondary";
export type BadgeAppearance = "soft" | "solid" | "outline";
export type BadgeSize = "sm" | "md";
// BadgeProps: appearance?: BadgeAppearance ("soft"); size?: BadgeSize ("sm")
```

### Mapeo de tonos (tokens existentes)

| Variante | Tono base | Texto en `soft` / `outline` |
| --- | --- | --- |
| `secure` | `--ui-color-success` | `--ui-color-success` |
| `alert` | `--ui-color-danger` | `--ui-color-danger` |
| `escort`, `info` | `--ui-color-primary` | `--ui-color-info` |
| `primary` | `--ui-color-primary` | `--ui-color-primary` |
| `warning` | `--ui-color-warning` | `--ui-color-warning` |
| `secondary` | `--ui-color-secondary` | `--ui-color-on-secondary` |
| `neutral` | `--ui-color-surface-raised` | `--ui-color-text-muted` |

Implementación con una variable local `--ui-badge-tone` por variante y apariencias que la consumen:

```css
.secure { --ui-badge-tone: var(--ui-color-success); }
.soft    { background: color-mix(in srgb, var(--ui-badge-tone) 16%, transparent);
           color: var(--ui-badge-fg, var(--ui-badge-tone));
           border-color: color-mix(in srgb, var(--ui-badge-tone) 40%, transparent); }
.solid   { background: var(--ui-badge-tone); color: var(--ui-color-on-primary); border-color: var(--ui-badge-tone); }
.outline { background: transparent; color: var(--ui-badge-fg, var(--ui-badge-tone)); border-color: var(--ui-badge-tone); }
```

- Las cinco variantes actuales deben dar **el mismo resultado visual** en `soft` que hoy. Los porcentajes de mezcla actuales difieren por variante (14 % a 16 % de fondo, 32 % a 42 % de borde). Para preservar el aspecto exacto, cada variante conserva sus porcentajes como variables locales (`--ui-badge-bg-mix`, `--ui-badge-border-mix`) y `soft` los consume. Esto se verifica contra capturas de las stories actuales antes de cerrar P7.
- `neutral` y `secondary` en `solid` y `outline`: se definen caso por caso en CSS (sin `color-mix` sobre el tono), porque `neutral` ya es una superficie y no un tono de acento.
- `size="md"`: altura `1.5rem`, fuente `--ui-text-label-md-size`, padding horizontal `0.625rem`. Las alturas y fuentes sueltas actuales se mueven a tokens locales de la clase (`--ui-badge-height`, `--ui-badge-font-size`).
- Contraste: la tarea 33 mide el contraste de `solid` en cuatro tonos y dos temas. Si algún par queda debajo de 4.5:1, se reporta (D10) en lugar de introducir tokens.

---

---

# Ampliación (2026-11-12): P8, P9 y P10

Orden de implementación: **P10, P8, P9**. Las APIs son propuesta hasta implementarse. Convención de nombres: identificadores técnicos en inglés; sustantivos del contrato en español (`secuencia`, `reclamo`, `escrituraHasta`). Las props de `MessagePanel` ya existentes (`hayMas`, `onCargarAnteriores`, `ultimaSecuencia`) no se renombran.

## P10. Iconos con Lucide

### Estado verificado

- 16 archivos de componentes y 4 de stories dibujan iconos con `<svg>` y `<path>`/`<circle>`/`<rect>`/`<polyline>`. Ya usan Lucide 7 componentes (`Alert`, `Breadcrumb`, `Section`, `Sidebar`, `Stat`, `Visor` y, a medias, `FilterBar`) y 11 stories.
- `lucide-react@1.47.0` está como `devDependency`. `dist/ui-library.js` (142 KB) lo trae empaquetado: `vite.config.ts` solo declara `react` y `react-dom` como externos y el bundle no contiene ningún `import ... from "lucide-react"`. Los portales fijan `lucide-react@1.43.0`; no hay conflicto porque la librería no lo importa en tiempo de ejecución.
- Decisión D11: se mantiene así. La alternativa (peer dependency y externo) deduplica el paquete pero obliga a cada portal a mantener una versión compatible.

### Mapeo (verificar cada nombre contra `node_modules/lucide-react` antes de usarlo)

| Archivo | Icono propio actual | Lucide |
| --- | --- | --- |
| `Calendar.tsx` | chevrones izquierda/derecha (`polyline`) | `ChevronLeft`, `ChevronRight` |
| `DateInput.tsx` | calendario, limpiar | `CalendarDays` (evita chocar con el componente `Calendar`), `X` |
| `TimePicker.tsx` | reloj, limpiar | `Clock`, `X` |
| `FilterBar.tsx` | lupa, cerrar chip | `Search`, `X` (`strokeWidth={2.5}`) |
| `FilterTable.tsx` | lupa | `Search` |
| `Form.tsx` | chevron de sección | `ChevronDown` |
| `Checkbox.tsx` | palomita | `Check` (`strokeWidth={3}`) |
| `Input.tsx` | limpiar, ojo / ojo tachado | `X`, `Eye`, `EyeOff` |
| `Select.tsx`, `SelectSearchable.tsx` | chevron | `ChevronDown` |
| `MessagePanel/shared.tsx` | minimizar, cerrar, expandir, enviar | `Minus`, `X`, `ChevronUp`, `Send` |
| `Table.tsx` | orden neutro / activo, chevron de fila | `ChevronsUpDown`, `ArrowUp`, `ChevronRight` |
| `Modal.tsx` | cerrar | `X` |
| `Navbar.tsx` | menú, cerrar | `Menu`, `X` |
| `Pagination.tsx` | anterior, siguiente | `ChevronLeft`, `ChevronRight` |
| `Toast.tsx` | info, éxito, aviso, error, cerrar | `Info`, `CircleCheck`, `TriangleAlert`, `CircleX`, `X` (los mismos que ya usa `Alert`) |
| Stories `Button`, `Card`, `Navbar`, `Input` | más, flecha, caja, lupa | `Plus`, `ArrowRight`, `Package`/`Box`, `Box`, `Search` |

### Reglas de implementación

- Los tamaños siguen saliendo del CSS (`:global(svg) { width; height }`), que gana sobre los atributos `width`/`height` de Lucide. Donde no hay regla, se pasa `size`.
- `strokeWidth` se pasa solo donde el icono actual no usa 2.
- Los iconos decorativos son `aria-hidden` (Lucide ya lo aplica si no hay `aria-label`). Un botón solo-icono mantiene su `aria-label`.
- `Table`: el indicador de orden cambia de dos trazos propios a `ChevronsUpDown` (neutro) y `ArrowUp` (activo; `desc` sigue rotando 180°). La rotación se hace con CSS como hoy.
- Para detectar regresiones: regla de ESLint en `eslint.config.js`:

```js
"no-restricted-syntax": ["error", {
  selector: "JSXOpeningElement[name.name='svg']",
  message: "Usa un icono de lucide-react (o createLucideIcon) en lugar de un <svg> a mano."
}]
```

- Las búsquedas de verificación (`<svg`, `<path`, `d="M`) cubren también `README.md`, `CONSUMING.md` y los comentarios MDX/JSDoc con ejemplos.

### Riesgo

Cambiar glifos altera el aspecto sutilmente (los trazos de Lucide no son idénticos a los actuales). Se compara cada componente en Storybook antes y después, en tema claro y oscuro. El cambio de `Table` (orden) y `Toast` es el más visible.

## P8. MessagePanel

### Contrato `v0.1.0-tracer.40` frente a la librería

| Contrato (`mensajeria.yaml`) | Librería hoy | Acción |
| --- | --- | --- |
| `Mensaje.secuencia` | `secuenciaMensaje` | Renombrar a `secuencia` (D12) |
| `Mensaje.{id, conversacion_id, client_message_id, audiencia_autor, alias_mostrado, actor_real, rol_al_enviar, cuerpo, adjuntos_ids, creado_en}` | Todos presentes en camelCase | Sin cambio |
| `Conversacion.{estado, escritura_hasta, ultima_secuencia, reclamo_activo, atendida_en, version_reclamo}` | `EstadoConversacion` y `ultimaSecuencia` | Nuevo `ConversationStatus` y slots `toolbar`/`notice` |
| `EnviarMensajeEntrada.{client_message_id, cuerpo, adjuntos_ids, version_reclamo_esperada, motivo_override}` | `onSend({ clientMessageId, cuerpo })` | `adjuntosIds` se agrega al evento si el consumidor adjunta; `versionReclamoEsperada` y `motivoOverride` los completa el consumidor al llamar a la API. La librería no los conoce |
| `ReciboEntrada.hasta_secuencia` | No aplica | Se usa `ultimaSecuenciaLeida` solo para el divisor "Mensajes nuevos" |
| `IntencionSubida` (adjuntos) | Slot `adjuntos` sin componente | `MessageAttachment` de presentación y `onAttach` en el compositor |
| `Rol` (8 valores) | `rolAlEnviar: string` | Sin cambio (D18) |

### Estructura de archivos

Se mantiene `src/components/MessagePanel/` y se agregan: `ConversationStatus.tsx`, `MessageThread.tsx`, `MessageAttachment.tsx`, `useMessageDock.ts`, `labels.ts`, `groupMessages.ts`. `shared.tsx` pasa a importar iconos de Lucide (P10).

### Panel (`MessagePanel.tsx`)

```tsx
<section className={styles.surface} aria-labelledby={titleId}>
  <div className={cx(styles.header, open && styles.expanded)}>
    <button type="button" className={styles.headerMain} aria-expanded={open} aria-controls={bodyId} onClick={toggle}>
      {avatar && <Avatar ... />}
      <span className={styles.headerText}>
        <span id={titleId} className={styles.name}>{name}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </span>
    </button>
    <span className={styles.headerActions}>
      <IconButton label={labels.minimize/expand} onClick={toggle}>…</IconButton>
      {onClose && <IconButton label={labels.close} onClick={onClose}>…</IconButton>}
    </span>
  </div>
  <div id={bodyId} className={styles.collapsible} data-open={open}>
    <div className={styles.collapsibleInner}>{toolbar}{notice}{children}{composer}</div>
  </div>
</section>
```

- El `<button>` ya no contiene botones. `IconButton` no necesita `stopPropagation`: ya no está dentro del control de título. El minimizar alterna una vez.
- Estado: `const [inner, setInner] = useState(defaultOpen ?? true)`; `open = props.open ?? inner`. `toggle` llama `onOpenChange?.(!open)` y `onToggle?.()`, y actualiza `inner` si no es controlado.
- Animación: `.collapsible { display: grid; grid-template-rows: 1fr; transition: grid-template-rows var(--ui-duration-base) var(--ui-ease-standard); }` y `[data-open="false"] { grid-template-rows: 0fr; visibility: hidden; transition: grid-template-rows ..., visibility 0s linear var(--ui-duration-base); }` con `.collapsibleInner { overflow: hidden; min-height: 0; }`. `visibility: hidden` saca el contenido del orden de tabulación y de los lectores sin `inert` (compatible con React 18 y 19). Con `prefers-reduced-motion`, sin transición.
- Foco: un `useEffect` detecta el paso de cerrado a abierto **originado por el usuario** (bandera `userToggled` que se pone en `toggle` y se limpia en el efecto) y enfoca el primer `textarea:not(:disabled)` del cuerpo. Al minimizar con el foco dentro del cuerpo, enfoca `headerMain`.
- `keepMounted` (D14): el cuerpo siempre está en el DOM. Para quien quiera lo anterior, `keepMounted={false}` lo desmonta al minimizar.
- Alturas: `.body { height: min(28rem, 70dvh); }`. Si el navegador no soporta `dvh`, cae a `vh` con una declaración previa.

### `ConversationStatus`

```ts
export interface ConversationStatusProps {
  estado: EstadoConversacion;
  escrituraHasta?: string | null;     // ISO 8601
  atendida?: boolean;
  reclamadaPor?: string | null;       // alias de quien tiene el reclamo
  reclamoPropio?: boolean;
  labels?: Partial<ConversationStatusLabels>;
}
```

Todos los datos de reclamo son opcionales: en el contrato `reclamo_activo` solo llega a audiencia Interno, y trae `responsable_id` sin nombre, así que `reclamadaPor` lo resuelve el portal. Si no se pasa, la fila no muestra responsable ni pool (vista del cliente). Una fila compacta: `Badge` de estado (`abierta` → `secure`, `solo_lectura` → `warning`, `cerrada` → `neutral`), responsable ("Reclamada por …" / "Reclamada por ti" / "En el pool"), "Atendida" con `Check` y, con `escrituraHasta`, "Escribe hasta …" con `formatSmartTimestamp`. No decide permisos.

### Mensajes

- `types.ts`: `Mensaje.secuencia`; `DeliveryStatus = "sending" | "sent" | "failed"`.
- `MessageBubble`: props nuevas `deliveryStatus`, `deliveryError`, `onRetry` (el botón "Reintentar" solo se dibuja si existe `onRetry`), `groupPosition` (`"single" | "first" | "middle" | "last"`, lo calcula `MessageThread` o el consumidor). `first`/`single` muestran alias; `last`/`single` muestran hora. Radios: la esquina del lado del autor es pequeña en `middle`/`last`.
- `groupMessages.ts`: `groupMessages(mensajes)` devuelve `{ dia, items: { mensaje, groupPosition }[] }[]`. Agrupa por día local y por autor consecutivo con menos de 5 minutos. Función pura.
- `MensajePendiente`: `{ clientMessageId, cuerpo, creadoEn, deliveryStatus, deliveryError?, onRetry? }`. Es un envío optimista que aún no tiene `secuencia`.
- `MessageThread`: `mensajes`, `isOwn`, `pendientes?`, `renderAudit?(mensaje)`, `renderAttachments?(mensaje)`, más las props de `MessageList`. Antes de agrupar, ordena una copia de `mensajes` por `secuencia` ascendente (nunca por `creadoEn`) y descarta ids repetidos. Los `pendientes` van al final y se descartan cuando aparece un mensaje con su `clientMessageId`. Las horas y los días de los divisores salen de `creadoEn`; el orden, de `secuencia`. Usa `groupMessages` y `MessageDayDivider` con etiqueta "Hoy" / "Ayer" / fecha larga (`Intl.DateTimeFormat`, `es-MX`).
- `MessageAttachment`: chip con icono de archivo (`FileText`/`Image`/`Paperclip` según `tipoMedio`), `nombre` truncado, tamaño legible (`KB`/`MB`), y estados `uploading` (`Spinner` pequeño), `error` (color de peligro) y `ready` (botón si hay `onOpen`).
- Auditoría: `.audit` con `--ui-text-label-sm-*` y color `--ui-color-text-muted`, separado del cuerpo por un divisor tenue.

### `MessageList`

- Detección de "cerca del final": `scrollHeight - scrollTop - clientHeight <= threshold` (4 rem en px, leído de `getComputedStyle`), guardada en un `ref` actualizado por `onScroll`.
- Efecto al cambiar `ultimaSecuencia`: si estaba cerca del final o el último mensaje es propio (`lastIsOwn`), baja; si no, incrementa `pending` y muestra el botón flotante.
- Al prepender historial: antes de cargar se guarda `scrollHeight`; tras el render, `scrollTop += nuevoScrollHeight - previo`. Se dispara cuando cambia el primer hijo. Como la librería no controla los datos, se activa cuando `loadingPrevious` pasa de `true` a `false`.
- Atributos: `role="log"`, `aria-live="polite"`, `aria-relevant="additions"`.
- Estados: `loading` → `SkeletonMessages` (3 a 5 burbujas alternadas con `Skeleton`); lista vacía y sin `loading` → `emptyState`.
- `MessageList` pierde la rama "sin `ultimaSecuencia` desplaza en cada render" solo si se confirma que ningún consumidor la usa; hoy se conserva para no romper.

### `MessageComposer`

- Guardia de IME: `if (e.nativeEvent.isComposing || e.keyCode === 229) return;` antes de interpretar Enter.
- `sending`: deshabilita el textarea y el botón; el botón muestra `Spinner` (P2).
- `onAttach`: botón `Paperclip` a la izquierda del textarea.
- `maxLength`: contador `n / max` visible desde el 80 %.
- `ref` hacia el textarea (`composerRef`).
- Altura automática con `max-height` ya existente; se reinicia al enviar (ya existe).
- Valor y reinicio del borrador: siguen siendo del consumidor.

### Muelle y barra

- `--ui-z-dock: 900;` en `tokens.css`; `.dock { z-index: var(--ui-z-dock); }`. El `Popover` (1100) y el `Modal` (1000) quedan por encima.
- `useMessageDock`:

```ts
interface DockState { order: string[]; minimized: Record<string, boolean>; barOpen: boolean }
type DockAction =
  | { type: "open"; id: string; capacity: number }
  | { type: "close"; id: string }
  | { type: "toggle"; id: string }
  | { type: "toggleBar" } | { type: "setCapacity"; capacity: number };
export function dockReducer(state: DockState, action: DockAction): DockState;
export function useMessageDock(opts?: { maxPanels?: number }): {
  panels: { id: string; minimized: boolean }[];
  overflow: string[];
  barOpen: boolean;
  open(id: string): void; close(id: string): void; toggle(id: string): void; toggleBar(): void;
};
```

  `dockReducer` es una función pura (testeable). Capacidad: `Math.max(1, Math.floor((window.innerWidth - barWidth - gaps) / panelWidth))` con `panelWidth` y `barWidth` leídos de los tokens `--ui-surface-panel-width` y `--ui-surface-panel-width-sm`; se recalcula en `resize`. Con `maxPanels` se usa ese valor.
- `MessageDock` acepta `overflow?: ReactNode` y `overflowCount?: number`; con `overflowCount > 0` renderiza el chip "+N" (botón) que abre un `Popover` con `overflow`.
- Móvil (≤ 560 px): `.surface { width: 100%; }` y el muelle sin `padding` horizontal; solo se renderiza el primer panel (la capacidad mínima es 1).
- `MessageDockBar`: mismo encabezado sin anidación que el panel; lista con `Avatar`, nombre, `convoPreview`, `lastMessageAt` formateado con `formatSmartTimestamp`, punto de no leído y (opcional) `badge`. El contenedor lleva `role="region"` con `aria-label` distinto al del muelle.

### Textos (`labels.ts`)

Cada componente acepta `labels?: Partial<...>` y mezcla con los defaults en español:

| Componente | Claves |
| --- | --- |
| `MessagePanel` | `minimize` "Minimizar", `expand` "Expandir", `close` "Cerrar conversación", `conversation` "Conversación" |
| `MessageDock` / `MessageDockBar` | `title` "Mensajería", `minimize`, `expand`, `unread` "Sin leer", `overflow` "Más conversaciones" |
| `MessageList` | `loadPrevious` "Cargar mensajes anteriores", `loadingPrevious` "Cargando…", `newMessages(n)` "N mensajes nuevos", `unreadDivider` "Mensajes nuevos", `empty` "Aún no hay mensajes" |
| `MessageComposer` | `placeholder` "Escribe un mensaje…", `readOnly` "Conversación en solo lectura", `send` "Enviar mensaje", `attach` "Adjuntar archivo", `message` "Mensaje" |
| `MessageBubble` | `sending` "Enviando…", `failed` "No se envió", `retry` "Reintentar", `you` "Tú" |

### Pruebas

`MessagePanel.test.tsx` se actualiza (renombre de `secuencia`, textos en español, estructura del encabezado). Pruebas recomendadas (opcionales): `dockReducer`, `groupMessages`, abrir/cerrar con foco, ausencia de botones anidados, IME en el compositor, scroll inteligente con `ResizeObserver`/`scrollTo` simulados.

### Riesgos de P8

| Riesgo | Mitigación |
| --- | --- |
| Los portales dependen de los textos en inglés (`Minimize`, `Messaging`) o del DOM del encabezado | Buscar esas cadenas en los tres portales (tarea 50.2); `labels` permite restaurarlas |
| `keepMounted` por defecto cambia el ciclo de vida (efectos del contenido siguen corriendo minimizados) | Documentarlo; `keepMounted={false}` conserva lo anterior |
| El muelle por debajo del `Modal` cambia el apilado | Documentarlo en el CHANGELOG (D15) |
| El scroll inteligente no se puede probar bien en jsdom | Probar la lógica pura (`isNearBottom`) y revisar el resto en Storybook |

## P9. Timeline

### API

```ts
export type TimelineStatus = "completed" | "current" | "upcoming" | "error" | "warning";
export interface TimelineItemData {
  id: Key;
  title: ReactNode;
  description?: ReactNode;
  timestamp?: ReactNode;
  dateTime?: string;
  icon?: ReactNode;
  status?: TimelineStatus;      // "upcoming"
  content?: ReactNode;          // contenido libre bajo la descripción
}
export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  items: TimelineItemData[];
  orientation?: "vertical" | "horizontal";   // "vertical"
  align?: "start" | "alternate";             // "start"
  size?: "sm" | "md" | "lg";                 // "md"
  minItemWidth?: string;                     // "8rem" (horizontal)
  stackBelow?: number;                       // px, solo horizontal
  maxVisible?: number;
  reverse?: boolean;
  onItemClick?: (item: TimelineItemData, index: number) => void;
  loading?: boolean; loadingItems?: number;  // 4
  emptyState?: ReactNode;
  labels?: Partial<TimelineLabels>;
  "aria-label"?: string;
}
```

`TimelineLabels`: `completed` "Completado", `current` "En curso", `upcoming` "Pendiente", `error` "Error", `warning` "Aviso", `showMore(n)` "Mostrar n más", `showLess` "Mostrar menos", `empty` "Sin eventos".

### Estructura

```tsx
<div ref={containerRef} className={styles.root} data-orientation={effectiveOrientation} data-align={align} data-size={size}>
  <div className={styles.scroller} role={overflowing ? "region" : undefined} tabIndex={overflowing ? 0 : undefined} aria-label=…>
    <ol className={styles.list} aria-label=…>
      {visible.map((item) => (
        <li key=… className={styles.item} data-status={status} aria-current={status === "current" ? "step" : undefined}>
          <div className={styles.rail}><span className={styles.marker}>{icon}</span><span className={styles.connector} /></div>
          <div className={styles.content}>…<span className="ui-sr-only">{statusLabel}</span></div>
        </li>
      ))}
    </ol>
  </div>
  {hidden > 0 && <button …>{showMore}</button>}
</div>
```

- **Orientación efectiva:** `effectiveOrientation = orientation === "horizontal" && stackBelow && width < stackBelow ? "vertical" : orientation`. `width` viene de un `ResizeObserver` sobre `root` (no sobre `window`). Sin `ResizeObserver` (jsdom) se asume el ancho completo.
- **Vertical:** `.item { display: grid; grid-template-columns: var(--tl-marker) 1fr; column-gap: var(--ui-space-3); }`. `.connector` es una línea `position: absolute` desde el marcador hasta el borde inferior del `li` (`top: marker; bottom: calc(-1 * gap)`), por lo que se adapta a cualquier alto de contenido. El último `li` no la pinta.
- **Vertical alternada:** en `@container (min-width: 40rem)` (el `root` tiene `container-type: inline-size`) el `li` pasa a `grid-template-columns: 1fr var(--tl-marker) 1fr` y los pares colocan el contenido a la izquierda. Es una media consulta de contenedor con valor fijo, porque `var()` no es válido dentro de la condición.
- **Horizontal:** `.list { display: flex; }`, `.item { flex: 1 0 var(--ui-timeline-min-item, 8rem); display: flex; flex-direction: column; }`. El `rail` es una fila: marcador y `connector` que se estira (`flex: 1`) hasta el siguiente. `.scroller { overflow-x: auto; scroll-snap-type: x proximity; }` y `.item { scroll-snap-align: center; }`. Con pocos puntos `flex: 1` los reparte; con muchos superan el ancho y activan el scroll. Los bordes se atenúan con `mask-image: linear-gradient(...)` solo cuando hay scroll (`data-overflow`).
- **Horizontal alternada:** los `li` pares invierten `flex-direction` (contenido arriba, riel abajo) y se reserva alto para ambos lados.
- **Detección de desbordamiento:** `scrollWidth > clientWidth + 1`, medido en el mismo `ResizeObserver`.
- **Centrar el actual:** `useEffect` al montar y al cambiar el índice `current`: `el.scrollIntoView({ inline: "center", block: "nearest" })` solo si `overflowing`. Con `prefers-reduced-motion`, sin `smooth`.
- **Orden y recorte:** `ordered = reverse ? [...items].reverse() : items`; `visible = expanded ? ordered : ordered.slice(0, maxVisible)`.
- **Conectores por estado:** el tramo bajo un punto `completed` usa `--ui-color-primary` sólido; el resto usa `border-style: dashed` con `--ui-color-border-strong`. Con `reverse`, el tramo se calcula por el elemento que lo origina en el orden de datos, no en el visual.
- **Marcador:** círculo de `--tl-marker` (1, 1.5, 2 rem). `completed` relleno primario y texto `--ui-color-on-primary`; `current` relleno primario con anillo (`box-shadow` con `color-mix` de primario al 25 %) y pulso; `upcoming` hueco con borde fuerte; `error` y `warning` rellenos con sus tokens y texto `--ui-color-on-danger` / `--ui-color-on-primary`.
- **Interacción:** con `onItemClick`, `.content` es un `<button>` con hover (`--ui-color-surface-raised`) y foco visible.
- **Carga:** `loading` renderiza `loadingItems` filas con `Skeleton` circular y líneas de texto, en la orientación efectiva.
- **Texto largo:** `.title, .description { overflow-wrap: anywhere; }`.
- **Iconos por defecto:** `Check`, `X` y `TriangleAlert` de `lucide-react`, tamaño proporcional al marcador (60 %).

### Ejemplo de uso para el historial de un viaje

```tsx
<Timeline
  orientation="horizontal"
  stackBelow={560}
  items={[
    { id: "SOLICITADO", title: "Solicitado", timestamp: "10 nov, 08:12", status: "completed" },
    { id: "APROBADO", title: "Aprobado", timestamp: "10 nov, 09:03", status: "completed" },
    { id: "EN_TRANSITO", title: "En recorrido", description: "Parada 2 de 3", status: "current" },
    { id: "CERRADO", title: "Cerrado", status: "upcoming" },
  ]}
/>
```

### Riesgos de P9

| Riesgo | Mitigación |
| --- | --- |
| La línea vertical se corta con contenido de alto variable | El conector se posiciona respecto del `li`, no con altura fija; story con contenido largo |
| `@container` no soportado en navegadores viejos | Sin soporte, la línea alternada degrada a una columna (comportamiento válido). Los navegadores de destino son los evergreen de los portales |
| 100+ puntos en horizontal pesan | `maxVisible` (en horizontal se recorta y se informa); sin virtualización en esta ola |
| `ResizeObserver` ausente en jsdom | Guardia; las pruebas de orientación usan un `ResizeObserver` simulado |

---

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| `Escape` dentro de un `Popover` cierra también el `Modal` contenedor (el `Modal` captura `Escape` en `document`) | El `Popover` escucha en `window` en captura y detiene la propagación; se prueba en la tarea 3.2 con un popover dentro de `Modal` |
| Cambiar `Sidebar` rompe la presentación en los consumidores | Revisión visual en `NavigationSidebar` y `AppShell` (tarea 12.3) |
| `solid` ilegible en tema claro | Medición en la tarea 33 y decisión D10 |
| Textos en español rompen pruebas de consumidores que buscan el texto en inglés | `labels` permite restaurar; buscar el texto actual en los repos de consumidores antes de publicar (tarea 31.1) |
| Mantener 7 partes en un spec crece sin control | Cada parte es una versión beta publicable por separado; la lista de tareas marca el cierre de cada parte |
| `DateTimeInput` con estado a medias | Documentado, con `defaultTime` como salida y `key` para reinicio |
