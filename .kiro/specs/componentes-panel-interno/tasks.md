# Tareas: componentes de la librería para el panel interno

**Repo:** `pf-library-frontend-components`. Requisitos en `requirements.md`; diseño en `design.md`. Orden de entrega en la sección 9; lista de tareas en la 13.

---

## 9. Plan de entrega

**Orden sugerido** (por dependencias y valor para el panel):

1. **Tokens y base común.** Revisar `tokens.css`. Agregar, si faltan, los de duración de animación, sombra y tamaños que necesiten los componentes (RT-1). Decidir `renderLink` (P-2).
2. **Parte 3** (Estados de página). Las Partes 4 y 6 reutilizan `Alert`, `Skeleton` y `EmptyState`.
3. **Parte 4** (ConfirmDialog), junto con el cambio aditivo a `Modal` si se acepta P-3.
4. **Partes 1 y 2** (Tabs; PageHeader y Breadcrumb), que comparten `renderLink`.
5. **Parte 5** (DescriptionList).
6. **Parte 6** (Timeline), tras la Parte 3.
7. **Parte 7** (CursorPagination).
8. **Cierre.** Exports en `src/index.ts`, `CHANGELOG.md`, versión y publicación.

**Tareas por componente** (se repiten para cada parte):
- [ ] Crear `src/components/<Nombre>/` con `.tsx`, `.module.css`, `index.ts` y stories.
- [ ] Pruebas unitarias de roles ARIA, teclado y estados.
- [ ] Exportar componente y tipos en `src/index.ts`.
- [ ] Revisar tema claro y oscuro (story `DarkMode`).
- [ ] Verificar la lista de la sección 8 del steering `components-library-steering.md`.

**Versionado.** Propuesta: **una sola versión** `0.2.0-beta.9` que agrupe las 7 partes, porque son aditivas y el panel las necesita juntas. Si el equipo prefiere liberar antes lo urgente, la unidad mínima es una versión por parte, en el orden anterior. Cada tarjeta exige "versión nueva publicada"; se cumple con cualquiera de las dos opciones. La publicación se dispara por `release` (`publish.yml`) y el flujo de ramas es `pf-lf-d` → `pf-lf-q` → `pf-lf-m`.

**Calidad antes de publicar:** `pnpm lint`, `pnpm typecheck`, `pnpm test` en verde (el CI de PR ya los corre) y `pnpm build:lib` sin errores.

---

## 13. Plan de tareas

Marcadores: `[ ]` pendiente. Las tareas no tienen estimación; el orden sigue la sección 9.

### 13.0 Preparación
- [ ] 0.1 Crear la rama de trabajo desde `pf-lf-d` (por ejemplo, `feature/componentes-panel-interno`).
- [ ] 0.2 Cerrar P-3, P-4, P-5, P-7 y P-8 (o aceptar las propuestas) y actualizar la sección 8 de `requirements.md`.
- [ ] 0.3 Definir `LinkRenderProps` y `RenderLink` en un archivo de tipos exportado desde `src/index.ts`.

### 13.1 Parte 3. Estados de página
- [ ] 3.1 `Spinner` y `Skeleton` (R3.2, R3.3, R3.5).
- [ ] 3.2 `Alert` con 4 variantes, acción y cierre (R3.4).
- [ ] 3.3 `EmptyState` (R3.1).
- [ ] 3.4 Stories, pruebas y exports de los cuatro componentes.

### 13.2 Parte 4. ConfirmDialog
- [ ] 4.1 Si se aprueba P-3: agregar `initialFocusRef` y `aria-describedby` a `Modal`, con prueba que confirme que sin ellas el comportamiento previo no cambia.
- [ ] 4.2 `ConfirmDialog` sobre `Modal`, `Button` y `Alert` (R4.1 a R4.4).
- [ ] 4.3 Stories: normal, peligro, cargando, con error.
- [ ] 4.4 Pruebas: doble envío, bloqueo de `Escape` durante la carga, retorno del foco.

### 13.3 Partes 1 y 2. Tabs, PageHeader y Breadcrumb
- [ ] 1.1 `Tabs` en modo controlado con teclado (R1.1, R1.2, R1.4).
- [ ] 1.2 `Tabs` en modo enlaces con `renderLink` (R1.3).
- [ ] 1.3 Stories y pruebas (incluye pestaña deshabilitada y `badge`).
- [ ] 2.1 `Breadcrumb` (R2.2).
- [ ] 2.2 `PageHeader` (R2.1, R2.3).
- [ ] 2.3 Stories y pruebas de ambos.

### 13.4 Parte 5. DescriptionList
- [ ] 5.1 `DescriptionList` y `DescriptionItem` con 1, 2 y 3 columnas (R5.1, R5.2).
- [ ] 5.2 Valor vacío y `action` (R5.3).
- [ ] 5.3 Stories y pruebas.

### 13.5 Parte 6. Timeline
- [ ] 6.1 `Timeline` y `TimelineItem` con `<ol>` (R6.1, R6.4).
- [ ] 6.2 Evento abierto (R6.2).
- [ ] 6.3 Carga y vacío con `Skeleton` y `EmptyState` (R6.3).
- [ ] 6.4 Stories y pruebas.

### 13.6 Parte 7. CursorPagination
- [ ] 7.1 `CursorPagination` (R7.1, R7.2).
- [ ] 7.2 Estado de carga y anuncio accesible (R7.3, R7.4).
- [ ] 7.3 Stories y pruebas.

### 13.7 Cierre
- [ ] 8.1 Exports y tipos en `src/index.ts`.
- [ ] 8.2 Revisar todos en tema claro y oscuro (`DarkMode.stories.tsx`).
- [ ] 8.3 Pasar la lista de verificación de la sección 8 del steering `components-library-steering.md` a cada componente.
- [ ] 8.4 Entradas en `CHANGELOG.md` (español, con fecha y hora) y subir la versión en `package.json` (P-8).
- [ ] 8.5 `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build:lib` en verde.
- [ ] 8.6 PR a `pf-lf-d`; luego promoción por el flujo `d → q → m` y publicación por `release`.
- [ ] 8.7 Avisar a quienes tienen las tarjetas `[Interno]` que la versión está disponible, con el nombre y la versión.
