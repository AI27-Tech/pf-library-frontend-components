import type { Breakpoint } from '../breakpoints';

/**
 * Columnas que acepta `Grid` por breakpoint: un número fijo, o un valor por
 * breakpoint (el que no se define hereda del breakpoint inmediatamente menor).
 */
export type ResponsiveColumns = number | Partial<Record<Breakpoint, number>>;

/** Tope de columnas de `Grid` cuando recibe un número: móvil 1, tablet 2, escritorio sin tope. */
const GRID_CAPS: Record<Breakpoint, number> = {
  mobile: 1,
  tablet: 2,
  desktop: Number.POSITIVE_INFINITY,
};

/** Orden de breakpoints de menor a mayor, usado para el fallback. */
const ORDER: readonly Breakpoint[] = ['mobile', 'tablet', 'desktop'];

/**
 * Limita el número de columnas pedido al tope del breakpoint: `min(requested, caps[bp])`.
 * Nunca devuelve menos de 1 ni más que `requested`.
 *
 * @example
 * capColumns(4, 'tablet', { mobile: 1, tablet: 2, desktop: 4 }) // 2
 */
export function capColumns(
  requested: number,
  bp: Breakpoint,
  caps: Record<Breakpoint, number>,
): number {
  return Math.max(1, Math.min(requested, caps[bp]));
}

/**
 * Resuelve las columnas de `Grid` para el breakpoint activo.
 *
 * - Número: se aplica el tope de `Grid` (móvil 1, tablet como máximo 2).
 * - Mapa parcial: se usa el valor del breakpoint activo. Si falta, el del
 *   breakpoint definido inmediatamente menor. Si no existe ninguno, 1.
 *
 * @example
 * resolveResponsiveColumns({ mobile: 1, desktop: 4 }, 'tablet') // 1
 */
export function resolveResponsiveColumns(columns: ResponsiveColumns, bp: Breakpoint): number {
  if (typeof columns === 'number') {
    return capColumns(columns, bp, GRID_CAPS);
  }
  for (let i = ORDER.indexOf(bp); i >= 0; i -= 1) {
    const value = columns[ORDER[i]];
    if (value !== undefined) return value;
  }
  return 1;
}
