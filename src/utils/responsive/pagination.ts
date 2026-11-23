/** Elemento de la paginación: número de página o puntos suspensivos. */
export type PaginationItem = number | 'ellipsis';

/** Mínimo de elementos que mantiene primera, última, página actual y dos puntos suspensivos. */
const MIN_ITEMS = 5;

/**
 * Calcula la ventana de páginas visible de `Pagination`.
 *
 * Devuelve como máximo `maxItems` elementos, en orden ascendente y sin repetir.
 * Siempre incluye la página actual, la primera y la última. Si `maxItems` es menor
 * que 5, se usa 5 como mínimo.
 *
 * @example
 * getPaginationItems(10, 20, 5) // [1, 'ellipsis', 10, 'ellipsis', 20]
 */
export function getPaginationItems(page: number, total: number, maxItems: number): PaginationItem[] {
  if (total < 1) return [];
  const max = Math.max(MIN_ITEMS, Math.floor(maxItems));
  const current = Math.min(Math.max(1, Math.floor(page)), total);

  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Bloque central: max - 4 páginas, entre 1 y total con un puntero suspensivo a cada lado.
  const centerSize = max - 4;

  if (current <= max - 2) {
    // Inicio: 1..max-2, puntos suspensivos, total.
    return [...range(1, max - 2), 'ellipsis', total];
  }
  if (current >= total - max + 3) {
    // Final: 1, puntos suspensivos, total-max+3..total.
    return [1, 'ellipsis', ...range(total - max + 3, total)];
  }

  // Centro: 1, puntos suspensivos, bloque centrado en la página actual, puntos suspensivos, total.
  let start = current - Math.floor((centerSize - 1) / 2);
  start = Math.max(3, Math.min(start, total - 2 - centerSize + 1));
  const end = start + centerSize - 1;
  return [1, 'ellipsis', ...range(start, end), 'ellipsis', total];
}

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}
