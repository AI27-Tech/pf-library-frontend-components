# Breakpoints de responsividad

Documento de referencia para la librería. Los umbrales se escriben como literales en los @media; los tokens --ui-bp-* solo los documentan.

## Breakpoint_Set

| Nombre | Umbral | Píxeles (16px de raíz) | Rango de uso |
| --- | --- | --- | --- |
| movil | sin media query (base) | menor de 640 px | 320 a 639 px |
| tablet | `min-width: 40rem` | 640 px | 640 a 1023 px |
| escritorio | `min-width: 64rem` | 1024 px | 1024 px en adelante |

Para escribir reglas que solo aplican por debajo de tablet se usa `max-width: 39.99rem`. Para reglas que solo aplican antes de escritorio se usa `max-width: 63.99rem`. Los valores permitidos por el escáner de src/utils/__tests__/breakpoints-css.test.ts son `40rem`, `39.99rem`, `63.99rem` y `64rem`.

## Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| `--ui-touch-target-min` | 2.75rem (44px) | Lado mínimo de un objetivo táctil con puntero grueso. |
| `--ui-gutter-screen` | `--ui-space-4` (movil), `--ui-space-5` (tablet), `--ui-space-6` (escritorio) | Margen lateral de pantalla. |
| `--ui-bp-tablet` | 40rem | Solo documentación. |
| `--ui-bp-desktop` | 64rem | Solo documentación. |

Los tokens `--ui-space-1` a `--ui-space-6` no cambian entre breakpoints.

## Anchos de prueba

Las pruebas de desborde se ejecutan en 320, 375, 768 y 1280 px. Las stories Mobile usan 375 x 667 y las Tablet usan 768 x 1024.
