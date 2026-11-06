# Tareas — Select con variante buscable

Antes de empezar, resolver D1 y D2 de `design.md`.

- [x] 1. Confirmar decisiones D1 y D2
  - D1: corregir en esta spec. D2: textos por defecto en español.
  - _Requisitos: R7, R2.5_

- [x] 0. Línea base de consumidores (antes de tocar código). Hecho: `pnpm test` en `pf-web-frontend-internal` da 478 pruebas pasando y 1 fallando (`tests/contracts/sesion.test.ts`, ajena a `Select`). Los tests nombrados aquí (`BandejaViajes`, etc.) no existen como unitarios.
  - Correr en `pf-web-frontend-internal` los tests de `BandejaViajes`, `DashboardMonitoreo`, `CrearViaje` e `HistoricoViaje` contra la versión actual de la librería. Guardar el resultado.
  - Si ya fallan antes del cambio, anotarlo: no es regresión de esta spec.
  - _Requisitos: R8.3_

- [x] 2. Extraer el filtro a una función pura (`filterOptions.ts`, implementado y probado)
  - Crear `src/components/Input/filterOptions.ts` con `filterOptions(options, query)`.
  - Normalización NFD, sin marcas diacríticas, sin distinguir mayúsculas.
  - Pruebas unitarias del filtro.
  - _Requisitos: R2.1, R2.2, R2.3, R2.4_

- [x] 3. Corregir la precedencia de `defaultValue` (D1, dentro de esta spec)
  - En `Select.tsx`, `defaultValue ?? (placeholder ? "" : undefined)`. Antes, `??` y `?:` se evaluaban juntos y un `defaultValue` con valor se perdía.
  - Prueba: `defaultValue` con `placeholder` muestra el label correcto (`Select.test.tsx`).
  - _Requisitos: R7_

- [x] 4. Agregar las props `variant`, `searchPlaceholder` y `noResultsText`
  - Tipo `SelectVariant` y props en `SelectProps`. Sin cambios en props existentes.
  - Exportar `SelectVariant` desde `src/components/Input/index.ts` y `src/index.ts`.
  - _Requisitos: R1.1, R1.3_

- [x] 5. Implementar `SelectSearchable.tsx`
  - Estado `query`, `isOpen`, `activeIndex`, `isEditing`.
  - Reglas de la sección "Comportamiento de la variante buscable" de `design.md`.
  - Escape, Enter, flechas, Tab y blur.
  - Selección con `mousedown` + `preventDefault` para no perder el clic.
  - _Requisitos: R2, R3, R4.1, R4.2, R6_

- [x] 6. Atributos ARIA de combobox y listbox
  - `useId()` para `listboxId` y `activeId`.
  - _Requisitos: R4.3, R4.4_

- [x] 7. Enrutar desde `Select.tsx` y reutilizar estilos
  - `Select` decide la variante. Clases de `Input.module.css` y `SelectCustom.module.css`.
  - Si hace falta una clase nueva para el campo de texto, agregarla usando solo tokens.
  - _Requisitos: R1.1, R1.2, R5_

- [x] 8. Pruebas de componente (`Select.test.tsx`, 17 pruebas; 21 en total con `Button`, todas pasan)
  - Escritura, filtrado, selección, Escape, Tab, flechas, deshabilitados, controlado y no controlado, ARIA.
  - Proyecto `unit` (`pnpm test`).
  - _Requisitos: R2 a R6_

- [x] 9. Storybook (historias añadidas; `build-storybook` pasa; revisión visual en Storybook pendiente, requiere revisión humana)
  - Historias `Searchable`, `SearchableWithoutResults`, `SearchableDisabledOptions` en `Select.stories.tsx`.
  - Verificar en modo oscuro (`DarkMode` existente) que no cambian colores.
  - _Requisitos: R5.2_

- [x] 10. Verificación de la librería (`test`, `typecheck`, `lint` y `build:lib` pasan)
  - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build:lib` en código 0.
  - Revisar la lista de verificación de `components-library-steering.md`, sección 8.
  - _Requisitos: R5_

- [-] 12. Regresión de consumidores. Revisión estática hecha: ninguno de los 9 usos de `Select` en `pf-web-frontend-internal` y `pf-web-frontend-client` usa `defaultValue`; los que tienen `placeholder` son controlados (`value=`), y `value` tiene prioridad. Prueba en ejecución pendiente: los frontends consumen `@ai27-tech/ui` publicado (0.2.0-beta.6), no el repo local, así que no pueden probar D1 sin vincular la librería.
  - Verificar que el disparador de la variante por defecto conserva el DOM de hoy (`button`, clase `_trigger_`, nombre accesible). Comparar contra la línea base de la tarea 0.
  - Correr en `pf-web-frontend-internal` los tests de la tarea 0 contra la librería modificada, sin tocar esos tests.
  - Si D1 se aprueba, revisar `defaultValue` junto con `placeholder` en el frontend interno y el cliente (búsqueda previa sin resultados).
  - _Requisitos: R5.4, R8.1, R8.2_

- [x] 11. Documentación y versión (entrada en `CHANGELOG.md`, sección Unreleased)
  - Actualizar `CHANGELOG.md` (sección Unreleased) y `CONSUMING.md` si describe `Select`.
  - La API es aditiva. Si D1 cambia el comportamiento por defecto, anotarlo como corrección.
  - _Requisitos: R7, sección 1 de steering (no romper API)_
