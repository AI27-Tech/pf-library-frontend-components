# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
#### 2026:11:23 15:55 — Corrige build:lib excluyendo src/stories (8674feb)
**Resumen:** Corrige el build de publicación (`pnpm build:lib`), que fallaba porque compilaba los archivos de `src/stories/` como parte de la librería.
**Cambios:**
- `tsconfig.build.json` excluye `src/stories/**` del build de publicación. Esos archivos (helpers responsivos y stories) solo los usan Storybook y las pruebas; ninguna pieza publicada los importa.
- Archivos por carpeta: `tsconfig.build.json` (1), `CHANGELOG.md` (1).
**Archivos modificados:**
- `tsconfig.build.json`
- `CHANGELOG.md`

#### 2026:11:23 13:29 — Corrige prefijo ui- y contraste de la story Mobile de SortableFieldList (3de2199)

**Resumen:** Corrige prefijo ui- y contraste de la story Mobile de SortableFieldList. 

**Cambios:**
- Las clases CSS nuevas llevan prefijo ui- (requisito 13.12). La story Mobile se muestra dentro de un Card para evitar el canvas muted, donde el bot├│n outline no cumple contraste AA. No se cambi├│ la paleta ni el bot├│n. 
- Archivos por carpeta: `CHANGELOG.md` (1), `src/components/SortableList` (3).

**Archivos modificados:**
- `CHANGELOG.md`
- `src/components/SortableList/SortableFieldList.module.css`
- `src/components/SortableList/SortableFieldList.stories.tsx`
- `src/components/SortableList/SortableFieldList.tsx`

#### 2026:11:23 13:18 — Agrega validaci├│n de captura a Input y DateInput (prop format) (f67e82e)

**Resumen:** Agrega validaci├│n de captura a Input y DateInput (prop format). 

**Cambios:**
- Archivos por carpeta: `src/components/DatePicker` (2), `src/components/Input` (5), `src/index.ts` (1).

**Archivos modificados:**
- `src/components/DatePicker/DateInput.tsx`
- `src/components/DatePicker/dateUtils.ts`
- `src/components/Input/Input.tsx`
- `src/components/Input/InputFormat.stories.tsx`
- `src/components/Input/index.ts`
- `src/components/Input/inputFormat.test.tsx`
- `src/components/Input/inputFormat.ts`
- `src/index.ts`

## [0.3.0-beta.2] — 2026-11-23

### Agregado

- **`SortableFieldList`**: lista de campos repetibles y reordenables, por ejemplo destinos intermedios. Cada posición tiene una etiqueta fija (`slotLabel`, por ejemplo "Destino 1") que no se mueve al reordenar; la tarjeta con asa, el control que dibuja `renderField` y el icono de quitar (`onRemove`) sí se mueven. Al final, un `Button` de ancho completo para agregar (`onAdd`, `addLabel`). Funciona con mouse, dedo y teclado (espacio toma y suelta, flechas mueven, escape cancela) y anuncia la posición a lectores de pantalla. El orden lo guarda el consumidor: `onReorder` entrega la lista nueva. Sin dependencias nuevas.
- **Sidebar**: nueva prop `headerCollapsed` con el contenido del encabezado cuando la barra está contraída (por ejemplo, un logo pequeño). Si se omite, el encabezado queda vacío al contraer.

### Cambiado

- **Sidebar**: el botón de colapso se mueve a la esquina inferior derecha, en una fila al final de la barra, centrado cuando la barra está contraída. Ya no está en el encabezado. El encabezado solo muestra `header`, y `footer` queda entre el contenido y el botón.

- **`DateInput`**: el campo de fecha tiene `role="combobox"` (antes `textbox`) y `aria-controls` cuando el calendario está abierto, para que `aria-expanded` y `aria-haspopup` sean válidos. Visualmente no cambia. Los consumidores que busquen el campo con `getByRole('textbox')` en sus pruebas deben usar `getByRole('combobox')`.

### Registro de cambios

#### 2026:11:23 13:04 — chore: bump version to 0.3.0-beta.2 (75dba11)

**Resumen:** chore: bump version to 0.3.0-beta.2. 

**Cambios:**
- Archivos por carpeta: `CHANGELOG.md` (1), `package.json` (1).

**Archivos modificados:**
- `CHANGELOG.md`
- `package.json`

#### 2026:11:23 12:57 — Restaura finales de l├¡nea del changelog (4c4442d)

**Resumen:** Restaura finales de l├¡nea del changelog. 

**Cambios:**
- El commit anterior reescribi├│ todo el archivo al cambiar los finales de l├¡nea. Se restaura el contenido previo y se deja solo la entrada de SortableFieldList. 
- Archivos por carpeta: `CHANGELOG.md` (1).

**Archivos modificados:**
- `CHANGELOG.md`

#### 2026:11:23 12:54 — Cierre de tarea SortableFieldList lista reordenable de campos (f9d6b72)

**Resumen:** Cierre de tarea SortableFieldList lista reordenable de campos. 

**Cambios:**
- Lista de campos repetibles y reordenables (por ejemplo, destinos intermedios). La etiqueta de cada posici├│n se queda fija al reordenar; solo se mueve la tarjeta con asa, el control y el icono de quitar. Incluye bot├│n de agregar al final, arrastre con mouse, dedo y teclado, y el hook useSortable compartido. Con pruebas, stories y entrada en el changelog. 
- Archivos por carpeta: `CHANGELOG.md` (1), `src/components/SortableList` (8), `src/index.ts` (1).

**Archivos modificados:**
- `CHANGELOG.md`
- `src/components/SortableList/SortableFieldList.module.css`
- `src/components/SortableList/SortableFieldList.stories.tsx`
- `src/components/SortableList/SortableFieldList.test.tsx`
- `src/components/SortableList/SortableFieldList.tsx`
- `src/components/SortableList/index.ts`
- `src/components/SortableList/labels.ts`
- `src/components/SortableList/sortableUtils.ts`
- `src/components/SortableList/useSortable.ts`
- `src/index.ts`

#### 2026:11:23 11:17 — Cierre de tarea 52 documentacion responsiva (7755d9a)

**Resumen:** Cierre de la tarea 52: documentacion responsiva. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/stories` (1).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/stories/Responsive.mdx`

#### 2026:11:23 11:14 — Cierre de tarea 51 coexistencia con Tailwind (37429c2)

**Resumen:** Cierre de la tarea 51: coexistencia con Tailwind. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `docs/css-classes.manifest.json` (1), `docs/responsive-tailwind.md` (1), `scripts/css-classes.d.mts` (1), `scripts/css-classes.mjs` (1), `src/stories` (2), `src/utils` (1).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `docs/css-classes.manifest.json`
- `docs/responsive-tailwind.md`
- `scripts/css-classes.d.mts`
- `scripts/css-classes.mjs`
- `src/stories/responsive-tailwind.stories.tsx`
- `src/stories/tailwind-equivalents.css`
- `src/utils/__tests__/tailwind-compat.test.ts`

#### 2026:11:23 11:07 — Cierre de tarea 50 accesibilidad tactil (833748d)

**Resumen:** Cierre de la tarea 50: accesibilidad tactil. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/DatePicker` (1), `src/components/FilterBar` (1), `src/components/MessagePanel` (1), `src/components/Navbar` (1), `src/components/Sidebar` (1), `src/components/Toast` (1).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/DatePicker/Calendar.module.css`
- `src/components/FilterBar/FilterBar.module.css`
- `src/components/MessagePanel/MessagePanel.module.css`
- `src/components/Navbar/Navbar.module.css`
- `src/components/Sidebar/Sidebar.module.css`
- `src/components/Toast/Toast.module.css`

#### 2026:11:23 10:56 — Cierre de tarea 48 MessageDock (e19f9ed)

**Resumen:** Cierre de la tarea 48: MessageDock. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/MessagePanel` (5).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/MessagePanel/MessagePanel.module.css`
- `src/components/MessagePanel/MessagePanel.stories.tsx`
- `src/components/MessagePanel/dockState.ts`
- `src/components/MessagePanel/useMessageDock.test.ts`
- `src/components/MessagePanel/useMessageDock.ts`

#### 2026:11:23 10:30 — Cierre de tarea 47 MessagePanel (2974371)

**Resumen:** Cierre de la tarea 47: MessagePanel. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/MessagePanel` (4), `src/utils` (1).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/MessagePanel/MessageComposer.tsx`
- `src/components/MessagePanel/MessagePanel.module.css`
- `src/components/MessagePanel/MessagePanel.stories.tsx`
- `src/components/MessagePanel/MessagePanel.tsx`
- `src/utils/breakpoints-legacy.manifest.json`

#### 2026:11:23 10:13 — Cierre de tarea 46 ConversationStatus (4d1e42e)

**Resumen:** Cierre de la tarea 46: ConversationStatus. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/MessagePanel` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/MessagePanel/ConversationStatus.stories.tsx`
- `src/components/MessagePanel/MessagePanel.module.css`

#### 2026:11:23 10:07 — Cierre de tarea 45 MessageList y MessageThread (ab4f8fc)

**Resumen:** Cierre de la tarea 45: MessageList y MessageThread. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/MessagePanel` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/MessagePanel/MessagePanel.module.css`
- `src/components/MessagePanel/MessagePanel.stories.tsx`

#### 2026:11:23 10:04 — Cierre de tarea 44 MessageComposer (4a8358f)

**Resumen:** Cierre de la tarea 44: MessageComposer. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/MessagePanel` (4).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/MessagePanel/MessageComposer.tsx`
- `src/components/MessagePanel/MessageList.tsx`
- `src/components/MessagePanel/MessagePanel.module.css`
- `src/components/MessagePanel/MessagePanel.stories.tsx`

#### 2026:11:23 09:59 — Cierre de tarea 43 MessageBubble y MessageAttachment (6fcb4b5)

**Resumen:** Cierre de la tarea 43: MessageBubble y MessageAttachment. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/MessagePanel` (3).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/MessagePanel/MessageAttachment.tsx`
- `src/components/MessagePanel/MessagePanel.module.css`
- `src/components/MessagePanel/MessagePanel.stories.tsx`

#### 2026:11:23 09:48 — Cierre de tarea 42 Visor (d3bc6d4)

**Resumen:** Cierre de la tarea 42: Visor. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Visor` (3), `src/utils` (1).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Visor/Visor.module.css`
- `src/components/Visor/Visor.stories.tsx`
- `src/components/Visor/Visor.tsx`
- `src/utils/breakpoints-legacy.manifest.json`

#### 2026:11:23 09:28 — Cierre de tarea 41 ImageCarousel (69060e3)

**Resumen:** Cierre de la tarea 41: ImageCarousel. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/ImageCarousel` (3), `src/utils` (1).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/ImageCarousel/ImageCarousel.module.css`
- `src/components/ImageCarousel/ImageCarousel.stories.tsx`
- `src/components/ImageCarousel/ImageCarousel.tsx`
- `src/utils/breakpoints-legacy.manifest.json`

#### 2026:11:23 09:23 — Cierre de tarea 40 ImageGrid (0fccae6)

**Resumen:** Cierre de la tarea 40: ImageGrid. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/ImageGrid` (3).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/ImageGrid/ImageGrid.module.css`
- `src/components/ImageGrid/ImageGrid.stories.tsx`
- `src/components/ImageGrid/ImageGrid.tsx`

#### 2026:11:20 17:29 — Cierre de tarea 39 ImageCard (1488a9e)

**Resumen:** Cierre de la tarea 39: ImageCard. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/ImageCard` (2), `src/utils` (1).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/ImageCard/ImageCard.module.css`
- `src/components/ImageCard/ImageCard.stories.tsx`
- `src/utils/breakpoints-legacy.manifest.json`

#### 2026:11:20 17:28 — Cierre de tarea 38 ProgressBar (7d455d8)

**Resumen:** Cierre de la tarea 38: ProgressBar. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/ProgressBar` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/ProgressBar/ProgressBar.module.css`
- `src/components/ProgressBar/ProgressBar.stories.tsx`

#### 2026:11:20 17:25 — Cierre de tarea 37 Spinner (5754eca)

**Resumen:** Cierre de la tarea 37: Spinner. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Spinner` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Spinner/Spinner.module.css`
- `src/components/Spinner/Spinner.stories.tsx`

#### 2026:11:20 17:22 — Cierre de tarea 36 Skeleton (66155d4)

**Resumen:** Cierre de la tarea 36: Skeleton. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Skeleton` (3), `src/stories` (1).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Skeleton/Skeleton.module.css`
- `src/components/Skeleton/Skeleton.stories.tsx`
- `src/components/Skeleton/SkeletonTable.tsx`
- `src/stories/responsive-overflow.responsive.tsx`

#### 2026:11:20 17:13 — Cierre de tarea 35 Tooltip (e77e1e4)

**Resumen:** Cierre de la tarea 35: Tooltip. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Tooltip` (3).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Tooltip/Tooltip.module.css`
- `src/components/Tooltip/Tooltip.stories.tsx`
- `src/components/Tooltip/Tooltip.tsx`

#### 2026:11:20 17:08 — Cierre de tarea 34 Popover (e09ed75)

**Resumen:** Cierre de la tarea 34: Popover. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Popover` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Popover/Popover.module.css`
- `src/components/Popover/Popover.stories.tsx`

#### 2026:11:20 17:04 — Cierre de tarea 33 Modal (9186418)

**Resumen:** Cierre de la tarea 33: Modal. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Modal` (3).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Modal/Modal.module.css`
- `src/components/Modal/Modal.stories.tsx`
- `src/components/Modal/Modal.tsx`

#### 2026:11:20 16:25 — Cierre de tarea 32 Toast (e66ec05)

**Resumen:** Cierre de la tarea 32: Toast. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Toast` (3), `src/stories` (1).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Toast/Toast.module.css`
- `src/components/Toast/Toast.stories.tsx`
- `src/components/Toast/Toast.tsx`
- `src/stories/responsive-overflow.responsive.tsx`

#### 2026:11:20 16:13 — Cierre de tarea 31 Alert (3aee53c)

**Resumen:** Cierre de la tarea 31: Alert. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Alert` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Alert/Alert.module.css`
- `src/components/Alert/Alert.stories.tsx`

#### 2026:11:20 15:44 — Cierre de tarea 30 DateTimeInput (e404865)

**Resumen:** Cierre de la tarea 30: DateTimeInput. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/DatePicker` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/DatePicker/DateTimeInput.module.css`
- `src/components/DatePicker/DateTimeInput.stories.tsx`

#### 2026:11:20 15:42 — Cierre de tarea 29 TimePicker (6dded71)

**Resumen:** Cierre de la tarea 29: TimePicker. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/DatePicker` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/DatePicker/TimePicker.module.css`
- `src/components/DatePicker/TimePicker.stories.tsx`

#### 2026:11:20 15:39 — Cierre de tarea 28 DateInput (06c830f)

**Resumen:** Cierre de la tarea 28: DateInput. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `CHANGELOG.md` (1), `src/components/DatePicker` (4).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `CHANGELOG.md`
- `src/components/DatePicker/DateInput.module.css`
- `src/components/DatePicker/DateInput.stories.tsx`
- `src/components/DatePicker/DateInput.tsx`
- `src/components/DatePicker/dateUtils.ts`

#### 2026:11:20 14:15 — Cierre de tarea 27 Calendar (a6c71fc)

**Resumen:** Cierre de la tarea 27: Calendar. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/DatePicker` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/DatePicker/Calendar.module.css`
- `src/components/DatePicker/Calendar.stories.tsx`

#### 2026:11:20 14:11 — Cierre de tarea 26 Checkbox, Radio y Switch (0cb2c1e)

**Resumen:** Cierre de la tarea 26: Checkbox, Radio y Switch. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Input` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Input/Choice.module.css`
- `src/components/Input/Choice.stories.tsx`

#### 2026:11:20 14:04 — Cierre de tarea 25 Select (92d7756)

**Resumen:** Cierre de la tarea 25: Select. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Input` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Input/Select.stories.tsx`
- `src/components/Input/SelectCustom.module.css`

#### 2026:11:20 14:01 — Cierre de tarea 24 Input y Textarea (b6abce4)

**Resumen:** Cierre de la tarea 24: Input y Textarea. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Input` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Input/Input.module.css`
- `src/components/Input/Input.stories.tsx`

#### 2026:11:20 13:43 — Cierre de tarea 23 Form (8b0dde3)

**Resumen:** Cierre de la tarea 23: Form. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Form` (2), `src/components/Input` (1), `src/utils` (1).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Form/Form.module.css`
- `src/components/Form/Form.stories.tsx`
- `src/components/Input/FormField.tsx`
- `src/utils/breakpoints-legacy.manifest.json`

#### 2026:11:20 13:33 — Cierre de tarea 22 FormField (cab38bf)

**Resumen:** Cierre de la tarea 22: FormField. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Input` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Input/FormField.module.css`
- `src/components/Input/FormField.stories.tsx`

#### 2026:11:20 13:10 — Cierre de tarea 21 Pagination (ac5906d)

**Resumen:** Cierre de la tarea 21: Pagination. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Pagination` (3).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Pagination/Pagination.module.css`
- `src/components/Pagination/Pagination.stories.tsx`
- `src/components/Pagination/Pagination.tsx`

#### 2026:11:20 13:02 — Cierre de tarea 20 FilterTable (eb73033)

**Resumen:** Cierre de la tarea 20: FilterTable. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/FilterTable` (3), `src/components/Table` (1).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/FilterTable/FilterTable.module.css`
- `src/components/FilterTable/FilterTable.stories.tsx`
- `src/components/FilterTable/FilterTable.tsx`
- `src/components/Table/Table.tsx`

#### 2026:11:20 12:28 — Cierre de tarea 19 FilterBar (22fbd26)

**Resumen:** Cierre de la tarea 19: FilterBar. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/FilterBar` (3), `src/utils` (1).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/FilterBar/FilterBar.module.css`
- `src/components/FilterBar/FilterBar.stories.tsx`
- `src/components/FilterBar/FilterBar.tsx`
- `src/utils/breakpoints-legacy.manifest.json`

#### 2026:11:20 11:10 — Cierre de tarea 18 Table (c3333c3)

**Resumen:** Cierre de la tarea 18: Table. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Table` (3).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Table/Table.module.css`
- `src/components/Table/Table.stories.tsx`
- `src/components/Table/Table.tsx`

#### 2026:11:20 11:04 — Cierre de tarea 17 Timeline (67453df)

**Resumen:** Cierre de la tarea 17: Timeline. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Timeline` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Timeline/Timeline.module.css`
- `src/components/Timeline/Timeline.stories.tsx`

#### 2026:11:20 10:55 — Responsividad de DescriptionList (7c7eb75)

**Resumen:** Responsividad de DescriptionList. 

**Cambios:**
- Archivos por carpeta: `src/components/DescriptionList` (3).

**Archivos modificados:**
- `src/components/DescriptionList/DescriptionList.module.css`
- `src/components/DescriptionList/DescriptionList.stories.tsx`
- `src/components/DescriptionList/DescriptionList.tsx`

#### 2026:11:20 10:08 — Cierre de tarea 15 Stat (3763db6)

**Resumen:** Cierre de la tarea 15: Stat. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Stat` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Stat/Stat.module.css`
- `src/components/Stat/Stat.stories.tsx`

#### 2026:11:20 10:02 — Cierre de tarea 14 Badge (573562c)

**Resumen:** Cierre de la tarea 14: Badge. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Badge` (2), `src/styles` (1).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Badge/Badge.module.css`
- `src/components/Badge/Badge.stories.tsx`
- `src/styles/tokens.css`

#### 2026:11:19 18:20 — Cierre de tarea 13 Sidebar (47fc127)

**Resumen:** Cierre de la tarea 13: Sidebar. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Sidebar` (5), `src/index.ts` (1).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Sidebar/Sidebar.module.css`
- `src/components/Sidebar/Sidebar.stories.tsx`
- `src/components/Sidebar/Sidebar.test.tsx`
- `src/components/Sidebar/Sidebar.tsx`
- `src/components/Sidebar/index.ts`
- `src/index.ts`

#### 2026:11:19 18:10 — Cierre de tarea 12 Navbar (bafa6c0)

**Resumen:** Cierre de la tarea 12: Navbar. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`

#### 2026:11:19 18:09 — Avance tarea 12 Navbar (pendiente revisi├│n visual 12.4) (6b1832f)

**Resumen:** Avance de la tarea 12: Navbar (pendiente revisi├│n visual 12.4). 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Navbar` (2), `src/utils` (1).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Navbar/Navbar.module.css`
- `src/components/Navbar/Navbar.stories.tsx`
- `src/utils/breakpoints-legacy.manifest.json`

#### 2026:11:19 18:00 — Cierre de tarea 11 Breadcrumb (7bfaef2)

**Resumen:** Cierre de la tarea 11: Breadcrumb. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Breadcrumb` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Breadcrumb/Breadcrumb.module.css`
- `src/components/Breadcrumb/Breadcrumb.stories.tsx`

#### 2026:11:19 17:54 — Cierre de tarea 10 Tabs (0234935)

**Resumen:** Cierre de la tarea 10: Tabs. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Tabs` (3).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Tabs/Tabs.module.css`
- `src/components/Tabs/Tabs.stories.tsx`
- `src/components/Tabs/Tabs.tsx`

#### 2026:11:19 17:47 — Cierre de tarea 9 PageHeader (616b70d)

**Resumen:** Cierre de la tarea 9: PageHeader. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/PageHeader` (2), `src/utils` (1).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/PageHeader/PageHeader.module.css`
- `src/components/PageHeader/PageHeader.stories.tsx`
- `src/utils/breakpoints-legacy.manifest.json`

#### 2026:11:19 17:25 — Cierre de tarea 8 EmptyState (969165a)

**Resumen:** Cierre de la tarea 8: EmptyState. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/EmptyState` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/EmptyState/EmptyState.module.css`
- `src/components/EmptyState/EmptyState.stories.tsx`

#### 2026:11:19 17:18 — Cierre de tarea 7 Divider (7e04943)

**Resumen:** Cierre de la tarea 7: Divider. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Divider` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Divider/Divider.module.css`
- `src/components/Divider/Divider.stories.tsx`

#### 2026:11:19 17:08 — Cierre de tarea 6 Section (ac1f2f6)

**Resumen:** Cierre de la tarea 6: Section. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Section` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Section/Section.module.css`
- `src/components/Section/Section.stories.tsx`

#### 2026:11:19 17:04 — Cierre de tarea 5 para Card (23f258a)

**Resumen:** Cierre de la tarea 5: para Card. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Card` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Card/Card.module.css`
- `src/components/Card/Card.stories.tsx`

#### 2026:11:19 16:54 — Responsividad de Layout (bf58753)

**Resumen:** Responsividad de Layout. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Layout` (4).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Layout/Layout.module.css`
- `src/components/Layout/Layout.stories.tsx`
- `src/components/Layout/Layout.test.tsx`
- `src/components/Layout/Layout.tsx`

#### 2026:11:19 16:22 — Cierre de Tarea 3 Button (357635c)

**Resumen:** Cierre de la tarea 3: Button. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (1), `src/components/Button` (2), `src/stories` (2).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/tasks.md`
- `src/components/Button/Button.module.css`
- `src/components/Button/Button.stories.tsx`
- `src/stories/responsive-overflow.responsive.tsx`
- `src/stories/responsiveStory.ts`

#### 2026:11:19 15:55 — Cierre de pre-requisitos para responsividad de componentes (0e9ad2f)

**Resumen:** Cierre de pre-requisitos para responsividad de componentes. 

**Cambios:**
- Archivos por carpeta: `.gitignore` (1), `.kiro/specs` (1), `.storybook/preview.tsx` (1), `docs/responsive-breakpoints.md` (1), `package.json` (1), `pnpm-lock.yaml` (1), `src/components/Modal` (1), `src/stories` (3), `src/styles` (2), `src/utils` (15), `vite.config.ts` (1).

**Archivos modificados:**
- `.gitignore`
- `.kiro/specs/responsive-components-library/tasks.md`
- `.storybook/preview.tsx`
- `docs/responsive-breakpoints.md`
- `package.json`
- `pnpm-lock.yaml`
- `src/components/Modal/Modal.tsx`
- `src/stories/responsive-overflow.responsive.tsx`
- `src/stories/responsiveFixtures.ts`
- `src/stories/responsiveStory.ts`
- `src/styles/base.css`
- `src/styles/tokens.css`
- `src/utils/__tests__/breakpoints-css.test.ts`
- `src/utils/__tests__/breakpoints.property.test.ts`
- `src/utils/__tests__/responsive-columns.property.test.ts`
- `src/utils/__tests__/responsive-pagination.property.test.ts`
- `src/utils/__tests__/responsive-position.property.test.ts`
- `src/utils/__tests__/responsive-swipe.property.test.ts`
- `src/utils/breakpoints-legacy.manifest.json`
- `src/utils/breakpoints.ts`
- `src/utils/responsive/columns.ts`
- `src/utils/responsive/pagination.ts`
- `src/utils/responsive/position.ts`
- `src/utils/responsive/swipe.ts`
- `src/utils/useBreakpoint.ts`
- `src/utils/useFocusTrap.ts`
- `src/utils/useMediaQuery.ts`
- `vite.config.ts`

#### 2026:11:19 13:38 — Cambio de estructura de Spec para trabajar componente uno a uno (194211c)

**Resumen:** Cambio de estructura de Spec para trabajar componente uno a uno. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (3).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/design.md`
- `.kiro/specs/responsive-components-library/requirements.md`
- `.kiro/specs/responsive-components-library/tasks.md`

#### 2026:11:19 11:10 — Creacion de spec para responsividad de componentes (34fea97)

**Resumen:** Creacion de spec para responsividad de componentes. 

**Cambios:**
- Archivos por carpeta: `.kiro/specs` (4).

**Archivos modificados:**
- `.kiro/specs/responsive-components-library/.config.kiro`
- `.kiro/specs/responsive-components-library/design.md`
- `.kiro/specs/responsive-components-library/requirements.md`
- `.kiro/specs/responsive-components-library/tasks.md`

## [0.3.0-beta.1] — 2026-11-12
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

- **Regla de lint**: `eslint.config.js` prohibe `<svg>` en `src/` y `.storybook/` (`no-restricted-syntax`). Los iconos se importan de `lucide-react`.

- **MensajerÃ­a (MessagePanel)**: ConversationStatus (estado, responsable, atendida y ventana de escritura), MessageThread (orden por secuencia, divisores de dÃ­a y de mensajes nuevos, envÃ­os pendientes), MessageAttachment (estados eady, uploading y error), useMessageDock y dockReducer (paneles abiertos, minimizados y overflow), groupMessages (agrupaciÃ³n de burbujas), MessageDockBar con lastMessageAt y adge. El panel acepta 	oolbar, 
otice, open, defaultOpen, onOpenChange, keepMounted y labels. El compositor acepta sending, onAttach, maxLength (contador desde el 80 %), composerRef y utoFocus, y no envÃ­a durante la composiciÃ³n de IME. La librerÃ­a agrega una regla de lint para no escribir <svg> a mano.

- **Timeline**: lÃ­nea del tiempo de estados con `orientation` vertical u horizontal, `align="alternate"` (con contenedor de 40 rem o mÃ¡s), `stackBelow` (una horizontal se muestra vertical en contenedores angostos, medido con `ResizeObserver`), `maxVisible` con control de expandir, `reverse`, `onItemClick`, `loading` y `emptyState`. Estados `completed`, `current`, `upcoming`, `error` y `warning` con iconos de Lucide; textos en espaÃ±ol sobrescribibles con `labels`.

### Cambiado
- **Textos por defecto en español** (`Table`, `FilterTable`, `FilterBar`): "No data to display." pasa a "No hay datos para mostrar."; "Select all rows" a "Seleccionar todas las filas"; "Search..." a "Buscar..."; "Clear" a "Limpiar"; "N result(s)" a "N resultado(s)". Se sobrescriben con `labels`.
- **`Table`**: los checkboxes de selección usan el `Checkbox` de la librería. Las columnas ordenables sin orden activo muestran `ChevronsUpDown` atenuado; con orden, `ArrowUp`. Los separadores usan `--ui-color-divider`. Las rayas alternas se controlan con `striped` (por defecto, igual que antes). El panel expandido entra con una transición breve, sin ella con movimiento reducido. Mientras carga, la tabla usa "Cargando" como `aria-label` si no se pasa uno.
- **`FilterBar`**: los chips usan un icono SVG en lugar de "✕" y el estilo de píldora. Las etiquetas de los filtros siguen el estilo de `FormField`, y un control con filtro activo se resalta con borde primario.
- **`Popover`**: si el contenido no cabe ni arriba ni abajo, se mantiene dentro del viewport. Nueva prop `onPositioned`, que avisa cuando el contenido ya es visible.
- **`Input`**: el estado `error` ahora pinta el borde. Antes solo marcaba `aria-invalid`.
- **`Select`**: `FormField` lo asocia con su etiqueta y con el texto de ayuda o error (antes el `id` no llegaba al control).
- **`Checkbox`, `Radio` y `Switch`**: ya no envían la prop `invalid` al `<input>`. Si el control está inválido, se marca con `aria-invalid`. El radio del checkbox pasa a `--ui-radius`, igual que `Input`.
- **`Form`**: `Form.tsx` usa el `cx` compartido de `Input/utils.ts`.
- **`Table` con `loading`**: muestra filas en skeleton que conservan las columnas, la selección y la expansión, en lugar de un spinner. El checkbox de seleccionar todo queda deshabilitado mientras carga. Se quitó el spinner y su CSS de `Table.module.css`.
- **`ImageCard`** (y `ImageGrid`, que la usa): mientras la imagen carga, muestra un placeholder `Skeleton` sobre el area de imagen. Si la imagen falla, el placeholder se retira. No cambian las props.
- **`Sidebar`**: el botón de colapso pasa del pie al encabezado y es solo icono (`PanelLeftClose` / `PanelLeftOpen` de `lucide-react`), centrado cuando la barra está contraída. El encabezado se muestra si hay `header` u `onToggleCollapse`. La prop `footer` ahora es la única que renderiza el pie. Sin `onToggleCollapse` no hay botón, como antes. Si una barra con `onToggleCollapse` no tenía `header`, ahora muestra una fila de encabezado de 3.5 rem con solo el botón.
- **Iconos**: todos los iconos de componentes y stories salen de `lucide-react`; antes habia SVG dibujados a mano en unos 20 archivos. Los trazos de Lucide no son identicos a los anteriores, asi que el aspecto cambia sutilmente. `Toast` y `Alert` usan los mismos iconos. `dist/ui-library.js` pasa de 145 436 a 139 987 bytes.
- **MessagePanel**: el encabezado ya no tiene botones anidados (headerMain y headerActions son hermanos). El contenido sigue montado al minimizar (keepMounted, por defecto); con alse se desmonta. El desplazamiento automÃ¡tico solo ocurre al llegar un mensaje, o cuando el usuario estÃ¡ cerca del final; si no, aparece el botÃ³n de mensajes nuevos.
- **MensajerÃ­a: secuencia**: Mensaje.secuenciaMensaje se renombra a secuencia, igual que en el contrato 0.1.0-tracer.40.
- **MensajerÃ­a: textos en espaÃ±ol**: los textos por defecto pasan a espaÃ±ol (Minimizar, Enviar mensaje, Escribe un mensajeâ€¦, Mensajes nuevos, etc.). Se sobrescriben con labels.
- **Muelle**: sus paneles usan el token --ui-z-dock (900), por debajo de Modal (1000). Antes quedaban en 1000 y se apilaban igual que el modal.
- **MessageBubble**: muestra la hora en es-MX y no muestra el alias en los mensajes de en medio de un grupo. Los radios de la burbuja dependen de su posiciÃ³n en el grupo (groupPosition).

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
