# Diseño: componentes de la librería para el panel interno

**Repo:** `pf-library-frontend-components` (`@ai27-tech/ui`). Requisitos en `requirements.md`; tareas en `tasks.md`. Las decisiones P-1 a P-8 están en la sección 8 de `requirements.md`.

Cada Parte resume el diseño propuesto (secciones `## Parte n`). Después viene el diseño detallado con las firmas de API (sección 12) y las pruebas (sección 14). Las firmas son propuesta: cualquier cambio posterior a la publicación es incompatible para el panel.

---

## Parte 1. Tabs

- API: `items: { id, label, disabled?, badge?, href? }[]`, `value`, `onChange(id)`, `ariaLabel`.
- Modo enlaces: si el ítem trae `href`, se renderiza `<a>`. La librería no importa el router. Para integrarlo con React Router se ofrece una prop `renderLink` (o `linkComponent`) que recibe `{ href, className, children, ...ariaProps }`.
- Semántica en modo enlaces: la pestaña activa lleva `aria-current="page"`. En este modo no usa `role="tab"` (decisión P-1, ver `requirements.md`).
- Las flechas saltan las pestañas deshabilitadas. `Inicio` y `Fin` van a la primera y última habilitada.
- No se incluye contenido de paneles (`tabpanel`) en V1. Cada pantalla renderiza el suyo.

---

## Parte 2. PageHeader y Breadcrumb

- `PageHeader`: props `title`, `description`, `meta`, `breadcrumb` (nodo, normalmente `<Breadcrumb />`), `actions`.
- `Breadcrumb`: `items: { label, href? }[]` y la misma convención `renderLink` de Tabs, para que ambos se comporten igual con el router.
- El separador es decorativo (`aria-hidden`), dentro de `<nav><ol>`.
- Las migas largas se recortan con elipsis sin perder el último elemento.

---

## Parte 3. Estados de página: EmptyState, Skeleton, Spinner y Alert

- Un solo nombre: `Alert` (no exportar también `Banner`). Variantes `info | success | warning | error`, con los tokens existentes `--ui-color-{success,warning,info,danger}` y sus `-container` y `-border`.
- `Alert`: props `variant`, `title`, `children`, `action`, `onClose`. Para `info`, `success` y `warning` usar `role="status"`; para `error`, `role="alert"`.
- `Skeleton`: `variant="line" | "block" | "table-row"`, con `rows` y `columns` en la de tabla. El contenedor lleva el `role="status"` y `aria-busy`; los elementos internos son decorativos.
- Con `prefers-reduced-motion`, el shimmer se reemplaza por un bloque estático y el `Spinner` gira más lento o se sustituye por un indicador estático con el texto.
- Diferencia con `Toast`: `Toast` es efímero y flotante; `Alert` es persistente y en línea. Se documenta en las stories.

---

## Parte 4. ConfirmDialog

- Se construye sobre `Modal` (que ya resuelve portal, trampa de foco, `Escape` y retorno de foco) y `Button`. No se reimplementa nada de eso.
- Props: `open`, `title`, `message`, `confirmLabel`, `cancelLabel`, `variant`, `loading`, `error`, `onConfirm`, `onCancel`. Valores por defecto: "Confirmar" y "Cancelar".
- `onConfirm` puede devolver una promesa. Mientras esté pendiente se activa `loading` interno, aunque el consumidor no lo pase. La prop `loading` externa lo sobrescribe.
- Durante `loading` se desactivan `closeOnEsc`, `closeOnOverlayClick` y el botón de cerrar, y `onCancel` no se ejecuta.
- El error vive dentro del diálogo, con `role="alert"`.
- En `danger`, el foco inicial va en **Cancelar**. `Modal` hoy enfoca el primer elemento enfocable (el botón de cerrar). Por eso hace falta una prop mínima y aditiva en `Modal` (por ejemplo `initialFocusRef`). Es la única modificación a un componente existente y no rompe su API. Ver pregunta P-3.
- Botón de confirmar con `Button` variante `danger` cuando aplique.

---

## Parte 5. DescriptionList

- `DescriptionList`: `columns={1 | 2 | 3}`. La rejilla colapsa a una columna con `@media`/`container query` en pantallas angostas.
- `DescriptionItem`: `label`, `children` (valor), `emptyText`, `action`. Si `children` es `null`, `undefined` o cadena vacía, muestra `emptyText` con estilo atenuado. `0` y `false` no se consideran vacíos (ver P-5).
- HTML válido: cada par se agrupa en un `<div>` dentro del `<dl>`.

---

## Parte 6. Timeline

- `TimelineItem`: `date`, `title`, `description`, `badge`, `icon`, `open` (evento abierto), `children` (contenido dinámico, por ejemplo un contador de tiempo transcurrido).
- `Timeline`: `loading` (usa `Skeleton` de la Parte 3), `empty` (usa `EmptyState` de la Parte 3) y `emptyText`. **Dependencia interna:** Parte 6 depende de la Parte 3.
- La fecha se recibe ya formateada (`ReactNode`) o como `<time dateTime>`. El formato es-MX lo decide el consumidor (tarjeta `[Interno]` de fechas). La librería no formatea (ver P-4).
- El orden es el que entrega el consumidor. La librería no reordena.
- Un evento abierto usa un indicador distinto y no depende solo del color (forma o etiqueta), para accesibilidad.

---

## Parte 7. Paginación por cursor

- Componente separado `CursorPagination`, **no** una variante de `Pagination`. Mantiene intacta la API numérica (RT-4) y evita props mutuamente excluyentes.
- Props: `page`, `hasPrevious`, `hasNext`, `onPrevious`, `onNext`, `loading`, `total?`, `className`. El componente no conoce el cursor; el consumidor lo administra.
- `loading` deshabilita ambos botones y marca `aria-busy`.
- `<nav aria-label="Paginación">`, con un texto `aria-live="polite"` para "Página N".
- Los botones usan `Button`.

---

## 12. Diseño detallado

Las firmas son una propuesta de API. Se ajustan al implementar, pero cualquier cambio posterior a la publicación es incompatible para el panel.

### 12.1 Base común

**Tokens ya disponibles** (verificados en `src/styles/tokens.css`): `--ui-duration-{fast,base,slow}`, `--ui-ease-standard`, `--ui-transition`, `--ui-shadow-{sm,md,lg}`, `--ui-focus-ring`, `--ui-border-width`, `--ui-radius*`, `--ui-space-1` a `--ui-space-6`, `--ui-color-{success,warning,info,danger}` con sus `-container` y `-border`, `--ui-z-modal`. No hace falta agregar tokens para empezar. Si un componente necesita uno (por ejemplo, el diámetro del indicador de `Timeline`), se agrega primero a `tokens.css` en los dos temas.

**Tipo compartido para enlaces** (Tabs y Breadcrumb, decisión P-2). Se define una sola vez y se exporta:

```ts
export interface LinkRenderProps {
  href: string;
  className: string;
  children: ReactNode;
  "aria-current"?: "page";
  "aria-disabled"?: boolean;
  onKeyDown?: KeyboardEventHandler;
}
export type RenderLink = (props: LinkRenderProps) => ReactElement;
```

Sin `renderLink`, la librería renderiza un `<a>` simple. Con él, el consumidor devuelve su `Link` del router. La librería no importa ningún router.

**Utilidad `cx`.** Cada componente de la librería la redefine localmente. Se sigue ese patrón; no se crea un módulo compartido en este spec.

### 12.2 Parte 1. Tabs

```ts
export interface TabItem {
  id: string;
  label: ReactNode;
  disabled?: boolean;
  /** Contador o Badge junto a la etiqueta. */
  badge?: ReactNode;
  /** Si existe, la pestaña es un enlace (modo navegación). */
  href?: string;
}
export interface TabsProps {
  items: TabItem[];
  /** id de la pestaña activa. */
  value: string;
  /** Solo en modo controlado. */
  onChange?: (id: string) => void;
  renderLink?: RenderLink;
  "aria-label"?: string;
  size?: "sm" | "md";
  className?: string;
}
```

- **Modo controlado** (ítems sin `href`): `<div role="tablist">` con `<button role="tab" aria-selected tabIndex>`. Solo la pestaña activa tiene `tabIndex=0` (roving tabindex). Las flechas mueven el foco y activan la pestaña, `Inicio` y `Fin` van a los extremos, saltando las deshabilitadas.
- **Modo enlaces** (ítems con `href`, decisión P-1): `<nav aria-label>` con `<ul>` y un `<a>` por ítem. La activa lleva `aria-current="page"`. Se mantiene la navegación por flechas, `Inicio` y `Fin` como mejora. Sin `role="tab"`.
- Mezclar ítems con y sin `href` en el mismo `Tabs` no está soportado. Se documenta y en desarrollo se emite una advertencia en consola.
- Pestaña deshabilitada: `aria-disabled="true"`, sin foco por flechas, y en modo enlaces sin `href` navegable.
- Estilo: línea inferior en la activa con `--ui-color-primary`; el `badge` va a la derecha de la etiqueta. Si el contenedor es más angosto que las pestañas, hace scroll horizontal sin romper el foco visible.
- Archivos: `Tabs.tsx`, `Tabs.module.css`, `Tabs.stories.tsx`, `Tabs.test.tsx`, `index.ts`.

### 12.3 Parte 2. PageHeader y Breadcrumb

```ts
export interface BreadcrumbItem { label: ReactNode; href?: string }
export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  renderLink?: RenderLink;
  className?: string;
}
export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Zona junto al título: Badge de estado, etc. */
  meta?: ReactNode;
  breadcrumb?: ReactNode;
  /** Zona derecha: botones de acción. */
  actions?: ReactNode;
  className?: string;
}
```

- `Breadcrumb`: `<nav aria-label="Migas de pan"><ol>`. El último ítem va sin enlace, con `aria-current="page"`. Un ítem intermedio sin `href` se muestra como texto. Separador por CSS (`::before`), no por texto, para que no lo lean los lectores de pantalla. Si hay una sola miga, se renderiza igual.
- `PageHeader`: contenedor con dos zonas. Izquierda: migas, fila de título + `meta`, descripción. Derecha: `actions`. `flex-wrap: wrap` para que `actions` baje a una segunda línea en pantallas angostas (R2.3).
- El título es un `<h1>`. Solo debe haber uno por pantalla; se documenta.
- Tipografía: título `ui-text-headline-lg`, descripción `ui-text-body-md`.
- Archivos: `PageHeader/` y `Breadcrumb/` como carpetas separadas, cada una con `index.ts`, stories y pruebas.

### 12.4 Parte 3. Estados de página

```ts
export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}
export type AlertVariant = "info" | "success" | "warning" | "error";
export interface AlertProps {
  variant?: AlertVariant;          // por defecto "info"
  title?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  onClose?: () => void;            // si existe, muestra el botón de cierre
  closeLabel?: string;             // por defecto "Cerrar aviso"
  className?: string;
}
export interface SkeletonProps {
  variant?: "line" | "block" | "table-row";
  rows?: number;                   // filas, para "line" y "table-row"
  columns?: number;                // solo "table-row"
  width?: string | number;
  height?: string | number;
  label?: string;                  // texto accesible, por defecto "Cargando"
  className?: string;
}
export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;                  // por defecto "Cargando"
  className?: string;
}
```

- `Alert`: `role="alert"` solo en `error` (R3.4). El resto usa `role="status"`. Nota de consistencia: `Toast` usa `alert` también para `warning`. Se decide seguir la tarjeta y dejar a `warning` como `status`; se documenta la diferencia.
- `Alert` usa colores solo de los tokens existentes: fondo `-container`, borde `-border`, texto e icono `--ui-color-*`. Cada variante lleva un icono distinto, para que no dependa solo del color.
- `Skeleton`: el contenedor lleva `role="status"`, `aria-busy="true"` y un texto oculto visualmente con `label`. Los bloques internos son `aria-hidden`.
- `Spinner`: `role="status"` y texto oculto. Reutiliza el estilo del indicador del `Button` cuando sea posible.
- Con `@media (prefers-reduced-motion: reduce)`: el shimmer del `Skeleton` se apaga (queda un bloque estático) y el `Spinner` se sustituye por tres puntos estáticos.
- `EmptyState`: centrado, `ui-text-title-md` para el título, `ui-text-body-md` para la descripción. No define su propio `role`.
- Archivos: carpetas `EmptyState/`, `Alert/`, `Skeleton/` y `Spinner/`.

### 12.5 Parte 4. ConfirmDialog

```ts
export interface ConfirmDialogProps {
  open: boolean;
  title: ReactNode;
  message?: ReactNode;
  confirmLabel?: string;           // por defecto "Confirmar"
  cancelLabel?: string;            // por defecto "Cancelar"
  variant?: "default" | "danger";
  /** Fuerza el estado de carga. Si se omite, se infiere de la promesa de onConfirm. */
  loading?: boolean;
  /** Error del servidor; se muestra dentro del diálogo sin cerrarlo. */
  error?: ReactNode;
  onConfirm: () => void | Promise<unknown>;
  onCancel: () => void;
}
```

- Se compone con `Modal` (tamaño `sm`) y `Button`. No se vuelve a escribir trampa de foco ni `Escape`.
- **Doble envío:** al confirmar se pone un candado interno (ref) antes de llamar a `onConfirm`. Si `onConfirm` devuelve una promesa, el candado se libera al resolverse o rechazarse. Un segundo clic o `Enter` mientras tanto se ignora.
- **Durante la carga:** ambos botones deshabilitados, el de confirmar con `loading`. Se pasan `closeOnEsc={false}`, `closeOnOverlayClick={false}` y `showCloseButton={false}` a `Modal`. `onCancel` no se invoca.
- **Error:** si `onConfirm` rechaza y no se pasó `error`, el diálogo no inventa un mensaje; el consumidor controla `error`. Se muestra con `Alert variant="error"` dentro del cuerpo, y el diálogo sigue abierto.
- **Foco inicial** (decisión P-3, aún propuesta): con `variant="danger"` el foco va a **Cancelar**. Requiere `initialFocusRef?: RefObject<HTMLElement>` en `Modal`, aditiva. Si no se aprueba, el foco queda donde `Modal` lo pone hoy.
- El botón de confirmar usa `Button variant="danger"` cuando `variant="danger"`, y `primary` en caso contrario.
- El mensaje se enlaza al diálogo con `aria-describedby`. Para eso `Modal` necesitaría aceptar `aria-describedby`; es otra prop aditiva a validar junto con P-3.

### 12.6 Parte 5. DescriptionList

```ts
export interface DescriptionListProps {
  columns?: 1 | 2 | 3;             // por defecto 1
  children: ReactNode;
  className?: string;
}
export interface DescriptionItemProps {
  label: ReactNode;
  children?: ReactNode;
  emptyText?: string;              // por defecto "Sin dato"
  action?: ReactNode;              // por ejemplo, un botón "Editar"
  className?: string;
}
```

- Marcado: `<dl>` con un `<div>` por par, que contiene `<dt>` y `<dd>`.
- Vacío (decisión P-5, propuesta): `null`, `undefined` y `""`. El texto vacío se muestra atenuado y con `ui-text-body-md`.
- `action` va en la misma línea que el valor, alineada a la derecha. Si el valor es largo, hace salto de línea sin desbordar el contenedor (`overflow-wrap: anywhere`).
- La rejilla de 2 y 3 columnas colapsa a una en pantallas angostas con `@media (max-width)` o `@container`, según lo que ya use la librería. Se revisa el patrón de `Form` y `FilterBar` antes de elegir.
- Archivos: `DescriptionList/` con ambos componentes en el mismo `index.ts`.

### 12.7 Parte 6. Timeline

```ts
export interface TimelineItemProps {
  date?: ReactNode;                // ya formateada (decisión P-4, propuesta)
  /** Valor ISO para <time dateTime>, opcional. */
  dateTime?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Badge de tipo: nota, estadía, incidencia, etc. */
  badge?: ReactNode;
  icon?: ReactNode;
  /** Evento en curso. */
  open?: boolean;
  /** Contenido dinámico, por ejemplo el tiempo transcurrido. */
  children?: ReactNode;
}
export interface TimelineProps {
  children?: ReactNode;
  loading?: boolean;
  loadingRows?: number;            // por defecto 3
  emptyTitle?: ReactNode;          // por defecto "Sin eventos"
  emptyDescription?: ReactNode;
  className?: string;
}
```

- `Timeline` renderiza `<ol>`; cada `TimelineItem` es un `<li>`. Una línea vertical conecta los indicadores.
- Si `loading`, muestra `Skeleton` y no renderiza `children`. Si no hay `children` y no está cargando, muestra `EmptyState`.
- Evento abierto: el indicador es un anillo con relleno parcial y el item lleva el texto accesible "En curso" (oculto visualmente), además del cambio de forma. No depende solo del color.
- El contenido dinámico (`children`) se renderiza dentro del `<li>`. Si cambia, no se anuncia a lectores de pantalla (sin `aria-live`), para no generar ruido cada segundo.
- Los grosores de línea e indicador salen de `--ui-border-width` y `--ui-border-width-strong`, no del `3px` fijo que usa hoy el panel.
- Depende de las Partes 3 (`Skeleton`, `EmptyState`).

### 12.8 Parte 7. CursorPagination

```ts
export interface CursorPaginationProps {
  /** Número de página actual, basado en 1. */
  page: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  /** Total conocido; si se omite, no se muestra "N resultados". */
  total?: number;
  /** Deshabilita ambos botones mientras se carga la página. */
  loading?: boolean;
  previousLabel?: string;          // por defecto "Anterior"
  nextLabel?: string;              // por defecto "Siguiente"
  className?: string;
}
```

- `<nav aria-label="Paginación">` con dos `Button variant="outline"` y el texto "Página N".
- El texto de página y de total va en un contenedor `aria-live="polite"` para que se anuncie el cambio.
- `loading` pone `aria-busy` en el `nav` y deshabilita ambos botones, así no se encadenan clics sobre un cursor que aún no llegó.
- No expone `pageSize` ni lista de páginas. Eso es lo que no puede calcularse con un cursor opaco.
- El texto "N resultados" usa singular cuando `total === 1`.

---

## 14. Pruebas y verificación

Pruebas unitarias en el proyecto `unit` (Vitest + Testing Library, jsdom). Cada componente cubre lo que su parte exige como comportamiento, no solo que renderice.

| Parte | Qué debe comprobar la prueba |
| --- | --- |
| Tabs | Roles y `aria-selected`; flechas, `Inicio` y `Fin` saltan deshabilitadas; modo enlaces pone `aria-current="page"`; `renderLink` recibe `href` y `className`. |
| Breadcrumb | `aria-label="Migas de pan"`; el último ítem no es enlace y tiene `aria-current="page"`. |
| PageHeader | Un único `h1`; las zonas `meta`, `breadcrumb` y `actions` aparecen solo si se pasan. |
| Estados de página | `Alert error` tiene `role="alert"`; los demás `status`; `onClose` se llama; `Skeleton` y `Spinner` tienen `role="status"` y `aria-busy`. |
| ConfirmDialog | Un doble clic llama a `onConfirm` una sola vez; durante la carga `Escape` no cierra; con `error` el diálogo sigue abierto; el foco vuelve al disparador. |
| DescriptionList | Genera `dl`, `dt` y `dd`; `0` se muestra como `0`; `""` muestra `emptyText`. |
| Timeline | Es un `ol`; con `loading` muestra el esqueleto; sin hijos muestra el vacío; el evento abierto incluye el texto "En curso". |
| CursorPagination | Anterior y Siguiente se deshabilitan según `hasPrevious` y `hasNext`; con `loading` ambos se deshabilitan; "N resultados" solo aparece con `total`. |

**Verificación visual (manual, en Storybook):** tema claro y oscuro, pantalla angosta (acciones de `PageHeader` en segunda línea; rejilla de `DescriptionList` en una columna), `prefers-reduced-motion` activo, foco visible con teclado.

**Criterio de terminado de todo el spec:** las 7 partes cumplen sus requisitos `R*`, los requisitos transversales `RT-1` a `RT-10`, la lista del steering y los comandos de la tarea 8.5 pasan sin errores.

**No verificado en este borrador:** no se ejecutó ni compiló nada. Las firmas y los comportamientos de esta sección son diseño, no código probado.
