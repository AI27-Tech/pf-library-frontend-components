# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
