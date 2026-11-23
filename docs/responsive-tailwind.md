# Coexistencia con Tailwind

La librería no depende de Tailwind. Un portal que usa Tailwind 4 puede mezclar sus utilidades con los componentes de `@ai27-tech/ui` si respeta lo que sigue.

## Equivalencias de breakpoints

| Breakpoint de la librería | Umbral | Equivalente en Tailwind 4 |
| --- | --- | --- |
| Móvil | menos de 40rem (640 px) | sin prefijo |
| Tablet | desde 40rem (640 px) | `sm:` |
| Escritorio | desde 64rem (1024 px) | `lg:` |

- Tailwind tiene además `md:` en 48rem (768 px). La librería no tiene corte en 48rem, así que `md:` no coincide con ningún cambio de componente. Una utilidad `md:` cambia en 768 px; el componente, no.
- Por eso, las utilidades que deban cambiar junto con un componente usan `sm:` (40rem) o `lg:` (64rem).

Los valores vienen de `docs/responsive-breakpoints.md`.

## CSS publicado sin capas

El CSS de la librería no usa `@layer`. Sin capas, el orden de carga y la especificidad de cada selector deciden qué regla gana. Por eso:

- Cargar los estilos de la librería antes que el CSS del portal (`import '@ai27-tech/ui/styles.css';`, como ya indica el steering).
- No envolver el CSS del portal en `@layer` si quiere sobrescribir componentes.

## Guía de sobrescritura

Orden de preferencia, de más a menos recomendado:

1. **Props de la librería.** `Grid.columns`, `Table.responsive`, `FilterBar.collapsibleOnMobile`, `Sidebar.mobileOpen` y las demás props nuevas resuelven casi todo sin CSS.
2. **Utilidades sobre un contenedor propio.** Poner `w-full`, `hidden sm:block` o `sm:grid-cols-2` en un `div` que envuelve al componente. No dentro del componente.
3. **Tokens `--ui-*`.** Para cambiar un valor, sobrescribir el token en un ámbito propio (por ejemplo, `.mi-pantalla { --ui-space-4: 1.25rem; }`). No redefinir los tokens globalmente.
4. **`!important` (utilidad `!`).** Solo como último recurso, porque anula la prop y el token que el componente necesita.

## Gutter de pantalla y `px-*`

La librería aplica `--ui-gutter-screen` como relleno lateral en `Section` (móvil). No sumar un `px-*` de Tailwind en el mismo contenedor: los dos rellenos se acumulan. Si el contenedor ya tiene `--ui-gutter-screen`, no añadir `px-*`. Si no lo tiene, usar solo `px-*`.

## Dependencias

- La librería no declara `tailwindcss`, `@tailwindcss/*` ni `postcss` en `dependencies` ni `peerDependencies`. El portal instala Tailwind por su cuenta.
- La prueba `src/utils/__tests__/tailwind-compat.test.ts` vigila esto y que no haya `@layer` en el CSS publicado.

## Clases

Las clases de la librería están en `docs/css-classes.manifest.json` (generado con `node scripts/css-classes.mjs`). Las clases nuevas llevan prefijo `ui-`, así no chocan con las utilidades del portal.

## Verificación

La story `Responsive/Tailwind` (`src/stories/responsive-tailwind.stories.tsx`) usa utilidades equivalentes de `src/stories/tailwind-equivalents.css`. Esas utilidades solo existen en Storybook y en las pruebas; no se publican.
