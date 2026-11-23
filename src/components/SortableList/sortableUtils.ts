/** Devuelve una copia de `list` con el elemento de `from` movido a `to`. */
export function moveItem<T>(list: readonly T[], from: number, to: number): T[] {
  const next = [...list];
  if (from === to || from < 0 || from >= next.length) return next;
  const target = Math.min(Math.max(to, 0), next.length - 1);
  const [moved] = next.splice(from, 1);
  next.splice(target, 0, moved);
  return next;
}

/**
 * Índice de destino para un elemento arrastrado, a partir del centro vertical que ocupa.
 * `midpoints` son los centros verticales de las filas en su orden original.
 * El destino es la fila cuyo centro está más cerca del centro del elemento arrastrado.
 */
export function indexFromMidpoints(midpoints: readonly number[], centerY: number): number {
  if (midpoints.length === 0) return 0;
  let best = 0;
  let bestDistance = Infinity;
  midpoints.forEach((mid, index) => {
    const distance = Math.abs(mid - centerY);
    if (distance < bestDistance) {
      best = index;
      bestDistance = distance;
    }
  });
  return best;
}
