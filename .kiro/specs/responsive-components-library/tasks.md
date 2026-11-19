# Implementation Plan: responsive-components-library

## Overview

Plan de implementación para hacer responsiva la librería `@ai27-tech/ui` con un único Breakpoint_Set (`mobile` < 40rem, `tablet` 40rem a < 64rem, `desktop` >= 64rem), Touch_Target de 44 px, stories por viewport y verificación automatizada en CI. Lenguaje: TypeScript (React) y CSS Modules, como en el diseño. El orden es: fundamentos (tokens, utilidades puras, hooks), migración de umbrales, componentes por familia, accesibilidad táctil, Storybook y verificación.

Convenciones: las props nuevas son opcionales y el escritorio no cambia (Req 12). Antes de crear una utilidad, buscar con `grep` si ya existe (por ejemplo `useFocusTrap` en `Modal` o `Visor`) para no duplicarla. Las referencias `Requirements X.Y` apuntan a `requirements.md`.

## Tasks

- [ ] 1. Fundamentos: tokens, utilidades puras y hooks
  - [ ] 1.1 Agregar tokens responsivos y bloque táctil base
    - En `src/styles/tokens.css`: `--ui-touch-target-min: 2.75rem`, `--ui-gutter-screen` (móvil `--ui-space-4`, tablet `--ui-space-5`, escritorio `--ui-space-6`), `--ui-bp-tablet: 40rem`, `--ui-bp-desktop: 64rem`. No modificar `--ui-space-1` a `--ui-space-6`.
    - En `src/styles/base.css`: clase `.ui-touch` bajo `@media (pointer: coarse)`.
    - _Requirements: 1.1, 1.2, 1.3, 9.1_

  - [ ] 1.2 Crear `breakpoints.ts`, `useMediaQuery` y `useBreakpoint`
    - `src/utils/breakpoints.ts`: `BREAKPOINTS`, `type Breakpoint`, `getBreakpoint(widthPx)`.
    - `src/utils/useMediaQuery.ts` con `useSyncExternalStore` y `matchMedia` (en servidor devuelve `false`).
    - `src/utils/useBreakpoint.ts` sobre `useMediaQuery`.
    - Exportar los tipos desde `src/index.ts` solo si el diseño los expone al consumidor.
    - _Requirements: 1.4, 2.1, 2.2_

  - [ ] 1.3 Crear funciones puras de `src/utils/responsive/`
    - `columns.ts`: `capColumns`, `resolveResponsiveColumns` y el tipo `ResponsiveColumns`.
    - `pagination.ts`: `getPaginationItems(page, total, maxItems)`.
    - `position.ts`: `clampToViewport(anchor, panel, viewport, margin)`.
    - `swipe.ts`: `nextIndexOnSwipe(index, count, deltaX, threshold)`.
    - _Requirements: 2.1, 2.2, 2.3, 4.6, 5.12, 5.13, 6.6, 6.7, 7.1, 7.2, 7.3, 7.7, 7.8, 7.10, 7.11_

  - [ ] 1.4 Crear o reutilizar `useFocusTrap`
    - Verificar con `grep` si `Modal` o `Visor` ya tienen una trampa de foco. Si existe, extraerla a `src/utils/useFocusTrap.ts` y reutilizarla; si no, crearla (`useFocusTrap(ref, active)`, Tab y Mayús+Tab cíclicos).
    - No cambiar el comportamiento observable de `Modal`.
    - _Requirements: 3.4, 7.12_

  - [ ]* 1.5 Write property test for `getBreakpoint`
    - **Property 1: Clasificación de ancho en un único breakpoint**
    - **Validates: Requirements 1.4, 2.1, 2.2**

  - [ ]* 1.6 Write property tests for `capColumns` y `resolveResponsiveColumns`
    - **Property 2: Tope de columnas por breakpoint**
    - **Property 3: Fallback de columnas por breakpoint en `Grid`**
    - **Validates: Requirements 2.1, 2.2, 2.3, 7.1, 7.2, 7.3**

  - [ ]* 1.7 Write property test for `getPaginationItems`
    - **Property 4: Ventana de paginación acotada y con la página actual**
    - **Validates: Requirements 4.6**

  - [ ]* 1.8 Write property test for `clampToViewport`
    - **Property 5: Paneles flotantes dentro del viewport**
    - **Validates: Requirements 5.12, 5.13, 6.6, 6.7**

  - [ ]* 1.9 Write property test for `nextIndexOnSwipe`
    - **Property 6: Deslizamiento limitado al rango**
    - **Validates: Requirements 7.7, 7.8, 7.10, 7.11**

- [ ] 2. Migración de umbrales al Breakpoint_Set
  - [ ] 2.1 Migrar los `@media` y `@container` existentes
    - Reemplazar 560, 640, 768 y 1024 px, y `40rem` como máximo, por `39.99rem`, `40rem`/`63.99rem` y `64rem` según el rango. Incluye `PageHeader` (`max-width: 40rem` a `39.99rem`), `Navbar` (640 px), `ImageCard` (640 px), `FormRow` (560 px), `MessagePanel` y `MessageDock` (560 px).
    - Usar `grep` sobre `src/**/*.css` para listar cada ocurrencia antes de editar. Verificar que escritorio no cambia.
    - _Requirements: 1.4, 1.5, 1.6, 1.9_

  - [ ] 2.2 Crear el escaneo de CSS `breakpoints-css.test.ts`
    - Test unitario que extrae cada condición `min-width`/`max-width` de `@media` y `@container` en `src/**/*.css`, y falla con archivo y valor si no coincide con el Breakpoint_Set.
    - Comparar `BREAKPOINTS` de TypeScript con los literales permitidos (paridad TS y CSS).
    - _Requirements: 1.6, 1.9_

- [ ] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Estructura de pantalla
  - [ ] 4.1 Hacer responsivo `Grid`
    - `columns` acepta `number | Partial<Record<Breakpoint, number>>`. Variables `--ui-grid-cols-mobile/-tablet/-desktop`; con número: móvil 1, tablet `min(n, 2)`, escritorio `n`; con mapa se usa `resolveResponsiveColumns`. `minItemWidth` no cambia.
    - _Requirements: 2.1, 2.2, 2.3, 12.1_

  - [ ] 4.2 Adaptar `PageHeader`, `Section`, `Card`, `CardFooter`, `Stack`, `Inline`, `Divider` y `EmptyState`
    - `PageHeader`: apilar título, descripción y acciones en móvil; `Breadcrumb` con `min-width: 0` y `overflow-wrap: anywhere`.
    - `Section`: `padding-inline: var(--ui-gutter-screen)` solo en móvil.
    - `Card` y `CardFooter`: `min-width: 0`, `overflow-wrap: anywhere`; pie en columna con hijos al 100 % en móvil.
    - `Stack`, `Inline`, `Divider`, `EmptyState`: `min-width: 0`; `Inline` con `flex-wrap: wrap`.
    - _Requirements: 2.4, 2.5, 2.7, 2.8, 2.9, 2.10_

  - [ ] 4.3 Mantener visible la pestaña activa en `Tabs`
    - Al activar una pestaña, llamar `scrollIntoView({ inline: 'nearest', block: 'nearest' })`; proteger la llamada cuando el entorno (jsdom) no la implemente.
    - _Requirements: 2.6_

- [ ] 5. Navegación
  - [ ] 5.1 Implementar panel móvil de `Sidebar` y `SidebarTrigger`
    - Props `mobileOpen`, `onMobileOpenChange`, `autoCollapseOnTablet`; componente `SidebarTrigger` (44 px) exportado desde `src/index.ts`.
    - Móvil: `<nav>` `fixed` fuera de pantalla, fondo `data-sidebar-backdrop`, `useFocusTrap` solo con el panel abierto, Escape y clic en el fondo cierran y devuelven el foco, clic en `SidebarItem` cierra sin detener la navegación del consumidor.
    - Si el breakpoint deja de ser `mobile` con el panel abierto, cerrar y retirar fondo y trampa. Tablet: contraído por defecto si `collapsed` no se pasa. Escritorio sin cambios. `aria-expanded` en todos los rangos.
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.10_

  - [ ] 5.2 Ajustar `Navbar` y `Breadcrumb`
    - `Navbar`: verificar que el menú desplegado no desborde en móvil.
    - `Breadcrumb`: confirmar que `maxItems` conserva primero y último; si el plegado no es una función pura, cubrirlo con pruebas de ejemplo.
    - _Requirements: 3.8, 3.9_

  - [ ]* 5.3 Write unit tests for `Sidebar`, `Navbar` y `Breadcrumb`
    - Casos: abrir/cerrar con Escape y fondo, retorno de foco, cierre al cambiar de breakpoint, `aria-expanded`.
    - _Requirements: 3.1, 3.4, 3.5, 3.7, 3.10_

- [ ] 6. Datos y listas
  - [ ] 6.1 Agregar `responsive="stacked"` a `Table`
    - Prop `responsive?: 'scroll' | 'stacked'` (por defecto `'scroll'`). Con `'stacked'`: `container-type: inline-size`, `@container (max-width: 39.99rem)` con filas como tarjetas, `data-label` en cada `<td>` impreso con `::before`, roles de tabla explícitos y estado vacío sin tarjetas.
    - Orden, selección y expansión operables con controles de 44 px en puntero grueso.
    - _Requirements: 4.1, 4.2, 4.3, 4.14, 12.1_

  - [ ]* 6.2 Write property test for `Table` apilada
    - **Property 9: La tabla apilada muestra todos los pares nombre-valor**
    - **Validates: Requirements 4.1, 4.14**

  - [ ] 6.3 Hacer responsivos `FilterBar` y `FilterTable`
    - Una columna en móvil; prop `collapsibleOnMobile` (por defecto `false`) con botón que alterna los filtros, ocultos al inicio solo en móvil.
    - _Requirements: 4.4, 4.5_

  - [ ] 6.4 Usar `getPaginationItems` en `Pagination`
    - En móvil, máximo 5 elementos; en tablet y escritorio se conserva el límite actual.
    - _Requirements: 4.6_

  - [ ] 6.5 Adaptar `DescriptionList`, `Stat` y `Badge`
    - `DescriptionList`: `columns` limitado por CSS (móvil 1, tablet `min(columns, 2)`); orientación horizontal apilada en móvil.
    - `Stat` y `Badge`: `min-width: 0`, `overflow-wrap: anywhere` en valores numéricos sin `text-overflow`; `Badge` envuelve o trunca con puntos suspensivos.
    - _Requirements: 4.7, 4.8, 4.9, 4.10, 4.13_

  - [ ] 6.6 Adaptar `Timeline`
    - `@container (max-width: 39.99rem)`: alternada pasa a una columna. En horizontal, `scrollIntoView` sobre el punto actual al montar (con protección para jsdom).
    - _Requirements: 4.11, 4.12_

- [ ] 7. Formularios y controles
  - [ ] 7.1 Adaptar `Form`, `FormRow`, `FormField` y `FormActions`
    - `FormRow` con el umbral `39.99rem`; `FormField` horizontal en columna en móvil; `FormActions` en columna conservando la acción principal primero en el DOM; barra fija con `padding-bottom: env(safe-area-inset-bottom)`.
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ] 7.2 Adaptar `Input`, `Textarea`, `Select`, `Checkbox`, `Radio` y `Switch`
    - Móvil: `min-height: var(--ui-touch-target-min)` y `font-size: 1rem` en `Input`, `Textarea` y `Select`; lista de `Select searchable` con `max-height: min(20rem, 60dvh)` y `overflow-y: auto`; etiquetas de `Checkbox`, `Radio` y `Switch` de 44 px de alto.
    - _Requirements: 5.4, 5.5, 5.6, 5.7_

  - [ ] 7.3 Adaptar `Calendar`, `DateInput`, `TimePicker` y `DateTimeInput`
    - `Calendar`: `repeat(7, minmax(0, 1fr))`, celdas con `aspect-ratio: 1` y 44 px en puntero grueso.
    - Paneles: presets apilados en móvil; `clampToViewport` en cada apertura y en `resize`/`orientationchange`; `max-height` con `overflow: auto` si no cabe; `DateInput` sin `min-width` con `@container (max-width: 12rem)`; `DateTimeInput` apila fecha y hora en móvil.
    - _Requirements: 5.8, 5.9, 5.10, 5.11, 5.12, 5.13_

  - [ ]* 7.4 Write unit tests for controles de fecha y formularios
    - Reposicionamiento del panel al abrir y en `resize`; orden de tabulación de `FormActions`.
    - _Requirements: 5.3, 5.12, 5.13_

- [ ] 8. Avisos y superposiciones
  - [ ] 8.1 Adaptar `Modal`
    - Móvil: ancho `calc(100vw - 2 * var(--ui-space-4))`; `max-height` con `100vh` y luego `100dvh`; encabezado y pie fijos con cuerpo desplazable; pie en columna. Menos de 320 px: ancho mínimo `calc(320px - 2 * var(--ui-space-4))` y desplazamiento horizontal interno.
    - _Requirements: 6.1, 6.2, 6.3, 6.11_

  - [ ] 8.2 Adaptar `ToastContainer`, `Alert`, `Skeleton*`, `Spinner` y `ProgressBar`
    - `ToastContainer`: ancho y márgenes con `env(safe-area-inset-*)`. `Alert`: columna en móvil. `Skeleton*`, `Spinner`, `ProgressBar`: `max-width: 100%`.
    - Agregar `@media (prefers-reduced-motion: reduce)` donde falte (`Tooltip` y `Alert` según `grep`).
    - _Requirements: 6.4, 6.5, 6.8, 6.9, 6.10_

  - [ ] 8.3 Adaptar `Popover` y `Tooltip`
    - `Popover`: `max-width: calc(100vw - 2 * var(--ui-space-2))` y posición con `clampToViewport`. `Tooltip`: coordenada horizontal con `clampToViewport`.
    - _Requirements: 6.6, 6.7_

  - [ ]* 8.4 Write unit tests for `Modal`, `Popover` y `Tooltip`
    - Foco, Escape, límites del viewport y movimiento reducido.
    - _Requirements: 6.1, 6.6, 6.7, 6.10_

- [ ] 9. Imágenes
  - [ ] 9.1 Adaptar `ImageGrid` e `ImageCard`
    - `ImageGrid`: sustituir el estilo en línea por `--ui-image-grid-cols` con `capColumns(columns, bp, { mobile: 2, tablet: 3, desktop: columns })`; vista de lista apilada en móvil. `ImageCard`: umbral `39.99rem`, `aspect-ratio` y `min-width: 0` en insignias.
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 9.2 Adaptar `ImageCarousel` y `Visor`
    - Un elemento por vista en móvil; gestos con Pointer Events y `nextIndexOnSwipe` (umbral 40 px); `touch-action: pan-y`. `Visor`: `height: 100dvh` en móvil, botones de 44 px, Escape y trampa de foco (reutilizar `useFocusTrap` si no la tiene).
    - _Requirements: 7.6, 7.7, 7.8, 7.9, 7.10, 7.11, 7.12_

  - [ ]* 9.3 Write unit tests for `ImageGrid`, `ImageCarousel` y `Visor`
    - Columnas por breakpoint, gestos de deslizamiento, Escape y foco dentro del Visor.
    - _Requirements: 7.1, 7.7, 7.12_

- [ ] 10. Mensajería
  - [ ] 10.1 Extraer `dockReducer` en `src/components/MessagePanel/dockState.ts`
    - Tipos `DockPanelState`, `DockState`, `DockAction`. Al abrir con el cupo lleno, minimiza el panel abierto más antiguo sin tocar su `draft`. Confirmar contra `useMessageDock`; si usa otro modelo, el reductor lo envuelve sin cambiar su API pública.
    - _Requirements: 8.2, 8.3, 12.1_

  - [ ]* 10.2 Write property test for `dockReducer`
    - **Property 7: El Dock respeta el cupo y conserva borradores**
    - **Validates: Requirements 8.2, 8.3**

  - [ ] 10.3 Adaptar `MessagePanel`, `MessageDock` y `useMessageDock`
    - Móvil: panel abierto a `100vw` y `100dvh`, alto ajustado con `visualViewport` cuando hay teclado; `maxOpen` por breakpoint (móvil 1, tablet 1, escritorio el valor actual) usando `dockReducer`.
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ] 10.4 Adaptar `MessageBubble`, `MessageComposer`, `MessageAttachment` y `ConversationStatus`
    - `MessageBubble`: `max-width: 85 %` y `overflow-wrap: anywhere`. `MessageComposer`: `sticky` abajo, `safe-area-inset-bottom`, botones de 44 px con `gap: var(--ui-space-2)`. `MessageAttachment`: truncado que conserva la extensión. `ConversationStatus`: columna en móvil.
    - _Requirements: 8.5, 8.6, 8.7, 8.8_

  - [ ]* 10.5 Write property test for orden de `MessageThread`
    - **Property 8: Orden de mensajes por `secuencia`**
    - **Validates: Requirements 8.9**

- [ ] 11. Accesibilidad táctil
  - [ ] 11.1 Aplicar Touch_Target en los módulos CSS
    - Bajo `@media (pointer: coarse)`, aplicar `min-width/min-height: var(--ui-touch-target-min)` a los controles listados en el Req 9.2 (botones, paginación, tabs, items de Sidebar, cierre de Modal y Toast, controles de carrusel y Visor, etc.).
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 11.2 Ampliar áreas activables sin solaparse
    - Para elementos densos, `::after` con `inset: calc((var(--ui-touch-target-min) - 100%) / -2)`, marcador `data-touch-extended`, `gap` mínimo de `var(--ui-space-2)` y limitación de la ampliación para que áreas contiguas no se solapen y conserven 8 px de separación.
    - _Requirements: 9.4, 9.5, 9.6, 9.7, 9.8_

- [ ] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Storybook con viewports
  - [ ] 13.1 Configurar viewports, fixtures y documentación
    - `.storybook/preview.tsx`: `VIEWPORTS` (móvil 375x667, tablet 768x1024, escritorio 1280x800) en `parameters.viewport.options`; verificar la API contra la versión instalada de Storybook.
    - `src/stories/responsiveFixtures.ts` (`LONG_TOKEN`, `LONG_NUMBER`, `makeItems(n >= 20)`) y `src/stories/Responsive.mdx`.
    - _Requirements: 10.1, 10.2, 10.6, 10.7_

  - [ ] 13.2 Agregar stories `Mobile` y `Tablet` por componente
    - En cada `*.stories.tsx`: exports `Mobile` y, si corresponde, `Tablet` con `globals.viewport` y `parameters: { responsive: true }`, usando fixtures de contenido largo. No modificar las stories existentes. Verificar legibilidad en temas `light` y `dark`.
    - _Requirements: 10.3, 10.4, 10.5, 10.9, 10.10, 10.11_

  - [ ] 13.3 Crear el test de cobertura `responsive-coverage.test.ts`
    - Lee `src/index.ts` y los `*.stories.tsx`; falla indicando el componente exportado sin story `Mobile`.
    - _Requirements: 10.3_

- [ ] 14. Verificación, CI y compatibilidad
  - [ ] 14.1 Pruebas de navegador de desborde y Touch_Target
    - Proyecto `storybook` (Chromium): comprobar `document.documentElement.scrollWidth <= clientWidth` en 320, 375, 768 y 1280 px; contexto con `hasTouch` e `isMobile` para medir `getBoundingClientRect()` de elementos interactivos, excluyendo `[data-touch-extended]`.
    - _Requirements: 11.1, 11.2, 11.3_

  - [ ] 14.2 Configurar a11y estricta en stories responsivas
    - `parameters.a11y.test = 'error'` solo en stories con `responsive: true`; las demás conservan `todo`.
    - _Requirements: 11.4, 11.5, 11.6_

  - [ ] 14.3 Agregar script `test:responsive` y paso de CI
    - Script npm `test:responsive` (`vitest run --project storybook`) y paso requerido en `.github/workflows` (confirmar el nombre del workflow). Verificar `npm run build-storybook`, `npm run lint`, `npm run build` y `npm test`.
    - _Requirements: 10.8, 11.7, 11.8_

  - [ ] 14.4 Pruebas de compatibilidad con consumidores
    - `tsc` sobre fixtures de consumo de la versión anterior; comparación de capturas de las stories existentes a 1280 px; verificación de que `dist/` no contiene `@ai27-tech/contracts`.
    - _Requirements: 12.1, 12.2, 12.3, 12.5_

  - [ ] 14.5 Documentar excepciones, CHANGELOG y versión
    - Crear `docs/responsive-excepciones.md` (si hay excepciones) y reflejarlas en `CHANGELOG.md`; fijar la versión (`0.4.0-beta.1` propuesta, o `0.3.0-beta.2` según el CHANGELOG).
    - _Requirements: 11.9, 11.10, 12.4, 12.6_

- [ ] 15. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Las sub-tareas marcadas con `*` son opcionales (pruebas de propiedades y unitarias) y se pueden omitir para un MVP.
- Las propiedades 1 a 9 del diseño solo cubren funciones puras, el reductor y el orden de mensajes. El CSS, el foco y los gestos reales se verifican con pruebas de navegador (tarea 14).
- Cada tarea referencia requisitos específicos para trazabilidad. Los puntos pendientes P1 y los supuestos S3 del diseño (valores de `--ui-gutter-screen`, comportamiento de `Grid`) se confirman al implementar.
- No se cambia ningún nombre, tipo ni valor por defecto de props existentes (Req 12).

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3", "1.4"] },
    { "id": 1, "tasks": ["1.5", "1.6", "1.7", "1.8", "1.9", "2.1"] },
    { "id": 2, "tasks": ["2.2", "4.1", "4.2", "4.3", "5.1", "5.2", "6.1", "6.3", "6.4", "6.5", "6.6", "7.1", "7.2", "7.3", "8.1", "8.2", "8.3", "9.1", "9.2", "10.1", "10.4"] },
    { "id": 3, "tasks": ["5.3", "6.2", "7.4", "8.4", "9.3", "10.2", "10.3", "10.5", "11.1"] },
    { "id": 4, "tasks": ["11.2", "13.1"] },
    { "id": 5, "tasks": ["13.2", "13.3"] },
    { "id": 6, "tasks": ["14.1", "14.2"] },
    { "id": 7, "tasks": ["14.3", "14.4"] },
    { "id": 8, "tasks": ["14.5"] }
  ]
}
```
