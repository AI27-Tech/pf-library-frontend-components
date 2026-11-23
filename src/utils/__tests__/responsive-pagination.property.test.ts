import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { getPaginationItems } from '../responsive/pagination';

/**
 * Genera una terna válida: total de páginas, página actual dentro de [1, total] y
 * maxItems de al menos 5.
 */
const paginationArb = fc
  .integer({ min: 1, max: 200 })
  .chain((total) =>
    fc.record({
      total: fc.constant(total),
      page: fc.integer({ min: 1, max: total }),
      maxItems: fc.integer({ min: 5, max: 15 }),
    }),
  );

describe('getPaginationItems', () => {
  // Property 4: Ventana de paginación acotada y con la página actual
  // Validates: Requirements 4.6
  it('devuelve como máximo maxItems elementos e incluye la página actual, la primera y la última', () => {
    fc.assert(
      fc.property(paginationArb, ({ total, page, maxItems }) => {
        const items = getPaginationItems(page, total, maxItems);
        expect(items.length).toBeLessThanOrEqual(maxItems);
        expect(items).toContain(page);
        expect(items).toContain(1);
        expect(items).toContain(total);
      }),
    );
  });

  it('los números salen en orden ascendente, sin repetirse y dentro del rango', () => {
    fc.assert(
      fc.property(paginationArb, ({ total, page, maxItems }) => {
        const numbers = getPaginationItems(page, total, maxItems).filter(
          (item): item is number => item !== 'ellipsis',
        );
        for (let i = 0; i < numbers.length; i += 1) {
          expect(numbers[i]).toBeGreaterThanOrEqual(1);
          expect(numbers[i]).toBeLessThanOrEqual(total);
          if (i > 0) expect(numbers[i]).toBeGreaterThan(numbers[i - 1]);
        }
      }),
    );
  });
});
