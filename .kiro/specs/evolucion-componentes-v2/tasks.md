# Tareas — Evolución de `@ai27-tech/ui` (ola v2)

Requisitos en `requirements.md`, diseño en `design.md`. Las partes P1 a P7 se implementan en orden (P7 puede ir antes). Cada parte termina con su tarea de cierre y puede publicarse como beta por separado.

Las tareas marcadas con `*` son opcionales (pruebas unitarias). Se recomiendan para la lógica pura de fechas y horas, que es la más propensa a errores.

Comandos de verificación en `repos/pf-library-frontend-components`: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build:lib`, `pnpm build-storybook`.

**Definición de terminado de las stories (R24).** Cada tarea de stories de este documento cumple esto, además de lo que diga la tarea:
- Archivo `Nombre.stories.tsx` con `title: "Components/Nombre"`, `tags: ["autodocs"]`, `satisfies Meta`.
- Variantes, tamaños, estados (deshabilitado, error, cargando, vacío, solo lectura) y casos de borde donde apliquen.
- Revisadas en tema claro y oscuro (selector de la barra de Storybook) y con el panel de accesibilidad.
- Textos de ejemplo en español, sin colores propios.
- Cada parte cierra con `pnpm build-storybook` sin errores.

- [-] 0. Preparación
  - [x] 0.1 Crear una rama de trabajo desde la rama de integración (`pf-lf-d`) y correr la línea base: `pnpm lint`, `pnpm typecheck`, `pnpm test`. Anotar fallos previos para no confundirlos con regresiones. _Rama ya existente (`feature/componentes-panel-interno`), no se creó otra. Línea base: lint y typecheck OK, 41 tests pasan, sin fallos previos._
  - [x] 0.2 Confirmar D8 (primer día de la semana) con el equipo o dejar lunes por defecto. _Decidido por el usuario: lunes por defecto._
  - [x] 0.3 Llenar el marcador `<ruta-de-tokens>` del steering con `src/styles/tokens.css`.

## P1. Fundaciones

- [x] 1. Tokens y utilidades
  - [x] 1.1 Agregar `--ui-z-popover: 1100` al bloque estructural de `tokens.css`.
  - [x] 1.2 Crear `src/utils/cx.ts`. Revisar si `base.css` ya define una clase de solo lectura de pantalla; si no, agregar `.ui-sr-only`. _`base.css` no tenía la clase; se agregó `.ui-sr-only`._
  - _Requisitos: R2_

- [x] 2. Componente `Popover`
  - [x] 2.1 Crear `src/components/Popover/` con portal, posicionamiento `bottom | top | auto`, ajuste horizontal, `align`, `offset` y `matchAnchorWidth`.
  - [x] 2.2 Reposicionar en `scroll` (captura) y `resize`.
  - [x] 2.3 Cierre por clic fuera (excluyendo el ancla) y por `Escape` escuchado en `window` en captura, con `stopPropagation`.
  - [x] 2.4 Estilos con `--ui-color-surface-raised`, `--ui-color-border`, `--ui-shadow-md`, `--ui-radius-lg`, `z-index: var(--ui-z-popover)`. _Ajustado: la superficie es `--ui-color-surface` (la de `Select` y `Modal`), con padding `--ui-space-2`, tipografía de la plataforma y fade corto. `design.md` aún dice `surface-raised`; pendiente de decisión._
  - [x] 2.5 Exportar `Popover` y `PopoverProps` en `src/index.ts`.
  - _Requisitos: R1.1 a R1.7_

- [x] 3. Story y verificación del Popover
  - [x] 3.1 Stories: abajo, arriba, automático con poco espacio, ancho del ancla.
  - [x] 3.2 Story dentro de un contenedor con `overflow: hidden` y otra dentro de `Modal`. Verificar: no se recorta; `Escape` cierra solo el popover y no el `Modal`; el clic en el popover no cierra el `Modal`; `Tab` dentro del popover no es atrapado por el focus trap. _Verificado en Chromium con un script temporal fuera del repo (15 de 15 criterios OK). Capturas en tema claro y oscuro revisadas._
  - [x] 3.3 Si el focus trap del `Modal` interfiere, reportar la brecha antes de tocar `Modal`. _No interfiere en el caso probado; `Modal` no se tocó._
  - _Requisitos: R1.8_

- [x] 4. Cierre de P1
  - [x] 4.1 `pnpm lint`, `pnpm typecheck`, `pnpm build:lib`, `pnpm build-storybook`.
  - [x] 4.2 Entrada en `CHANGELOG.md` `[Unreleased]` → "Agregado".

## P2. Cargas

- [x] 5. Skeleton
  - [x] 5.1 Crear `src/components/Skeleton/` con `Skeleton`, `SkeletonText`, `SkeletonCard`, `SkeletonTable` y el componente interno `SkeletonRows`.
  - [x] 5.2 Variables de color declaradas dentro de la clase del componente (sin `:root`), sin movimiento con `prefers-reduced-motion`.
  - [x] 5.3 Compuestos con `role="status"`, `aria-busy` y texto "Cargando" solo para lectores.
  - [x] 5.4 Verificar la forma de `SkeletonCard` contra `Card` (padding, borde, radio). _Usa `Card` como contenedor y `CardBody` para el padding; verificado en Chromium._
  - _Requisitos: R3_

- [x] 6. Spinner y ProgressBar
  - [x] 6.1 Crear `src/components/Spinner/` (tamaños `sm | md | lg`, `label`).
  - [x] 6.2 Crear `src/components/ProgressBar/` (determinada e indeterminada, `size`).
  - _Requisitos: R4_

- [x] 7. Integración en `Table`
  - [x] 7.1 `loading` renderiza `SkeletonRows` con `loadingRows` filas, respetando `density`, selección y expansión.
  - [x] 7.2 `aria-busy` en el `<table>` mientras carga.
  - [x] 7.3 Quitar el spinner y su CSS de `Table.module.css`; verificar que no queda código muerto.
  - _Requisitos: R5_

- [x] 8. (Opcional) Placeholder de imagen en `ImageCard` / `ImageGrid` _Hecho: placeholder en `ImageCard` mientras carga, sin cambios de props. Verificado en Chromium: carga lenta, error 404 y sin src._
  - Leer ambos componentes primero. Si se puede mostrar un `Skeleton` hasta el `onLoad` de la imagen sin cambiar props existentes, hacerlo; si no, registrarlo como fuera de alcance en el CHANGELOG.

- [x] 9. Stories y cierre de P2
  - [x] 9.1 Stories de `Skeleton`, compuestos, `Spinner`, `ProgressBar` y `Table` en carga (con selección y expansión).
  - [x] 9.2 Exportar todo en `src/index.ts`.
  - [x] 9.3 `pnpm lint`, `pnpm typecheck`, `pnpm build:lib`, `pnpm build-storybook`.
  - [x] 9.4 CHANGELOG: "Agregado" para los componentes; "Cambiado" para `Table loading` (skeleton en lugar de spinner).

## P3. Navegación

- [ ] 10. Botón de colapso del `Sidebar`
  - [ ] 10.1 Reestructurar el encabezado: `headerContent` + botón de icono; renderizar el encabezado si hay `header` o `onToggleCollapse`.
  - [ ] 10.2 CSS: `.header` con `space-between`; `.headerContent` con `min-width: 0`; cambiar `.header :global(svg)` a `.headerContent :global(svg)`.
  - [ ] 10.3 Estado colapsado: ocultar `headerContent`, centrar el botón.
  - [ ] 10.4 Botón: 2.5 rem, icono de panel con flecha que rota 180°, `aria-label`, `aria-expanded` y `title`.
  - [ ] 10.5 El `footer` solo se renderiza si hay prop `footer`. Eliminar CSS huérfano (`.collapseBtn`) si queda sin uso.
  - [ ] 10.6 Actualizar `Sidebar.stories.tsx`: con `header` y botón, sin `header` y con botón, colapsada. La story `Interactive` actual cambia el `header` a un icono cuando la barra se colapsa (`collapsed ? <Icon/> : <span>`); con D2 el contenido del encabezado se oculta al colapsar, así que ese icono ya no se verá. Ajustar la story y revisar si los consumidores hacen lo mismo (tarea 12.3).
  - _Requisitos: R6_

- [ ] 11. `Breadcrumb`
  - [ ] 11.1 Crear `src/components/Breadcrumb/` con `items`, `separator`, `as`, `href`, `onClick`, `icon`.
  - [ ] 11.2 Semántica `nav` / `ol` y `aria-current="page"` en el último elemento.
  - [ ] 11.3 Colapso con `maxItems` y menú de "…" usando `Popover`.
  - [ ] 11.4 Truncado de etiquetas con `title`.
  - [ ] 11.5 Stories: básico, con iconos, con `as` (enlace simulado de router), colapsado, etiquetas largas.
  - _Requisitos: R7_

- [ ] 12. Cierre de P3
  - [ ] 12.1 Exportar en `src/index.ts`.
  - [ ] 12.2 `pnpm lint`, `pnpm typecheck`, `pnpm build:lib`, `pnpm build-storybook`.
  - [ ] 12.3 Probar el build local en `pf-web-frontend-internal` (`NavigationSidebar`) y `pf-web-frontend-analist-panel` (`AppShell`): botón visible, colapsa y expande, sin solapamiento. Sin publicar.
  - [ ] 12.4 CHANGELOG: "Agregado" (`Breadcrumb`); "Cambiado" (botón del `Sidebar` pasa al encabezado y es solo icono; el pie queda para `footer`).

## P4. Estructura de información

- [ ] 13. Layout
  - [ ] 13.1 `src/components/Layout/` con `Stack`, `Inline`, `Grid` (`gap` 0 a 6, `align`, `justify`, `as`, `wrap`, `columns`, `minItemWidth`).
  - _Requisitos: R8_

- [ ] 14. `PageHeader`, `Section`, `DescriptionList`
  - [ ] 14.1 `PageHeader` (título, descripción, breadcrumb, acciones, children; apilado en pantallas angostas).
  - [ ] 14.2 `Section` con modo colapsable controlado y no controlado.
  - [ ] 14.3 `DescriptionList` con `<dl>`, columnas, orientación, `span` y `emptyValue`.
  - _Requisitos: R9, R10, R11_

- [ ] 15. `Stat`, `EmptyState`, `Alert`, `Divider`
  - [ ] 15.1 `Stat` sobre `Card`, con tendencia accesible (flecha + texto) y `loading` con `Skeleton`.
  - [ ] 15.2 `EmptyState`.
  - [ ] 15.3 `Alert` con `role` según variante y botón de cierre.
  - [ ] 15.4 `Divider` con etiqueta opcional.
  - [ ] 15.5 Contrastar `Alert` e iconos en tema oscuro y claro.
  - _Requisitos: R12, R13_

- [ ] 16. `Tabs`
  - [ ] 16.1 `Tabs`, `TabList`, `Tab`, `TabPanel` con contexto, modo controlado y no controlado.
  - [ ] 16.2 Roving tabindex; flechas, `Home` y `End`; omitir pestañas deshabilitadas.
  - [ ] 16.3 `icon` y `badge` en `Tab`.
  - _Requisitos: R14_

- [ ] 17. Stories y cierre de P4
  - [ ] 17.1 Un archivo de stories por componente (`Stack`/`Inline`/`Grid` pueden compartir uno), con todas sus variantes y estados, y una "pantalla de ejemplo" (`PageHeader` + `Tabs` + `Section` + `DescriptionList` + `Stat` + `Alert`) que muestre cómo reemplaza el patrón `Card` + `Button`.
  - [ ] 17.2 Exportar en `src/index.ts`.
  - [ ] 17.3 `pnpm lint`, `pnpm typecheck`, `pnpm build:lib`, `pnpm build-storybook`.
  - [ ] 17.4 CHANGELOG: "Agregado".

## P5. Formularios y pickers

- [ ] 18. Auditoría de formularios (D7)
  - [ ] 18.1 Revisar `Input`, `Select`, `Textarea`, `Checkbox`, `Radio`, `Switch`, `FormField` y `Form` (CSS y TSX): altura, radio, foco, deshabilitado, error, solo lectura, tamaños.
  - [ ] 18.2 Escribir `auditoria-formularios.md` con diferencias y mejoras candidatas, y acordar con el equipo cuáles entran. Las tareas 24 y 25 se detallan a partir de ese acuerdo.
  - _Requisitos: R19.1, R19.2_

- [ ] 19. Módulo de fechas
  - [ ] 19.1 `src/components/DatePicker/dateUtils.ts` con las funciones puras del diseño. Sin `new Date(string)`; solo `Date.UTC` para el día de la semana.
  - [ ]* 19.2 Pruebas unitarias: años bisiestos, fin de mes, `addMonths` desde el día 31, rejilla con `weekStartsOn` 0 y 1, análisis de texto con `/`, `-` y `.`, fechas inválidas, `min`/`max`.
  - _Requisitos: R15.6_

- [ ] 20. `Calendar`
  - [ ] 20.1 Vistas de días, meses y años; encabezado con navegación.
  - [ ] 20.2 Grid ARIA con roving tabindex; teclado completo (flechas, `PageUp`/`PageDown`, `Shift` + estas, `Home`/`End`, `Enter`/`Espacio`).
  - [ ] 20.3 Estados: hoy, seleccionado, fuera de mes, deshabilitado (`min`, `max`, `isDateDisabled`).
  - [ ] 20.4 Nombres de meses y días con `Intl.DateTimeFormat` (`timeZone: "UTC"`).
  - [ ] 20.5 Story con `min`/`max`, `weekStartsOn` y fechas deshabilitadas.
  - _Requisitos: R15_

- [ ] 21. `DateInput`
  - [ ] 21.1 Campo con `Input`, botón de calendario y botón de limpiar; formato `DD/MM/AAAA`.
  - [ ] 21.2 Confirmación del texto en `blur`/`Enter`; si es inválido o fuera de rango, volver al valor vigente.
  - [ ] 21.3 `Popover` con `Calendar` y columna de `presets`.
  - [ ] 21.4 Teclado: `ArrowDown` abre y mueve el foco al calendario; `Escape` cierra y devuelve el foco.
  - [ ] 21.5 Compatibilidad con `FormField` (`id`, `invalid`, `aria-describedby`); modo controlado y no controlado.
  - [ ] 21.6 Stories: básico, con presets, `clearable`, error, dentro de `FormField`, dentro de `Modal`.
  - _Requisitos: R16_

- [ ] 22. `TimePicker`
  - [ ] 22.1 Segmentos (horas, minutos, segundos, AM/PM) con avance automático, flechas con paso y `Backspace`.
  - [ ] 22.2 Emisión de `HH:mm[:ss]` en 24 h solo con segmentos completos.
  - [ ] 22.3 Dropdown con columnas `listbox`, scroll al valor vigente, `dropdownPosition`.
  - [ ] 22.4 `presets`, `closeDropdownOnPresetSelect` y `getTimeRange`.
  - [ ] 22.5 `min`/`max` (opciones deshabilitadas; ajuste al límite al salir del campo).
  - [ ] 22.6 Pegado de `HH:mm` y `HH:mm:ss`; `clearable`; compatibilidad con `FormField`.
  - [ ]* 22.7 Pruebas unitarias de la lógica de segmentos, el ajuste a `min`/`max` y `getTimeRange`.
  - [ ] 22.8 Stories: 24 h, 12 h, con segundos, con presets, posición arriba, `min`/`max`, error, dentro de `FormField`.
  - _Requisitos: R17_

- [ ] 23. `DateTimeInput`
  - [ ] 23.1 Composición de `DateInput` y `TimePicker` con estado interno por partes.
  - [ ] 23.2 Emisión combinada solo con ambas partes; `defaultTime`; reparto de `min`/`max`.
  - [ ] 23.3 Story que documenta el comportamiento de "parte a medias" y el uso de `key` para reiniciar.
  - _Requisitos: R18_

- [ ] 24. Mejoras de formularios acordadas en 18.2
  - [ ] 24.1 Implementar los cambios de `Input`, `Select`, `Textarea`, `Checkbox`, `Radio`, `Switch` acordados.
  - [ ] 24.2 Implementar los cambios de `FormField` acordados.
  - [ ] 24.3 Actualizar `Input.stories.tsx`, `Select.stories.tsx`, `Choice.stories.tsx` y `FormField.stories.tsx`: cada cambio acordado tiene su story, con los estados deshabilitado, error y solo lectura.
  - Detallar las subtareas cuando termine 18.2.
  - _Requisitos: R19.3_

- [ ] 25. Mejoras de `Form` acordadas en 18.2
  - Detallar las subtareas cuando termine 18.2 (`FormActions` pegajoso, `FormSection` colapsable, `FormRow`, si se aprueban).
  - Incluir la actualización de `Form.stories.tsx` con un formulario completo que use los pickers nuevos.
  - _Requisitos: R19.3_

- [ ] 26. Cierre de P5
  - [ ] 26.1 Exportar `Calendar`, `DateInput`, `TimePicker`, `getTimeRange`, `DateTimeInput` y sus tipos en `src/index.ts`.
  - [ ] 26.2 Documentar en `CONSUMING.md` el contrato de valores (cadenas de hora de pared, `""` vacío) y el límite de `DateTimeInput`.
  - [ ] 26.3 `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build:lib`, `pnpm build-storybook`.
  - [ ] 26.4 CHANGELOG: "Agregado" y "Cambiado" según lo acordado en 18.2.

## P6. Tablas y filtros

- [ ] 27. `Table`: estilo
  - [ ] 27.1 `stickyHeader` con sombra de scroll horizontal.
  - [ ] 27.2 `striped` (por defecto `true`).
  - [ ] 27.3 Selección con `Checkbox` de la librería.
  - [ ] 27.4 Indicador de orden con estado neutro en columnas ordenables.
  - [ ] 27.5 Separadores con `--ui-color-divider`.
  - [ ] 27.6 Animación de entrada del panel expandido, sin movimiento con `prefers-reduced-motion`.
  - [ ] 27.7 `Column.minWidth` y `Column.truncate`.
  - _Requisitos: R20.1 a R20.6, R20.8_

- [ ] 28. `Table`: barra de acciones masivas, vacío y textos
  - [ ] 28.1 `bulkActions` con contador y `aria-live="polite"`.
  - [ ] 28.2 `emptyState` por defecto con `EmptyState`.
  - [ ] 28.3 `labels` con defaults en español (D4).
  - _Requisitos: R20.7, R20.9, R20.10_

- [ ] 29. `FilterBar`
  - [ ] 29.1 `layout="panel"` conserva DOM y clases; aplicar chips con icono SVG, control activo resaltado y etiquetas alineadas con `FormField`.
  - [ ] 29.2 `layout="toolbar"` con botón "Filtros (n)" y `Popover`.
  - [ ] 29.3 `labels` en español y `loading`.
  - [ ] 29.4 Actualizar `FilterBar.test.tsx` si los textos cambian.
  - _Requisitos: R21.1 a R21.5_

- [ ] 30. `FilterTable`
  - [ ] 30.1 Pasar `filters` completos a `FilterBar` (D5).
  - [ ] 30.2 `filterLayout`, `labels`, `loading`, conteo "resultado" / "resultados".
  - [ ] 30.3 Stories: actualizar `Table.stories.tsx` y `FilterTable.stories.tsx`, y crear `FilterBar.stories.tsx` (hoy no existe), en ambos `layout`, con carga, vacío, selección con acciones masivas, encabezado fijo, filtros activos y filtro buscable.
  - _Requisitos: R21.6, R21.7_

- [ ] 31. Cierre de P6
  - [ ] 31.1 Buscar en los consumidores (`pf-web-frontend-*`) pruebas o código que dependan de los textos en inglés ("No data to display.", "Select all rows", "Search...", "result").
  - [ ] 31.2 Probar el build local en `pf-web-frontend-internal` (`FichaEditor`, `Catalogos`).
  - [ ] 31.3 `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build:lib`, `pnpm build-storybook`.
  - [ ] 31.4 CHANGELOG: "Agregado", y "Cambiado" para textos en español y `Table loading`.

## P7. Badges

- [ ] 32. Apariencia, tamaño y alias
  - [ ] 32.1 Capturas de las stories actuales como referencia visual.
  - [ ] 32.2 Reestructurar el CSS con variables locales de tono, conservando los porcentajes de mezcla actuales por variante.
  - [ ] 32.3 Agregar `appearance` (`soft | solid | outline`) y `size` (`sm | md`).
  - [ ] 32.4 Agregar variantes `info`, `primary` y `secondary`.
  - [ ] 32.5 Verificar que las cinco variantes actuales en `soft` / `sm` se ven igual que la referencia.
  - [ ] 32.6 Verificar combinaciones con `dot`, `pulse`, `pill`, `truncate`, `expandOnHover`, `fixedWidth` y `tooltip`.
  - _Requisitos: R22.1 a R22.6_

- [ ] 33. Contraste (D10)
  - [ ] 33.1 Medir el contraste de `solid` con `--ui-color-on-primary` para `secure`, `alert`, `warning` y `escort`, en tema oscuro y claro.
  - [ ] 33.2 Reportar los pares que queden por debajo de 4.5:1. No agregar tokens sin aprobación.

- [ ] 34. Stories y cierre de P7
  - [ ] 34.1 Story de matriz variante × apariencia × tamaño.
  - [ ] 34.2 Story "Estados del viaje" con las 12 combinaciones de estado V1 mapeadas a variante + apariencia, y una nota de que la paleta solo distingue 4 tonos (D9).
  - [ ] 34.3 `pnpm lint`, `pnpm typecheck`, `pnpm build:lib`, `pnpm build-storybook`.
  - [ ] 34.4 CHANGELOG: "Agregado".

## Cierre final

- [ ] 35. Verificación de la ola
  - [ ] 35.1 `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build:lib`, `pnpm build-storybook` desde un árbol limpio.
  - [ ] 35.1b Recorrer Storybook completo en tema claro y oscuro: todos los componentes nuevos y modificados tienen sus stories, sin errores en consola ni violaciones nuevas en el panel de accesibilidad.
  - [ ] 35.2 Revisar la lista de verificación del steering (sección 8) por cada componente nuevo o modificado.
  - [ ] 35.3 Confirmar que `src/index.ts` exporta todo lo nuevo y que ningún export existente cambió de nombre.
  - [ ] 35.4 Actualizar `CONSUMING.md` y `README.md` con la lista de componentes nuevos.
  - [ ] 35.5 Resumir al equipo los cambios visibles y las decisiones D8 a D10 que sigan abiertas. La versión y la publicación quedan fuera de este spec.
