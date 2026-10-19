# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Agregado

- **CI (E8-T1)**: Workflow `ci.yml` que corre `lint`, `typecheck` y `test` en cada pull request y en cada push a las tres ramas del flujo (`pf-lf-m/d/q`), al estilo de los backends de la plataforma. `publish.yml` no se tocó: la publicación sigue disparándose por `release`.
- **Flujo de ramas (E8-T1)**: Workflows `promotion-pr-dq.yml` y `promotion-pr-qm.yml`, copiados del patrón de la plataforma. Mantienen al día un PR `d → q` y otro `q → m`; derivan la rama destino del sufijo y no fusionan (merge manual).
- **Pruebas unitarias**: Proyecto `unit` de Vitest en jsdom (independiente del proyecto `storybook`, que corre en navegador real y queda fuera del CI de PR), con `Button.test.tsx` (render, `onClick`, estado deshabilitado y `aria-busy`). Scripts `test` y `test:watch` que corren solo el proyecto `unit`, y `typecheck` (`tsc -b`).
- **Pre-commit**: Hook de Husky (`lint-staged` + `tsc -b`) para alinear la línea base de calidad con los portales. No se introdujo Prettier en la librería (queda como decisión abierta del equipo).

### Cambiado

- **`vite.config.ts`**: `test.projects` ahora declara dos proyectos (`unit` y `storybook`); antes solo `storybook`.
- **`tsconfig.build.json`**: excluye `src/vitest-env.d.ts` del build de publicación, además de las stories y los tests, para que `dist` no lleve artefactos de prueba.

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
