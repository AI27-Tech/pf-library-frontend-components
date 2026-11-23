/** Rectángulo en coordenadas del viewport. */
export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Coloca un panel flotante junto a su ancla sin salirse del viewport.
 *
 * Vertical: debajo del ancla si cabe; si no, encima si cabe; si no cabe en ninguno,
 * se usa el lado con más espacio y `maxHeight` limita el alto del panel.
 * Horizontal: alineado con el borde izquierdo del ancla, desplazado para no salir
 * por la derecha ni por la izquierda.
 *
 * El resultado respeta `margin` en los cuatro bordes del viewport.
 *
 * @example
 * clampToViewport({ top: 100, left: 20, width: 80, height: 32 }, { width: 200, height: 120 }, { width: 375, height: 667 }, 8)
 * // { top: 132, left: 20, maxHeight: 120 }
 */
export function clampToViewport(
  anchor: Rect,
  panel: { width: number; height: number },
  viewport: { width: number; height: number },
  margin: number,
): { top: number; left: number; maxHeight: number } {
  const anchorBottom = anchor.top + anchor.height;
  const spaceBelow = viewport.height - margin - anchorBottom;
  const spaceAbove = anchor.top - margin;

  let top: number;
  let maxHeight: number;
  if (panel.height <= spaceBelow) {
    top = anchorBottom;
    maxHeight = panel.height;
  } else if (panel.height <= spaceAbove) {
    maxHeight = panel.height;
    top = anchor.top - panel.height;
  } else if (spaceBelow >= spaceAbove) {
    top = anchorBottom;
    maxHeight = Math.max(0, spaceBelow);
  } else {
    maxHeight = Math.max(0, spaceAbove);
    top = anchor.top - maxHeight;
  }

  let left = anchor.left;
  if (left + panel.width > viewport.width - margin) {
    left = viewport.width - margin - panel.width;
  }
  if (left < margin) {
    left = margin;
  }

  return { top, left, maxHeight };
}
