# Requirements Document

## Introduction

La librería `@ai27-tech/ui` (repo `pf-library-frontend-components`) tiene hoy una responsividad parcial e inconsistente. Este spec define los requisitos para que todos los componentes se adapten a pantallas móvil, tablet y escritorio, con stories de Storybook que lo demuestren y una verificación automatizada.

### Estado actual (levantado con búsquedas en `src/**/*.css` y `.storybook/`)

- **No hay breakpoints comunes.** `tokens.css` no define ninguno. Los `@media` existentes usan valores distintos: 560px (`Form`, `MessagePanel`), 640px (`Navbar`, `ImageCard`, `ImageCarousel`, `FilterBar`), `40rem` (`PageHeader`), 768px (`Visor`, `FilterBar`) y 1024px (`ImageCarousel`, `FilterBar`).
- **Con adaptación parcial:** `Navbar`, `PageHeader`, `Form` (`FormRow`), `FilterBar`, `MessagePanel`, `Visor`, `ImageCard`, `ImageCarousel`, `Timeline` (usa `@container`), `Toast` (ancho con `min()`), `Popover` (se mantiene dentro del viewport), `Tabs` (desplazamiento horizontal), `Table` (desplazamiento horizontal) y `Grid` con `minItemWidth`.
- **Sin adaptación, brechas detectadas:**
  - `Sidebar`: ancho fijo de 15rem o 4rem, sin modo móvil.
  - `Modal`: alto máximo con `100vh`, que en móvil no descuenta la barra del navegador.
  - `ImageGrid`: columnas fijas con estilo en línea; la vista de lista usa `80px 1fr 100px 100px 100px 200px`.
  - `Calendar`: 7 columnas de 2.25rem fijas; `DateInput`, `DateTimeInput` y `TimePicker` con paneles laterales (presets) que no se apilan.
  - `DescriptionList`: el número de columnas es fijo, sin colapso.
  - `Grid` con `columns` fijo y `Pagination`: sin colapso en pantallas angostas.
  - `Tooltip`: sin límite horizontal contra los bordes del viewport.
- **Objetivos táctiles menores a 44px:** `Pagination` (2rem), botón de expandir de `Table` (1.5rem), cierre de `Toast` (1.5rem), cierre de `Modal` (2rem), botones de icono de `MessagePanel` (1.75rem a 2.25rem), botones de `DateInput` y `TimePicker` (1.125rem), celdas de `Calendar` (2.25rem), botón de `Navbar` (2.25rem) y botón de `Sidebar` (2.5rem).
- **Storybook:** `.storybook/preview.tsx` no configura viewports ni hay stories pensadas para móvil o tablet. La regla de accesibilidad está en `test: 'todo'`. Storybook 10.6 con `@storybook/addon-vitest`, `@storybook/addon-a11y` y Playwright ya están instalados.

### Supuestos a confirmar con el equipo de la librería

- Valores de breakpoints propuestos: móvil hasta 39.99rem, tablet de 40rem a 63.99rem, escritorio desde 64rem. Se eligieron por coincidir con el `40rem` de `PageHeader` y el rango de 560 a 1024px ya usado.
- Tamaño táctil mínimo propuesto: 44 x 44 px CSS (criterio 2.5.5 de WCAG 2.2, nivel AAA), aplicado cuando el puntero es grueso (`pointer: coarse`). El nivel AA exige 24 x 24 px (criterio 2.5.8).
- Sin cambios de API pública que rompan consumidores. Cualquier prop nueva es opcional con valor por defecto equivalente al comportamiento actual en escritorio.

## Glossary

- **Library**: la librería `@ai27-tech/ui`, repo `pf-library-frontend-components`.
- **Component**: cada componente exportado por la Library, agrupado en las familias del catálogo: acciones y formularios, datos y listas, estructura de pantalla, navegación, avisos y superposiciones, imágenes y mensajería.
- **Breakpoint_Set**: conjunto único de umbrales de ancho compartido por todos los Component: móvil (menor a 40rem), tablet (de 40rem a menos de 64rem) y escritorio (64rem o más).
- **Viewport_Preset**: tamaño de pantalla predefinido en Storybook. Móvil 375 x 667, tablet 768 x 1024 y escritorio 1280 x 800 (px CSS).
- **Touch_Target**: área interactiva de un control, medida como caja del elemento en px CSS.
- **Coarse_Pointer**: dispositivo cuyo puntero principal cumple `(pointer: coarse)`.
- **Responsive_Story**: story de Storybook que muestra un Component en un Viewport_Preset concreto mediante parámetros de viewport.
- **Storybook**: herramienta de documentación visual de la Library (versión 10.6).
- **Responsive_Test_Suite**: pruebas automatizadas que ejecutan las Responsive_Story en un navegador real con `@storybook/addon-vitest` y Playwright.
- **Token**: variable CSS con prefijo `--ui-*` definida en `src/styles/tokens.css`.
- **Horizontal_Overflow**: condición en la que `scrollWidth` del documento supera su `clientWidth`.
- **Consumer**: portal que usa la Library (`pf-web-frontend-internal`, `pf-web-frontend-client`, `pf-web-frontend-analist-panel`).

## Requirements

### Requirement 1: Breakpoints y tokens comunes

**User Story:** Como desarrollador de la Library, quiero un único conjunto de breakpoints y tokens de tamaño táctil, para que todos los Component se adapten con los mismos umbrales.

#### Acceptance Criteria

1. THE Library SHALL documentar el Breakpoint_Set en un único lugar (`src/styles/tokens.css` y `docs/`), indicando para cada umbral su nombre y su valor en `rem` y en píxeles.
2. THE Library SHALL definir un Token para el tamaño táctil mínimo con valor `2.75rem`.
3. THE Library SHALL definir Tokens de espaciado lateral de pantalla que tomen un valor distinto en cada rango del Breakpoint_Set, sin modificar los valores de `--ui-space-1` a `--ui-space-6`.
4. WHEN un Component adapta su disposición según el ancho de la ventana, THE Component SHALL usar únicamente los umbrales del Breakpoint_Set.
5. WHERE un Component se adapta al ancho de su contenedor y no al de la ventana, THE Component SHALL usar `@container` con los mismos umbrales del Breakpoint_Set.
6. WHEN se ejecuta una búsqueda de `@media` con `max-width` o `min-width` en `src/**/*.css`, THE Library SHALL devolver únicamente umbrales cuyo valor coincida con uno de los definidos en el Breakpoint_Set, con cero coincidencias de otros valores.
7. THE Library SHALL consumir únicamente Tokens `--ui-*` y valores del Breakpoint_Set en el CSS agregado o modificado por este spec, con cero colores o tamaños literales cuando exista un Token equivalente.
8. THE Library SHALL implementar la adaptación sin agregar librerías externas de UI ni de media queries.
9. IF un valor de umbral en `@media` o `@container` no coincide con ningún valor del Breakpoint_Set, THEN THE Library SHALL reportar la discrepancia como fallo en la verificación de CSS, indicando el archivo y el valor encontrado.

### Requirement 2: Estructura de pantalla

**User Story:** Como desarrollador de un portal, quiero que `Grid`, `Stack`, `Inline`, `Card`, `Section`, `PageHeader`, `Tabs`, `Divider` y `EmptyState` se adapten al ancho, para armar pantallas sin CSS de ajuste propio.

#### Acceptance Criteria

1. WHEN la prop `columns` de `Grid` es mayor que 1 y el ancho del contenedor es de móvil, THE Grid SHALL mostrar exactamente 1 columna.
2. WHEN la prop `columns` de `Grid` es mayor que 2 y el ancho del contenedor es de tablet, THE Grid SHALL mostrar un máximo de 2 columnas.
3. WHERE el Consumer pasa un conjunto de valores de columnas por Breakpoint_Set, THE Grid SHALL aplicar el valor del Breakpoint_Set activo y, IF el Breakpoint_Set activo no tiene valor definido, THEN THE Grid SHALL aplicar el valor del Breakpoint_Set definido inmediatamente menor, o 1 columna si no existe ninguno.
4. WHEN el ancho es de móvil, THE PageHeader SHALL apilar título, descripción y acciones en una sola columna, en ese orden de arriba hacia abajo, con las acciones debajo del título.
5. WHEN el ancho es de móvil y el `Breadcrumb` del PageHeader tiene más elementos que `maxItems`, THE PageHeader SHALL plegar los elementos excedentes del `Breadcrumb` y SHALL mantener el ancho del documento igual al ancho del viewport (sin Horizontal_Overflow).
6. WHEN las pestañas de `Tabs` superan el ancho disponible, THE TabList SHALL permitir desplazamiento horizontal dentro del TabList sin Horizontal_Overflow de la página, y SHALL mantener la pestaña activa completamente visible dentro del área visible del TabList.
7. WHILE el ancho es de móvil, THE Section SHALL aplicar a su relleno interno lateral el valor del Token de espaciado lateral de móvil.
8. THE Card SHALL ajustar su contenido al ancho disponible sin Horizontal_Overflow desde 320px de ancho, incluyendo texto largo sin espacios.
9. WHEN el ancho es de móvil, THE CardFooter SHALL apilar sus acciones en una sola columna, cada una al 100% del ancho del CardFooter.
10. WHEN el ancho es de móvil, THE Stack, THE Inline, THE Divider y THE EmptyState SHALL ajustarse al ancho disponible sin Horizontal_Overflow desde 320px de ancho, y THE Inline SHALL pasar sus elementos a la línea siguiente cuando no caben en una sola línea.

### Requirement 3: Navegación

**User Story:** Como usuario en móvil o tablet, quiero que la barra lateral, la barra superior y las migas de pan funcionen con poco espacio, para navegar sin perder contenido.

#### Acceptance Criteria

1. WHEN el ancho de la ventana es de móvil, THE Sidebar SHALL permanecer oculto fuera de pantalla y, WHEN el usuario acciona el control de apertura, THE Sidebar SHALL abrirse como panel superpuesto con un fondo de oscurecimiento que cubre el 100 % del área visible restante.
2. WHEN el ancho de la ventana es de tablet, THE Sidebar SHALL mostrarse contraído a solo iconos por defecto, y WHEN el usuario acciona el control de expansión, THE Sidebar SHALL expandirse a su ancho completo.
3. WHEN el ancho de la ventana es de escritorio, THE Sidebar SHALL conservar el ancho `--ui-sidebar-width` y la contracción manual existente, sin cambios respecto al comportamiento previo.
4. WHILE el `Sidebar` está abierto como panel superpuesto, THE Sidebar SHALL mantener el foco del teclado dentro del panel, de modo que Tab desde el último elemento enfocable lleve al primero y Mayús+Tab desde el primero lleve al último.
5. WHEN el usuario presiona la tecla Escape o acciona el fondo de oscurecimiento mientras el `Sidebar` está abierto como panel superpuesto, THE Sidebar SHALL cerrarse y devolver el foco al control de apertura que lo abrió.
6. WHEN el usuario selecciona un `SidebarItem` mientras el `Sidebar` está abierto como panel superpuesto, THE Sidebar SHALL cerrarse y conservar la navegación del elemento seleccionado.
7. IF el ancho de la ventana cambia de móvil a un ancho mayor con el `Sidebar` abierto como panel superpuesto, THEN THE Sidebar SHALL cerrar el panel superpuesto, retirar el fondo de oscurecimiento y liberar la captura de foco.
8. WHEN el ancho de la ventana es de móvil, THE Navbar SHALL colapsar sus `NavbarLink` tras un botón de menú, y WHEN el usuario acciona ese botón, THE Navbar SHALL mostrar los enlaces sin Horizontal_Overflow.
9. WHEN el ancho de la ventana es de móvil y el ancho total de los elementos del `Breadcrumb` supera el ancho disponible, THE Breadcrumb SHALL plegar los elementos intermedios conservando visibles el primer y el último elemento.
10. THE Sidebar SHALL conservar el atributo `aria-expanded` con valor que refleje su estado abierto o contraído, y las etiquetas `aria-label` de sus controles, en todos los Breakpoint_Set.

### Requirement 4: Datos y listas

**User Story:** Como usuario en móvil, quiero leer tablas, filtros y fichas de datos sin desplazarme en ambas direcciones, para consultar información operativa desde un teléfono.

#### Acceptance Criteria

1. WHERE el Consumer activa el modo apilado, WHEN el ancho del contenedor es de móvil, THE Table SHALL mostrar cada fila como una tarjeta que contenga, por cada columna visible, el nombre de la columna junto a su valor.
2. WHILE el modo apilado no está activo y el ancho del contenedor es menor que el ancho total de las columnas, THE Table SHALL conservar el desplazamiento horizontal únicamente dentro de su contenedor, de modo que el ancho de desplazamiento del documento no exceda el ancho del viewport (sin Horizontal_Overflow).
3. WHEN el ancho del viewport es de móvil, THE Table SHALL conservar la selección de filas, el orden por columna y la expansión de filas, cada uno operable mediante un control con un Touch_Target de al menos 44 x 44 px.
4. WHEN el ancho del viewport es de móvil, THE FilterBar y THE FilterTable SHALL mostrar los filtros en una sola columna, con cada control ocupando el 100% del ancho disponible del contenedor.
5. WHERE el Consumer solicita ocultar los filtros, WHEN el ancho del viewport es de móvil, THE FilterBar SHALL ocultar los filtros y mostrar un botón que alterne entre mostrarlos y ocultarlos, con filtros ocultos como estado inicial y un Touch_Target de al menos 44 x 44 px.
6. WHEN el ancho del viewport es de móvil, THE Pagination SHALL mostrar un máximo de 5 elementos visibles entre botones de página, flechas y puntos suspensivos, y SHALL mantener visible la página actual.
7. WHEN el ancho del viewport es de móvil, THE DescriptionList SHALL mostrar una sola columna, sin importar el valor de `columns`.
8. WHEN el ancho del viewport es de tablet, THE DescriptionList SHALL mostrar un máximo de 2 columnas, sin importar el valor de `columns`.
9. WHEN el ancho del viewport es de móvil y `orientation` es `horizontal`, THE DescriptionList SHALL mostrar el nombre encima del valor en cada par.
10. THE Stat SHALL ajustar su valor y su tendencia al ancho disponible del contenedor, mostrando el valor numérico completo sin truncarlo ni cortarlo con puntos suspensivos, y sin provocar Horizontal_Overflow.
11. WHEN el ancho del viewport es de móvil, THE Timeline SHALL mostrar todos sus puntos en una sola columna vertical, sin alternar lados.
12. WHEN la `Timeline` es horizontal y el ancho del viewport es de móvil, THE Timeline SHALL permitir desplazamiento horizontal dentro de su contenedor y SHALL posicionar el desplazamiento inicial de modo que el punto actual quede completamente visible.
13. WHEN el ancho del viewport es de móvil, THE Badge SHALL mantener todo su contenido dentro del ancho de su contenedor, ajustando el texto en varias líneas o truncándolo con puntos suspensivos, sin provocar Horizontal_Overflow.
14. IF una Table en modo apilado no tiene filas, THEN THE Table SHALL mostrar su estado vacío en lugar de tarjetas, sin provocar Horizontal_Overflow.

### Requirement 5: Formularios y controles

**User Story:** Como usuario en móvil, quiero llenar formularios y elegir fechas con una mano, para capturar datos desde un teléfono.

#### Acceptance Criteria

1. WHEN el ancho del viewport es de móvil, THE FormRow SHALL mostrar los campos en una sola columna, con cada campo ocupando el 100% del ancho disponible del contenedor.
2. WHEN el ancho del viewport es de móvil y `FormField` usa orientación horizontal, THE FormField SHALL apilar la etiqueta sobre el control, con la etiqueta y el control al 100% del ancho del contenedor.
3. WHEN el ancho del viewport es de móvil, THE FormActions SHALL apilar los botones en una sola columna con ancho del 100% del contenedor, con la acción principal como primer elemento en el orden visual y de tabulación.
4. WHILE `FormActions` está fijo en la parte inferior, THE FormActions SHALL añadir un relleno inferior igual a `env(safe-area-inset-bottom)`, de modo que ningún botón quede cubierto por el área segura del dispositivo.
5. WHEN el ancho del viewport es de móvil, THE Input, THE Textarea y THE Select SHALL medir al menos `2.75rem` de alto y usar un tamaño de fuente de al menos `1rem`.
6. WHEN el ancho del viewport es de móvil y el usuario abre un Select con `variant="searchable"`, THE Select SHALL limitar la altura de la lista a la altura visible disponible del viewport y SHALL desplazar las opciones dentro de la lista cuando excedan esa altura.
7. WHEN el ancho del viewport es de móvil, THE Checkbox, THE Radio y THE Switch SHALL tener un área de activación, incluida su etiqueta, de al menos 44 x 44 px.
8. WHEN el ancho del viewport es de móvil y es de al menos 320px, THE Calendar SHALL ajustar el ancho de sus celdas al ancho disponible, mostrar 7 columnas completas y no producir Horizontal_Overflow.
9. WHEN el ancho del viewport es de móvil, THE DateInput, THE TimePicker y THE DateTimeInput SHALL apilar el panel de presets sobre el calendario o la lista de horas, con ambos al 100% del ancho del panel.
10. WHEN el ancho del viewport es de móvil, THE DateTimeInput SHALL apilar el selector de fecha sobre el de hora, con ambos al 100% del ancho del contenedor.
11. WHILE el ancho del contenedor de DateInput es menor a `12rem`, THE DateInput SHALL ocupar el 100% del ancho del contenedor sin ancho mínimo fijo.
12. IF DateInput, TimePicker o DateTimeInput abre su panel y el panel excedería los bordes del viewport, THEN THE control SHALL reposicionar el panel para que sus cuatro bordes queden dentro del viewport, y SHALL mantener visible el control que lo abrió.
13. IF el panel de un control de fecha u hora no cabe completo en el viewport tras reposicionarse, THEN THE control SHALL limitar el panel a la altura visible disponible y SHALL desplazar su contenido internamente.

### Requirement 6: Avisos y superposiciones

**User Story:** Como usuario en móvil, quiero que modales, toasts y popovers se vean completos y se puedan cerrar con el pulgar, para no perder acciones ni mensajes.

#### Acceptance Criteria

1. WHILE el ancho del viewport es de móvil, THE Modal SHALL ocupar el ancho completo del viewport menos el doble del margen del Token de espaciado, sin importar el valor de `size`.
2. THE Modal SHALL limitar su alto máximo a 100dvh menos el doble del margen del Token de espaciado, de modo que la barra del navegador móvil no oculte el pie del Modal.
3. WHEN el contenido del Modal supera su alto máximo, THE Modal SHALL mantener visibles el encabezado y el pie y desplazar verticalmente solo el cuerpo.
4. WHILE el ancho del viewport es de móvil, THE Modal SHALL apilar los botones de su pie en una sola columna, cada uno con el 100% del ancho del pie.
5. WHILE el ancho del viewport es de móvil, THE ToastContainer SHALL ocupar el ancho completo del viewport menos el doble del margen del Token de espaciado, anclarse al borde superior o inferior indicado por `position` y mantener una separación mínima igual al área segura del dispositivo respecto de ese borde.
6. WHEN el contenido de un Popover supera el ancho del viewport, THE Popover SHALL limitar su ancho a 100vw menos el doble del margen del viewport y desplazar o ajustar el contenido sin Horizontal_Overflow.
7. WHEN un Tooltip se posiciona de modo que quedaría fuera del borde izquierdo o derecho del viewport, THE Tooltip SHALL desplazarse horizontalmente hasta quedar completamente dentro del viewport.
8. WHILE el ancho del viewport es de móvil, THE Alert SHALL apilar verticalmente su icono, mensaje y acciones sin Horizontal_Overflow.
9. THE Skeleton, THE SkeletonTable, THE Spinner y THE ProgressBar SHALL ocupar como máximo el ancho de su contenedor sin Horizontal_Overflow en viewports desde 320px de ancho.
10. WHILE el usuario tiene `prefers-reduced-motion: reduce`, THE Library SHALL desactivar las animaciones y transiciones de Modal, ToastContainer, Popover, Tooltip y Alert agregadas por este spec.
11. IF el ancho del viewport es menor a 320px, THEN THE Modal SHALL conservar el ancho mínimo de 320px menos el doble del margen y permitir desplazamiento horizontal dentro del Modal en lugar de recortar su contenido.

### Requirement 7: Imágenes

**User Story:** Como usuario en móvil, quiero ver galerías, tarjetas y el visor de imágenes completos y con gestos táctiles, para revisar evidencia desde un teléfono.

#### Acceptance Criteria

1. WHEN el ancho del viewport es de móvil, THE ImageGrid SHALL mostrar un máximo de 2 columnas, aunque `columns` tenga un valor mayor.
2. WHEN el ancho del viewport es de tablet, THE ImageGrid SHALL mostrar un máximo de 3 columnas, aunque `columns` tenga un valor mayor.
3. IF `columns` es menor que el máximo del Breakpoint_Set vigente, THEN THE ImageGrid SHALL mostrar `columns` columnas.
4. WHEN el ancho del viewport es de móvil y la vista es de lista, THE ImageGrid SHALL mostrar cada elemento en una disposición apilada de una sola columna, en lugar de las columnas fijas de `80px 1fr 100px 100px 100px 200px`.
5. WHEN el ancho del viewport es de móvil, THE ImageCard SHALL conservar la proporción de su imagen y mantener insignias y acciones dentro de los límites de la tarjeta, sin desbordamiento horizontal.
6. WHEN el ancho del viewport es de móvil, THE ImageCarousel SHALL mostrar 1 elemento por vista.
7. WHERE el dispositivo admite gestos táctiles, WHEN el usuario desliza horizontalmente sobre el ImageCarousel en móvil, THE ImageCarousel SHALL avanzar o retroceder 1 elemento en la dirección del deslizamiento.
8. IF el ImageCarousel está en el primer o el último elemento y el usuario desliza hacia fuera del rango, THEN THE ImageCarousel SHALL permanecer en el elemento actual.
9. WHEN el ancho del viewport es de móvil, THE Visor SHALL ocupar el 100% del alto dinámico del viewport (`dvh`) y mostrar cada control con un Touch_Target mínimo.
10. WHERE el dispositivo admite gestos táctiles, WHEN el usuario desliza horizontalmente sobre el Visor, THE Visor SHALL cambiar a la imagen anterior o siguiente según la dirección del deslizamiento.
11. IF el Visor está en la primera o la última imagen y el usuario desliza hacia fuera del rango, THEN THE Visor SHALL permanecer en la imagen actual.
12. WHILE el Visor está abierto, THE Visor SHALL cerrarse al presionar la tecla Escape y mantener el foco del teclado dentro del Visor en todos los Breakpoint_Set.

### Requirement 8: Mensajería

**User Story:** Como ejecutivo que atiende a un cliente desde un teléfono o tableta, quiero que el panel de conversación use todo el ancho y se maneje con el pulgar, para responder sin errores.

#### Acceptance Criteria

1. WHEN el ancho del viewport es de móvil, THE MessagePanel y THE MessageDock SHALL mostrar un solo panel abierto que ocupe el 100% del ancho del viewport y el 100% del alto dinámico del viewport.
2. WHEN el ancho del viewport es de tablet, THE MessageDock SHALL mostrar como máximo 1 panel abierto y SHALL mostrar cada conversación restante como una pestaña en la barra de pestañas.
3. IF el ancho del viewport es de móvil y el usuario abre un segundo panel, THEN THE MessageDock SHALL minimizar el panel abierto previamente a la barra de pestañas, de modo que solo 1 panel quede abierto, y SHALL conservar el texto no enviado del panel minimizado.
4. WHEN el ancho del viewport es de móvil, THE MessageBubble SHALL limitar su ancho máximo al 85% del ancho de la lista de mensajes y SHALL ajustar el texto largo, incluidas las cadenas sin espacios de hasta 500 caracteres, mediante salto de línea, de modo que la lista de mensajes no tenga Horizontal_Overflow (`scrollWidth` igual a `clientWidth`).
5. WHEN el ancho del viewport es de móvil, THE MessageComposer SHALL permanecer anclado a la parte inferior del área visible, SHALL quedar completamente visible por encima del teclado en pantalla cuando este se muestre, y SHALL aplicar el margen del área segura inferior del dispositivo.
6. WHEN el ancho del viewport es de móvil, THE MessageComposer SHALL mostrar sus botones de adjuntar y enviar con un Touch_Target mínimo de 44 x 44 px y una separación mínima de 8 px entre ellos.
7. WHEN el ancho del viewport es de móvil y un archivo adjunto tiene un nombre más largo que el espacio disponible, THE MessageAttachment SHALL truncar el nombre con puntos suspensivos en una sola línea, SHALL conservar visible la extensión del archivo y SHALL mantenerse dentro de los límites de la burbuja.
8. WHEN el ancho del viewport es de móvil, THE ConversationStatus SHALL apilar sus elementos en una sola columna sin Horizontal_Overflow.
9. THE MessageThread SHALL ordenar los mensajes por `secuencia` ascendente en todos los Breakpoint_Set, sin reordenarlos por fecha de creación al cambiar de breakpoint ni al girar el dispositivo.

### Requirement 9: Accesibilidad táctil

**User Story:** Como usuario con pantalla táctil, quiero que los controles sean fáciles de acertar, para no activar acciones por error.

#### Acceptance Criteria

1. WHILE el puntero es un Coarse_Pointer, THE Button SHALL tener un Touch_Target de al menos 44 x 44 px en todos los tamaños (`sm`, `md`, `lg`) y en los botones de solo icono.
2. WHILE el puntero es un Coarse_Pointer, THE Component interactivo (cierre de `Modal`, cierre de `Toast`, botón de `Sidebar`, botón de `Navbar`, expandir de `Table`, flechas y páginas de `Pagination`, celdas de `Calendar`, botones de `MessagePanel`) SHALL tener un Touch_Target de al menos 44 x 44 px.
3. WHERE el elemento visible de un Component interactivo mide menos de 44 x 44 px, THE Component SHALL ampliar el área activable hasta 44 x 44 px con relleno o un pseudoelemento, sin cambiar las dimensiones ni la apariencia visible del elemento.
4. WHILE el puntero es un Coarse_Pointer, THE Library SHALL separar dos Touch_Target contiguos al menos 8 px, medidos entre los bordes de sus áreas activables.
5. WHEN el usuario aplica un zoom de texto del 200%, THE Component SHALL mostrar todo su contenido textual sin truncarlo, sin ocultarlo y sin solaparlo con otros elementos, y sin requerir desplazamiento horizontal de la página en un ancho de 320 px.
6. THE Component SHALL conservar sus atributos `aria-*`, su `role` y el indicador de foco visible en todos los Breakpoint_Set.
7. WHEN el usuario cambia la orientación del dispositivo entre vertical y horizontal, THE Component SHALL ajustar su disposición al nuevo ancho en un máximo de 300 ms y conservar su estado interno (valor de los campos, selección, filas expandidas, pestaña activa, posición de desplazamiento y apertura de `Modal`, `Popover` o `Toast`).
8. IF el área activable ampliada de un Component se solapa con la de otro Touch_Target contiguo, THEN THE Library SHALL limitar la ampliación para que ambas áreas no se solapen y conserven la separación mínima de 8 px, y SHALL activar solo el Component cuya área contiene el punto de contacto.

### Requirement 10: Storybook con viewports

**User Story:** Como diseñador y desarrollador, quiero ver cada Component en móvil, tablet y escritorio dentro de Storybook, para validar la responsividad sin abrir un portal.

#### Acceptance Criteria

1. THE Storybook SHALL configurar en `.storybook/preview.tsx` exactamente tres Viewport_Preset: móvil 375 x 667, tablet 768 x 1024 y escritorio 1280 x 800, con anchos y altos expresados en píxeles CSS.
2. THE Storybook SHALL ofrecer en la barra de herramientas un selector de viewport cuyas únicas opciones de Viewport_Preset sean móvil, tablet y escritorio.
3. THE Library SHALL incluir al menos una Responsive_Story con Viewport_Preset móvil por cada Component exportado desde la raíz de `@ai27-tech/ui`.
4. THE Library SHALL incluir al menos una Responsive_Story con Viewport_Preset tablet por cada Component cuya disposición, número de columnas o visibilidad de elementos difiere entre 375 px y 768 px de ancho.
5. WHEN un Component tiene una story existente que no representa el uso real en móvil, THE Library SHALL agregar una Responsive_Story nueva y conservar sin cambios la story existente.
6. THE Responsive_Story SHALL declarar su Viewport_Preset mediante el parámetro de viewport de Storybook y no mediante anchos fijos en estilos en línea.
7. THE Responsive_Story SHALL usar contenido representativo del dominio que incluya al menos: un texto de 60 o más caracteres sin espacios o con palabras largas, un valor numérico de 9 o más dígitos, y una lista de 20 o más elementos cuando el Component admita listas.
8. WHEN se ejecuta `npm run build-storybook`, THE Storybook SHALL terminar con código de salida 0 y sin errores, con todas las Responsive_Story incluidas.
9. IF `npm run build-storybook` falla por una Responsive_Story, THEN THE Storybook SHALL reportar en la salida el nombre de la story que causó el fallo.
10. THE Storybook SHALL incluir una página de documentación que describa el Breakpoint_Set con sus valores en píxeles, el Touch_Target mínimo en píxeles y los pasos para seleccionar un Viewport_Preset en la barra de herramientas.
11. WHILE el tema activo del selector de tema existente es `light` o `dark`, THE Responsive_Story SHALL renderizarse en cada Viewport_Preset sin texto ilegible ni contenido recortado fuera del viewport, y sin cambiar el comportamiento de ajuste entre temas.

### Requirement 11: Verificación

**User Story:** Como responsable de la Library, quiero pruebas automáticas de responsividad en CI, para que una regresión no llegue a los portales.

#### Acceptance Criteria

1. WHEN se ejecuta la Responsive_Test_Suite, THE Responsive_Test_Suite SHALL ejecutar cada Responsive_Story en un navegador real con `@storybook/addon-vitest` y Playwright.
2. WHEN se ejecuta una Responsive_Story en cada ancho de viewport de 320px, 375px, 768px y 1280px, THE Responsive_Test_Suite SHALL comprobar que el `scrollWidth` del documento no excede el ancho del viewport, es decir, que no hay Horizontal_Overflow.
3. WHEN se ejecuta una Responsive_Story en un contexto con Coarse_Pointer, THE Responsive_Test_Suite SHALL comprobar que cada elemento interactivo visible mide al menos 44 x 44 px, salvo los que amplían el área activable según el criterio 3 del Requirement 9.
4. WHEN se ejecuta una Responsive_Story, THE Responsive_Test_Suite SHALL ejecutar las comprobaciones de `@storybook/addon-a11y` sobre ella.
5. IF las comprobaciones de accesibilidad de una Responsive_Story encuentran una o más violaciones, THEN THE Responsive_Test_Suite SHALL marcar la prueba de esa Responsive_Story como fallida, indicar la regla incumplida y el elemento afectado, y devolver un código de salida distinto de cero.
6. THE Library SHALL configurar `parameters.a11y.test` con el valor `error` (en lugar de `todo`) en `.storybook/preview.tsx` para las Responsive_Story, y conservar `todo` para las demás stories.
7. IF la Responsive_Test_Suite falla en CI, THEN THE Library SHALL impedir la integración del cambio hasta que la suite termine sin fallos.
8. WHEN se ejecutan `npm run lint`, `npm run build` y las pruebas unitarias existentes, THE Library SHALL terminarlos con código de salida 0 y sin errores nuevos respecto de la línea base previa al cambio.
9. WHEN se completa la implementación, THE Library SHALL registrar en `CHANGELOG.md` los cambios de cada Component y actualizar `docs/steering-consumidores/ai27-ui-library.md` si cambia el uso de algún Component.
10. IF un Component no puede cumplir un requisito de este spec, THEN THE Library SHALL registrar la excepción, con su motivo, en `docs/` y en `CHANGELOG.md`.

### Requirement 12: Compatibilidad con los Consumer

**User Story:** Como desarrollador de un portal, quiero actualizar la Library sin reescribir mis pantallas, para adoptar la responsividad sin migración.

#### Acceptance Criteria

1. THE Library SHALL conservar los nombres, tipos y valores por defecto de todas las props públicas que cada Component exponía en la versión publicada inmediata anterior, de modo que un Consumer compile sin errores de tipos y sin cambios de código tras actualizar.
2. WHERE se agrega una prop nueva para controlar la adaptación (por ejemplo, el modo apilado de `Table` o las columnas por Breakpoint_Set de `Grid`), THE Component SHALL tratarla como opcional y, cuando se omite, SHALL producir en anchos de escritorio la misma disposición (orden, número de columnas, espaciado y tamaños) que producía en la versión anterior.
3. WHEN el ancho del viewport es de escritorio, THE Component SHALL conservar su aspecto y disposición de la versión anterior, sin diferencias visuales en una comparación de capturas de las stories de Storybook existentes.
4. WHEN un Consumer pasa la prop `labels` a un Component, THE Component SHALL aplicar los textos recibidos, y WHEN la omite, THE Component SHALL mostrar los textos por defecto en español de la versión anterior.
5. IF un Consumer usa un Component sin instalar `@ai27-tech/contracts`, THEN THE Library SHALL funcionar sin error de resolución de módulos, porque ningún archivo publicado de la Library importa ni declara dependencia (de ejecución, de pares o de tipos) de esa librería.
6. WHEN la implementación se publica, THE Library SHALL incrementar su versión según el tipo de cambio (cambios compatibles como incremento menor o de prerrelease, cambios con ruptura como incremento mayor) y SHALL documentar en el CHANGELOG, antes de la publicación, cada cambio visible para los Consumer, incluidas las props nuevas y cualquier cambio de comportamiento en anchos menores al de escritorio.