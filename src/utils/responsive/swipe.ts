/**
 * Índice que resulta de un gesto horizontal sobre un carrusel.
 *
 * Avanza una posición si `deltaX` es negativo (el dedo va hacia la izquierda) y
 * retrocede si es positivo. Un gesto más corto que `threshold` no cambia el índice,
 * y tampoco uno que saldría del rango `[0, count - 1]`.
 *
 * @example
 * nextIndexOnSwipe(1, 3, -120, 48) // 2
 */
export function nextIndexOnSwipe(index: number, count: number, deltaX: number, threshold: number): number {
  if (Math.abs(deltaX) < threshold) return index;
  const next = deltaX < 0 ? index + 1 : index - 1;
  if (next < 0 || next >= count) return index;
  return next;
}
