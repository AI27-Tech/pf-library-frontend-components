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

- [x] 20. `Calendar` _Cerrada. Revisión visual en Storybook confirmada por el equipo en tema claro y oscuro._
  - [x] 20.1 Vistas de días, meses y años; encabezado con navegación. _`Calendar.tsx`. El título cambia de vista y los botones anterior y siguiente avanzan según la vista (mes, año o bloque de 12 años)._
  - [x] 20.2 Grid ARIA con roving tabindex; teclado completo (flechas, `PageUp`/`PageDown`, `Shift` + estas, `Home`/`End`, `Enter`/`Espacio`). _Teclado implementado en la vista de días. Decisión: `Shift` + flechas avanza o retrocede un año. En meses y años se usan botones nativos (Tab y Enter)._
  - [x] 20.3 Estados: hoy, seleccionado, fuera de mes, deshabilitado (`min`, `max`, `isDateDisabled`). _Los días deshabilitados usan `aria-disabled`, para que sigan siendo alcanzables con el teclado. Un mes o año fuera de rango se deshabilita por completo. Días de otros meses: texto atenuado y borde punteado, elegibles (decisión de revisión visual)._
  - [x] 20.4 Nombres de meses y días con `Intl.DateTimeFormat` (`timeZone: "UTC"`). _Fechas construidas con `Date.UTC`._
  - [x] 20.5 Story con `min`/`max`, `weekStartsOn` y fechas deshabilitadas. _`Calendar.stories.tsx`, con 5 stories._
  - _Verificado con una prueba temporal de 9 casos (teclado, selección, rangos, navegación entre vistas, lunes y domingo como inicio), que luego se eliminó. Pendiente: revisión visual en Storybook y tema oscuro/claro._
  - _Requisitos: R15_

- [x] 21. `DateInput` _Cerrada. Revisión visual confirmada por el equipo. Cambios posteriores al cierre: `displayFormat="AAAA Mmm DD"` (solo visual, en español); foco de `ArrowDown` al calendario (`Popover` avisa con `onPositioned`); al elegir fecha el foco vuelve al botón de calendario; con `clearable`, elegir la fecha seleccionada la borra; presets como botones._
  - [x] 21.1 Campo con `Input`, botón de calendario y botón de limpiar; formato `DD/MM/AAAA`. _`DateInput.tsx`, con `DateInput.module.css`._
  - [x] 21.2 Confirmación del texto en `blur`/`Enter`; si es inválido o fuera de rango, volver al valor vigente. _Texto vacío: emite `""` solo con `clearable`._
  - [x] 21.3 `Popover` con `Calendar` y columna de `presets`. _Presets con valor fijo o función._
  - [x] 21.4 Teclado: `ArrowDown` abre y mueve el foco al calendario; `Escape` cierra y devuelve el foco. _`Tab` cierra. Si el clic es fuera del panel, el foco no vuelve al campo._
  - [x] 21.5 Compatibilidad con `FormField` (`id`, `invalid`, `aria-describedby`); modo controlado y no controlado. _El color de error del campo depende de la corrección H1 (24.1). Hasta entonces, `invalid` no pinta el borde en `Input`._
  - [x] 21.6 Stories: básico, con presets, `clearable`, error, dentro de `FormField`, dentro de `Modal`. _Incluye también `WithRange`, `Sizes`, `Disabled` y `Controlled`._
  - _Verificado con una prueba temporal de 13 casos, eliminada después. Revisión visual confirmada por el equipo._
  - _Corrección tras revisión: el calendario se salía de la pantalla en tamaños md y lg cuando el campo estaba cerca del borde inferior. Causa: `Popover` no limitaba `top` si no cabía ni arriba ni abajo. Ahora se mantiene dentro del viewport. Medido en 1280×800, 1024×640 y 800×600 con los tres tamaños. Limitación: en viewports muy bajos el panel puede tapar el campo. Suite completa: 89 pruebas pasan._
  - _Requisitos: R16_

- [x] 22. `TimePicker` _Cerrada. Revisión visual confirmada por el equipo. Queda pendiente solo la 22.7, opcional._
  - [x] 22.1 Segmentos (horas, minutos, segundos, AM/PM) con avance automático, flechas con paso y `Backspace`. _`TimePicker.tsx` y `timeUtils.ts`. Un dígito que no puede ser decenas completa el valor (`3` → `03`). Con dos dígitos válidos avanza._
  - [x] 22.2 Emisión de `HH:mm[:ss]` en 24 h solo con segmentos completos. _En 12 h se convierte a 24 h. Un segmento a medias no borra el valor emitido; uno vacío sí emite `""`._
  - [x] 22.3 Dropdown con columnas `listbox`, scroll al valor vigente, `dropdownPosition`. _Se abre al enfocar un segmento. Las opciones usan `mousedown` cancelado para no quitar el foco del campo._
  - [x] 22.4 `presets`, `closeDropdownOnPresetSelect` y `getTimeRange`. _Decisión: `closeDropdownOnPresetSelect` vale `true` por defecto. `getTimeRange` acepta intervalo `HH:mm` e incluye el extremo._
  - [x] 22.5 `min`/`max` (opciones deshabilitadas; ajuste al límite al salir del campo). _Una opción se deshabilita si toda su hora queda fuera del rango. Al salir con hora incompleta, el campo vuelve al valor vigente._
  - [x] 22.6 Pegado de `HH:mm` y `HH:mm:ss`; `clearable`; compatibilidad con `FormField`. _El `id` y `aria-describedby` van al primer segmento._
  - [ ]* 22.7 Pruebas unitarias de la lógica de segmentos, el ajuste a `min`/`max` y `getTimeRange`. _Opcional, pendiente. Se verificó con una prueba temporal de 17 casos que luego se eliminó._
  - [x] 22.8 Stories: 24 h, 12 h, con segundos, con presets, posición arriba, `min`/`max`, error, dentro de `FormField`. _`TimePicker.stories.tsx`, con 15 stories._
  - _Corrección tras revisión: los segmentos recortaban el placeholder `HH`/`MM` porque su ancho era `2ch`. Ahora son `2.4em` (AM/PM `3.4em`). Verificado en Storybook con captura. Pendiente: el espacio entre segmentos puede ser algo amplio; se puede ajustar si se pide._
  - _Cierre: revisión visual confirmada por el equipo._
  - _Requisitos: R17_

- [x] 23. `DateTimeInput` _Cerrada. Revisión visual confirmada por el equipo._
  - [x] 23.1 Composición de `DateInput` y `TimePicker` con estado interno por partes. _`DateTimeInput.tsx`. La hora tiene ancho natural; la fecha ocupa el resto de la fila._
  - [x] 23.2 Emisión combinada solo con ambas partes; `defaultTime`; reparto de `min`/`max`. _Un valor externo no vacío reemplaza las dos partes; uno vacío no borra una parte a medias. La hora se restringe solo el día del límite._
  - [x] 23.3 Story que documenta el comportamiento de "parte a medias" y el uso de `key` para reiniciar. _`ResetWithKey` y `PartialState`, más 9 stories en total._
  - _Verificado con una prueba temporal de 9 casos, eliminada después. Suite completa: 89 pruebas pasan. Pendiente: revisión visual en Storybook._
  - _Requisitos: R18_

- [x] 24. Mejoras de formularios acordadas en 18.2 _Cerrada. Revisión visual confirmada por el equipo._
  - Restricciones: todo cambio mantiene la API existente (las funciones nuevas son opt-in y el valor por defecto no cambia), no agrega colores y reutiliza `Input.module.css`, `Choice.module.css` y `FormField.module.css`. Los comentarios nuevos van en español.
  - [x] 24.1 Correcciones H1 a H3 de `auditoria-formularios.md`: _H1: `Input` con `state="error"` aplica la clase `invalid`. H2: `Select` (y `SelectSearchable`) acepta `id` y `aria-describedby`. H3: `Checkbox`, `Radio` y `Switch` consumen `invalid` y lo convierten en `aria-invalid`, sin enviarlo al DOM._
  - [x] 24.2 Solo lectura (H4): _`readOnly` en `Input`, `Textarea` y `Select` (la lista no abre). Tokens de la decisión 2. El foco sigue visible._
  - [x] 24.3 Estados de validación unificados (H5): _`state` en `Textarea` y `Select`. `invalid` sigue como alias._
  - [x] 24.4 Radios unificados (decisión 3): _la caja del `Checkbox` usa `--ui-radius`. `Radio` sigue circular y `Switch` sigue como píldora._
  - [x] 24.5 Tamaños en `Checkbox`, `Radio` y `Switch` (H7): _prop `size` (`sm`, `md`, `lg`). Los valores de `sm` y `lg` del interruptor son estimados, no medidos en navegador._
  - [x] 24.6 Indicador de opcional en `FormField`: _prop `showOptional`, muestra "(opcional)" en campos no requeridos._
  - [x] 24.7 Orientación horizontal en `FormField`: _prop `orientation` (`vertical` por defecto, `horizontal` con etiqueta a la izquierda)._
  - [x] 24.8 Contador de caracteres en `Textarea`: _prop `showCount`. Muestra `actual/máximo` con `maxLength`, o solo el total sin él._
  - [x] 24.9 `Input` con `clearable`: _botón "Borrar" solo cuando hay texto y el campo es editable. Con `onClear`. El campo emite `""` en modo controlado y no controlado._
  - [x] 24.10 `Input` con mostrar y ocultar contraseña: _prop `passwordToggle` en `type="password"`, con `aria-pressed`._
  - [x] 24.11 Stories: _`Input` (estados, solo lectura, `clearable`, contraseña), `Select` (estado success, solo lectura), `Choice` (tamaños e inválido), `FormField` (opcional, horizontal, contador)._
  - [x] 24.12 Validar con `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build-storybook`. _Lint, typecheck, 89 pruebas y `pnpm build-storybook` pasan. Revisión visual confirmada por el equipo._
  - _Requisitos: R19.3_

- [x] 25. Mejoras de `Form` acordadas en 18.2 _Cerrada. Revisión visual confirmada por el equipo._
  - Restricciones: igual que la tarea 24.
  - [x] 25.1 `FormActions` pegajoso: prop opt-in `sticky` que fija la barra al fondo del área visible. _Clase `sticky` en `Form.module.css`._
  - [x] 25.2 `FormSection` colapsable: prop opt-in `collapsible`, con `defaultOpen` (no controlado) y `open` con `onOpenChange` (controlado). La leyenda funciona como botón y expone `aria-expanded`. _El contenido va en un `div` con `hidden` y `aria-controls`._
  - [x] 25.3 `FormRow`: sin cambios funcionales. Reemplazar el `cx` local de `Form.tsx` por el de `Input/utils.ts` (H8). _Hecho._
  - [x] 25.4 Stories de `Form.stories.tsx` para `FormActions` pegajoso, `FormSection` colapsable y `FormRow`. _`StickyActions`, `CollapsibleSections` y `Rows`._
  - [x] 25.5 Formulario completo en `Form.stories.tsx` que use los pickers nuevos. _`FullFormWithPickers` usa `DateInput` y `TimePicker`. Los pickers de la tarea 20 a 22 ya existen; la 23 (`DateTimeInput`) no se usa aquí._
  - [x] 25.6 Validar con `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build-storybook`. _Lint, typecheck, 89 pruebas y `pnpm build-storybook` pasan. Verificación temporal de 6 casos de `FormSection` y `FormActions`, eliminada después. Ajustes tras revisión visual: alturas de `DateInput`, `TimePicker` e `Input` unificadas a 36 px (botones de acción de 18 px con área de clic ampliada); `TimePicker` ocupa el ancho de su columna; barra pegajosa con borde a borde en la story `StickyActions`. Pendiente: revisión visual final por el equipo._
  - _Requisitos: R19.3_

- [x] 26. Cierre de P5
  - [x] 26.1 Exportar `Calendar`, `DateInput`, `TimePicker`, `getTimeRange`, `DateTimeInput` y sus tipos en `src/index.ts`. _Barrel en `components/DatePicker/index.ts`._
  - [x] 26.2 Documentar el contrato de valores (cadenas de hora de pared, `""` vacío) y el límite de `DateTimeInput`. _Se escribió en la sección "Fechas y horas: contrato de valores" del README. `CONSUMING.md` solo apunta al README desde una consolidación anterior, así que no se duplicó allí._
  - [x] 26.3 `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build:lib`, `pnpm build-storybook`. _Todo pasa: 89 pruebas, build de librería y build de Storybook._
  - [x] 26.4 CHANGELOG: "Agregado" y "Cambiado" según lo acordado en 18.2. _Entradas en `[Unreleased]`._
  - [ ] 26.4 CHANGELOG: "Agregado" y "Cambiado" según lo acordado en 18.2.

## P6. Tablas y filtros

- [x] 27. `Table`: estilo
  - [x] 27.1 `stickyHeader` con sombra de scroll horizontal. _Sombra solo con CSS (`background-attachment: local/scroll`), sin listener de scroll; el diseño lo proponía con JS. Pendiente revisión visual en Storybook._
  - [x] 27.2 `striped` (por defecto `true`).
  - [x] 27.3 Selección con `Checkbox` de la librería.
  - [x] 27.4 Indicador de orden con estado neutro en columnas ordenables.
  - [x] 27.5 Separadores con `--ui-color-divider`.
  - [x] 27.6 Animación de entrada del panel expandido, sin movimiento con `prefers-reduced-motion`.
  - [x] 27.7 `Column.minWidth` y `Column.truncate`.
  - _Requisitos: R20.1 a R20.6, R20.8_

- [x] 28. `Table`: barra de acciones masivas, vacío y textos
  - [x] 28.1 `bulkActions` con contador y `aria-live="polite"`. _El contador dice "N seleccionadas" (femenino, como en el diseño), no "N seleccionados" como dice R20.7. Confirmar cuál se quiere._
  - [x] 28.2 `emptyState` por defecto con `EmptyState`.
  - [x] 28.3 `labels` con defaults en español (D4). `TableLabels` exportado. `loading` se usa como `aria-label` de la tabla mientras carga, si no se pasa uno.
  - _Requisitos: R20.7, R20.9, R20.10_

- [x] 29. `FilterBar`
  - [x] 29.1 `layout="panel"` conserva DOM y clases; aplicar chips con icono SVG, control activo resaltado y etiquetas alineadas con `FormField`. _Se agregó `data-active`-equivalente como clase `filterSelectActive` en el control. Las etiquetas usan el tamaño y peso de `FormField`. Sin `htmlFor`, para no cambiar el nombre accesible de los selects._
  - [x] 29.2 `layout="toolbar"` con botón "Filtros (n)" y `Popover`. _Incluye búsqueda y selector de vista. Los chips quedan debajo de la barra._
  - [x] 29.3 `labels` en español y `loading`.
  - [x] 29.4 Actualizar `FilterBar.test.tsx` si los textos cambian. _Los textos existentes siguen igual, así que el archivo no cambió. Se verificó con una prueba temporal de `toolbar` y `loading` que se eliminó._
  - _Requisitos: R21.1 a R21.5_

- [x] 30. `FilterTable`
  - [x] 30.1 Pasar `filters` completos a `FilterBar` (D5). _Ahora se pasan tal cual, con el fallback `label || placeholder || key`. Antes se perdían `variant`, `searchPlaceholder`, `noResultsText` e `icon`._
  - [x] 30.2 `filterLayout`, `labels`, `loading`, conteo "resultado" / "resultados". _`labels` es `FilterTableLabels`. Los textos de `Table` van en `tableLabels`, porque `labels` de `TableProps` ya tiene otro tipo._
  - [x] 30.3 Stories: actualizar `Table.stories.tsx` y `FilterTable.stories.tsx`, y crear `FilterBar.stories.tsx` (hoy no existe), en ambos `layout`, con carga, vacío, selección con acciones masivas, encabezado fijo, filtros activos y filtro buscable. _Las stories pendientes de 27 y 28 también quedan cubiertas aquí. Pendiente revisión visual en Storybook._
  - _Requisitos: R21.6, R21.7_

- [x] 31. Cierre de P6
  - [x] 31.1 Buscar en los consumidores (`pf-web-frontend-*`) pruebas o código que dependan de los textos en inglés ("No data to display.", "Select all rows", "Search...", "result"). _Búsqueda en `src` y `tests` de los tres consumidores: ningún texto cambiado aparece. `BandejaViajes.test.tsx` busca el botón con `/limpiar|clear/i`, y sigue encontrando "Limpiar todos los filtros"._
  - [x] 31.2 Probar el build local en `pf-web-frontend-internal` (`FichaEditor`, `Catalogos`). _Hecho sin tocar el consumidor: un config temporal (ya borrado) apunta `@ai27-tech/ui` al `dist` local. Build de Vite sin errores; el bundle tiene el texto nuevo y no el viejo. `tests/viajes/FichaEditor.test.tsx` y `tests/catalogos/Catalogos.test.tsx`: 13 de 13 pasan, igual que con la versión publicada. No corrí `tsc` del consumidor porque usa los tipos publicados; tampoco revisión visual._
  - [x] 31.3 `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build:lib`, `pnpm build-storybook`. _Todos pasan: 89 pruebas, build de la librería y build de Storybook sin errores._
  - [x] 31.4 CHANGELOG: "Agregado", y "Cambiado" para textos en español y `Table loading`.

## P7. Badges

- [x] 32. Apariencia, tamaño y alias
  - [x] 32.1 Capturas de las stories actuales como referencia visual. _Revisión visual hecha por el usuario en Storybook._
  - [x] 32.2 Reestructurar el CSS con variables locales de tono, conservando los porcentajes de mezcla actuales por variante.
  - [x] 32.3 Agregar `appearance` (`soft | solid | outline`) y `size` (`sm | md`).
  - [x] 32.4 Agregar variantes `info`, `primary` y `secondary`. _`info` es alias de `escort`, como en el diseño. `secondary` usa 60 % de mezcla en `soft`; el diseño no fijaba el porcentaje._
  - [x] 32.5 Verificar que las cinco variantes actuales en `soft` / `sm` se ven igual que la referencia. _Revisión visual del usuario, y lectura del CSS: los valores de `soft`/`sm` no cambian._
  - [x] 32.6 Verificar combinaciones con `dot`, `pulse`, `pill`, `truncate`, `expandOnHover`, `fixedWidth` y `tooltip`. _Story `Combinaciones` y revisión visual del usuario._
  - _Requisitos: R22.1 a R22.6_

- [x] 33. Contraste (D10)
  - [x] 33.1 Medir el contraste de `solid` con `--ui-color-on-primary` para `secure`, `alert`, `warning` y `escort`, en tema oscuro y claro. _Calculado con la fórmula WCAG sobre los valores hex de `tokens.css`, no sobre el render. Oscuro: secure 12,4:1; alert 10,0:1; warning 13,1:1; escort 7,1:1. Claro: secure 3,49:1; alert 5,43:1; warning 3,64:1; escort 4,77:1._
  - [x] 33.2 Reportar los pares que queden por debajo de 4.5:1. No agregar tokens sin aprobación. _Quedan por debajo de 4,5:1 en tema claro: `secure` (3,49:1) y `warning` (3,64:1). Decisión pendiente (D10): tokens `on-success` / `on-warning`, o aceptar el contraste._

- [x] 34. Stories y cierre de P7
  - [x] 34.1 Story de matriz variante × apariencia × tamaño. _`Matriz`._
  - [-] 34.2 Story "Estados del viaje" con las 12 combinaciones de estado V1 mapeadas a variante + apariencia, y una nota de que la paleta solo distingue 4 tonos (D9). _Eliminada por decisión del usuario: la librería no define cómo se usan los badges. Cada consumidor mapea sus estados. Las 4 tonos de D9 se mantienen como nota de diseño._
  - [x] 34.3 `pnpm lint`, `pnpm typecheck`, `pnpm build:lib`, `pnpm build-storybook`. _Pasan. Las 89 pruebas también._
  - [x] 34.4 CHANGELOG: "Agregado".

## Ampliación (2026-11-12): P10, P8 y P9

Orden de ejecución: **P10, luego P8, luego P9**, y al final la tarea 35. Decisiones D11 a D17 confirmadas el 2026-11-12 (siguen las recomendaciones); D18 sin cambio. Detalle en `requirements.md`.

## P10. Iconos con Lucide

- [ ] 36. Preparación
  - [x] 36.1 Verificar contra `node_modules/lucide-react` que existen los nombres del mapeo de `design.md` (`ChevronsUpDown`, `CalendarDays`, `EyeOff`, `Minus`, `Send`, `Paperclip`, etc.). Ajustar el mapeo si algún nombre cambió en la versión 1.47.
  - [ ] 36.2 Guardar capturas de referencia en Storybook (tema claro y oscuro) de los componentes afectados.
  - [x] 36.3 Anotar el tamaño actual de `dist/ui-library.js` (142 KB al 2026-11-12).
  - _Requisitos: R37, R38_

- [x] 37. Reemplazar iconos en componentes
  - [x] 37.1 `Calendar.tsx`, `DateInput.tsx`, `TimePicker.tsx`.
  - [x] 37.2 `Input.tsx`, `Select.tsx`, `SelectSearchable.tsx`, `Checkbox.tsx` (`strokeWidth={3}`).
  - [x] 37.3 `FilterBar.tsx`, `FilterTable.tsx`, `Form.tsx`.
  - [x] 37.4 `Table.tsx` (orden y chevron de fila) y `Pagination.tsx`.
  - [x] 37.5 `Modal.tsx`, `Navbar.tsx`, `Toast.tsx` (mismos iconos que `Alert`).
  - [x] 37.6 `MessagePanel/shared.tsx` (`Minus`, `X`, `ChevronUp`, `Send`). Se completa su reestructura en P8.
  - [x] 37.7 Eliminar las funciones de icono locales que queden sin uso.
  - _Requisitos: R37.1 a R37.6_

- [x] 38. Reemplazar iconos en stories
  - [x] 38.1 `Button.stories.tsx`, `Card.stories.tsx`, `Navbar.stories.tsx`, `Input.stories.tsx`.
  - [x] 38.2 Revisar el resto de stories y `.storybook/` por `<svg`.
  - _Requisitos: R37.1_

- [ ] 39. Evitar regresiones y verificar
  - [x] 39.1 Agregar la regla `no-restricted-syntax` de `design.md` a `eslint.config.js` para `src/**` y `.storybook/**`.
  - [x] 39.2 Buscar `<svg`, `<path`, `<circle`, `<rect`, `<polyline`, `<line` y `d="M` en `src/`, `.storybook/`, `README.md` y `CONSUMING.md`; el resultado debe estar vacío.
  - [x] 39.3 `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build:lib`, `pnpm build-storybook`.
  - [x] 39.4 Comparar el tamaño de `dist/ui-library.js` con 36.3 y confirmar que `dist` no importa `lucide-react` como externo.
  - [ ] 39.5 Comparar las capturas de 36.2 en tema claro y oscuro. Revisar con cuidado `Table` (orden) y `Toast`.
  - _Requisitos: R38_

- [x] 40. Documentación de P10
  - [x] 40.1 `CONSUMING.md`: la librería incluye Lucide; los portales no necesitan instalarlo para usar `@ai27-tech/ui`.
  - [x] 40.2 CHANGELOG `[Unreleased]`: "Cambiado" (iconos de Lucide, orden de `Table`) y "Agregado" (regla de lint).

## P8. MessagePanel

- [x] 41. Contrato y decisiones
  - [x] 41.1 En `pf-pkg-contracts`: `git fetch --tags` y confirmar el último tag. Si es posterior a `v0.1.0-tracer.40`, repetir la comparación de `Mensaje`, `Conversacion`, `EstadoConversacion` y `EnviarMensajeEntrada` con `v0.1.0-tracer.9` y ajustar `design.md`.
  - [x] 41.2 Leer siempre del tag (`git show <tag>:contracts/openapi/mensajeria.yaml`), no del árbol de trabajo, que está en una rama de feature.
  - [x] 41.3 D11 a D17 confirmadas (2026-11-12).
  - [x] 41.4 Contrastar el diseño de P8 con las reglas de conversación del `Addendum` (`docs/addenda/addendum-conversacion-de-negocio-y-bandeja-compartida.md`, §4 a §8) y con DEC-107, DEC-117, DEC-118 y DEC-127 en el repo de contexto. Hasta ahora se verificó contra el texto del contrato y contra `afordancias.ts` del portal interno, no contra esos documentos.
  - _Requisitos: R25.1, R25.4_

- [x] 42. Tipos, textos y alineación
  - [x] 42.1 Renombrar `Mensaje.secuenciaMensaje` a `secuencia` en `types.ts`, `MessagePanel.test.tsx`, `MessagePanel.stories.tsx` y en cualquier otro uso (D12).
  - [x] 42.2 Cambiar los comentarios que citan `v0.1.0-tracer.9`.
  - [x] 42.3 Crear `labels.ts` con los textos por defecto en español de `design.md` y que cada componente acepte `labels` (D13).
  - [x] 42.4 Agregar a `CONSUMING.md` la tabla campo del contrato → prop de la librería, y la tabla de reglas de la conversación (quién reclama, responde, libera, transfiere y marca atendida; solo lectura de `supervisor`/`coordinador`; errores `409` y `403`), con el aviso de que la librería no las aplica (R26.7).
  - [x] 42.5 Agregar un test con un `Mensaje` completo basado en el ejemplo del contrato.
  - _Requisitos: R25_

- [x] 43. Abrir y cerrar el panel
  - [x] 43.1 Reestructurar `MessagePanel` sin botones anidados: `headerMain` (botón) y `headerActions` (botones hermanos). Quitar el `stopPropagation` de `IconButton` si deja de ser necesario.
  - [x] 43.2 Estado `open` / `defaultOpen` / `onOpenChange`, conservando `onToggle`.
  - [x] 43.3 Cuerpo colapsable con `grid-template-rows`, `visibility` y `keepMounted` (D14); sin movimiento con `prefers-reduced-motion`.
  - [x] 43.4 Foco: al abrir por acción del usuario, al primer `textarea` habilitado; al minimizar con el foco dentro, al botón del encabezado.
  - [x] 43.5 `aria-expanded`, `aria-controls`, `aria-labelledby`.
  - [x] 43.6 Slots `toolbar` y `notice` con estilo propio.
  - [x] 43.7 Altura del cuerpo `min(28rem, 70dvh)`.
  - _Requisitos: R26.2, R30_

- [x] 44. `ConversationStatus`
  - [x] 44.1 Crear el componente con `Badge` de estado, responsable, atendida y `escrituraHasta`.
  - [x] 44.2 Stories: abierta, solo lectura, cerrada, reclamo propio, reclamo ajeno, en el pool, atendida, y "Vista del cliente" (sin datos de reclamo).
  - _Requisitos: R26.1, R26.3, R26.4_

- [x] 45. Mensajes
  - [x] 45.1 `groupMessages.ts` (función pura): agrupación por día y por autor consecutivo con menos de 5 minutos.
  - [x]* 45.2 Pruebas de `groupMessages` (cambio de día, de autor, límite de 5 minutos).
  - [x] 45.3 `MessageBubble`: `deliveryStatus`, `deliveryError`, `onRetry` (el botón solo si existe), `groupPosition`, `pre-wrap` y ruptura de palabras largas.
  - [x] 45.4 `MessageThread` con divisores de día (Hoy, Ayer, fecha larga `es-MX`), `isOwn`, `renderAudit`, `renderAttachments`, orden por `secuencia`, descarte de ids repetidos y `pendientes` (`MensajePendiente`).
  - [x]* 45.4b Pruebas del orden por `secuencia` con `creadoEn` desordenado, ids repetidos y un pendiente que se confirma.
  - [x] 45.5 `MessageAttachment` (D17) con estados `ready`, `uploading` y `error`.
  - [x] 45.6 Estilo discreto para `slotAuditoria`.
  - _Requisitos: R27_

- [x] 46. `MessageList`
  - [x] 46.1 Detección `isNearBottom` y auto-desplazamiento condicionado.
  - [x] 46.2 Botón flotante "N mensajes nuevos".
  - [x] 46.3 Conservar la posición al cargar mensajes anteriores; `loadingPrevious`.
  - [x] 46.4 `loading` con esqueletos de burbujas y `emptyState`.
  - [x] 46.5 Divisor "Mensajes nuevos" con `ultimaSecuenciaLeida`.
  - [x] 46.6 `role="log"`, `aria-live="polite"`, `aria-relevant="additions"`.
  - [ ]* 46.7 Prueba de `isNearBottom`.
  - _Requisitos: R28_

- [x] 47. `MessageComposer`
  - [x] 47.1 Guardia de IME (`isComposing`).
  - [x] 47.2 `sending` con `Spinner` en el botón y sin doble envío.
  - [x] 47.3 `onAttach` con botón `Paperclip`.
  - [x] 47.4 `maxLength` con contador visible desde el 80 %.
  - [x] 47.5 `composerRef` y `autoFocus`.
  - _Requisitos: R29_

- [x] 48. Muelle y barra
  - [x] 48.1 Token `--ui-z-dock: 900` en `tokens.css` y uso en `.dock` (D15).
  - [x] 48.2 `dockReducer` (función pura) y `useMessageDock` (D16) con capacidad por ancho de ventana.
  - [x]* 48.3 Pruebas de `dockReducer` (abrir, cerrar, alternar, desbordar, capacidad 1).
  - [x] 48.4 `MessageDock` con `overflowCount`, `overflow` y chip "+N" con `Popover`.
  - [x] 48.5 Móvil (≤ 560 px): un panel a todo el ancho.
  - [x] 48.6 `MessageDockBar` sin botones anidados, con `lastMessageAt`, `badge` opcional y nombre accesible propio.
  - [x] 48.7 `DockConversation.lastMessageAt` y `badge` en el tipo.
  - _Requisitos: R31_

- [ ] 49. Estilo
  - [x] 49.1 Reemplazar los valores sueltos de `MessagePanel.module.css` por tokens o variables locales.
  - [x] 49.2 Burbujas agrupadas, radios por posición, alias y hora con la escala de tipografía de tokens, scrollbar fino.
  - [x] 49.3 Foco visible en encabezado, acciones, lista, compositor y envío.
  - [ ] 49.4 Revisar tema claro y oscuro.
  - _Requisitos: R32_

- [ ] 50. Stories, pruebas y cierre de P8
  - [x] 50.1 Stories (R24): panel abierto y minimizado, controlado y no controlado, con `toolbar` y `notice`, solo lectura, cerrada, cargando, vacío, mensajes fallidos y enviando, con adjuntos, muelle con 1, 3 y 6 conversaciones y desborde, barra con no leídos, vista angosta.
  - [x] 50.2 Buscar en `pf-web-frontend-internal`, `pf-web-frontend-client` y `pf-web-frontend-analist-panel` el uso de `MessagePanel`, de las props obsoletas `author`/`time` y de los textos en inglés (`Minimize`, `Messaging`, `Write a message`). Reportar el resultado.
  - [x] 50.3 Actualizar `MessagePanel.test.tsx` (renombre, textos, estructura del encabezado).
  - [x]* 50.4 Pruebas de comportamiento: abrir/cerrar sin doble alternancia, ausencia de botones anidados, foco al abrir y al minimizar, IME, `keepMounted`.
  - [ ] 50.5 Probar el build local en `PanelConversacion` de `pf-web-frontend-internal`, sin publicar: reemplazar el armado manual de banner, acciones y "cargar anteriores" por `ConversationStatus`, `toolbar`, `notice` y `loadingPrevious`, y confirmar que el flujo (reclamar, enviar, devolver) sigue funcionando.
  - [x] 50.6 Exportar `ConversationStatus`, `MessageThread`, `MessageAttachment`, `useMessageDock` y los tipos nuevos en `src/index.ts`.
  - [x] 50.7 `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build:lib`, `pnpm build-storybook`.
  - [x] 50.8 CHANGELOG: "Cambiado" (`secuencia`, textos en español, muelle bajo `Modal`, contenido montado al minimizar, encabezado sin botones anidados, auto-scroll condicionado), "Agregado" (componentes nuevos), "Obsoleto" (`author`, `time`).

## P9. Timeline

- [x] 51. Núcleo
  - [x] 51.1 `src/components/Timeline/` con tipos, `<ol>`/`<li>`, estado, texto para lectores y `<time>`.
  - [x] 51.2 CSS vertical con conector posicionado respecto del `li`.
  - [x] 51.3 CSS horizontal con reparto uniforme, `minItemWidth`, scroll, `scroll-snap` y atenuado de bordes.
  - [x] 51.4 Variante `alternate` en ambas orientaciones.
  - _Requisitos: R33, R34.1 a R34.3, R34.5_

- [x] 52. Responsividad
  - [x] 52.1 `ResizeObserver` sobre el contenedor: ancho y desbordamiento (con guardia si no existe).
  - [x] 52.2 `stackBelow`: orientación efectiva.
  - [x] 52.3 Centrar el punto `current` cuando hay scroll.
  - [x] 52.4 `@container (min-width: 40rem)` para la alternada vertical.
  - _Requisitos: R34.2 a R34.4_

- [x] 53. Estados y estilo
  - [x] 53.1 Marcadores y conectores por estado con tokens existentes.
  - [x] 53.2 Iconos por defecto de Lucide (`Check`, `X`, `TriangleAlert`) e `icon` personalizado.
  - [x] 53.3 Tamaños `sm | md | lg`.
  - [x] 53.4 Anillo con pulso en `current`, sin movimiento con `prefers-reduced-motion`.
  - [x] 53.5 `onItemClick` con botón, hover y foco visible.
  - _Requisitos: R33.5, R35_

- [ ] 54. N puntos y casos límite
  - [x] 54.1 `maxVisible` con "Mostrar n más" / "Mostrar menos" (`aria-expanded`).
  - [x] 54.2 `reverse` sin alterar los datos.
  - [x] 54.3 `loading` con `Skeleton` y `emptyState`.
  - [ ] 54.4 Verificar a mano 0, 1, 2, 3, 12 y 100 puntos en ambas orientaciones, y un título de 200 caracteres sin espacios.
  - _Requisitos: R34.6 a R34.9, R35.6_

- [x] 55. Stories (R24)
  - [x] 55.1 Vertical, horizontal, alternada (ambas), 1, 3, 12 y 100 puntos, `maxVisible`, `reverse`, `stackBelow`, cargando, vacío, tamaños, estados, iconos propios, `onItemClick`, ancho angosto.
  - [x] 55.2 Ejemplo "Historial de estados del viaje" con los estados de `viaje.estados.yaml`.
  - _Requisitos: R36.1_

- [ ] 56. Cierre de P9
  - [x] 56.1 Exportar `Timeline` y sus tipos en `src/index.ts`.
  - [ ] 56.2 Revisión con el teclado (Tab sobre puntos clickables) y con el panel de accesibilidad.
  - [x] 56.3 `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build:lib`, `pnpm build-storybook`.
  - [x] 56.4 `CONSUMING.md` y CHANGELOG "Agregado".
  - _Requisitos: R36.2, R36.3_

## Cierre final

- [ ] 35. Verificación de la ola (ejecutar al terminar P8, P9 y P10)
  - [ ] 35.1 `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build:lib`, `pnpm build-storybook` desde un árbol limpio.
  - [ ] 35.1b Recorrer Storybook completo en tema claro y oscuro: todos los componentes nuevos y modificados tienen sus stories, sin errores en consola ni violaciones nuevas en el panel de accesibilidad.
  - [ ] 35.2 Revisar la lista de verificación del steering (sección 8) por cada componente nuevo o modificado.
  - [ ] 35.3 Confirmar que `src/index.ts` exporta todo lo nuevo y que ningún export existente cambió de nombre.
  - [ ] 35.4 Actualizar `CONSUMING.md` y `README.md` con la lista de componentes nuevos.
  - [ ] 35.5 Resumir al equipo los cambios visibles y las decisiones D8 a D10 que sigan abiertas. La versión y la publicación quedan fuera de este spec.
