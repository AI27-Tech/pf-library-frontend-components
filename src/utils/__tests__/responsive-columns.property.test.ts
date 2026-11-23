import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import type { Breakpoint } from '../breakpoints';
import {
  capColumns,
  resolveResponsiveColumns,
  type ResponsiveColumns,
} from '../responsive/columns';

const BREAKPOINTS: Breakpoint[] = ['mobile', 'tablet', 'desktop'];

const bpArb = fc.constantFrom<Breakpoint>(...BREAKPOINTS);
const requestedArb = fc.integer({ min: 1, max: 24 });
const capValueArb = fc.integer({ min: 1, max: 12 });
const capsArb = fc.record({
  mobile: capValueArb,
  tablet: capValueArb,
  desktop: capValueArb,
});
const partialMapArb = fc.record(
  {
    mobile: capValueArb,
    tablet: capValueArb,
    desktop: capValueArb,
  },
  { requiredKeys: [] },
);

/** Valor del breakpoint definido de mayor rango que no supere al activo; si no hay ninguno, 1. */
function expectedFallback(map: Partial<Record<Breakpoint, number>>, bp: Breakpoint): number {
  const activeRank = BREAKPOINTS.indexOf(bp);
  for (let rank = activeRank; rank >= 0; rank -= 1) {
    const value = map[BREAKPOINTS[rank]];
    if (value !== undefined) return value;
  }
  return 1;
}

describe('capColumns', () => {
  // Property 2: Tope de columnas por breakpoint
  // Validates: Requirements 2.1, 2.2, 2.3, 7.1, 7.2, 7.3
  it('devuelve min(requested, caps[bp]), nunca menos de 1 y nunca más que requested', () => {
    fc.assert(
      fc.property(requestedArb, bpArb, capsArb, (requested, bp, caps) => {
        const result = capColumns(requested, bp, caps);
        expect(result).toBe(Math.min(requested, caps[bp]));
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(requested);
      }),
    );
  });

  it('con los topes de Grid (móvil 1, tablet 2) y de ImageGrid (móvil 2, tablet 3), un valor dentro del tope no cambia', () => {
    const gridCaps = { mobile: 1, tablet: 2, desktop: 99 };
    const imageGridCaps = { mobile: 2, tablet: 3, desktop: 99 };
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 2 }), (requested) => {
        if (requested <= gridCaps.mobile) expect(capColumns(requested, 'mobile', gridCaps)).toBe(requested);
        if (requested <= gridCaps.tablet) expect(capColumns(requested, 'tablet', gridCaps)).toBe(requested);
        if (requested <= imageGridCaps.mobile) expect(capColumns(requested, 'mobile', imageGridCaps)).toBe(requested);
        if (requested <= imageGridCaps.tablet) expect(capColumns(requested, 'tablet', imageGridCaps)).toBe(requested);
      }),
    );
  });
});

describe('resolveResponsiveColumns', () => {
  // Property 3: Fallback de columnas por breakpoint en Grid
  // Validates: Requirements 2.1, 2.2, 2.3, 7.1, 7.2, 7.3
  it('con un mapa parcial devuelve el valor del breakpoint activo, o el del inmediato menor definido, o 1', () => {
    fc.assert(
      fc.property(partialMapArb, bpArb, (map, bp) => {
        const result = resolveResponsiveColumns(map as ResponsiveColumns, bp);
        expect(result).toBe(expectedFallback(map, bp));
        expect(result).toBeGreaterThanOrEqual(1);
      }),
    );
  });

  it('con un número aplica el tope de Grid: móvil 1, tablet min(n, 2), escritorio n', () => {
    fc.assert(
      fc.property(requestedArb, (n) => {
        expect(resolveResponsiveColumns(n, 'mobile')).toBe(1);
        expect(resolveResponsiveColumns(n, 'tablet')).toBe(Math.min(n, 2));
        expect(resolveResponsiveColumns(n, 'desktop')).toBe(n);
      }),
    );
  });
});
