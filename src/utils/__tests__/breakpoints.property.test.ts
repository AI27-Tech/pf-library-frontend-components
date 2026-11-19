import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { getBreakpoint, type Breakpoint } from '../breakpoints';

/** Orden de menor a mayor, para comparar la monotonía. */
const RANK: Record<Breakpoint, number> = { mobile: 0, tablet: 1, desktop: 2 };

/** Anchos de viewport en píxeles CSS, incluidos decimales y valores en los bordes. */
const widthArb = fc.double({ min: 0, max: 10000, noNaN: true, noDefaultInfinity: true });

describe('getBreakpoint', () => {
  // Property 1: Clasificación de ancho en un único breakpoint
  // Validates: Requirements 1.4, 2.1, 2.2
  it('clasifica cada ancho en exactamente un breakpoint según los umbrales 640 y 1024', () => {
    fc.assert(
      fc.property(widthArb, (w) => {
        const bp = getBreakpoint(w);
        expect(['mobile', 'tablet', 'desktop']).toContain(bp);
        if (w < 640) expect(bp).toBe('mobile');
        else if (w < 1024) expect(bp).toBe('tablet');
        else expect(bp).toBe('desktop');
      }),
    );
  });

  it('es monótono: un ancho mayor nunca cae en un breakpoint menor', () => {
    fc.assert(
      fc.property(widthArb, widthArb, (x, y) => {
        const a = Math.min(x, y);
        const b = Math.max(x, y);
        expect(RANK[getBreakpoint(a)]).toBeLessThanOrEqual(RANK[getBreakpoint(b)]);
      }),
    );
  });

  it('en los bordes 639.99, 640, 1023.99 y 1024 cambia de breakpoint', () => {
    expect(getBreakpoint(639.99)).toBe('mobile');
    expect(getBreakpoint(640)).toBe('tablet');
    expect(getBreakpoint(1023.99)).toBe('tablet');
    expect(getBreakpoint(1024)).toBe('desktop');
  });
});
