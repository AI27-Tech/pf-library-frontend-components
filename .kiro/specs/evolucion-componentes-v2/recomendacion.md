# Recomendación: evolución de `@ai27-tech/ui` (siguiente ola)

**Estado:** borrador para validar. Todavía no es un spec.
**Fecha:** 2026-11-12
**Base:** `0.2.0-beta.8`. Todo lo propuesto es aditivo salvo donde se indica "cambio visible".

## 1. Qué encontré en el repo (evidencia)

| Hallazgo | Dónde | Por qué importa |
| --- | --- | --- |
| El botón de colapso vive en el pie y muestra texto "Contraer" + chevron | `Sidebar.tsx` | Es lo que hay que mover y reducir a un icono |
| No existe ningún input de fecha u hora | búsqueda de `type="date"/"time"` sin resultados | Los pickers son componentes nuevos, no mejoras |
| El desplegable del `Select` es `position: absolute` dentro del contenedor | `SelectCustom.module.css` | Se puede recortar dentro de contenedores con `overflow` (la envoltura de `Table` tiene `overflow-x: auto`). Un picker con ese enfoque tendría el mismo problema |
| Ya hay patrón de portal + `position: fixed` | `Tooltip`, `Modal`, `Toast` | Sirve de base para un `Popover` compartido |
| La tabla en carga solo muestra un spinner centrado | `Table.tsx` | Sin skeleton hay salto de layout al llegar los datos |
| Textos por defecto en inglés: "No data to display.", "Select all rows", "Search...", "Clear", "results" | `Table.tsx`, `FilterTable.tsx` | El resto de la librería y los portales están en español |
| `FilterTable` reconstruye los filtros y descarta `variant`, `searchPlaceholder`, `noResultsText` e `icon` | `FilterTable.tsx` | El select buscable de beta.7/8 no llega a `FilterTable` |
| La selección de filas usa `<input type="checkbox">` nativo, no el `Checkbox` de la librería | `Table.tsx` | Inconsistencia visual dentro de la misma tabla |
| Los chips de `FilterBar` usan el carácter "✕" como icono | `FilterBar.tsx` | Se ve distinto al resto de iconos SVG |
| Badge tiene 5 variantes: `secure`, `alert`, `escort`, `warning`, `neutral` | `Badge.module.css` | Ver sección 6 |
| Paleta real: 4 tonos (azul periwinkle, verde menta, ámbar, coral) + neutros. `info` y `primary` son el mismo azul | `tokens.css` | Es el límite de las variantes de color sin tokens nuevos |
| En los portales, `Card`, `Button` y `Badge` dominan los imports; `Table` aparece en pocas pantallas (`FichaEditor`, `Catalogos`) y no vi `FilterTable`. `TarjetaResumen` (analist-panel) arma una tarjeta de KPI a mano sobre `Card` | `pf-web-frontend-*` | Es la señal de componentes de estructura faltantes |
| `lucide-react` es `devDependency` pero se importa en `Visor` y `FilterBar`; no está en `external` de Vite | `package.json`, `vite.config.ts` | Se empaqueta dentro de `dist`. Para código nuevo recomiendo SVG inline, como hacen la mayoría de componentes |

Limitación: el `grep` de consumidores se truncó, así que no revisé `pf-web-frontend-client` ni el marcado interno de pantallas como `BannerEstado` o `ListaCasos`. La lista de la sección 5 se basa en lo que vi y en el nombre de los archivos.

## 2. Restricciones que condicionan el diseño

El steering de la librería (`components-library-steering.md`) manda:

- **No colores nuevos ni cambios de fuente.** Afecta directo a los badges.
- **No romper la API pública.** Todo se agrega con props opcionales y con defaults que conservan el comportamiento.
- **No dependencias nuevas sin justificar.** No usaremos `@mantine/*` ni `dayjs`. Mantine (MIT) es referencia de comportamiento; reescribimos con `Intl.DateTimeFormat`.
- **Tokens primero.** Todo valor nuevo (z-index de popover, alturas de control, colores de skeleton) se agrega a `tokens.css` y luego se consume.
- Nota menor: el steering tiene el marcador `<ruta-de-tokens>` sin llenar. Debe decir `src/styles/tokens.css`.

## 3. Fundaciones (van antes que todo lo demás)

1. **`Popover` (primitiva interna, exportada)**: portal a `document.body`, posicionado con `position: fixed` desde `getBoundingClientRect`. Opciones `position: "bottom" | "top" | "auto"` (auto = abajo si cabe, arriba si no; es el comportamiento que muestra Mantine en "Dropdown position"), ancho igual al ancho del ancla o al contenido, cierre con clic fuera y `Escape`, manejo de foco, reposicionado en scroll y resize. Token nuevo `--ui-z-popover`.
2. **`Skeleton` (primitiva)**: ver sección 4.
3. **Tokens de control**: alturas `sm/md/lg` compartidas por input, select, picker y botón (el steering ya lo exige y conviene verificar que existan).

`Popover` desbloquea los pickers, el colapso del breadcrumb y, más adelante, el panel de filtros. No propongo cambiar `Select` a `Popover` ahora (es una migración con riesgo de regresión); queda como candidato aparte.

## 4. Propuesta por solicitud

### 4.1 Breadcrumb

- `Breadcrumb` con `items: { label, href?, icon?, onClick?, as? }[]`. Recomiendo API por datos (no hijos) porque el colapso con puntos suspensivos necesita conocer los elementos, y `as` permite pasar el `Link` de TanStack Router, igual que `SidebarItem`.
- Semántica: `<nav aria-label="Ruta de navegación"><ol>`, último elemento con `aria-current="page"`.
- Separador configurable (por defecto chevron SVG), `maxItems` con colapso a "…" que abre un `Popover` con los ocultos, truncado de etiquetas largas con `Tooltip`.
- Estados: hover, foco visible, activo; en móvil hace scroll horizontal o colapsa.

### 4.2 Sidebar: botón de colapso

- Mover el botón al **extremo derecho del encabezado**, solo icono (estilo panel-izquierda abrir/cerrar), 2.5 rem de área de clic, con `aria-label` y `aria-expanded` que ya existen, más `title`.
- El pie queda solo para la prop `footer`.
- La fila de encabezado se renderiza si hay `header` o `onToggleCollapse` (hoy sin `header` no habría dónde poner el botón).
- **Decisión pendiente**: con la barra colapsada (4 rem) no caben marca y botón. Recomiendo mostrar solo el botón centrado en el encabezado. Alternativa: marca visible y botón al pasar el cursor.
- Las props no cambian. Es un **cambio visible**: se documenta en CHANGELOG.

### 4.3 Formularios y pickers

**Pickers nuevos** (sin dependencias):

- `TimePicker`: campos segmentados horas / minutos (opcional segundos), formato 24 h o 12 h con AM/PM, flechas arriba/abajo con paso configurable (`hoursStep`, `minutesStep`), dropdown con columnas, `presets` (incluye un helper para generar rangos), `min`/`max`, `clearable`, `dropdownPosition`, pegado de texto `HH:mm`.
- `DateInput`: campo escrito con parseo + calendario en `Popover`, `presets` junto al calendario (ej. Hoy, Ayer, Hace 7 días), `min`/`max`, fechas deshabilitadas, `clearable`, navegación por mes y año, teclado completo (flechas, PageUp/PageDown, Home/End, Enter, Escape).
- `DateTimeInput`: composición de los dos para el caso "fecha y hora".
- Calendario reutilizable (`Calendar`) como pieza interna que se exporta.
- Locale `es-MX` por defecto vía `Intl`; `weekStartsOn` configurable.

**Contrato de valores (recomendado):** cadenas, no `Date`. `"2026-11-12"`, `"14:30"` / `"14:30:00"`, `"2026-11-12T14:30"`. Son la hora de pared local, sin zona horaria. Evita el desfase por zona al serializar; la conversión a UTC la hace el consumidor. Esto importa porque el contrato exige `fecha_hora_servicio_definida` para aprobar viajes.

**Mejora de formularios existentes.** No revisé el CSS de cada control, así que la primera tarea del spec es una auditoría de estados y alturas. Lista candidata:

- Misma altura, radio, foco, deshabilitado y error en `Input`, `Select`, `Textarea`, `Checkbox`, `Radio`, `Switch`.
- `FormField`: indicador de opcional, contador de caracteres (con `maxLength`), orientación horizontal opcional, mensajes de error con icono.
- `Input`: `clearable`, estado `loading`, botón de mostrar/ocultar contraseña.
- `Form`: `FormActions` pegajoso al fondo, `FormSection` colapsable, `FormRow` con puntos de quiebre más claros.
- Estados `readOnly` y `disabled` visualmente distintos.

### 4.4 Skeletons y cargas

- `Skeleton` con formas `text`, `circle`, `rect`; animación shimmer que usa los colores de superficie existentes (`surface-container-high` y `surface-container-highest`) mediante tokens `--ui-skeleton-base/highlight`. Sin colores nuevos.
- Compuestos: `SkeletonText` (n líneas, última más corta), `SkeletonCard`, `SkeletonTable`.
- `Spinner` extraído del CSS de `Table`, con tamaños `sm/md/lg`, y `ProgressBar` (determinada e indeterminada) para cargas de página.
- Accesibilidad: contenedor con `aria-busy`, texto "Cargando" solo para lectores de pantalla, `prefers-reduced-motion` desactiva el shimmer.
- Integración: `Table loading` pasa a mostrar filas skeleton con las columnas reales (`loadingRows` configurable) en lugar del spinner. **Cambio visible**. También aplica a `FilterTable`, `ImageCard`/`ImageGrid` (placeholder mientras carga la imagen) y `Card`.

### 4.5 Tablas y filtros (solo estilo)

**Tabla:**

- Encabezado fijo (`stickyHeader`) y sombra de borde cuando hay scroll horizontal.
- Selección con el `Checkbox` de la librería.
- Indicador de orden con estado neutro visible (flechas arriba/abajo atenuadas) y transición.
- Separadores de fila con `--ui-color-divider`; `striped` como opción en lugar de siempre activo (hoy las rayas son fijas, así que el default debe seguir igual).
- Expandir fila con transición de altura.
- Barra de acciones masivas al seleccionar ("3 seleccionados" + slot de acciones).
- Estado vacío con el nuevo `EmptyState` (icono, título, descripción, acción).
- Columnas con `truncate` y `minWidth`.
- Textos por defecto en español, expuestos como un objeto `labels` para sobrescribirlos.

**Filtros:**

- `FilterBar` con `layout`: `"panel"` (el actual, por defecto) y `"toolbar"` (una fila: búsqueda + botón "Filtros (n)" que despliega los controles en un `Popover`).
- Chips de filtros activos como píldoras con botón de quitar y icono SVG; control activo resaltado con borde primario.
- Etiquetas de los selects alineadas con `FormField`.
- Textos en español.
- Arreglo relacionado: que `FilterTable` pase `variant`, `searchPlaceholder`, `noResultsText` e `icon`. Es funcionalidad, no estilo, así que lo marco para tu aprobación.

### 4.6 Componentes de estructura de información

Prioridad 1 (cubre la repetición Card + Button):

| Componente | Para qué |
| --- | --- |
| `Stack`, `Inline`, `Grid` | Layout con gaps de `--ui-space-*` en lugar de CSS suelto en cada pantalla |
| `PageHeader` | Breadcrumb + título + descripción + acciones |
| `Section` | Bloque con título, descripción, acciones y divisor; colapsable opcional |
| `DescriptionList` | Pares etiqueta/valor en 1..n columnas (fichas técnicas, expedientes) |
| `Stat` | KPI con valor, etiqueta y tendencia (sustituye `TarjetaResumen` hecha a mano) |
| `EmptyState` | Estado vacío estándar |
| `Alert` | Banner en línea de info/éxito/aviso/error (hoy se arma con `Badge`) |
| `Tabs` | Dividir pantallas largas |
| `Divider` | Separador horizontal/vertical con etiqueta opcional |

Prioridad 2: `Accordion`, `Timeline` (útil para historial de estados del viaje), `Avatar`, `ProgressBar` (si no entra antes), `Stepper`, `List`/`ListItem` (bandejas tipo `ListaCasos`).

Todos con tokens existentes, sin colores nuevos, tamaños `sm/md/lg` donde aplique.

## 5. Badges: el problema es de paleta, no de código

La paleta tiene 4 tonos útiles y los 4 ya están en uso. El contrato de estados del viaje (`viaje.estados.yaml`) tiene **12 estados alcanzables en V1** más 2 condiciones (incidencia, sin señal). Con 5 variantes no se pueden distinguir todos por color.

| Opción | Qué hace | Riesgo |
| --- | --- | --- |
| **A (recomendada para empezar)** | Eje nuevo `appearance`: `soft` (actual, por defecto), `solid`, `outline`. Agrega `size` `sm/md`. Alias semánticos `info`/`primary`/`secondary` sobre tokens existentes | Ninguno de paleta. Triplica combinaciones visibles, pero sigue habiendo solo 4 tonos |
| B | Tonos derivados con `color-mix` de tokens existentes (verde azulado = éxito + primario; naranja = aviso + peligro; violeta = primario + peligro) | Son tonos nuevos aunque no haya hex nuevos. Hay que validar contraste en tema oscuro y claro |
| C | Extender la paleta con tokens nuevos aprobados por diseño (oscuro y claro) | Requiere aprobación explícita del steering. Es lo más limpio a largo plazo |

Recomiendo A ahora, y que diseño decida B o C. Para no rehacer nada después, los tonos extra se consumirán por tokens (`--ui-color-accent-*`); cambiar de B a C solo cambia los valores. Además, `solid` necesita texto legible sobre verde y ámbar. Hoy solo existe `--ui-color-on-primary`/`on-danger`, así que habría que agregar `on-success` y `on-warning`. Eso son tokens de color nuevos y también pide tu visto bueno.

## 6. Orden y partición en specs

Recomiendo **varios specs pequeños en vez de uno grande**: son 7 áreas con dependencias distintas y se pueden publicar como betas separadas.

| # | Spec | Contenido | Depende de |
| --- | --- | --- | --- |
| S1 | Navegación | Sidebar (botón) + Breadcrumb | `Popover` (solo para el colapso) |
| S2 | Cargas | `Skeleton`, `Spinner`, `ProgressBar`, integración con `Table`/`Card` | Tokens |
| S3 | Formularios y pickers | `Popover`, `Calendar`, `DateInput`, `TimePicker`, `DateTimeInput`, mejoras de controles | Tokens |
| S4 | Tablas y filtros | Estilos de `Table`, `FilterBar`, `FilterTable` | S2, `EmptyState` de S5 |
| S5 | Estructura de información | Componentes de la sección 4.6 | Ninguna |
| S6 | Badges | Opción A (y B/C cuando haya decisión) | Decisión de paleta |

Secuencia sugerida: `Popover` y tokens → S2 → S1 → S5 → S3 → S4 → S6. S6 puede ir primero si prefieres un cambio rápido, ya que la opción A no tiene dependencias.

## 7. Decisiones que necesito de ti

1. **Badges**: ¿A ahora y luego B o C? ¿Alguien de diseño puede aprobar tonos nuevos?
2. **Sidebar colapsada**: ¿solo el botón centrado, o marca visible y botón al pasar el cursor?
3. **Pickers**: ¿valores como cadenas ISO local (recomendado) o `Date`? ¿Entra un rango de fechas (`DateRangeInput`) en esta ola?
4. **Textos por defecto en español** en `Table` y `FilterTable`: cambia lo que ven hoy los consumidores. ¿Lo hacemos y lo anotamos en CHANGELOG?
5. **Arreglo de `FilterTable`** (pasar `variant` y demás a `FilterBar`): ¿entra en S4?
6. **Particionado**: ¿de acuerdo con S1 a S6 como specs separados? ¿Cuál escribimos primero?
7. **Alcance de "mejorar todos los formularios"**: ¿la lista candidata de 4.3 es suficiente, o hay quejas concretas de los consumidores?

## 8. Cambios visibles para consumidores (para CHANGELOG)

- Sidebar: el botón de colapso cambia de lugar y pierde el texto.
- Table: `loading` muestra skeleton en lugar de spinner.
- Table/FilterTable/FilterBar: textos por defecto en español (si se aprueba).
- Todo lo demás es aditivo: componentes nuevos y props opcionales con default equivalente al actual. Versión sugerida: siguientes betas de `0.2.0`.
