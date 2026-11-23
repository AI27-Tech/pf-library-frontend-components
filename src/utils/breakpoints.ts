/**
 * Breakpoints del Breakpoint_Set (tarea 1.2).
 *
 * Los literales rem son los que usan los @media del CSS; el escaner de
 * breakpoints-css.test.ts comprueba que coincidan. Los px equivalen a 16px de raiz.
 */
export const BREAKPOINTS = {
  tablet: { rem: "40rem", px: 640 },
  desktop: { rem: "64rem", px: 1024 },
} as const;

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/**
 * Clasifica un ancho de viewport en exactamente un breakpoint.
 *
 * mobile si el ancho es menor que 640 px, 	ablet desde 640 px (incluido)
 * hasta 1024 px (excluido) y desktop desde 1024 px.
 *
 * @example
 * getBreakpoint(375) // 'mobile'
 */
export function getBreakpoint(widthPx: number): Breakpoint {
  if (widthPx >= BREAKPOINTS.desktop.px) return 'desktop';
  if (widthPx >= BREAKPOINTS.tablet.px) return 'tablet';
  return 'mobile';
}
