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

- [x] 10. Botón de colapso del `Sidebar`
  - [x] 10.1 Reestructurar el encabezado: `headerContent` + botón de icono; renderizar el encabezado si hay `header` o `onToggleCollapse`.
  - [x] 10.2 CSS: `.header` con `space-between`; `.headerContent` con `min-width: 0`; cambiar `.header :global(svg)` a `.headerContent :global(svg)`.
  - [x] 10.3 Estado colapsado: ocultar `headerContent`, centrar el botón.
  - [x] 10.4 Botón: 2.5 rem, icono de panel de `lucide-react` (`PanelLeftClose` expandido, `PanelLeftOpen` contraído) en lugar de rotar 180°, `aria-label`, `aria-expanded` y `title`.
  - [x] 10.5 El `footer` solo se renderiza si hay prop `footer`. Eliminar CSS huérfano (`.collapseBtn`) si queda sin uso.
  - [x] 10.6 Actualizar `Sidebar.stories.tsx`: con `header` y botón, sin `header` y con botón, colapsada. La story `Interactive` actual cambia el `header` a un icono cuando la barra se colapsa (`collapsed ? <Icon/> : <span>`); con D2 el contenido del encabezado se oculta al colapsar, así que ese icono ya no se verá. Ajustar la story y revisar si los consumidores hacen lo mismo (tarea 12.3).
  - _Requisitos: R6_

- [x] 11. `Breadcrumb`
  - [x] 11.1 Crear `src/components/Breadcrumb/` con `items`, `separator`, `as`, `href`, `onClick`, `icon`.
  - [x] 11.2 Semántica `nav` / `ol` y `aria-current="page"` en el último elemento.
  - [x] 11.3 Colapso con `maxItems` y menú de "…" usando `Popover`.
  - [x] 11.4 Truncado de etiquetas con `title`.
  - [x] 11.5 Stories: básico, con iconos, con `as` (enlace simulado de router), colapsado, etiquetas largas.
  - _Requisitos: R7_

- [-] 12. Cierre de P3
  - [x] 12.1 Exportar en `src/index.ts`. _`Breadcrumb` exportado; `Sidebar` ya estaba._
  - [x] 12.2 `pnpm lint`, `pnpm typecheck`, `pnpm build:lib`, `pnpm build-storybook`. _Todos pasan._
  - [ ] 12.3 Probar el build local en `pf-web-frontend-internal` (`NavigationSidebar`) y `pf-web-frontend-analist-panel` (`AppShell`): botón visible, colapsa y expande, sin solapamiento. Sin publicar. _Pendiente: los consumidores usan versiones publicadas (`0.2.0-beta.6` y `beta.8`). Probar el build local exige cambiar sus dependencias, decisión del equipo. Hallazgo: `BrandHeader` de `NavigationSidebar` muestra una "A" al contraer, y con D2 esa marca se oculta._
  - [x] 12.4 CHANGELOG: "Agregado" (`Breadcrumb`); "Cambiado" (botón del `Sidebar` pasa al encabezado y es solo icono; el pie queda para `footer`).

## P4. Estructura de información

- [x] 13. Layout
  - [x] 13.1 `src/components/Layout/` con `Stack`, `Inline`, `Grid` (`gap` 0 a 6, `align`, `justify`, `as`, `wrap`, `columns`, `minItemWidth`).
  - _Requisitos: R8_

- [x] 14. `PageHeader`, `Section`, `DescriptionList`
  - [x] 14.1 `PageHeader` (título, descripción, breadcrumb, acciones, children; apilado en pantallas angostas).
  - [x] 14.2 `Section` con modo colapsable controlado y no controlado.
  - [x] 14.3 `DescriptionList` con `<dl>`, columnas, orientación, `span` y `emptyValue`.
  - _Requisitos: R9, R10, R11_

- [x] 15. `Stat`, `EmptyState`, `Alert`, `Divider`
  - [x] 15.1 `Stat` sobre `Card`, con tendencia accesible (flecha + texto) y `loading` con `Skeleton`.
  - [x] 15.2 `EmptyState`.
  - [x] 15.3 `Alert` con `role` según variante y botón de cierre.
  - [x] 15.4 `Divider` con etiqueta opcional.
  - [x] 15.5 Contrastar `Alert` e iconos en tema oscuro y claro. _Calculado con los tokens: texto ≥ 9.7:1 en ambos temas; iconos ≥ 3:1, con el mínimo en `success` del tema claro (3.03:1). No se midió en navegador._
  - _Requisitos: R12, R13_

- [x] 16. `Tabs`
  - [x] 16.1 `Tabs`, `TabList`, `Tab`, `TabPanel` con contexto, modo controlado y no controlado.
  - [x] 16.2 Roving tabindex; flechas, `Home` y `End`; omitir pestañas deshabilitadas.
  - [x] 16.3 `icon` y `badge` en `Tab`.
  - _Requisitos: R14_

- [x] 17. Stories y cierre de P4
  - [x] 17.1 Un archivo de stories por componente (`Stack`/`Inline`/`Grid` pueden compartir uno), con todas sus variantes y estados, y una "pantalla de ejemplo" (`PageHeader` + `Tabs` + `Section` + `DescriptionList` + `Stat` + `Alert`) que muestre cómo reemplaza el patrón `Card` + `Button`.
  - [x] 17.2 Exportar en `src/index.ts`.
  - [x] 17.3 `pnpm lint`, `pnpm typecheck`, `pnpm build:lib`, `pnpm build-storybook`.
  - [x] 17.4 CHANGELOG: "Agregado".

## P5. Formularios y pickers

- [x] 18. Auditoría de formularios (D7)
  - [x] 18.1 Revisar `Input`, `Select`, `Textarea`, `Checkbox`, `Radio`, `Switch`, `FormField` y `Form` (CSS y TSX): altura, radio, foco, deshabilitado, error, solo lectura, tamaños. _Hecho por lectura de código, sin navegador. Hallazgos en `auditoria-formularios.md`: H1 (`Input` no muestra error, clase `.error` inexistente), H2 (`FormField` no cablea `Select`), H3 (`invalid` llega a checkbox/radio/switch)._
  - [x] 18.2 Escribir `auditoria-formularios.md` con diferencias y mejoras candidatas, y acordar con el equipo cuáles entran. Las tareas 24 y 25 se detallan a partir de ese acuerdo. _Acordado: se corrigen H1 a H3; solo lectura se hace explícito; radios se unifican en 4px; entran todas las candidatas de la sección 3. Detalle en la sección 5 de `auditoria-formularios.md`. Pendiente: confirmar la fecha de la respuesta y que la lista de candidatas esté completa._
  - _Requisitos: R19.1, R19.2_

- [x] 19. Módulo de fechas
  - [x] 19.1 `src/components/DatePicker/dateUtils.ts` con las funciones puras del diseño. Sin `new Date(string)`; solo `Date.UTC` para el día de la semana. _Hecho. `pnpm typecheck` y `pnpm lint` pasan. Comprobación rápida de casos borde (bisiesto, 31 de enero + 1 mes, rejillas lunes y domingo, `DD/MM/AAAA` con separador mixto) sin pruebas formales._
  - [x] 19.2 Pruebas unitarias: años bisiestos, fin de mes, `addMonths` desde el día 31, rejilla con `weekStartsOn` 0 y 1, análisis de texto con `/`, `-` y `.`, fechas inválidas, `min`/`max`. _Hecho en `dateUtils.test.ts`: 48 pruebas pasan con `pnpm test`. Incluye también `today` con reloj simulado._
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
  - Restricciones: todo cambio mantiene la API existente (las funciones nuevas son opt-in y el valor por defecto no cambia), no agrega colores y reutiliza `Input.module.css`, `Choice.module.css` y `FormField.module.css`. Los comentarios nuevos van en español.
  - [ ] 24.1 Correcciones H1 a H3 de `auditoria-formularios.md`:
    - `Input`: el estado `error` aplica la clase de borde de error (`invalid`), para que el borde rojo se vea.
    - `Select` (variante por defecto y `SelectSearchable`): aceptar `id` y `aria-describedby` y pasarlos al control, para que `FormField` los asocie.
    - `FormField`: inyectar `invalid` solo en hijos que lo declaran, o hacer que `Checkbox`, `Radio` y `Switch` lo consuman sin enviarlo al `<input>`.
  - [ ] 24.2 Solo lectura (H4): estilos de `readOnly` en `Input`, `Textarea` y `Select` con los tokens de la decisión 2 (fondo `surface-container-low`, borde `border-subtle`, texto `text`, cursor `default`). El anillo de foco se mantiene.
  - [ ] 24.3 Estados de validación unificados (H5): `state` (`error`, `warning`, `success`) en `Textarea` y `Select`. `invalid` queda como alias deprecado, igual que en `Input`.
  - [ ] 24.4 Radios unificados (decisión 3): la caja de `Checkbox` y `Radio` usa `--ui-radius`. `Switch` mantiene su forma.
  - [ ] 24.5 Tamaños en `Checkbox`, `Radio` y `Switch` (H7): prop `size` opt-in (`sm`, `md`, `lg`), con `md` igual al tamaño actual.
  - [ ] 24.6 Indicador de opcional en `FormField`: prop opt-in que muestra "(opcional)" en campos no requeridos.
  - [ ] 24.7 Orientación horizontal en `FormField`: prop `orientation` (`vertical` por defecto, `horizontal`), con la etiqueta a la izquierda del control.
  - [ ] 24.8 Contador de caracteres en `Textarea`: prop opt-in `showCount`, que usa `maxLength` cuando está definido.
  - [ ] 24.9 `Input` con `clearable`: botón opt-in para borrar el valor, con callback `onClear`. Usa `endAdornment`, sin cambiar la API existente.
  - [ ] 24.10 `Input` con mostrar y ocultar contraseña: prop opt-in para `type="password"`, con botón que alterna el tipo.
  - [ ] 24.11 Stories de `Input.stories.tsx`, `Select.stories.tsx`, `Choice.stories.tsx` y `FormField.stories.tsx`. Cada cambio tiene su story, con los estados deshabilitado, error y solo lectura.
  - [ ] 24.12 Validar con `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build-storybook`.
  - _Requisitos: R19.3_

- [ ] 25. Mejoras de `Form` acordadas en 18.2
  - Restricciones: igual que la tarea 24.
  - [ ] 25.1 `FormActions` pegajoso: prop opt-in `sticky` que fija la barra al fondo del área visible.
  - [ ] 25.2 `FormSection` colapsable: prop opt-in `collapsible`, con `defaultOpen` (no controlado) y `open` con `onOpenChange` (controlado). La leyenda funciona como botón y expone `aria-expanded`.
  - [ ] 25.3 `FormRow`: sin cambios funcionales. Reemplazar el `cx` local de `Form.tsx` por el de `Input/utils.ts` (H8).
  - [ ] 25.4 Stories de `Form.stories.tsx` para `FormActions` pegajoso, `FormSection` colapsable y `FormRow`.
  - [ ] 25.5 Formulario completo en `Form.stories.tsx` que use los pickers nuevos. Depende de las tareas 20 a 23: no empezar antes de que existan `DateInput` y `TimePicker`.
  - [ ] 25.6 Validar con `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build-storybook`.
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
