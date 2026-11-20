# Implementation Plan: responsive-components-library

## Overview

Plan reestructurado para trabajar **componente por componente**. El usuario revisa en Storybook cómo se comporta cada uno (móvil, tablet y escritorio) y lo aprueba antes de pasar al siguiente. Lenguaje: TypeScript (React) y CSS Modules, como en el diseño.

Estructura:

- **Fase 0, Fundamentos** (tareas 1 y 2): una sola vez y sin revisión visual. Tokens, escáner de umbrales con manifiesto de archivos heredados, utilidades puras, `fast-check`, viewports de Storybook, fábrica `responsiveStory`, fixtures y proyecto Vitest `responsive`.
- **Fase 1, Componentes** (tareas 3 a 49): una tarea de primer nivel por componente exportado desde `src/index.ts`, en orden de dependencia y agrupada por familia. Cada tarea es autocontenida y sigue siempre este orden de subtareas:
  1. `N.1` ajuste de CSS/TSX (migrar sus `@media` al Breakpoint_Set, adaptación móvil y tablet, Touch_Target).
  2. `N.2` Responsive_Story `Mobile` (y `Tablet` cuando la disposición difiere entre 375 y 768 px) con contenido de dominio.
  3. `N.3` pruebas del componente (opcional `*`): desborde en 320, 375, 768 y 1280 px, Touch_Target, a11y y la propiedad cuando aplica.
  4. `N.4` **Revisión visual** (no opcional): el usuario valida en Storybook y aprueba antes de continuar.
- **Fase 2, Transversales** (tareas 50 a 56): accesibilidad táctil global restante, Requirement 13 (Tailwind, criterios 13.1 a 13.12), documentación MDX, CI, CHANGELOG, steering, versión y checkpoint final.

Convenciones:

- Las props nuevas son opcionales y el escritorio no cambia (Requirement 12). Antes de crear una utilidad, buscar con `grep` si ya existe.
- **No hay paralelismo entre componentes.** Cada componente espera la aprobación de la revisión visual del anterior. El grafo de dependencias es secuencial.
- Los `@media` heredados de cada componente se migran dentro de su propia tarea. El manifiesto `src/utils/breakpoints-legacy.manifest.json` (tarea 1.5) lista los archivos CSS con umbrales aún no migrados; cada tarea `N.1` quita sus archivos del manifiesto. Al final de la Fase 1 el manifiesto debe quedar vacío.
- Las stories existentes no se modifican; solo se agregan `Mobile` y `Tablet` (Requirement 10.5). Las stories nuevas declaran el viewport con `responsiveStory` (parámetro de Storybook, no anchos en línea).
- Comando de prueba filtrada por componente: `npm run test:responsive -- -t "Components/<Nombre>"` (se crea en la tarea 1.13).
- Las referencias `Requirements X.Y` apuntan a `requirements.md`.

## Tasks

- [ ] 1. Fase 0, Fundamentos (sin revisión visual)
  - [x] 1.1 Agregar tokens responsivos, bloque táctil base y documento de breakpoints
    - En `src/styles/tokens.css`: `--ui-touch-target-min: 2.75rem`, `--ui-gutter-screen` (móvil `--ui-space-4`, tablet `--ui-space-5`, escritorio `--ui-space-6`), `--ui-bp-tablet: 40rem`, `--ui-bp-desktop: 64rem` (solo documentan). No modificar `--ui-space-1` a `--ui-space-6`.
    - En `src/styles/base.css`: clase `.ui-touch` bajo `@media (pointer: coarse)`.
    - Crear `docs/responsive-breakpoints.md` con nombre, `rem` y px de cada umbral.
    - _Requirements: 1.1, 1.2, 1.3, 9.1_

  - [x] 1.2 Crear `breakpoints.ts`, `useMediaQuery` y `useBreakpoint`
    - `src/utils/breakpoints.ts`: `BREAKPOINTS`, `type Breakpoint`, `getBreakpoint(widthPx)`.
    - `src/utils/useMediaQuery.ts` con `useSyncExternalStore` y `matchMedia` (en servidor devuelve `false`). `src/utils/useBreakpoint.ts` sobre `useMediaQuery`.
    - Exportar tipos desde `src/index.ts` solo si el diseño los expone al consumidor.
    - _Requirements: 1.4, 2.1, 2.2_

  - [x] 1.3 Crear funciones puras de `src/utils/responsive/`
    - `columns.ts`: `capColumns`, `resolveResponsiveColumns`, `ResponsiveColumns`. `pagination.ts`: `getPaginationItems(page, total, maxItems)`. `position.ts`: `clampToViewport(anchor, panel, viewport, margin)`. `swipe.ts`: `nextIndexOnSwipe(index, count, deltaX, threshold)`.
    - _Requirements: 2.1, 2.2, 2.3, 4.6, 5.12, 5.13, 6.6, 6.7, 7.1, 7.2, 7.3, 7.7, 7.8, 7.10, 7.11_

  - [x] 1.4 Crear o reutilizar `useFocusTrap`
    - Verificar con `grep` si `Modal` o `Visor` ya tienen trampa de foco. Si existe, extraerla a `src/utils/useFocusTrap.ts` y reutilizarla; si no, crearla (`useFocusTrap(ref, active)`, Tab y Mayús+Tab cíclicos). No cambiar el comportamiento observable de `Modal`.
    - _Requirements: 3.4, 7.12_

  - [x] 1.5 Crear el escáner de umbrales y el manifiesto de archivos heredados
    - `src/utils/__tests__/breakpoints-css.test.ts`: extrae cada condición `min-width`/`max-width` de `@media` y `@container` en `src/**/*.css`; falla con archivo y valor si no coincide con el Breakpoint_Set (`40rem`, `39.99rem`, `63.99rem`, `64rem`). Compara también `BREAKPOINTS` de TypeScript con los literales permitidos.
    - `src/utils/breakpoints-legacy.manifest.json`: lista los archivos con umbrales heredados que el escáner tolera temporalmente (`FilterBar`, `Form`, `Visor`, `ImageCarousel`, `Navbar`, `ImageCard`, `PageHeader`, `MessagePanel`; confirmar con `grep` antes de editar). Un archivo que no está en el manifiesto no puede tener umbrales ajenos al Breakpoint_Set.
    - Agregar al test una comprobación de que el manifiesto no contiene archivos que ya cumplen (para forzar su limpieza) y un modo estricto (`BREAKPOINTS_STRICT=1`) que falla si el manifiesto no está vacío.
    - _Requirements: 1.4, 1.5, 1.6, 1.9_

  - [x] 1.6 Instalar `fast-check`
    - `npm install --save-dev fast-check` y verificar que el proyecto Vitest `unit` lo resuelve. Sin dependencias de UI ni de media queries.
    - _Requirements: 1.8_

  - [x]* 1.7 Write property test for `getBreakpoint`
    - **Property 1: Clasificación de ancho en un único breakpoint**
    - **Validates: Requirements 1.4, 2.1, 2.2**

  - [x]* 1.8 Write property tests for `capColumns` y `resolveResponsiveColumns`
    - **Property 2: Tope de columnas por breakpoint**
    - **Property 3: Fallback de columnas por breakpoint en `Grid`**
    - **Validates: Requirements 2.1, 2.2, 2.3, 7.1, 7.2, 7.3**

  - [x]* 1.9 Write property test for `getPaginationItems`
    - **Property 4: Ventana de paginación acotada y con la página actual**
    - **Validates: Requirements 4.6**

  - [x]* 1.10 Write property test for `clampToViewport`
    - **Property 5: Paneles flotantes dentro del viewport**
    - **Validates: Requirements 5.12, 5.13, 6.6, 6.7**

  - [x]* 1.11 Write property test for `nextIndexOnSwipe`
    - **Property 6: Deslizamiento limitado al rango**
    - **Validates: Requirements 7.7, 7.8, 7.10, 7.11**

  - [x] 1.12 Configurar viewports, fábrica `responsiveStory` y fixtures compartidos
    - `.storybook/preview.tsx`: `VIEWPORTS` (móvil 375x667, tablet 768x1024, escritorio 1280x800) como únicas opciones de `parameters.viewport.options`; verificar la API contra la versión instalada de Storybook 10.6. `parameters.a11y.test = 'error'` solo cuando `parameters.responsive` es `true`; las demás stories conservan `todo`.
    - `src/stories/responsiveStory.ts`: fábrica `responsiveStory(viewport: 'mobile' | 'tablet', story)` que fija `globals.viewport` y `parameters: { responsive: true }` sin anchos en línea.
    - `src/stories/responsiveFixtures.ts`: `LONG_TOKEN` (60 o más caracteres sin espacios), `LONG_NUMBER` (9 o más dígitos), `makeItems(n >= 20)` y datos de dominio (viaje, unidad, custodio, bitácora).
    - _Requirements: 10.1, 10.2, 10.6, 10.7, 11.6_

  - [x] 1.13 Crear el proyecto Vitest `responsive` y el script `test:responsive`
    - En `vite.config.ts`: proyecto `responsive` (Chromium con `@vitest/browser-playwright` y `@storybook/addon-vitest`) que ejecuta solo las stories con `parameters.responsive === true`. No modificar los proyectos `unit` y `storybook`.
    - Pruebas por story en 320, 375, 768 y 1280 px: `document.documentElement.scrollWidth <= clientWidth`; contexto `hasTouch`/`isMobile` que mide `getBoundingClientRect()` de elementos interactivos (excluye `[data-touch-extended]`); a11y con reporte de regla y elemento.
    - Script npm `test:responsive` (`vitest run --project responsive`); admite `-t "Components/<Nombre>"` para filtrar por componente.
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 2. Checkpoint - Fundamentos
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Button (familia Acciones)
  - [x] 3.1 Ajustar `Button.module.css` y `Button.tsx`
    - `@media (pointer: coarse)`: `min-height` y `min-width` de `var(--ui-touch-target-min)` en `sm`, `md`, `lg` y en botones de solo icono; ampliar con `::after` y `data-touch-extended` si el visible es menor, sin cambiar su apariencia. Conservar `aria-*` y foco visible.
    - _Requirements: 9.1, 9.3, 9.4, 9.6, 12.2, 12.3_

  - [x] 3.2 Agregar Responsive_Story `Mobile` en `Button.stories.tsx`
    - `Mobile` con los tres tamaños, solo icono y etiqueta larga (`LONG_TOKEN`), en fila contigua para ver la separación de 8 px. Sin `Tablet` (la disposición no difiere).
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 3.3 Write tests for `Button`
    - Touch_Target ≥ 44 x 44 px con puntero grueso en `sm`, `md`, `lg` y solo icono; separación ≥ 8 px entre botones contiguos; sin desborde en 320, 375, 768 y 1280; a11y.
    - `npm run test:responsive -- -t "Components/Button"`.
    - _Requirements: 9.1, 9.4, 11.2, 11.3, 11.4_

  - [x] 3.4 Revisión visual de `Button`
    - Revisar en Storybook `Components/Button › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: botones `sm`, `md` y `lg` y solo icono se ven y se aciertan con el pulgar (≥ 44 px con puntero grueso); la etiqueta larga no desborda; hay aire de 8 px entre botones contiguos; tema `light` y `dark` legibles.
    - Verificar que a 1280 px las stories existentes de `Button` se ven igual que antes (Requirement 12.3).
    - _Requirements: 9.1, 9.4, 10.11, 12.3_

- [x] 4. Stack, Inline y Grid (familia Estructura de pantalla)
  - [x] 4.1 Hacer responsivos `Stack`, `Inline` y `Grid`
    - `Layout.module.css` y el TSX de `Grid`: `columns` acepta `number | Partial<Record<Breakpoint, number>>` . Variables `--ui-grid-cols-mobile/-tablet/-desktop`; con número: móvil 1, tablet `min(n, 2)`, escritorio `n`; con mapa se usa `resolveResponsiveColumns`. `minItemWidth` no cambia. Por DC-3, `Grid` responde al ancho de la ventana con `@media` (no se agrega `responsive="container"` ni `@container`); P1 queda cerrado.
    - `Stack` e `Inline`: `min-width: 0`; `Inline` con `flex-wrap: wrap`.
    - _Requirements: 2.1, 2.2, 2.3, 2.10, 12.2, 12.3_

  - [x] 4.2 Agregar Responsive_Story `Mobile` y `Tablet` en `Layout.stories.tsx`
    - `Mobile`: `Grid columns={4}` con tarjetas de viaje, `Inline` con 20 etiquetas, `Stack` con texto largo. `Tablet`: el mismo `Grid` (máximo 2 columnas) y un `Grid` con mapa por breakpoint.
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 10.11_

  - [x]* 4.3 Write tests for `Stack`, `Inline` y `Grid`
    - Unidad: columnas por breakpoint con mapa y con número. Suite filtrada: sin desborde en 320, 375, 768 y 1280; a11y.
    - _Requirements: 2.1, 2.2, 2.3, 2.10, 11.2, 11.4_

  - [x] 4.4 Revisión visual de `Stack`, `Inline` y `Grid`
    - Revisar en Storybook `Components/Layout › Mobile` y `› Tablet` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: `Grid` de 4 columnas muestra 1 en móvil, 2 en tablet y 4 en escritorio; el mapa por breakpoint aplica el valor del rango y hereda el inmediato menor; `Inline` salta de línea sin desborde; sin barra horizontal en la página.
    - Verificar que a 1280 px las stories existentes de `Layout` no cambiaron (Requirement 12.3). 
    - _Requirements: 2.1, 2.2, 2.3, 2.10, 12.3_

- [x] 5. Card, CardHeader, CardBody y CardFooter (familia Estructura de pantalla)
  - [x] 5.1 Adaptar `Card` y `CardFooter`
    - `Card.module.css`: `min-width: 0` y `overflow-wrap: anywhere`. `CardFooter` en columna con hijos al 100 % en móvil (`@media (max-width: 39.99rem)`).
    - _Requirements: 2.8, 2.9, 12.2, 12.3_

  - [x] 5.2 Agregar Responsive_Story `Mobile` en `Card.stories.tsx`
    - `Mobile`: tarjeta de viaje con título `LONG_TOKEN`, cifra `LONG_NUMBER` y pie con dos o tres botones.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 5.3 Write tests for `Card`
    - Sin desborde con texto largo sin espacios en 320, 375, 768 y 1280; pie apilado en móvil; a11y.
    - _Requirements: 2.8, 2.9, 11.2, 11.4_

  - [x] 5.4 Revisión visual de `Card`
    - Revisar en Storybook `Components/Card › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: el texto largo se ajusta sin cortar la tarjeta; los botones del pie quedan en columna al 100 % en móvil y en fila en tablet y escritorio.
    - Verificar que a 1280 px las stories existentes de `Card` no cambiaron (Requirement 12.3).
    - _Requirements: 2.8, 2.9, 12.3_

- [x] 6. Section (familia Estructura de pantalla)
  - [x] 6.1 Adaptar `Section`
    - `Section.module.css`: `padding-inline: var(--ui-gutter-screen)` solo en móvil; `min-width: 0`.
    - _Requirements: 2.7, 12.2, 12.3_

  - [x] 6.2 Agregar Responsive_Story `Mobile` en `Section.stories.tsx`
    - `Mobile`: sección con acciones, divisor y contenido largo; una variante colapsable.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 6.3 Write tests for `Section`
    - El relleno lateral en móvil es el valor de `--ui-gutter-screen`; sin desborde; a11y (incluye `aria-expanded` al colapsar).
    - _Requirements: 2.7, 9.6, 11.2, 11.4_

  - [x] 6.4 Revisión visual de `Section`
    - Revisar en Storybook `Components/Section › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: margen lateral de móvil visible y distinto del de tablet y escritorio; acciones del encabezado no se salen; colapsar y expandir conserva el contenido.
    - Verificar que a 1280 px las stories existentes de `Section` no cambiaron (Requirement 12.3).
    - _Requirements: 2.7, 12.3_

- [x] 7. Divider (familia Estructura de pantalla)
  - [x] 7.1 Adaptar `Divider`
    - `Divider.module.css`: `min-width: 0`, `max-width: 100%`; la etiqueta se ajusta sin desborde.
    - _Requirements: 2.10, 12.2, 12.3_

  - [x] 7.2 Agregar Responsive_Story `Mobile` en `Divider.stories.tsx`
    - `Mobile`: divisor con etiqueta de `LONG_TOKEN` y divisor vertical dentro de un `Inline`.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 7.3 Write tests for `Divider`
    - Sin desborde en 320, 375, 768 y 1280; a11y.
    - _Requirements: 2.10, 11.2, 11.4_

  - [x] 7.4 Revisión visual de `Divider`
    - Revisar en Storybook `Components/Divider › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: etiqueta larga contenida; línea completa al ancho; sin barra horizontal.
    - Verificar que a 1280 px las stories existentes de `Divider` no cambiaron (Requirement 12.3).
    - _Requirements: 2.10, 12.3_

- [x] 8. EmptyState (familia Estructura de pantalla)
  - [x] 8.1 Adaptar `EmptyState`
    - `EmptyState.module.css`: `min-width: 0`, `overflow-wrap: anywhere`; acciones en columna en móvil si no caben.
    - _Requirements: 2.10, 12.2, 12.3_

  - [x] 8.2 Agregar Responsive_Story `Mobile` en `EmptyState.stories.tsx`
    - `Mobile`: título largo, descripción de 60 o más caracteres sin espacios y acción.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 8.3 Write tests for `EmptyState`
    - Sin desborde en 320, 375, 768 y 1280; Touch_Target de la acción; a11y.
    - _Requirements: 2.10, 9.2, 11.2, 11.3, 11.4_

  - [x] 8.4 Revisión visual de `EmptyState`
    - Revisar en Storybook `Components/EmptyState › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: icono, título, descripción y acción centrados y dentro del ancho; la acción se acierta con el pulgar.
    - Verificar que a 1280 px las stories existentes de `EmptyState` no cambiaron (Requirement 12.3).
    - _Requirements: 2.10, 12.3_

- [x] 9. PageHeader (familia Estructura de pantalla)
  - [x] 9.1 Adaptar `PageHeader`
    - `PageHeader.module.css`: migrar `@media (max-width: 40rem)` a `39.99rem`; apilar título, descripción y acciones en móvil (acciones debajo del título); `Breadcrumb` con `min-width: 0` y `overflow-wrap: anywhere`. Quitar `PageHeader` de `breakpoints-legacy.manifest.json`.
    - _Requirements: 1.4, 1.6, 2.4, 2.5, 12.2, 12.3_

  - [x] 9.2 Agregar Responsive_Story `Mobile` y `Tablet` en `PageHeader.stories.tsx`
    - `Mobile`: ruta con más elementos que `maxItems`, título largo y tres acciones. `Tablet`: el mismo encabezado en 768 px.
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 9.3 Write tests for `PageHeader`
    - Orden título, descripción, acciones en móvil; sin desborde con ruta plegada en 320, 375, 768 y 1280; a11y.
    - _Requirements: 2.4, 2.5, 11.2, 11.4_

  - [x] 9.4 Revisión visual de `PageHeader`
    - Revisar en Storybook `Components/PageHeader › Mobile` y `› Tablet` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: en móvil las acciones quedan debajo del título; en tablet y escritorio quedan junto a él; la ruta se pliega sin ensanchar la página.
    - Verificar que a 1280 px las stories existentes de `PageHeader` no cambiaron y que el umbral pasó de `40rem` a `39.99rem` sin salto visible (Requirement 12.3).
    - _Requirements: 2.4, 2.5, 12.3_

- [x] 10. Tabs, TabList, Tab y TabPanel (familia Estructura de pantalla)
  - [x] 10.1 Mantener visible la pestaña activa en `Tabs`
    - `Tabs.module.css`: `TabList` con desplazamiento horizontal interno y Touch_Target de 44 px con puntero grueso. Al activar una pestaña, `scrollIntoView({ inline: 'nearest', block: 'nearest' })`, con protección para jsdom.
    - _Requirements: 2.6, 9.2, 9.7, 12.2, 12.3_

  - [x] 10.2 Agregar Responsive_Story `Mobile` en `Tabs.stories.tsx`
    - `Mobile`: 10 o más pestañas con nombres de dominio (Resumen, Bitácora, Evidencias, Incidencias…) y la pestaña activa al final.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 10.3 Write tests for `Tabs`
    - La pestaña activa queda dentro del área visible del `TabList`; sin desborde de la página; Touch_Target; a11y (`role="tab"`, `aria-selected`).
    - _Requirements: 2.6, 9.2, 9.6, 11.2, 11.3, 11.4_

  - [x] 10.4 Revisión visual de `Tabs`
    - Revisar en Storybook `Components/Tabs › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: el `TabList` se desplaza solo dentro de su área; la pestaña activa queda visible; la página no se desplaza lateralmente; el cambio de orientación conserva la pestaña activa.
    - Verificar que a 1280 px las stories existentes de `Tabs` no cambiaron (Requirement 12.3).
    - _Requirements: 2.6, 9.7, 12.3_

- [x] 11. Breadcrumb (familia Navegación)
  - [x] 11.1 Ajustar `Breadcrumb`
    - Confirmar que `maxItems` conserva primero y último; si el plegado no es función pura, cubrirlo con pruebas de ejemplo. `Breadcrumb.module.css`: `min-width: 0`, elementos con `overflow-wrap: anywhere`; enlaces con Touch_Target con puntero grueso.
    - _Requirements: 2.5, 3.9, 9.2, 12.2, 12.3_

  - [x] 11.2 Agregar Responsive_Story `Mobile` en `Breadcrumb.stories.tsx`
    - `Mobile`: ruta de 6 elementos con nombres largos y `maxItems={3}`.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 11.3 Write tests for `Breadcrumb`
    - El plegado conserva primero y último; sin desborde en 320, 375, 768 y 1280; a11y (`aria-label`, `aria-current`).
    - _Requirements: 3.9, 9.6, 11.2, 11.4_

  - [x] 11.4 Revisión visual de `Breadcrumb`
    - Revisar en Storybook `Components/Breadcrumb › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: se ven el primer y el último elemento y los intermedios plegados; el elemento plegado se puede abrir; sin desborde.
    - Verificar que a 1280 px las stories existentes de `Breadcrumb` no cambiaron (Requirement 12.3).
    - _Requirements: 3.9, 12.3_

- [x] 12. Navbar y NavbarLink (familia Navegación)
  - [x] 12.1 Ajustar `Navbar`
    - `Navbar.module.css`: migrar `@media (max-width: 640px)` a `39.99rem`; menú desplegado sin desborde en móvil; botón de menú con Touch_Target de 44 px. Quitar `Navbar` de `breakpoints-legacy.manifest.json`.
    - _Requirements: 1.4, 1.6, 3.8, 9.2, 12.2, 12.3_

  - [x] 12.2 Agregar Responsive_Story `Mobile` y `Tablet` en `Navbar.stories.tsx`
    - `Mobile`: barra con 6 enlaces de dominio y marca larga. `Tablet`: la misma barra en 768 px.
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 12.3 Write tests for `Navbar`
    - En móvil los enlaces están tras el botón de menú; al accionarlo se muestran sin desborde; a11y (`aria-expanded` del botón).
    - _Requirements: 3.8, 9.6, 11.2, 11.4_

  - [x] 12.4 Revisión visual de `Navbar`
    - Revisar en Storybook `Components/Navbar › Mobile` y `› Tablet` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: en móvil solo marca y botón de menú; el menú abierto cabe en el ancho; en tablet y escritorio los enlaces se ven en línea; el umbral pasa de 640 px a `39.99rem` sin mover la barra en escritorio.
    - Verificar que a 1280 px las stories existentes de `Navbar` no cambiaron (Requirement 12.3).
    - _Requirements: 3.8, 12.3_

- [x] 13. Sidebar, SidebarGroup, SidebarItem y SidebarTrigger (familia Navegación)
  - [x] 13.1 Implementar el panel móvil de `Sidebar` y el componente `SidebarTrigger`
    - Props `mobileOpen`, `onMobileOpenChange`, `autoCollapseOnTablet`; `SidebarTrigger` (44 px) exportado desde `src/index.ts`.
    - Móvil: `<nav>` `fixed` fuera de pantalla, fondo `data-sidebar-backdrop`, `useFocusTrap` solo con el panel abierto, Escape y clic en el fondo cierran y devuelven el foco al control que lo abrió, clic en `SidebarItem` cierra sin detener la navegación del consumidor.
    - Si el breakpoint deja de ser `mobile` con el panel abierto, cerrar y retirar fondo y trampa. Tablet: contraído por defecto si `collapsed` no se pasa. Escritorio sin cambios. `aria-expanded` y `aria-label` en todos los rangos.
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.10, 9.2, 12.2, 12.3_

  - [x] 13.2 Agregar Responsive_Story `Mobile` y `Tablet` en `Sidebar.stories.tsx`
    - `Mobile`: `SidebarTrigger` más `Sidebar` con grupos y 10 o más items de dominio (Viajes, Bitácora, Unidades, Custodios…). `Tablet`: contraído a iconos.
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 10.11_

  - [x]* 13.3 Write tests for `Sidebar`
    - Abrir y cerrar con Escape y fondo, retorno de foco, trampa de foco (Tab y Mayús+Tab), cierre al cambiar de breakpoint, `aria-expanded`, cierre al elegir un item.
    - _Requirements: 3.1, 3.4, 3.5, 3.6, 3.7, 3.10, 11.2, 11.4_

  - [x] 13.4 Revisión visual de `Sidebar`
    - Revisar en Storybook `Components/Sidebar › Mobile` y `› Tablet` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: en móvil el panel está oculto y el botón lo abre sobre un fondo oscuro; Escape y toque en el fondo lo cierran y el foco vuelve al botón; elegir un item lo cierra; en tablet queda solo con iconos y se expande; girar el dispositivo con el panel abierto lo cierra al pasar a un ancho mayor.
    - Verificar que en escritorio el ancho `--ui-sidebar-width` y la contracción manual no cambiaron (Requirement 12.3).
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.7, 12.3_

- [ ] 14. Badge (familia Datos y listas)
  - [ ] 14.1 Adaptar `Badge`
    - `Badge.module.css`: `min-width: 0`, `max-width: 100%`; envolver el texto o truncarlo con puntos suspensivos sin `Horizontal_Overflow`.
    - _Requirements: 4.13, 12.2, 12.3_

  - [ ] 14.2 Agregar Responsive_Story `Mobile` en `Badge.stories.tsx`
    - `Mobile`: insignias con estado de viaje y una con `LONG_TOKEN` dentro de un contenedor angosto.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 14.3 Write tests for `Badge`
    - Contenido dentro del ancho del contenedor en 320, 375, 768 y 1280; a11y.
    - _Requirements: 4.13, 11.2, 11.4_

  - [ ] 14.4 Revisión visual de `Badge`
    - Revisar en Storybook `Components/Badge › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: la insignia larga se ajusta o se trunca con puntos suspensivos dentro de su contenedor; los colores de estado siguen legibles en `light` y `dark`.
    - Verificar que a 1280 px las stories existentes de `Badge` no cambiaron (Requirement 12.3).
    - _Requirements: 4.13, 12.3_

- [ ] 15. Stat (familia Datos y listas)
  - [ ] 15.1 Adaptar `Stat`
    - `Stat.module.css`: `min-width: 0`, `overflow-wrap: anywhere` en valores numéricos sin `text-overflow`; valor y tendencia se ajustan al ancho del contenedor mostrando el valor completo.
    - _Requirements: 4.10, 12.2, 12.3_

  - [ ] 15.2 Agregar Responsive_Story `Mobile` en `Stat.stories.tsx`
    - `Mobile`: `Grid` de métricas con `LONG_NUMBER`, tendencia y estado `loading`.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 15.3 Write tests for `Stat`
    - El valor numérico se muestra completo; sin desborde en 320, 375, 768 y 1280; a11y.
    - _Requirements: 4.10, 11.2, 11.4_

  - [ ] 15.4 Revisión visual de `Stat`
    - Revisar en Storybook `Components/Stat › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: el valor de 9 o más dígitos se ve completo, sin puntos suspensivos; la tendencia no se corta; el skeleton de carga conserva la forma.
    - Verificar que a 1280 px las stories existentes de `Stat` no cambiaron (Requirement 12.3).
    - _Requirements: 4.10, 12.3_

- [ ] 16. DescriptionList (familia Datos y listas)
  - [ ] 16.1 Adaptar `DescriptionList`
    - `DescriptionList.module.css`: `columns` limitado por CSS (móvil 1, tablet `min(columns, 2)`); orientación horizontal apilada (nombre sobre valor) en móvil; `overflow-wrap: anywhere`.
    - _Requirements: 4.7, 4.8, 4.9, 12.2, 12.3_

  - [ ] 16.2 Agregar Responsive_Story `Mobile` y `Tablet` en `DescriptionList.stories.tsx`
    - `Mobile`: ficha técnica del viaje con `columns={4}`, orientación horizontal y valores largos. `Tablet`: la misma ficha.
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 16.3 Write tests for `DescriptionList`
    - 1 columna en móvil, máximo 2 en tablet, `columns` completas en escritorio; nombre sobre valor en horizontal móvil; sin desborde; a11y.
    - _Requirements: 4.7, 4.8, 4.9, 11.2, 11.4_

  - [ ] 16.4 Revisión visual de `DescriptionList`
    - Revisar en Storybook `Components/DescriptionList › Mobile` y `› Tablet` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: 1 columna en móvil, 2 en tablet y 4 en escritorio; en horizontal el nombre queda encima del valor en móvil; el valor vacío se muestra como "—".
    - Verificar que a 1280 px las stories existentes de `DescriptionList` no cambiaron (Requirement 12.3).
    - _Requirements: 4.7, 4.8, 4.9, 12.3_

- [ ] 17. Timeline (familia Datos y listas)
  - [ ] 17.1 Adaptar `Timeline`
    - `Timeline.module.css`: `@container (max-width: 39.99rem)` hace que la alternada pase a una columna (el `@container (min-width: 40rem)` existente ya coincide con el Breakpoint_Set). En horizontal, `scrollIntoView` sobre el punto actual al montar, con protección para jsdom.
    - _Requirements: 1.5, 4.11, 4.12, 12.2, 12.3_

  - [ ] 17.2 Agregar Responsive_Story `Mobile` y `Tablet` en `Timeline.stories.tsx`
    - `Mobile`: bitácora de 20 o más eventos, alternada y horizontal con el punto actual al final. `Tablet`: alternada en 768 px.
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 17.3 Write tests for `Timeline`
    - Una columna en móvil; el punto actual queda visible en horizontal; sin desborde de la página; a11y.
    - _Requirements: 4.11, 4.12, 11.2, 11.4_

  - [ ] 17.4 Revisión visual de `Timeline`
    - Revisar en Storybook `Components/Timeline › Mobile` y `› Tablet` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: móvil en una sola columna sin alternar lados; la horizontal se desplaza solo dentro de su contenedor y arranca en el punto actual; la alternada vuelve a dos lados desde 40rem de contenedor.
    - Verificar que a 1280 px las stories existentes de `Timeline` no cambiaron (Requirement 12.3).
    - _Requirements: 4.11, 4.12, 12.3_

- [ ] 18. Table (familia Datos y listas)
  - [ ] 18.1 Agregar `responsive="stacked"` a `Table`
    - Prop `responsive?: 'scroll' | 'stacked'` (por defecto `'scroll'`). Con `'stacked'`: `container-type: inline-size`, `@container (max-width: 39.99rem)` con filas como tarjetas, `data-label` en cada `<td>` impreso con `::before`, roles de tabla explícitos y estado vacío sin tarjetas.
    - Modo `'scroll'`: el desplazamiento horizontal queda solo dentro del contenedor. Orden, selección y expansión operables con controles de 44 px con puntero grueso.
    - _Requirements: 4.1, 4.2, 4.3, 4.14, 9.2, 12.2, 12.3_

  - [ ] 18.2 Agregar Responsive_Story `Mobile` y `Tablet` en `Table.stories.tsx`
    - `Mobile` apilada y `Mobile` en modo desplazamiento (story aparte), con 20 o más viajes, columnas largas, selección, orden y filas expandibles, y una variante sin filas. `Tablet`: la tabla en 768 px.
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 18.3 Write tests for `Table`
    - **Property 9: La tabla apilada muestra todos los pares nombre-valor**
    - Estado vacío sin tarjetas; sin desborde en 320, 375, 768 y 1280; Touch_Target de orden, selección y expansión; a11y.
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.14**

  - [ ] 18.4 Revisión visual de `Table`
    - Revisar en Storybook `Components/Table › Mobile` y `› Tablet` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: apilada muestra cada fila como tarjeta con nombre y valor por columna; en modo desplazamiento solo la tabla se desplaza; ordenar, seleccionar y expandir se aciertan con el pulgar; el estado vacío se ve sin tarjetas.
    - Verificar que sin la prop `responsive` y a 1280 px las stories existentes de `Table` no cambiaron (Requirement 12.3).
    - _Requirements: 4.1, 4.2, 4.3, 4.14, 12.3_

- [ ] 19. FilterBar (familia Datos y listas)
  - [ ] 19.1 Hacer responsivo `FilterBar`
    - `FilterBar.module.css`: reemplazar `@media (max-width: 1024px)`, `768px` y `640px` por `63.99rem`, `39.99rem` según el rango; una columna en móvil con cada control al 100 %. Prop `collapsibleOnMobile` (por defecto `false`) con botón de 44 px que alterna los filtros, ocultos al inicio solo en móvil. Quitar `FilterBar` de `breakpoints-legacy.manifest.json`.
    - Anotar en el CHANGELOG (tarea 54) que el umbral de `FilterBar` cambia de 768/640 px a `39.99rem`.
    - _Requirements: 1.4, 1.6, 4.4, 4.5, 9.2, 12.2, 12.3_

  - [ ] 19.2 Agregar Responsive_Story `Mobile` y `Tablet` en `FilterBar.stories.tsx`
    - `Mobile`: 6 filtros de dominio (cliente, estado, origen, destino, fecha, unidad) con y sin `collapsibleOnMobile`. `Tablet`: la barra en 768 px.
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 19.3 Write tests for `FilterBar`
    - Una columna en móvil; con `collapsibleOnMobile` los filtros arrancan ocultos y el botón alterna (`aria-expanded`); sin desborde; a11y.
    - _Requirements: 4.4, 4.5, 11.2, 11.3, 11.4_

  - [ ] 19.4 Revisión visual de `FilterBar`
    - Revisar en Storybook `Components/FilterBar › Mobile` y `› Tablet` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: controles al 100 % en una columna en móvil; el botón de mostrar u ocultar es cómodo de tocar; con la prop omitida los filtros se ven siempre; el relleno de la barra cambia en los umbrales nuevos.
    - Verificar que a 1280 px las stories existentes de `FilterBar` no cambiaron (Requirement 12.3). Cambio de umbral registrado para el CHANGELOG.
    - _Requirements: 4.4, 4.5, 12.3_

- [ ] 20. FilterTable (familia Datos y listas)
  - [ ] 20.1 Adaptar `FilterTable`
    - `FilterTable.module.css` y TSX: propagar `collapsibleOnMobile` y `responsive` a `FilterBar` y `Table` como props opcionales (`tableLabels` sin cambios); filtros en una sola columna en móvil.
    - _Requirements: 4.1, 4.4, 4.5, 12.2, 12.3_

  - [ ] 20.2 Agregar Responsive_Story `Mobile` y `Tablet` en `FilterTable.stories.tsx`
    - `Mobile`: lista de viajes con búsqueda, filtros, 20 o más filas, `responsive="stacked"` y `collapsibleOnMobile`. `Tablet`: en 768 px.
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 20.3 Write tests for `FilterTable`
    - Filtros en una columna en móvil; tabla apilada; sin desborde en 320, 375, 768 y 1280; a11y.
    - _Requirements: 4.1, 4.4, 11.2, 11.4_

  - [ ] 20.4 Revisión visual de `FilterTable`
    - Revisar en Storybook `Components/FilterTable › Mobile` y `› Tablet` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: búsqueda y filtros arriba en una columna; filas como tarjetas; filtrar, ordenar y paginar conservan el estado al girar el dispositivo.
    - Verificar que a 1280 px las stories existentes de `FilterTable` no cambiaron (Requirement 12.3).
    - _Requirements: 4.1, 4.4, 9.7, 12.3_

- [ ] 21. Pagination (familia Datos y listas)
  - [ ] 21.1 Usar `getPaginationItems` en `Pagination`
    - En móvil, máximo 5 elementos visibles entre páginas, flechas y puntos suspensivos con la página actual visible; en tablet y escritorio se conserva el límite actual. Botones con Touch_Target de 44 px con puntero grueso y separación de 8 px.
    - _Requirements: 4.6, 9.2, 9.4, 12.2, 12.3_

  - [ ] 21.2 Agregar Responsive_Story `Mobile` en `Pagination.stories.tsx`
    - `Mobile`: 50 páginas con la página actual en el medio y en los extremos.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 21.3 Write tests for `Pagination`
    - Máximo 5 elementos en móvil con la página actual visible; sin desborde; Touch_Target; a11y (`aria-current`, `aria-label`).
    - _Requirements: 4.6, 9.2, 9.4, 11.2, 11.3, 11.4_

  - [ ] 21.4 Revisión visual de `Pagination`
    - Revisar en Storybook `Components/Pagination › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: nunca más de 5 elementos en móvil; la página actual siempre se ve; flechas y páginas se aciertan con el pulgar.
    - Verificar que a 1280 px las stories existentes de `Pagination` no cambiaron (Requirement 12.3).
    - _Requirements: 4.6, 12.3_

- [ ] 22. FormField (familia Formularios)
  - [ ] 22.1 Adaptar `FormField`
    - `FormField.module.css`: orientación horizontal en columna en móvil (etiqueta sobre el control, ambos al 100 %); `min-width: 0`; ayuda y error con `overflow-wrap: anywhere`. Conserva `id`, `invalid` y `aria-describedby`.
    - _Requirements: 5.2, 9.6, 12.2, 12.3_

  - [ ] 22.2 Agregar Responsive_Story `Mobile` en `FormField.stories.tsx`
    - `Mobile`: campo horizontal con etiqueta larga, ayuda y mensaje de error de 60 o más caracteres sin espacios.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 22.3 Write tests for `FormField`
    - Etiqueta sobre control en móvil; `aria-describedby` y `aria-invalid` intactos; sin desborde; a11y.
    - _Requirements: 5.2, 9.6, 11.2, 11.4_

  - [ ] 22.4 Revisión visual de `FormField`
    - Revisar en Storybook `Components/FormField › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: en móvil etiqueta y control al 100 % apilados; en tablet y escritorio la horizontal conserva su disposición; ayuda y error no desbordan.
    - Verificar que a 1280 px las stories existentes de `FormField` no cambiaron (Requirement 12.3).
    - _Requirements: 5.2, 12.3_

- [ ] 23. Form, FormSection, FormRow y FormActions (familia Formularios)
  - [ ] 23.1 Adaptar `Form`, `FormSection`, `FormRow` y `FormActions`
    - `Form.module.css`: `FormRow` con `@media (max-width: 39.99rem)` en una columna (reemplaza 560 px); `FormActions` en columna al 100 % con la acción principal primero en el orden visual y de tabulación; barra fija con `padding-bottom: env(safe-area-inset-bottom)`. Quitar `Form` de `breakpoints-legacy.manifest.json`.
    - _Requirements: 1.4, 1.6, 5.1, 5.3, 5.4, 12.2, 12.3_

  - [ ] 23.2 Agregar Responsive_Story `Mobile` y `Tablet` en `Form.stories.tsx`
    - `Mobile`: formulario de alta de viaje con secciones, filas de 3 campos, secciones colapsables y barra fija de acciones. `Tablet`: en 768 px.
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 23.3 Write tests for `Form`
    - Una columna en `FormRow`; orden de tabulación de `FormActions`; relleno de área segura con barra fija; sin desborde; a11y.
    - _Requirements: 5.1, 5.3, 5.4, 11.2, 11.4_

  - [ ] 23.4 Revisión visual de `Form`
    - Revisar en Storybook `Components/Form › Mobile` y `› Tablet` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: campos en una columna en móvil; botones apilados con la acción principal arriba; la barra fija no tapa el último campo ni el área segura; en tablet y escritorio las filas conservan sus columnas.
    - Verificar que a 1280 px las stories existentes de `Form` no cambiaron (Requirement 12.3).
    - _Requirements: 5.1, 5.3, 5.4, 12.3_

- [ ] 24. Input y Textarea (familia Formularios)
  - [ ] 24.1 Adaptar `Input` y `Textarea`
    - `Input.module.css`: en móvil `min-height: var(--ui-touch-target-min)` y `font-size: 1rem`; botones `clearable` y `passwordToggle` con Touch_Target de 44 px; contador de `Textarea` sin desborde.
    - _Requirements: 5.5, 9.2, 12.2, 12.3_

  - [ ] 24.2 Agregar Responsive_Story `Mobile` en `Input.stories.tsx`
    - `Mobile`: `Input` con `clearable`, `passwordToggle`, valor `LONG_TOKEN` y `Textarea` con contador.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 24.3 Write tests for `Input` y `Textarea`
    - Alto ≥ 2.75rem y fuente ≥ 1rem en móvil; Touch_Target de los botones internos; sin desborde; a11y.
    - _Requirements: 5.5, 9.2, 11.2, 11.3, 11.4_

  - [ ] 24.4 Revisión visual de `Input` y `Textarea`
    - Revisar en Storybook `Components/Input › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: campos cómodos de tocar y sin zoom automático del navegador (fuente de 1rem); botones de limpiar y mostrar contraseña se aciertan; valor largo no ensancha la página.
    - Verificar que a 1280 px las stories existentes de `Input` no cambiaron (Requirement 12.3).
    - _Requirements: 5.5, 12.3_

- [ ] 25. Select (familia Formularios)
  - [ ] 25.1 Adaptar `Select` y `SelectCustom`
    - En móvil `min-height: var(--ui-touch-target-min)` y `font-size: 1rem`; lista de `variant="searchable"` con `max-height: min(20rem, 60dvh)` y `overflow-y: auto`; opciones con Touch_Target de 44 px.
    - _Requirements: 5.5, 5.6, 9.2, 12.2, 12.3_

  - [ ] 25.2 Agregar Responsive_Story `Mobile` en `Select.stories.tsx`
    - `Mobile`: `Select` nativo y `searchable` con 50 o más opciones y etiquetas largas.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 25.3 Write tests for `Select`
    - La lista no supera la altura visible y se desplaza dentro; Touch_Target de opciones; teclado (flechas, Escape); a11y.
    - _Requirements: 5.5, 5.6, 9.2, 11.2, 11.3, 11.4_

  - [ ] 25.4 Revisión visual de `Select`
    - Revisar en Storybook `Components/Select › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: la lista cabe en pantalla y se desplaza por dentro; escribir para buscar sigue siendo cómodo con el teclado en pantalla; las opciones se aciertan con el pulgar.
    - Verificar que a 1280 px las stories existentes de `Select` no cambiaron (Requirement 12.3).
    - _Requirements: 5.5, 5.6, 12.3_

- [ ] 26. Checkbox, Radio y Switch (familia Formularios)
  - [ ] 26.1 Adaptar `Checkbox`, `Radio` y `Switch`
    - `Choice.module.css`: en móvil el área de activación, con su etiqueta, de al menos 44 x 44 px; etiqueta con `overflow-wrap: anywhere`; separación de 8 px entre opciones contiguas.
    - _Requirements: 5.7, 9.2, 9.4, 12.2, 12.3_

  - [ ] 26.2 Agregar Responsive_Story `Mobile` en `Choice.stories.tsx`
    - `Mobile`: grupo de 10 `Checkbox`, grupo de `Radio` y varios `Switch` con etiquetas de dominio largas.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 26.3 Write tests for `Checkbox`, `Radio` y `Switch`
    - Área de activación ≥ 44 x 44 px incluida la etiqueta; separación ≥ 8 px; a11y (`role="switch"`, `aria-checked`).
    - _Requirements: 5.7, 9.2, 9.4, 11.3, 11.4_

  - [ ] 26.4 Revisión visual de `Checkbox`, `Radio` y `Switch`
    - Revisar en Storybook `Components/Choice › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: tocar la etiqueta activa el control; las opciones contiguas no se confunden; etiquetas largas se envuelven.
    - Verificar que a 1280 px las stories existentes de `Choice` no cambiaron (Requirement 12.3).
    - _Requirements: 5.7, 9.4, 12.3_

- [ ] 27. Calendar (familia Formularios, fechas)
  - [ ] 27.1 Adaptar `Calendar`
    - `Calendar.module.css`: `repeat(7, minmax(0, 1fr))`, celdas con `aspect-ratio: 1` y Touch_Target de 44 px con puntero grueso; 7 columnas completas desde 320 px sin desborde.
    - _Requirements: 5.8, 9.2, 12.2, 12.3_

  - [ ] 27.2 Agregar Responsive_Story `Mobile` en `Calendar.stories.tsx`
    - `Mobile`: calendario a 320 y 375 px con un rango seleccionado y vistas de mes y año.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 27.3 Write tests for `Calendar`
    - 7 columnas completas desde 320 px; Touch_Target de celdas; navegación por teclado; a11y.
    - _Requirements: 5.8, 9.2, 11.2, 11.3, 11.4_

  - [ ] 27.4 Revisión visual de `Calendar`
    - Revisar en Storybook `Components/DatePicker/Calendar › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: los 7 días caben sin desplazamiento; las celdas se aciertan con el pulgar; el día seleccionado y hoy se distinguen.
    - Verificar que a 1280 px las stories existentes de `Calendar` no cambiaron (Requirement 12.3).
    - _Requirements: 5.8, 12.3_

- [ ] 28. DateInput (familia Formularios, fechas)
  - [ ] 28.1 Adaptar `DateInput`
    - `DateInput.module.css`: presets apilados sobre el calendario en móvil, ambos al 100 %; sin `min-width` con `@container (max-width: 12rem)`; `clampToViewport` en cada apertura y en `resize`/`orientationchange`; `max-height` con `overflow: auto` si no cabe; mantener visible el control que abrió el panel.
    - _Requirements: 5.9, 5.11, 5.12, 5.13, 9.7, 12.2, 12.3_

  - [ ] 28.2 Agregar Responsive_Story `Mobile` y `Tablet` en `DateInput.stories.tsx`
    - `Mobile`: `DateInput` con presets, al borde derecho de la pantalla y en un contenedor de 10rem. `Tablet`: en 768 px.
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 28.3 Write tests for `DateInput`
    - Panel dentro del viewport al abrir y tras `resize`; presets apilados en móvil; Escape cierra; a11y.
    - _Requirements: 5.9, 5.11, 5.12, 5.13, 11.2, 11.4_

  - [ ] 28.4 Revisión visual de `DateInput`
    - Revisar en Storybook `Components/DatePicker/DateInput › Mobile` y `› Tablet` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: el panel queda dentro de los cuatro bordes y el campo sigue visible; presets arriba del calendario en móvil; con el panel más alto que la pantalla se desplaza por dentro; girar el dispositivo reposiciona el panel.
    - Verificar que a 1280 px las stories existentes de `DateInput` no cambiaron (Requirement 12.3).
    - _Requirements: 5.9, 5.11, 5.12, 5.13, 12.3_

- [ ] 29. TimePicker (familia Formularios, fechas)
  - [ ] 29.1 Adaptar `TimePicker`
    - `TimePicker.module.css`: presets apilados sobre la lista de horas en móvil; `clampToViewport` y `max-height` con `overflow: auto`; opciones con Touch_Target de 44 px.
    - _Requirements: 5.9, 5.12, 5.13, 9.2, 12.2, 12.3_

  - [ ] 29.2 Agregar Responsive_Story `Mobile` y `Tablet` en `TimePicker.stories.tsx`
    - `Mobile`: selector con presets y lista de horas completa, cerca del borde inferior. `Tablet`: en 768 px.
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 29.3 Write tests for `TimePicker`
    - Panel dentro del viewport al abrir y tras `resize`; lista desplazable por dentro; a11y.
    - _Requirements: 5.9, 5.12, 5.13, 11.2, 11.4_

  - [ ] 29.4 Revisión visual de `TimePicker`
    - Revisar en Storybook `Components/DatePicker/TimePicker › Mobile` y `› Tablet` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: panel completo dentro de la pantalla; presets sobre la lista; las horas se aciertan con el pulgar.
    - Verificar que a 1280 px las stories existentes de `TimePicker` no cambiaron (Requirement 12.3).
    - _Requirements: 5.9, 5.12, 5.13, 12.3_

- [ ] 30. DateTimeInput (familia Formularios, fechas)
  - [ ] 30.1 Adaptar `DateTimeInput`
    - `DateTimeInput.module.css`: en móvil apila el selector de fecha sobre el de hora al 100 %; presets apilados; `clampToViewport` y `max-height` con `overflow: auto`.
    - _Requirements: 5.9, 5.10, 5.12, 5.13, 12.2, 12.3_

  - [ ] 30.2 Agregar Responsive_Story `Mobile` y `Tablet` en `DateTimeInput.stories.tsx`
    - `Mobile`: fecha y hora de salida del viaje con presets. `Tablet`: en 768 px.
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 30.3 Write tests for `DateTimeInput`
    - Fecha sobre hora en móvil; panel dentro del viewport; a11y.
    - _Requirements: 5.10, 5.12, 5.13, 11.2, 11.4_

  - [ ] 30.4 Revisión visual de `DateTimeInput`
    - Revisar en Storybook `Components/DatePicker/DateTimeInput › Mobile` y `› Tablet` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: fecha arriba y hora abajo en móvil, lado a lado en escritorio; el panel completo cabe; el valor elegido se refleja en el campo.
    - Verificar que a 1280 px las stories existentes de `DateTimeInput` no cambiaron (Requirement 12.3).
    - _Requirements: 5.10, 12.3_

- [ ] 31. Alert (familia Avisos y superposiciones)
  - [ ] 31.1 Adaptar `Alert`
    - `Alert.module.css`: en móvil icono, mensaje y acciones apilados sin desborde; botón de cerrar con Touch_Target de 44 px; `@media (prefers-reduced-motion: reduce)` donde falte.
    - _Requirements: 6.8, 6.10, 9.2, 12.2, 12.3_

  - [ ] 31.2 Agregar Responsive_Story `Mobile` en `Alert.stories.tsx`
    - `Mobile`: alertas `info`, `warning` y `danger` con mensaje largo, dos acciones y botón de cerrar.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 31.3 Write tests for `Alert`
    - Disposición apilada en móvil; sin desborde; movimiento reducido; a11y (`role`).
    - _Requirements: 6.8, 6.10, 11.2, 11.4_

  - [ ] 31.4 Revisión visual de `Alert`
    - Revisar en Storybook `Components/Alert › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: icono, mensaje y acciones en columna en móvil; el cierre se acierta; los cuatro colores son legibles en `light` y `dark`.
    - Verificar que a 1280 px las stories existentes de `Alert` no cambiaron (Requirement 12.3).
    - _Requirements: 6.8, 12.3_

- [ ] 32. Toast y ToastContainer (familia Avisos y superposiciones)
  - [ ] 32.1 Adaptar `Toast` y `ToastContainer`
    - `Toast.module.css`: en móvil ancho `calc(100vw - 2 * var(--ui-space-4))`, anclado al borde de `position` con `env(safe-area-inset-*)`; cierre con Touch_Target de 44 px; movimiento reducido.
    - _Requirements: 6.5, 6.10, 9.2, 12.2, 12.3_

  - [ ] 32.2 Agregar Responsive_Story `Mobile` en `Toast.stories.tsx`
    - `Mobile`: contenedor arriba y abajo con tres toasts de mensaje largo.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 32.3 Write tests for `Toast`
    - Ancho y separación del borde en móvil; cierre con Touch_Target; movimiento reducido; a11y (`role="status"`/`alert`).
    - _Requirements: 6.5, 6.10, 9.2, 11.2, 11.3, 11.4_

  - [ ] 32.4 Revisión visual de `Toast`
    - Revisar en Storybook `Components/Toast › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: los toasts ocupan el ancho menos márgenes y respetan el área segura; el cierre se acierta; en escritorio conservan su tamaño y esquina.
    - Verificar que a 1280 px las stories existentes de `Toast` no cambiaron (Requirement 12.3).
    - _Requirements: 6.5, 12.3_

- [ ] 33. Modal (familia Avisos y superposiciones)
  - [ ] 33.1 Adaptar `Modal`
    - `Modal.module.css`: móvil con ancho `calc(100vw - 2 * var(--ui-space-4))` sin importar `size`; `max-height` con `100vh` y luego `100dvh` menos el doble del margen; encabezado y pie fijos con cuerpo desplazable; pie en columna con botones al 100 %; cierre con Touch_Target de 44 px. Menos de 320 px: ancho mínimo `calc(320px - 2 * var(--ui-space-4))` y desplazamiento horizontal interno. Movimiento reducido. No cambiar el comportamiento del foco.
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.10, 6.11, 9.2, 9.7, 12.2, 12.3_

  - [ ] 33.2 Agregar Responsive_Story `Mobile` y `Tablet` en `Modal.stories.tsx`
    - `Mobile`: modal `lg` con cuerpo de 20 o más renglones, título largo y tres botones en el pie. `Tablet`: en 768 px.
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 33.3 Write tests for `Modal`
    - Ancho y alto máximos en móvil; encabezado y pie visibles con cuerpo desplazable; foco, Escape y trampa de foco intactos; ancho mínimo bajo 320 px; movimiento reducido; a11y.
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.10, 6.11, 11.2, 11.4_

  - [ ] 33.4 Revisión visual de `Modal`
    - Revisar en Storybook `Components/Modal › Mobile` y `› Tablet` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: el modal cabe con márgenes; el pie nunca queda oculto por la barra del navegador; el cuerpo se desplaza y el encabezado y el pie quedan fijos; los botones del pie en columna; el cierre se acierta.
    - Verificar que a 1280 px las stories existentes de `Modal` no cambiaron (Requirement 12.3).
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 12.3_

- [ ] 34. Popover (familia Avisos y superposiciones)
  - [ ] 34.1 Adaptar `Popover`
    - `Popover.module.css`: `max-width: calc(100vw - 2 * var(--ui-space-2))`; posición con `clampToViewport`; contenido ajustado sin desborde; movimiento reducido.
    - _Requirements: 6.6, 6.10, 12.2, 12.3_

  - [ ] 34.2 Agregar Responsive_Story `Mobile` en `Popover.stories.tsx`
    - `Mobile`: popover con menú de acciones largas anclado al borde derecho.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 34.3 Write tests for `Popover`
    - Panel dentro del viewport; ancho limitado; Escape; movimiento reducido; a11y.
    - _Requirements: 6.6, 6.10, 11.2, 11.4_

  - [ ] 34.4 Revisión visual de `Popover`
    - Revisar en Storybook `Components/Popover › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: el panel no se sale por los lados; el texto largo se ajusta; los elementos se aciertan con el pulgar.
    - Verificar que a 1280 px las stories existentes de `Popover` no cambiaron (Requirement 12.3).
    - _Requirements: 6.6, 12.3_

- [ ] 35. Tooltip (familia Avisos y superposiciones)
  - [ ] 35.1 Adaptar `Tooltip`
    - `Tooltip.module.css` y TSX: coordenada horizontal con `clampToViewport`; `max-width` al viewport; `@media (prefers-reduced-motion: reduce)` donde falte.
    - _Requirements: 6.7, 6.10, 12.2, 12.3_

  - [ ] 35.2 Agregar Responsive_Story `Mobile` en `Tooltip.stories.tsx`
    - `Mobile`: tooltips en el borde izquierdo y derecho con texto largo.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 35.3 Write tests for `Tooltip`
    - Siempre dentro del viewport; movimiento reducido; a11y (`role="tooltip"`, `aria-describedby`).
    - _Requirements: 6.7, 6.10, 9.6, 11.2, 11.4_

  - [ ] 35.4 Revisión visual de `Tooltip`
    - Revisar en Storybook `Components/Tooltip › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: el texto no se corta en los bordes; se ve con foco de teclado.
    - Verificar que a 1280 px las stories existentes de `Tooltip` no cambiaron (Requirement 12.3).
    - _Requirements: 6.7, 12.3_

- [ ] 36. Skeleton, SkeletonText, SkeletonCard y SkeletonTable (familia Avisos y cargas)
  - [ ] 36.1 Adaptar `Skeleton*`
    - `Skeleton.module.css`: `max-width: 100%`; `SkeletonTable` sin ancho fijo mayor al contenedor.
    - _Requirements: 6.9, 12.2, 12.3_

  - [ ] 36.2 Agregar Responsive_Story `Mobile` en `Skeleton.stories.tsx`
    - `Mobile`: los cuatro skeletons con anchos fijos grandes en contenedor angosto.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 36.3 Write tests for `Skeleton`
    - Sin desborde en 320, 375, 768 y 1280; a11y.
    - _Requirements: 6.9, 11.2, 11.4_

  - [ ] 36.4 Revisión visual de `Skeleton`
    - Revisar en Storybook `Components/Skeleton › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: los placeholders no ensanchan la página y conservan la forma del contenido.
    - Verificar que a 1280 px las stories existentes de `Skeleton` no cambiaron (Requirement 12.3).
    - _Requirements: 6.9, 12.3_

- [ ] 37. Spinner (familia Avisos y cargas)
  - [ ] 37.1 Adaptar `Spinner`
    - `Spinner.module.css`: `max-width: 100%`; el movimiento reducido ya existe, conservarlo.
    - _Requirements: 6.9, 12.2, 12.3_

  - [ ] 37.2 Agregar Responsive_Story `Mobile` en `Spinner.stories.tsx`
    - `Mobile`: tamaños dentro de un contenedor de 320 px con etiqueta larga.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 37.3 Write tests for `Spinner`
    - Sin desborde; a11y (`role="status"`).
    - _Requirements: 6.9, 11.2, 11.4_

  - [ ] 37.4 Revisión visual de `Spinner`
    - Revisar en Storybook `Components/Spinner › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: el indicador queda dentro del contenedor y centrado.
    - Verificar que a 1280 px las stories existentes de `Spinner` no cambiaron (Requirement 12.3).
    - _Requirements: 6.9, 12.3_

- [ ] 38. ProgressBar (familia Avisos y cargas)
  - [ ] 38.1 Adaptar `ProgressBar`
    - `ProgressBar.module.css`: `max-width: 100%`; etiqueta y porcentaje con `overflow-wrap: anywhere`.
    - _Requirements: 6.9, 12.2, 12.3_

  - [ ] 38.2 Agregar Responsive_Story `Mobile` en `ProgressBar.stories.tsx`
    - `Mobile`: barras de distintos tamaños con etiqueta larga.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 38.3 Write tests for `ProgressBar`
    - Sin desborde; a11y (`role="progressbar"`, `aria-valuenow`).
    - _Requirements: 6.9, 9.6, 11.2, 11.4_

  - [ ] 38.4 Revisión visual de `ProgressBar`
    - Revisar en Storybook `Components/ProgressBar › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: la barra ocupa el ancho del contenedor; la etiqueta larga no desborda.
    - Verificar que a 1280 px las stories existentes de `ProgressBar` no cambiaron (Requirement 12.3).
    - _Requirements: 6.9, 12.3_

- [ ] 39. ImageCard (familia Imágenes)
  - [ ] 39.1 Adaptar `ImageCard`
    - `ImageCard.module.css`: migrar `@media (max-width: 640px)` a `39.99rem`; `aspect-ratio` de la imagen y `min-width: 0` en insignias y acciones. Quitar `ImageCard` de `breakpoints-legacy.manifest.json`.
    - _Requirements: 1.4, 1.6, 7.5, 12.2, 12.3_

  - [ ] 39.2 Agregar Responsive_Story `Mobile` en `ImageCard.stories.tsx`
    - `Mobile`: tarjeta con 3 insignias, título `LONG_TOKEN`, pie con acciones y una de audio.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 39.3 Write tests for `ImageCard`
    - Proporción de la imagen conservada; insignias y acciones dentro de los límites; sin desborde; a11y.
    - _Requirements: 7.5, 11.2, 11.4_

  - [ ] 39.4 Revisión visual de `ImageCard`
    - Revisar en Storybook `Components/ImageCard › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: la imagen mantiene su proporción; insignias y acciones quedan dentro de la tarjeta; el cambio de umbral de 640 px a `39.99rem` no se nota en escritorio.
    - Verificar que a 1280 px las stories existentes de `ImageCard` no cambiaron (Requirement 12.3).
    - _Requirements: 7.5, 12.3_

- [ ] 40. ImageGrid (familia Imágenes)
  - [ ] 40.1 Adaptar `ImageGrid`
    - Sustituir el estilo en línea por `--ui-image-grid-cols` con `capColumns(columns, bp, { mobile: 2, tablet: 3, desktop: columns })`; vista de lista apilada en una columna en móvil (en lugar de `80px 1fr 100px 100px 100px 200px`).
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 12.2, 12.3_

  - [ ] 40.2 Agregar Responsive_Story `Mobile` y `Tablet` en `ImageGrid.stories.tsx`
    - `Mobile`: 20 o más evidencias con `columns={6}` en cuadrícula y en lista. `Tablet`: en 768 px.
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 40.3 Write tests for `ImageGrid`
    - Máximo 2 columnas en móvil, 3 en tablet, `columns` si es menor; lista apilada; sin desborde; a11y.
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 11.2, 11.4_

  - [ ] 40.4 Revisión visual de `ImageGrid`
    - Revisar en Storybook `Components/ImageGrid › Mobile` y `› Tablet` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: 2 columnas en móvil, 3 en tablet y `columns` en escritorio; la vista de lista se apila sin columnas fijas; miniaturas tocables.
    - Verificar que a 1280 px las stories existentes de `ImageGrid` no cambiaron (Requirement 12.3).
    - _Requirements: 7.1, 7.2, 7.4, 12.3_

- [ ] 41. ImageCarousel (familia Imágenes)
  - [ ] 41.1 Adaptar `ImageCarousel`
    - `ImageCarousel.module.css`: migrar `@media (max-width: 1024px)` y `640px` a `63.99rem` y `39.99rem`; un elemento por vista en móvil; gestos con Pointer Events y `nextIndexOnSwipe` (umbral 40 px) y `touch-action: pan-y`; controles con Touch_Target de 44 px. Quitar `ImageCarousel` de `breakpoints-legacy.manifest.json`.
    - _Requirements: 1.4, 1.6, 7.6, 7.7, 7.8, 9.2, 12.2, 12.3_

  - [ ] 41.2 Agregar Responsive_Story `Mobile` y `Tablet` en `ImageCarousel.stories.tsx`
    - `Mobile`: 3 secciones forenses con 6 o más elementos. `Tablet`: en 768 px.
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 41.3 Write tests for `ImageCarousel`
    - 1 elemento por vista en móvil; deslizar avanza o retrocede 1; en los extremos permanece; a11y.
    - _Requirements: 7.6, 7.7, 7.8, 11.2, 11.4_

  - [ ] 41.4 Revisión visual de `ImageCarousel`
    - Revisar en Storybook `Components/ImageCarousel › Mobile` y `› Tablet` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: un elemento por vista en móvil; deslizar con el dedo cambia de elemento; en el primero y el último no avanza; el desplazamiento vertical de la página sigue funcionando.
    - Verificar que a 1280 px las stories existentes de `ImageCarousel` no cambiaron (Requirement 12.3).
    - _Requirements: 7.6, 7.7, 7.8, 12.3_

- [ ] 42. Visor (familia Imágenes)
  - [ ] 42.1 Adaptar `Visor`
    - `Visor.module.css`: migrar `@media (max-width: 768px)` a `39.99rem`; `height: 100dvh` en móvil; controles con Touch_Target de 44 px; deslizar con `nextIndexOnSwipe`; Escape cierra y el foco queda dentro con `useFocusTrap` si el Visor no lo tiene. Quitar `Visor` de `breakpoints-legacy.manifest.json`.
    - Anotar en el CHANGELOG (tarea 54) que el umbral de `Visor` cambia de 768 px a `39.99rem`.
    - _Requirements: 1.4, 1.6, 7.9, 7.10, 7.11, 7.12, 9.2, 12.2, 12.3_

  - [ ] 42.2 Agregar Responsive_Story `Mobile` y `Tablet` en `Visor.stories.tsx`
    - `Mobile`: visor abierto con 20 o más imágenes y metadatos largos. `Tablet`: en 768 px.
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 42.3 Write tests for `Visor`
    - Deslizar cambia de imagen y en los extremos permanece; Escape cierra; el foco no sale del Visor; a11y.
    - _Requirements: 7.10, 7.11, 7.12, 11.2, 11.4_

  - [ ] 42.4 Revisión visual de `Visor`
    - Revisar en Storybook `Components/Visor › Mobile` y `› Tablet` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: ocupa el alto visible aun con la barra del navegador; botones cómodos; deslizar cambia de imagen; Escape cierra; Tab no sale del Visor; el umbral nuevo (`39.99rem` en vez de 768 px) cambia el encabezado en tablet de 768 px.
    - Verificar que a 1280 px las stories existentes de `Visor` no cambiaron (Requirement 12.3).
    - _Requirements: 7.9, 7.10, 7.12, 12.3_

- [ ] 43. MessageBubble y MessageAttachment (familia Mensajería)
  - [ ] 43.1 Adaptar `MessageBubble` y `MessageAttachment`
    - `MessagePanel.module.css`: `MessageBubble` con `max-width: 85%` y `overflow-wrap: anywhere` en móvil; `MessageAttachment` trunca el nombre con puntos suspensivos en una línea conservando la extensión y dentro de la burbuja. Migrar los umbrales de estas reglas a `39.99rem`.
    - _Requirements: 1.4, 8.4, 8.7, 12.2, 12.3_

  - [ ] 43.2 Agregar Responsive_Story `Mobile` en `MessagePanel.stories.tsx`
    - `Mobile` (nombre `BubbleMobile` si ya existe `Mobile`): burbujas con cadena de 500 caracteres sin espacios y adjuntos con nombre largo (`reporte-de-evidencia-viaje-...-final.pdf`).
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 43.3 Write tests for `MessageBubble` y `MessageAttachment`
    - Lista sin desborde con cadenas de hasta 500 caracteres; la extensión del adjunto queda visible; a11y.
    - _Requirements: 8.4, 8.7, 11.2, 11.4_

  - [ ] 43.4 Revisión visual de `MessageBubble` y `MessageAttachment`
    - Revisar en Storybook `Components/MessagePanel › BubbleMobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: las burbujas no pasan del 85 % del ancho; el texto largo se rompe en renglones; el adjunto muestra "…" y la extensión.
    - Verificar que a 1280 px las stories existentes de `MessagePanel` no cambiaron (Requirement 12.3).
    - _Requirements: 8.4, 8.7, 12.3_

- [ ] 44. MessageComposer (familia Mensajería)
  - [ ] 44.1 Adaptar `MessageComposer`
    - `MessagePanel.module.css`: `sticky` abajo, `padding-bottom: env(safe-area-inset-bottom)`, ajuste con `visualViewport` cuando hay teclado en pantalla; botones de adjuntar y enviar con 44 x 44 px y `gap: var(--ui-space-2)`.
    - _Requirements: 8.5, 8.6, 9.2, 12.2, 12.3_

  - [ ] 44.2 Agregar Responsive_Story `Mobile` en `MessagePanel.stories.tsx`
    - `ComposerMobile`: compositor con borrador largo y adjuntos pendientes.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 44.3 Write tests for `MessageComposer`
    - Touch_Target y separación de 8 px de los botones; compositor anclado abajo; a11y.
    - _Requirements: 8.5, 8.6, 11.2, 11.3, 11.4_

  - [ ] 44.4 Revisión visual de `MessageComposer`
    - Revisar en Storybook `Components/MessagePanel › ComposerMobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: el compositor queda al fondo y por encima del teclado; los botones se aciertan sin tocar el vecino; respeta el área segura.
    - Verificar que a 1280 px las stories existentes de `MessagePanel` no cambiaron (Requirement 12.3).
    - _Requirements: 8.5, 8.6, 12.3_

- [ ] 45. MessageList, MessageThread, MessageDayDivider y groupMessages (familia Mensajería)
  - [ ] 45.1 Adaptar `MessageList`, `MessageThread` y `MessageDayDivider`
    - Verificar que el orden es siempre por `secuencia` ascendente (no por `creadoEn`) en todos los rangos y al girar; `min-width: 0` y desplazamiento vertical dentro de la lista; separador de día sin desborde.
    - _Requirements: 8.4, 8.9, 9.7, 12.2, 12.3_

  - [ ] 45.2 Agregar Responsive_Story `Mobile` en `MessagePanel.stories.tsx`
    - `ThreadMobile`: hilo de 20 o más mensajes con fechas de creación desordenadas respecto a `secuencia` y varios días.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 45.3 Write property test for orden de `MessageThread`
    - **Property 8: Orden de mensajes por `secuencia`**
    - Sin desborde en 320, 375, 768 y 1280; a11y.
    - **Validates: Requirements 8.9**

  - [ ] 45.4 Revisión visual de `MessageThread`
    - Revisar en Storybook `Components/MessagePanel › ThreadMobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: el orden de mensajes no cambia entre móvil, tablet y escritorio ni al girar; los separadores de día se ven bien; el desplazamiento se conserva.
    - Verificar que a 1280 px las stories existentes de `MessagePanel` no cambiaron (Requirement 12.3).
    - _Requirements: 8.9, 9.7, 12.3_

- [ ] 46. ConversationStatus (familia Mensajería)
  - [ ] 46.1 Adaptar `ConversationStatus`
    - `MessagePanel.module.css` (o su módulo): elementos apilados en una columna en móvil sin desborde; no pasar datos de reclamo ni pool al portal del cliente (no cambia la API).
    - _Requirements: 8.8, 12.2, 12.3_

  - [ ] 46.2 Agregar Responsive_Story `Mobile` en `ConversationStatus.stories.tsx`
    - `Mobile`: estado con responsable de nombre largo, estado de la conversación y acciones.
    - _Requirements: 10.3, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 46.3 Write tests for `ConversationStatus`
    - Columna única en móvil; sin desborde en 320, 375, 768 y 1280; a11y.
    - _Requirements: 8.8, 11.2, 11.4_

  - [ ] 46.4 Revisión visual de `ConversationStatus`
    - Revisar en Storybook `Components/ConversationStatus › Mobile` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: estado, responsable y acciones en columna en móvil y en fila en escritorio.
    - Verificar que a 1280 px las stories existentes de `ConversationStatus` no cambiaron (Requirement 12.3).
    - _Requirements: 8.8, 12.3_

- [ ] 47. MessagePanel (familia Mensajería)
  - [ ] 47.1 Adaptar `MessagePanel`
    - `MessagePanel.module.css`: reemplazar `@media (max-width: 560px)` por `39.99rem`; panel abierto a `100vw` y `100dvh` en móvil, con alto ajustado por `visualViewport` cuando hay teclado; botones del encabezado con Touch_Target de 44 px. Quitar `MessagePanel` de `breakpoints-legacy.manifest.json` al terminar también la tarea 48.
    - _Requirements: 1.4, 1.6, 8.1, 8.5, 9.2, 12.2, 12.3_

  - [ ] 47.2 Agregar Responsive_Story `Mobile` y `Tablet` en `MessagePanel.stories.tsx`
    - `Mobile`: panel de conversación con un viaje, hilo largo, compositor y adjuntos. `Tablet`: en 768 px.
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 47.3 Write tests for `MessagePanel`
    - Panel a 100 % del ancho y alto dinámico en móvil; botones con Touch_Target; Escape y foco; a11y.
    - _Requirements: 8.1, 8.5, 9.2, 11.2, 11.3, 11.4_

  - [ ] 47.4 Revisión visual de `MessagePanel`
    - Revisar en Storybook `Components/MessagePanel › Mobile` y `› Tablet` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: en móvil el panel ocupa toda la pantalla; el compositor sigue visible con el teclado; en tablet y escritorio el panel conserva su tamaño de ventana flotante.
    - Verificar que a 1280 px las stories existentes de `MessagePanel` no cambiaron (Requirement 12.3).
    - _Requirements: 8.1, 8.5, 12.3_

- [ ] 48. MessageDock, MessageDockBar y useMessageDock (familia Mensajería)
  - [ ] 48.1 Extraer `dockReducer` y adaptar `MessageDock`, `MessageDockBar` y `useMessageDock`
    - `src/components/MessagePanel/dockState.ts`: tipos `DockPanelState`, `DockState`, `DockAction` y `dockReducer`. Al abrir con el cupo lleno, minimiza el panel abierto más antiguo sin tocar su `draft`. Confirmar contra `useMessageDock` (los tipos `DockState` y `DockAction` ya se exportan; si el modelo difiere, el reductor lo envuelve sin cambiar la API pública).
    - `maxOpen` por breakpoint (móvil 1, tablet 1, escritorio el valor actual); cada conversación restante como pestaña en la barra; botones de la barra con Touch_Target de 44 px.
    - _Requirements: 8.1, 8.2, 8.3, 9.2, 12.1, 12.2, 12.3_

  - [ ] 48.2 Agregar Responsive_Story `Mobile` y `Tablet` en `MessagePanel.stories.tsx`
    - `DockMobile`: 4 conversaciones con borradores; abrir una segunda minimiza la primera. `DockTablet`: 1 panel abierto y el resto como pestañas.
    - _Requirements: 10.3, 10.4, 10.5, 10.6, 10.7, 10.11_

  - [ ]* 48.3 Write property test for `dockReducer`
    - **Property 7: El Dock respeta el cupo y conserva borradores**
    - Sin desborde en 320, 375, 768 y 1280; a11y.
    - **Validates: Requirements 8.2, 8.3**

  - [ ] 48.4 Revisión visual de `MessageDock`
    - Revisar en Storybook `Components/MessagePanel › DockMobile` y `› DockTablet` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: nunca hay más de 1 panel abierto en móvil y tablet; al abrir otro, el anterior pasa a la barra y su borrador sigue ahí; en escritorio se conserva el cupo actual.
    - Verificar que a 1280 px las stories existentes de `MessagePanel` no cambiaron y que el manifiesto de umbrales ya no lista `MessagePanel` (Requirement 12.3).
    - _Requirements: 8.1, 8.2, 8.3, 12.3_

- [ ] 49. Checkpoint - Componentes completos
  - Verificar que `src/utils/breakpoints-legacy.manifest.json` quedó vacío y que `BREAKPOINTS_STRICT=1 npm test` pasa.
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 50. Fase 2, Accesibilidad táctil global restante
  - [ ] 50.1 Barrido de Touch_Target en módulos CSS no cubiertos
    - Con `grep` sobre `src/**/*.module.css`, listar los controles interactivos del Requirement 9.2 que no recibieron Touch_Target en su tarea (cierre de `Modal` y `Toast`, botones de `Sidebar` y `Navbar`, expandir de `Table`, páginas de `Pagination`, celdas de `Calendar`, botones de `MessagePanel`) y completar los faltantes bajo `@media (pointer: coarse)`.
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 50.2 Ampliar áreas activables sin solaparse y zoom de texto
    - Elementos densos: `::after` con `inset: calc((var(--ui-touch-target-min) - 100%) / -2)`, marcador `data-touch-extended`, `gap` mínimo de `var(--ui-space-2)` y limitación de la ampliación para que áreas contiguas no se solapen y conserven 8 px.
    - Zoom de texto al 200 % a 320 px: sin truncar, ocultar ni solapar contenido; orientación: la disposición cambia en 300 ms o menos y conserva el estado interno.
    - _Requirements: 9.3, 9.4, 9.5, 9.7, 9.8_

  - [ ]* 50.3 Write tests for accesibilidad táctil global
    - Prueba de navegador sobre todas las Responsive_Story: Touch_Target (excluye `[data-touch-extended]`), separación de 8 px entre contiguos, atributos `aria-*` y `role` conservados.
    - _Requirements: 9.4, 9.6, 9.8, 11.3_

  - [ ] 50.4 Revisión visual de accesibilidad táctil
    - Revisar en Storybook `Components/DarkMode / Galería de Componentes` y las stories `Mobile` más densas (`Table`, `Pagination`, `Calendar`, `MessagePanel`) en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: ningún control denso se activa por error al tocar; la separación entre controles contiguos es visible; con texto al 200 % nada se corta.
    - Verificar que a 1280 px nada cambió (Requirement 12.3).
    - _Requirements: 9.4, 9.5, 12.3_

- [ ] 51. Fase 2, Requirement 13: coexistencia con Tailwind
  - [ ] 51.1 Documentar la coexistencia con Tailwind y la guía de sobrescritura
    - Crear `docs/responsive-tailwind.md` con la tabla de equivalencias del Breakpoint_Set frente a Tailwind 4 (40rem = `sm`, 64rem = `lg`, sin corte en 48rem), la nota de que el CSS publicado no usa `@layer` y la guía de sobrescritura: utilidades sobre un contenedor propio, props de la librería y `!` solo como último recurso. Documentar que el Gutter_Token no se acumula con `px-*` en el mismo contenedor.
    - Replicar la guía de sobrescritura en `docs/steering-consumidores/ai27-ui-library.md` (se coordina con la tarea 55.1).
    - _Requirements: 13.3, 13.4, 13.5, 13.6, 13.7, 13.10_

  - [ ] 51.2 Crear `src/stories/tailwind-equivalents.css` y la story de coexistencia
    - Crear `src/stories/tailwind-equivalents.css` con utilidades equivalentes a Tailwind (`w-full`, `hidden`, `sm:grid-cols-2`) dentro de `@layer utilities`, solo para stories y pruebas, sin instalar `tailwindcss` (D8). No se publica en `dist`.
    - Story `Responsive/Tailwind` con esas clases alrededor de componentes de la Library, usando `responsiveStory` en cada Viewport_Preset; verifica que los estilos calculados coinciden con lo documentado.
    - _Requirements: 13.2, 13.8, 13.9_

  - [ ] 51.3 Crear el manifiesto de clases y `tailwind-compat.test.ts`
    - `scripts/css-classes.mjs`: genera el manifiesto normalizado de clases (sin hash ni línea de las clases de módulo) en `docs/css-classes.manifest.json`.
    - `src/utils/__tests__/tailwind-compat.test.ts` (proyecto `unit`): `package.json` no declara `tailwindcss`, `@tailwindcss/*` ni `postcss` en `dependencies` ni `peerDependencies` (13.1); ningún CSS de `src/` contiene `@layer` (13.5); las clases existentes no se renombran frente al manifiesto (13.11); toda clase nueva lleva prefijo `ui-` (13.12).
    - _Requirements: 13.1, 13.5, 13.11, 13.12_

  - [ ]* 51.4 Write tests for la coexistencia con Tailwind
    - Suite filtrada de la story `Responsive/Tailwind`: sin desborde en 320, 375, 768 y 1280; a11y.
    - _Requirements: 11.2, 11.4, 13.8, 13.9_

  - [ ] 51.5 Revisión visual de la coexistencia con Tailwind
    - Revisar en Storybook `Responsive/Tailwind` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: las clases de Tailwind y los componentes cambian de disposición en los mismos anchos; no hay conflictos de estilos ni desborde.
    - Verificar que a 1280 px las stories existentes no cambiaron (Requirement 12.3).
    - _Requirements: 12.3, 13.8, 13.9_

  - [ ]* 51.6 Write property test for el CSS sin capas
    - **Property 10: El CSS no declara capas**
    - Recorrer los archivos CSS de `src/` y el `styles.css` publicado; ninguno contiene `@layer` (prueba unitaria exhaustiva, sin `fast-check`).
    - **Validates: Requirements 13.5**

  - [ ]* 51.7 Write property test for umbrales equivalentes a Tailwind 4
    - **Property 11: Umbrales equivalentes a Tailwind 4**
    - Todo umbral de `@media`/`@container` en `src/` es 40rem o 64rem (o `39.99rem` como límite superior de rango); no existe ningún corte en 48rem.
    - **Validates: Requirements 13.3, 13.4**

  - [ ]* 51.8 Write property test for clases conservadas o con prefijo `ui-`
    - **Property 12: Clases conservadas o nuevas con prefijo `ui-`**
    - Toda clase del manifiesto anterior existe en la versión actual; toda clase fuera del manifiesto empieza con `ui-`.
    - **Validates: Requirements 13.11, 13.12**

- [ ] 52. Fase 2, Documentación Storybook (MDX)
  - [ ] 52.1 Crear `src/stories/Responsive.mdx`
    - Página con el Breakpoint_Set en px, el Touch_Target mínimo en px, los pasos para elegir un Viewport_Preset en la barra de herramientas y la lista de props nuevas (`Grid.columns` por breakpoint, `Table.responsive`, `FilterBar.collapsibleOnMobile`, `Sidebar.mobileOpen`, `SidebarTrigger`). Enlazar `docs/responsive-breakpoints.md`.
    - _Requirements: 10.10, 1.1_

  - [ ] 52.2 Verificar `npm run build-storybook`
    - Ejecutar y confirmar código de salida 0 con todas las Responsive_Story; si falla, el nombre de la story aparece en la salida.
    - _Requirements: 10.8, 10.9_

  - [ ] 52.3 Revisión visual de la documentación
    - Revisar en Storybook la página `Responsive` en móvil, tablet y escritorio; el usuario valida y aprueba antes de continuar.
    - Mirar: tablas y bloques de código legibles en móvil; los pasos para elegir viewport son claros.
    - _Requirements: 10.10_

- [ ] 53. Fase 2, CI: job de responsividad y check de breakpoints
  - [ ] 53.1 Agregar el job de responsividad a `.github/workflows/ci.yml`
    - Paso requerido que ejecuta `npm run test:responsive`; confirmar el nombre del workflow con `grep`. Marcar el job como requerido para integrar.
    - _Requirements: 11.1, 11.7_

  - [ ] 53.2 Agregar el check de breakpoints y de cobertura de stories
    - Paso de CI con `BREAKPOINTS_STRICT=1` (manifiesto vacío). Crear `src/utils/__tests__/responsive-coverage.test.ts`: lee `src/index.ts` y los `*.stories.tsx` y falla indicando el componente exportado sin story `Mobile` (los de mensajería cuentan con las variantes `BubbleMobile`, `ComposerMobile`, `ThreadMobile`, `DockMobile`).
    - Confirmar que `npm run lint`, `npm run build` y `npm test` terminan con código 0 y sin errores nuevos.
    - _Requirements: 1.6, 1.9, 10.3, 11.8_

  - [ ] 53.3 Pruebas de compatibilidad con consumidores
    - `tsc` sobre fixtures de consumo de la versión anterior; comparación de capturas de las stories existentes a 1280 px; verificar que `dist/` no contiene `@ai27-tech/contracts`.
    - _Requirements: 12.1, 12.2, 12.3, 12.5_

- [ ] 54. Fase 2, CHANGELOG, excepciones y versión
  - [ ] 54.1 Registrar los cambios en `CHANGELOG.md`
    - Una entrada por componente con sus props nuevas y cambios de comportamiento en anchos menores a escritorio. Incluir el **cambio de umbrales de `Visor` (768 px a `39.99rem`) y de `FilterBar` (1024, 768 y 640 px a `63.99rem` y `39.99rem`)**, y los de `Navbar`, `ImageCard`, `ImageCarousel`, `PageHeader`, `Form` y `MessagePanel`.
    - _Requirements: 11.9, 12.6_

  - [ ] 54.2 Documentar excepciones y fijar la versión
    - Crear `docs/responsive-excepciones.md` si hay excepciones (con su motivo) y reflejarlas en `CHANGELOG.md`; fijar la versión (`0.4.0-beta.1` propuesta, o `0.3.0-beta.2` según el CHANGELOG).
    - _Requirements: 11.10, 12.6_

- [ ] 55. Fase 2, Actualizar el steering de consumidores
  - [ ] 55.1 Actualizar `docs/steering-consumidores/ai27-ui-library.md`
    - Reflejar `Grid` con columnas por breakpoint, `Table responsive="stacked"`, `FilterBar collapsibleOnMobile`, `Sidebar` móvil con `SidebarTrigger`, la nota de coexistencia con Tailwind y la fecha y versión del encabezado.
    - _Requirements: 11.9, 13.3, 13.4, 13.6_

- [ ] 56. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Las sub-tareas marcadas con `*` son opcionales (pruebas de propiedades y unitarias) y se pueden omitir para un MVP. La Responsive_Test_Suite (tarea 1.13) corre en CI sobre todas las stories con `responsive: true` aunque se omitan.
- La subtarea `N.4` (Revisión visual) **no** es opcional: el usuario valida y aprueba cada componente antes de iniciar el siguiente.
- Las propiedades 1 a 9 del diseño cubren funciones puras, el reductor y el orden de mensajes; las propiedades 10 a 12 se verifican con pruebas unitarias exhaustivas sobre archivos y clases (sin `fast-check`). El CSS, el foco y los gestos reales se verifican con pruebas de navegador.
- El punto P1 quedó cerrado por DC-3 (`Grid` usa `@media` sobre la ventana). Los supuestos S3 del diseño (valores de `--ui-gutter-screen`) y el pendiente P3 (prop `gutter={false}`, relacionada con 13.10) se confirman al implementar las tareas 1.1 y 51.1.
- No se cambia ningún nombre, tipo ni valor por defecto de props existentes (Requirement 12).

## Traceability: componente a requisitos

| Componente | Requisitos que cubre |
| --- | --- |
| Button | 9.1, 9.3, 9.4, 9.6 |
| Stack, Inline, Grid | 2.1, 2.2, 2.3, 2.10 |
| Card, CardFooter | 2.8, 2.9 |
| Section | 2.7 |
| Divider | 2.10 |
| EmptyState | 2.10 |
| PageHeader | 1.4, 2.4, 2.5 |
| Tabs | 2.6, 9.2, 9.7 |
| Breadcrumb | 2.5, 3.9 |
| Navbar | 1.4, 3.8, 9.2 |
| Sidebar, SidebarTrigger | 3.1 a 3.7, 3.10, 9.2 |
| Badge | 4.13 |
| Stat | 4.10 |
| DescriptionList | 4.7, 4.8, 4.9 |
| Timeline | 1.5, 4.11, 4.12 |
| Table | 4.1, 4.2, 4.3, 4.14, 9.2 |
| FilterBar | 1.4, 4.4, 4.5 |
| FilterTable | 4.1, 4.4, 4.5 |
| Pagination | 4.6, 9.2, 9.4 |
| FormField | 5.2, 9.6 |
| Form, FormSection, FormRow, FormActions | 1.4, 5.1, 5.3, 5.4 |
| Input, Textarea | 5.5, 9.2 |
| Select | 5.5, 5.6, 9.2 |
| Checkbox, Radio, Switch | 5.7, 9.2, 9.4 |
| Calendar | 5.8, 9.2 |
| DateInput | 5.9, 5.11, 5.12, 5.13 |
| TimePicker | 5.9, 5.12, 5.13 |
| DateTimeInput | 5.9, 5.10, 5.12, 5.13 |
| Alert | 6.8, 6.10 |
| Toast, ToastContainer | 6.5, 6.10, 9.2 |
| Modal | 6.1 a 6.4, 6.10, 6.11, 9.2 |
| Popover | 6.6, 6.10 |
| Tooltip | 6.7, 6.10 |
| Skeleton, SkeletonText, SkeletonCard, SkeletonTable | 6.9 |
| Spinner | 6.9 |
| ProgressBar | 6.9 |
| ImageCard | 1.4, 7.5 |
| ImageGrid | 7.1 a 7.4 |
| ImageCarousel | 1.4, 7.6, 7.7, 7.8 |
| Visor | 1.4, 7.9 a 7.12 |
| MessageBubble, MessageAttachment | 8.4, 8.7 |
| MessageComposer | 8.5, 8.6 |
| MessageList, MessageThread, MessageDayDivider, groupMessages | 8.9 |
| ConversationStatus | 8.8 |
| MessagePanel | 8.1, 8.5 |
| MessageDock, MessageDockBar, useMessageDock | 8.1, 8.2, 8.3 |
| Transversales | 1.1 a 1.9, 9.x, 10.x, 11.x, 12.x, 13 |

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3"] },
    { "id": 3, "tasks": ["1.4"] },
    { "id": 4, "tasks": ["1.5"] },
    { "id": 5, "tasks": ["1.6"] },
    { "id": 6, "tasks": ["1.7"] },
    { "id": 7, "tasks": ["1.8"] },
    { "id": 8, "tasks": ["1.9"] },
    { "id": 9, "tasks": ["1.10"] },
    { "id": 10, "tasks": ["1.11"] },
    { "id": 11, "tasks": ["1.12"] },
    { "id": 12, "tasks": ["1.13"] },
    { "id": 13, "tasks": ["3.1"] },
    { "id": 14, "tasks": ["3.2"] },
    { "id": 15, "tasks": ["3.3"] },
    { "id": 16, "tasks": ["3.4"] },
    { "id": 17, "tasks": ["4.1"] },
    { "id": 18, "tasks": ["4.2"] },
    { "id": 19, "tasks": ["4.3"] },
    { "id": 20, "tasks": ["4.4"] },
    { "id": 21, "tasks": ["5.1"] },
    { "id": 22, "tasks": ["5.2"] },
    { "id": 23, "tasks": ["5.3"] },
    { "id": 24, "tasks": ["5.4"] },
    { "id": 25, "tasks": ["6.1"] },
    { "id": 26, "tasks": ["6.2"] },
    { "id": 27, "tasks": ["6.3"] },
    { "id": 28, "tasks": ["6.4"] },
    { "id": 29, "tasks": ["7.1"] },
    { "id": 30, "tasks": ["7.2"] },
    { "id": 31, "tasks": ["7.3"] },
    { "id": 32, "tasks": ["7.4"] },
    { "id": 33, "tasks": ["8.1"] },
    { "id": 34, "tasks": ["8.2"] },
    { "id": 35, "tasks": ["8.3"] },
    { "id": 36, "tasks": ["8.4"] },
    { "id": 37, "tasks": ["9.1"] },
    { "id": 38, "tasks": ["9.2"] },
    { "id": 39, "tasks": ["9.3"] },
    { "id": 40, "tasks": ["9.4"] },
    { "id": 41, "tasks": ["10.1"] },
    { "id": 42, "tasks": ["10.2"] },
    { "id": 43, "tasks": ["10.3"] },
    { "id": 44, "tasks": ["10.4"] },
    { "id": 45, "tasks": ["11.1"] },
    { "id": 46, "tasks": ["11.2"] },
    { "id": 47, "tasks": ["11.3"] },
    { "id": 48, "tasks": ["11.4"] },
    { "id": 49, "tasks": ["12.1"] },
    { "id": 50, "tasks": ["12.2"] },
    { "id": 51, "tasks": ["12.3"] },
    { "id": 52, "tasks": ["12.4"] },
    { "id": 53, "tasks": ["13.1"] },
    { "id": 54, "tasks": ["13.2"] },
    { "id": 55, "tasks": ["13.3"] },
    { "id": 56, "tasks": ["13.4"] },
    { "id": 57, "tasks": ["14.1"] },
    { "id": 58, "tasks": ["14.2"] },
    { "id": 59, "tasks": ["14.3"] },
    { "id": 60, "tasks": ["14.4"] },
    { "id": 61, "tasks": ["15.1"] },
    { "id": 62, "tasks": ["15.2"] },
    { "id": 63, "tasks": ["15.3"] },
    { "id": 64, "tasks": ["15.4"] },
    { "id": 65, "tasks": ["16.1"] },
    { "id": 66, "tasks": ["16.2"] },
    { "id": 67, "tasks": ["16.3"] },
    { "id": 68, "tasks": ["16.4"] },
    { "id": 69, "tasks": ["17.1"] },
    { "id": 70, "tasks": ["17.2"] },
    { "id": 71, "tasks": ["17.3"] },
    { "id": 72, "tasks": ["17.4"] },
    { "id": 73, "tasks": ["18.1"] },
    { "id": 74, "tasks": ["18.2"] },
    { "id": 75, "tasks": ["18.3"] },
    { "id": 76, "tasks": ["18.4"] },
    { "id": 77, "tasks": ["19.1"] },
    { "id": 78, "tasks": ["19.2"] },
    { "id": 79, "tasks": ["19.3"] },
    { "id": 80, "tasks": ["19.4"] },
    { "id": 81, "tasks": ["20.1"] },
    { "id": 82, "tasks": ["20.2"] },
    { "id": 83, "tasks": ["20.3"] },
    { "id": 84, "tasks": ["20.4"] },
    { "id": 85, "tasks": ["21.1"] },
    { "id": 86, "tasks": ["21.2"] },
    { "id": 87, "tasks": ["21.3"] },
    { "id": 88, "tasks": ["21.4"] },
    { "id": 89, "tasks": ["22.1"] },
    { "id": 90, "tasks": ["22.2"] },
    { "id": 91, "tasks": ["22.3"] },
    { "id": 92, "tasks": ["22.4"] },
    { "id": 93, "tasks": ["23.1"] },
    { "id": 94, "tasks": ["23.2"] },
    { "id": 95, "tasks": ["23.3"] },
    { "id": 96, "tasks": ["23.4"] },
    { "id": 97, "tasks": ["24.1"] },
    { "id": 98, "tasks": ["24.2"] },
    { "id": 99, "tasks": ["24.3"] },
    { "id": 100, "tasks": ["24.4"] },
    { "id": 101, "tasks": ["25.1"] },
    { "id": 102, "tasks": ["25.2"] },
    { "id": 103, "tasks": ["25.3"] },
    { "id": 104, "tasks": ["25.4"] },
    { "id": 105, "tasks": ["26.1"] },
    { "id": 106, "tasks": ["26.2"] },
    { "id": 107, "tasks": ["26.3"] },
    { "id": 108, "tasks": ["26.4"] },
    { "id": 109, "tasks": ["27.1"] },
    { "id": 110, "tasks": ["27.2"] },
    { "id": 111, "tasks": ["27.3"] },
    { "id": 112, "tasks": ["27.4"] },
    { "id": 113, "tasks": ["28.1"] },
    { "id": 114, "tasks": ["28.2"] },
    { "id": 115, "tasks": ["28.3"] },
    { "id": 116, "tasks": ["28.4"] },
    { "id": 117, "tasks": ["29.1"] },
    { "id": 118, "tasks": ["29.2"] },
    { "id": 119, "tasks": ["29.3"] },
    { "id": 120, "tasks": ["29.4"] },
    { "id": 121, "tasks": ["30.1"] },
    { "id": 122, "tasks": ["30.2"] },
    { "id": 123, "tasks": ["30.3"] },
    { "id": 124, "tasks": ["30.4"] },
    { "id": 125, "tasks": ["31.1"] },
    { "id": 126, "tasks": ["31.2"] },
    { "id": 127, "tasks": ["31.3"] },
    { "id": 128, "tasks": ["31.4"] },
    { "id": 129, "tasks": ["32.1"] },
    { "id": 130, "tasks": ["32.2"] },
    { "id": 131, "tasks": ["32.3"] },
    { "id": 132, "tasks": ["32.4"] },
    { "id": 133, "tasks": ["33.1"] },
    { "id": 134, "tasks": ["33.2"] },
    { "id": 135, "tasks": ["33.3"] },
    { "id": 136, "tasks": ["33.4"] },
    { "id": 137, "tasks": ["34.1"] },
    { "id": 138, "tasks": ["34.2"] },
    { "id": 139, "tasks": ["34.3"] },
    { "id": 140, "tasks": ["34.4"] },
    { "id": 141, "tasks": ["35.1"] },
    { "id": 142, "tasks": ["35.2"] },
    { "id": 143, "tasks": ["35.3"] },
    { "id": 144, "tasks": ["35.4"] },
    { "id": 145, "tasks": ["36.1"] },
    { "id": 146, "tasks": ["36.2"] },
    { "id": 147, "tasks": ["36.3"] },
    { "id": 148, "tasks": ["36.4"] },
    { "id": 149, "tasks": ["37.1"] },
    { "id": 150, "tasks": ["37.2"] },
    { "id": 151, "tasks": ["37.3"] },
    { "id": 152, "tasks": ["37.4"] },
    { "id": 153, "tasks": ["38.1"] },
    { "id": 154, "tasks": ["38.2"] },
    { "id": 155, "tasks": ["38.3"] },
    { "id": 156, "tasks": ["38.4"] },
    { "id": 157, "tasks": ["39.1"] },
    { "id": 158, "tasks": ["39.2"] },
    { "id": 159, "tasks": ["39.3"] },
    { "id": 160, "tasks": ["39.4"] },
    { "id": 161, "tasks": ["40.1"] },
    { "id": 162, "tasks": ["40.2"] },
    { "id": 163, "tasks": ["40.3"] },
    { "id": 164, "tasks": ["40.4"] },
    { "id": 165, "tasks": ["41.1"] },
    { "id": 166, "tasks": ["41.2"] },
    { "id": 167, "tasks": ["41.3"] },
    { "id": 168, "tasks": ["41.4"] },
    { "id": 169, "tasks": ["42.1"] },
    { "id": 170, "tasks": ["42.2"] },
    { "id": 171, "tasks": ["42.3"] },
    { "id": 172, "tasks": ["42.4"] },
    { "id": 173, "tasks": ["43.1"] },
    { "id": 174, "tasks": ["43.2"] },
    { "id": 175, "tasks": ["43.3"] },
    { "id": 176, "tasks": ["43.4"] },
    { "id": 177, "tasks": ["44.1"] },
    { "id": 178, "tasks": ["44.2"] },
    { "id": 179, "tasks": ["44.3"] },
    { "id": 180, "tasks": ["44.4"] },
    { "id": 181, "tasks": ["45.1"] },
    { "id": 182, "tasks": ["45.2"] },
    { "id": 183, "tasks": ["45.3"] },
    { "id": 184, "tasks": ["45.4"] },
    { "id": 185, "tasks": ["46.1"] },
    { "id": 186, "tasks": ["46.2"] },
    { "id": 187, "tasks": ["46.3"] },
    { "id": 188, "tasks": ["46.4"] },
    { "id": 189, "tasks": ["47.1"] },
    { "id": 190, "tasks": ["47.2"] },
    { "id": 191, "tasks": ["47.3"] },
    { "id": 192, "tasks": ["47.4"] },
    { "id": 193, "tasks": ["48.1"] },
    { "id": 194, "tasks": ["48.2"] },
    { "id": 195, "tasks": ["48.3"] },
    { "id": 196, "tasks": ["48.4"] },
    { "id": 197, "tasks": ["50.1"] },
    { "id": 198, "tasks": ["50.2"] },
    { "id": 199, "tasks": ["50.3"] },
    { "id": 200, "tasks": ["50.4"] },
    { "id": 201, "tasks": ["51.1"] },
    { "id": 202, "tasks": ["51.2"] },
    { "id": 203, "tasks": ["51.3"] },
    { "id": 204, "tasks": ["51.4"] },
    { "id": 205, "tasks": ["51.5"] },
    { "id": 206, "tasks": ["51.6"] },
    { "id": 207, "tasks": ["51.7"] },
    { "id": 208, "tasks": ["51.8"] },
    { "id": 209, "tasks": ["52.1"] },
    { "id": 210, "tasks": ["52.2"] },
    { "id": 211, "tasks": ["52.3"] },
    { "id": 212, "tasks": ["53.1"] },
    { "id": 213, "tasks": ["53.2"] },
    { "id": 214, "tasks": ["53.3"] },
    { "id": 215, "tasks": ["54.1"] },
    { "id": 216, "tasks": ["54.2"] },
    { "id": 217, "tasks": ["55.1"] }
  ]
}
```
