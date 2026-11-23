import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { nextIndexOnSwipe } from '../responsive/swipe';

/**
 * Carrusel con `count >= 1`, índice dentro del rango, desplazamiento horizontal y umbral positivo.
 */
const swipeArb = fc
  .integer({ min: 1, max: 30 })
  .chain((count) =>
    fc.record({
      count: fc.constant(count),
      index: fc.integer({ min: 0, max: count - 1 }),
      deltaX: fc.double({ min: -2000, max: 2000, noNaN: true, noDefaultInfinity: true }),
      threshold: fc.double({ min: 0.5, max: 200, noNaN: true, noDefaultInfinity: true }),
    }),
  );

describe('nextIndexOnSwipe', () => {
  // Property 6: Deslizamiento limitado al rango
  // Validates: Requirements 7.7, 7.8, 7.10, 7.11
  it('devuelve un índice dentro del rango que difiere del actual en 0 o en 1', () => {
    fc.assert(
      fc.property(swipeArb, ({ count, index, deltaX, threshold }) => {
        const next = nextIndexOnSwipe(index, count, deltaX, threshold);
        expect(next).toBeGreaterThanOrEqual(0);
        expect(next).toBeLessThanOrEqual(count - 1);
        expect(Math.abs(next - index)).toBeLessThanOrEqual(1);
      }),
    );
  });

  it('si |deltaX| es menor que el umbral, o el gesto saldría del rango, devuelve el mismo índice', () => {
    fc.assert(
      fc.property(swipeArb, ({ count, index, deltaX, threshold }) => {
        const next = nextIndexOnSwipe(index, count, deltaX, threshold);
        const outOfRange = deltaX < 0 ? index + 1 > count - 1 : index - 1 < 0;
        if (Math.abs(deltaX) < threshold || outOfRange) {
          expect(next).toBe(index);
        }
      }),
    );
  });

  it('un deltaX negativo avanza y uno positivo retrocede, cuando el gesto supera el umbral y cabe en el rango', () => {
    fc.assert(
      fc.property(swipeArb, ({ count, index, deltaX, threshold }) => {
        const next = nextIndexOnSwipe(index, count, deltaX, threshold);
        const mag = Math.abs(deltaX);
        if (mag < threshold) return;
        if (deltaX < 0 && index + 1 <= count - 1) expect(next).toBe(index + 1);
        if (deltaX > 0 && index - 1 >= 0) expect(next).toBe(index - 1);
      }),
    );
  });
});
